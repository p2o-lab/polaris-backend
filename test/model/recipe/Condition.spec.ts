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

import {ConditionType} from '@p2olab/polaris-interface';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {OPCUAServer} from 'node-opcua-server';
import {timeout} from 'promise-timeout';
import * as delay from 'timeout-as-promise';
import {ServiceState} from '../../../src/model/core/enum';
import {Module} from '../../../src/model/core/Module';
import {Condition} from '../../../src/model/condition/Condition';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {ExpressionCondition} from '../../../src/model/condition/ExpressionCondition';
import {TimeCondition} from '../../../src/model/condition/TimeCondition';
import {ConditionFactory} from '../../../src/model/condition/ConditionFactory';
import {TrueCondition} from '../../../src/model/condition/TrueCondition';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test for [[Condition]]
 */
describe('Condition', () => {

    describe('without test server', () => {

        it('should fail with no type', () => {
            expect(() => ConditionFactory.create(null, undefined)).to.throw();
        });

        it('should provide TrueCondition with wrong type', () => {
            const cond = ConditionFactory.create({type: 'test'} as any, []);
            expect(cond).to.instanceOf(TrueCondition);
        });

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
            const condition = ConditionFactory.create({
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
            const condition = ConditionFactory.create({
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
            expect(hit).to.equal(true);
        });

        it('should listen to a NOT condition', async () => {
            const condition = ConditionFactory.create({
                type: ConditionType.not,
                condition: {type: ConditionType.time, duration: 0.1}
            }, undefined);
            expect(condition.json()).to.deep.equal({type: 'not', condition: {type: 'time', duration: 0.1}});

            condition.listen();
            await delay(10);
            expect(condition).to.have.property('fulfilled', true);
            await delay(100);
            expect(condition).to.have.property('fulfilled', false);

            expect(condition.getUsedModules().size).to.equal(0);

            condition.clear();
        });

        it('should fail with wrong parameter', () => {
            expect(() => ConditionFactory.create({type: ConditionType.time, duration: -10}, undefined))
                .to.throw();
        });

        describe('ExpressionCondition', () => {

            it('should work with simple expression', async () => {
                const expr = new ExpressionCondition({type: ConditionType.expression, expression: '4>3'});
                const value = await expr.getValue();
                expect(value).to.equal(true);
            });

            it('should fail when module is not connected', async () => {
                const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
                    .modules[0];

                const module = new Module(moduleJson);
                const expr = ConditionFactory.create({
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
                }, [module]) as ExpressionCondition;

                expect(expr.getValue()).to.be.rejectedWith('not connected');
            });

        });

    });

    describe('with ModuleTestServer', () => {
        let moduleServer: ModuleTestServer;
        let module: Module;

        beforeEach(async function() {
            this.timeout(4000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
                .modules[0];

            module = new Module(moduleJson);
            await module.connect();
        });

        afterEach(async () => {
            await module.disconnect();
            await moduleServer.shutdown();
        });

        it('specialized as VariableCondition should work', async () => {
            const condition = ConditionFactory.create({
                type: ConditionType.variable,
                module: 'CIF',
                dataAssembly: 'Variable001',
                variable: 'V',
                operator: '>',
                value: 25
            }, [module]);

            condition.listen();

            expect(module.services[0]).to.have.property('name', 'Service1');
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.variables[0].v = 22;
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.variables[0].v = 26;
            await new Promise((resolve) => {
                condition.once('stateChanged', () => {
                    resolve();
                } );
            });
            expect(condition).to.have.property('fulfilled', true);

            condition.clear();
            moduleServer.variables[0].v = 24.4;
            expect(condition).to.have.property('fulfilled', undefined);
            moduleServer.variables[0].v = 37;
            expect(condition).to.have.property('fulfilled', undefined);

        });

        it('specialized as StateCondition should work', async function() {
            this.timeout(5000);
            const condition = ConditionFactory.create({
                type: ConditionType.state,
                module: 'CIF',
                service: 'Service1',
                state: 'completed'
            }, [module]);
            expect(condition.json()).to.deep.equal(
            {
                module: 'CIF',
                service: 'Service1',
                state: 'completed',
                type: 'state'
            });

            condition.listen();

            expect(module.services[0]).to.have.property('name', 'Service1');
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.services[0].varStatus = ServiceState.EXECUTE;
            await delay(100);
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.services[0].varStatus = ServiceState.COMPLETED;
            await new Promise((resolve) => {
                condition.on('stateChanged', function test(state) {
                    if (state) {
                        condition.removeListener('stateChanged', test);
                        resolve();
                    }
                } );
            });
            expect(condition).to.have.property('fulfilled', true);

            condition.clear();
            expect(condition).to.have.property('fulfilled', undefined);
            moduleServer.services[0].varStatus = ServiceState.EXECUTE;
            await delay(100);
            expect(condition).to.have.property('fulfilled', undefined);
            moduleServer.services[0].varStatus = ServiceState.COMPLETED;
            await delay(100);
            expect(condition).to.have.property('fulfilled', undefined);

        });

        it('should not react on a closed condition', async () => {
            const condition = ConditionFactory.create({
                type: ConditionType.state,
                module: 'CIF',
                service: 'Service1',
                state: 'completed'
            }, [module]);

            condition.listen();
            moduleServer.services[0].varStatus = ServiceState.IDLE;
            await delay(50);
            expect(condition).to.have.property('fulfilled', false);

            condition.on('stateChanged', () => console.log('state changed'));
            expect(condition.listenerCount('stateChanged')).to.equal(1);

            condition.clear();
            expect(condition).to.have.property('fulfilled', undefined);
            expect(condition.listenerCount('stateChanged')).to.equal(0);

            condition.listen();
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.services[0].varStatus = ServiceState.COMPLETED;
            await new Promise((resolve, reject) => {
                condition.once('stateChanged', (state) => {
                    if (state) {
                        resolve();
                    } else {
                        reject();
                    }
                } );
            });
            condition.clear();
        });

        describe('ExpressionCondition', () => {

            it('should work with simple server expression', async () => {
                const expr = new ExpressionCondition(
                    {type: ConditionType.expression, expression: 'CIF.Variable001.V>10'}, [module]);
                expr.listen();

                expect(expr.getUsedModules().size).to.equal(1);

                moduleServer.variables[0].v = 0;
                expect(expr).to.have.property('fulfilled', false);
                let value = await expr.getValue();
                expect(value).to.equal(false);

                moduleServer.variables[0].v = 11;
                await new Promise((resolve) => {
                    expr.once('stateChanged', () => {
                        resolve();
                    } );
                });
                expect(expr).to.have.property('fulfilled', true);
                value = await expr.getValue();
                expect(value).to.equal(true);
                expect(expr).to.have.property('fulfilled', true);

                moduleServer.variables[0].v = 8;
                value = await expr.getValue();
                expect(value).to.equal(false);
                await new Promise((resolve) => {
                    expr.once('stateChanged', () => {
                        resolve();
                    } );
                });
                expect(expr).to.have.property('fulfilled', false);

                expr.clear();
                moduleServer.variables[0].v = 12;
                value = await expr.getValue();
                expect(value).to.equal(true);
                expect(expr).to.have.property('fulfilled', undefined);
            });

            it('should work with semi-complex expression', async () => {
                moduleServer.variables[0].v = 3.1;
                const expr: ExpressionCondition = ConditionFactory.create({
                    type: ConditionType.expression,
                    expression: 'cos(CIF.Variable001.V)^2 > 0.9'
                }, [module]) as ExpressionCondition;
                let value = await expr.getValue();
                expect(value).to.equal(true);

                moduleServer.variables[0].v = 0.7;
                value = await expr.getValue();
                expect(value).to.equal(false);
            });

            it('should work with complex expression', async () => {
                const expr = ConditionFactory.create({
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
                }, [module]) as ExpressionCondition;
                moduleServer.variables[0].v = 0.7;

                const value = await expr.getValue();
                expect(value).to.equal(false);
            });

        });

    });

});
