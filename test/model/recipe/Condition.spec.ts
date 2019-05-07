/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {Condition, ExpressionCondition, TimeCondition} from '../../../src/model/recipe/Condition';
import {ConditionType} from '@p2olab/polaris-interface';
import {expect} from 'chai';
import {Module} from '../../../src/model/core/Module';
import {OPCUAServer} from 'node-opcua-server';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {ServiceState} from '../../../src/model/core/enum';
import { timeout } from 'promise-timeout';
import * as fs from "fs";
import * as delay from 'timeout-as-promise';


/**
 * Test for [[Condition]]
 */
describe('Condition', () => {

    it('should listen to a time condition of 0.1s', (done) => {
        const condition = new TimeCondition({type: ConditionType.time, duration: 0.1});

        expect(condition.json()).to.deep.equal({type: 'time', duration: 0.1});

        expect(condition).to.have.property('fulfilled', false);

        condition.listen().on('stateChanged', () => {
            expect(condition).to.have.property('fulfilled', true);
            done();
        });

        expect(condition).to.have.property('fulfilled', false);
    });

    it('should listen to an AND condition of two time conditions', async () => {
        const condition = Condition.create({
            type: ConditionType.and,
            conditions: [
                {type: ConditionType.time, duration: 0.2},
                {type: ConditionType.time, duration: 0.1}
            ]
        }, undefined);
        expect(condition.json()).to.deep.equal({
            type: 'and',
            conditions:
                [{type: 'time', duration: 0.2},
                    {type: 'time', duration: 0.1}]
        });
        condition.listen().on('stateChanged', () => {
            expect(condition).to.have.property('fulfilled', true);
        });
        expect(condition).to.have.property('fulfilled', false);
        await delay(150);
        expect(condition).to.have.property('fulfilled', false);
        await delay(60);
        expect(condition).to.have.property('fulfilled', true);
    });

    it('should listen to a OR condition of two time conditions', async () => {
        const condition = Condition.create({
            type: ConditionType.or,
            conditions: [
                {type: ConditionType.time, duration: 0.5},
                {type: ConditionType.time, duration: 0.1}
            ]
        }, undefined);
        expect(condition.json()).to.deep.equal({
            type: 'or',
            conditions:
                [{type: 'time', duration: 0.5},
                    {type: 'time', duration: 0.1}]
        });
        let hit = false;
        condition.listen().on('stateChanged', () => {
            expect(condition).to.have.property('fulfilled', true);
            hit = true;
        });
        await delay(60);
        expect(condition).to.have.property('fulfilled', false);
        await delay(50);
        expect(condition).to.have.property('fulfilled', true);
        expect(hit).to.be.true;
    });

    it('should listen to a NOT condition', async () => {
        const condition = Condition.create({
            type: ConditionType.not,
            condition: {type: ConditionType.time, duration: 0.1}
        }, undefined);
        expect(condition.json()).to.deep.equal({type: 'not', condition: {type: 'time', duration: 0.1}});

        condition.listen();
        await delay(10);
        expect(condition).to.have.property('fulfilled', true);
        await delay(100);
        expect(condition).to.have.property('fulfilled', false);
    });

    it('should fail with wrong parameter', () => {
        expect(() => Condition.create({type: ConditionType.time, duration: -10}, undefined))
            .to.throw();
    });

    describe('with ModuleTestServer', () => {
        let moduleServer: ModuleTestServer;
        let module: Module;

        before(async function () {
            this.timeout(4000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start(() => Promise.resolve);

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
                .modules[0];

            module = new Module(moduleJson);
            await module.connect();
        });

        after((done) => {
            moduleServer.shutdown(done);
        });

        it('specialized as VariableCondition should work', async () => {
            const condition = Condition.create({
                type: ConditionType.variable,
                module: 'CIF',
                dataAssembly: "Variable001",
                variable: 'V',
                operator: ">",
                value: 25
            }, [module]);

            condition.listen();

            expect(module.services[0]).to.have.property('name', 'Service1');
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.varVariable1 = 22;
            expect(condition).to.have.property('fulfilled', false);


            moduleServer.varVariable1 = 26;
            await new Promise((resolve) => {
                condition.once('stateChanged', (state) => {
                    resolve();
                } );
            });
            expect(condition).to.have.property('fulfilled', true);

            condition.clear();
            moduleServer.varVariable1 = 24.4;
            expect(condition).to.have.property('fulfilled', undefined);
            moduleServer.varVariable1 = 37;
            expect(condition).to.have.property('fulfilled', undefined);

        });

        it('specialized as StateCondition should work', async () => {
            const condition = Condition.create({
                type: ConditionType.state,
                module: 'CIF',
                service: 'Service1',
                state: 'completed'
            }, [module]);
            expect(condition.json()).to.deep.equal(
            {
                module: "CIF",
                service: "Service1",
                state: "completed",
                type: "state"
            });

            condition.listen();

            expect(module.services[0]).to.have.property('name', 'Service1');
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.varStatus = ServiceState.EXECUTE;
            expect(condition).to.have.property('fulfilled', false);


            moduleServer.varStatus = ServiceState.COMPLETED;
            await new Promise((resolve) => {
                condition.once('stateChanged', (state) => {
                    resolve();
                } );
            });
            expect(condition).to.have.property('fulfilled', true);

            condition.clear();
            moduleServer.varStatus = ServiceState.EXECUTE;
            expect(condition).to.have.property('fulfilled', undefined);
            moduleServer.varStatus = ServiceState.COMPLETED;
            expect(condition).to.have.property('fulfilled', undefined);

        });

        describe('ExpressionCondition', () => {

            it('should work with simple expression', async () => {
                const expr = new ExpressionCondition({type: ConditionType.expression, expression: '4>3'});
                let value = await expr.getValue();
                expect(value).to.be.true;
            });

            it('should work with simple server expression', async () => {
                const expr = new ExpressionCondition({type: ConditionType.expression, expression: 'CIF.Variable001.V>10'}, [module]);
                expr.listen();

                moduleServer.varVariable1 = 0;
                expect(expr).to.have.property('fulfilled', false);
                let value = await expr.getValue();
                expect(value).to.be.false;

                moduleServer.varVariable1 = 11;
                await new Promise((resolve) => {
                    expr.once('stateChanged', (state) => {
                        resolve();
                    } );
                });
                expect(expr).to.have.property('fulfilled', true);
                value = await expr.getValue();
                expect(value).to.be.true;
                expect(expr).to.have.property('fulfilled', true);

                moduleServer.varVariable1 = 8;
                value = await expr.getValue();
                expect(value).to.be.false;
                await new Promise((resolve) => {
                    expr.once('stateChanged', (state) => {
                        resolve();
                    } );
                });
                expect(expr).to.have.property('fulfilled', false);

                expr.clear();
                moduleServer.varVariable1 = 12;
                value = await expr.getValue();
                expect(value).to.be.true;
                expect(expr).to.have.property('fulfilled', undefined);
            });

            it('should work with semi-complex expression', async () => {
                moduleServer.varVariable1 = 3.1;
                const expr: ExpressionCondition = <ExpressionCondition> Condition.create({
                    type: ConditionType.expression,
                    expression: 'cos(CIF.Variable001.V)^2 > 0.9'
                }, [module]);
                let value = await expr.getValue();
                expect(value).to.be.true;

                moduleServer.varVariable1 = 0.7;
                value = await expr.getValue();
                expect(value).to.be.false;
            });

            it('should work with complex expression', async () => {
                const expr = <ExpressionCondition> Condition.create({
                    type: ConditionType.expression,
                    expression: 'sin(a)^2 + cos(CIF.Variable001)^2 < 0.5',
                    scope: [
                        {
                            name: 'a',
                            module: 'CIF',
                            dataAssembly: 'Variable001',
                            variable: 'V'
                        }
                    ]
                }, [module]);
                let value = await expr.getValue();
                expect(value).to.be.false;
            });

        });

    });

});
