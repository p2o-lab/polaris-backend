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
import * as delay from 'timeout-as-promise';
import {catCondition} from '../../../src/logging/logging';
import {ConditionFactory} from '../../../src/model/condition/ConditionFactory';
import {ExpressionCondition} from '@/model/condition/custom/ExpressionCondition';
import {TimeCondition} from '@/model/condition/custom/TimeCondition';
import {TrueCondition} from '@/model/condition/custom/TrueCondition';
import {ServiceState} from '@/model/dataAssembly/enum';
import {PEA} from '@/model/core/PEA';
import {TestServerNumericVariable} from '../../../src/moduleTestServer/ModuleTestNumericVariable';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {waitForVariableChange} from '../../helper';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test for [[Condition]]
 */
describe('Condition', () => {

    describe('without test server', () => {

        it('should provide TrueCondition with no type', () => {
            expect(ConditionFactory.create(null, undefined)).to.instanceOf(TrueCondition);
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
                expr.listen();
                const value = expr.getValue();
                expect(value).to.equal(true);
            });

            it('should fail when module is not connected', async () => {
                const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
                    .modules[0];

                const module = new PEA(moduleJson);
                const expr = ConditionFactory.create({
                    type: ConditionType.expression,
                    expression: 'sin(a)^2 + cos(ModuleTestServer.Variable001)^2 < 0.5',
                    scope: [
                        {
                            name: 'a',
                            module: 'ModuleTestServer',
                            dataAssembly: 'Variable001',
                            variable: 'V'
                        }
                    ]
                }, [module]) as ExpressionCondition;
                expect(() => expr.getValue()).to.throw('not connected');
            });

        });

    });

    describe('with ModuleTestServer', () => {
        let moduleServer: ModuleTestServer;
        let module: PEA;
        let var0: TestServerNumericVariable;

        beforeEach(async function() {
            this.timeout(10000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
            var0 = moduleServer.variables[0] as TestServerNumericVariable;

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
                .modules[0];

            module = new PEA(moduleJson);
            await module.connect();
        });

        afterEach(async () => {
            await module.disconnect();
            await moduleServer.shutdown();
        });

        it('specialized as VariableCondition should work', async () => {
            const condition = ConditionFactory.create({
                type: ConditionType.variable,
                module: 'ModuleTestServer',
                dataAssembly: 'Variable001',
                variable: 'V',
                operator: '>',
                value: 25
            }, [module]);

            condition.listen();
            expect(condition).to.have.property('fulfilled', false);

            var0.v = 22;
            await waitForVariableChange(module, 'Variable001', 22);
            expect(condition).to.have.property('fulfilled', false);

            var0.v = 26;
            await new Promise((resolve) => {
                condition.once('stateChanged', () => {
                    resolve();
                } );
            });
            expect(condition).to.have.property('fulfilled', true);

            condition.clear();
            var0.v = 24.4;
            expect(condition).to.have.property('fulfilled', undefined);
            var0.v = 37;
            expect(condition).to.have.property('fulfilled', undefined);

        }).timeout(5000);

        it('specialized as StateCondition should work', async function() {
            this.timeout(5000);
            const condition = ConditionFactory.create({
                type: ConditionType.state,
                module: 'ModuleTestServer',
                service: 'Service1',
                state: 'completed'
            }, [module]);
            expect(condition.json()).to.deep.equal(
            {
                module: 'ModuleTestServer',
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
                module: 'ModuleTestServer',
                service: 'Service1',
                state: 'completed'
            }, [module]);

            condition.listen();
            moduleServer.services[0].varStatus = ServiceState.IDLE;
            await delay(50);
            expect(condition).to.have.property('fulfilled', false);

            condition.on('stateChanged', () => catCondition.debug('state changed'));
            expect(condition.listenerCount('stateChanged')).to.equal(1);

            condition.clear();
            expect(condition).to.have.property('fulfilled', undefined);
            expect(condition.listenerCount('stateChanged')).to.equal(0);

            condition.listen();
            expect(condition).to.have.property('fulfilled', false);

            moduleServer.services[0].varStatus = ServiceState.COMPLETED;
            await new Promise((resolve) => {
                condition.on('stateChanged', (state) => {
                    if (state) {
                        resolve();
                    }
                } );
            });
            condition.clear();
        });

        describe('ExpressionCondition', () => {

            it('should work with simple server expression', async () => {
                const expr = new ExpressionCondition(
                    {type: ConditionType.expression, expression: 'ModuleTestServer.Variable001.V>10'}, [module]);
                expr.listen();

                expect(expr.getUsedModules().size).to.equal(1);

                var0.v = 0;
                await waitForVariableChange(module, 'Variable001', 0);
                expect(expr).to.have.property('fulfilled', false);
                let value = expr.getValue();
                expect(value).to.equal(false);

                var0.v = 11;
                await waitForVariableChange(module, 'Variable001', 11);
                value = expr.getValue();
                expect(value).to.equal(true);
                expect(expr).to.have.property('fulfilled', true);

                var0.v = 8;
                await Promise.all([
                    new Promise((resolve) => expr.once('stateChanged', resolve)),
                    waitForVariableChange(module, 'Variable001', 8)
                ]);
                value = expr.getValue();
                expect(value).to.equal(false);
                expect(expr).to.have.property('fulfilled', false);

                expr.clear();
                var0.v = 12;
                expr.once('stateChanged', () => { throw new Error('State has changed after it was cleared'); });
                await waitForVariableChange(module, 'Variable001', 12);
                value = expr.getValue();
                expect(value).to.equal(true);
                expect(expr).to.have.property('fulfilled', undefined);
            }).timeout(5000);

            it('should work with semi-complex expression', async () => {
                const expr: ExpressionCondition = ConditionFactory.create({
                    type: ConditionType.expression,
                    expression: 'cos(ModuleTestServer.Variable001.V)^2 > 0.9'
                }, [module]) as ExpressionCondition;
                expr.listen();

                var0.v = 3.1;
                await Promise.all([
                    new Promise((resolve) => expr.once('stateChanged', resolve)),
                    waitForVariableChange(module, 'Variable001', 3.1)
                ]);
                let value = expr.getValue();
                expect(value).to.equal(true);

                var0.v = 0.7;
                await Promise.all([
                    new Promise((resolve) => expr.once('stateChanged', resolve)),
                    waitForVariableChange(module, 'Variable001', 0.7)
                ]);
                value = expr.getValue();
                expect(value).to.equal(false);
            }).timeout(5000);

            it('should work with complex expression', async () => {
                const expr = ConditionFactory.create({
                    type: ConditionType.expression,
                    expression: 'sin(a)^2 + cos(ModuleTestServer.Variable001)^2 < 0.5',
                    scope: [
                        {
                            name: 'a',
                            module: 'ModuleTestServer',
                            dataAssembly: 'Variable001',
                            variable: 'V'
                        }
                    ]
                }, [module]) as ExpressionCondition;

                var0.v = 0.7;
                await new Promise((resolve) => module.once('variableChanged', resolve));

                const value = expr.getValue();
                expect(value).to.equal(false);
            });

        });

    });

});
