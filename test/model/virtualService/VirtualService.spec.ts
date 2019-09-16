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

import {expect} from 'chai';
import * as fs from 'fs';
import * as parseJson from 'json-parse-better-errors';
import * as delay from 'timeout-as-promise';
import {ServiceState} from '../../../src/model/core/enum';
import {Manager} from '../../../src/model/Manager';
import {FunctionGenerator} from '../../../src/model/virtualService/FunctionGenerator';
import {Storage} from '../../../src/model/virtualService/Storage';
import {Timer} from '../../../src/model/virtualService/Timer';
import {VirtualServiceFactory} from '../../../src/model/virtualService/VirtualServiceFactory';
import {waitForStateChange} from '../../helper';

describe('VirtualService', () => {

    describe('via Manager', () => {
        it('should instantiate two timers', async () => {
            const manager = new Manager();
            manager.instantiateVirtualService({name: 'timer1', type: 'timer'});
            manager.instantiateVirtualService({name: 'timer2', type: 'timer'});

            expect(manager.virtualServices).to.have.lengthOf(2);
        });
    });

    describe('Factory', () => {
       it('should instantiate timer', () => {
           const timerJson = parseJson(fs.readFileSync('assets/virtualService/timer.json', 'utf8'), null, 60);

           const timer = VirtualServiceFactory.create(timerJson);

           expect(timer.json().type).equal('Timer');
           expect(timer.json().name).equal('timer1');
           const json = timer.json().strategies[0];
           expect(json.parameters).deep.equal([
               {min: 1,
                   name: 'duration',
                   unit: 'ms',
                   value: 10000
               },
               {
                   min: 100,
                   name: 'updateRate',
                   unit: 'ms',
                   value: 1000
               }]);
           expect(json.processValuesOut).to.deep.equal([
               {
                   name: 'remainingTime',
                   readonly: true,
                   unit: 'ms',
                   value: 10000
               }
           ]);
       });

       it('should instantiate aggregated service', () => {
           const manager = new Manager();
           const modules = manager.loadModule(
               JSON.parse(fs.readFileSync('assets/modules/achema_demonstrator/modules_achema.json').toString()),
               true);
           expect(modules).to.have.lengthOf(3);

           const asJson = parseJson(
                fs.readFileSync('assets/virtualService/virtualService_achema_dose_fill.json', 'utf8'), null, 60);

           const aggregatedService = VirtualServiceFactory.create(asJson, modules);

           const json = aggregatedService.json();
           expect(json.type).equal('AggregatedService');
           expect(json.name).equal('DoseFill');
           expect(json.parameters).deep.equal([]);
           expect(json.strategies[0].parameters).deep.equal([
                {
                    default: '0',
                    name: 'SetVolume',
                    type: 'ExtAnaOp',
                    unit: '1038'
                }
            ]);
        });

       it('should fail with unknown virtual service type', () => {
           expect(() => VirtualServiceFactory.create({type: 'unknown', name: 'myUnknownVirtualService'}))
               .to.throw('Unknown virtual service type');
       });

    });

    describe('Timer', () => {
        it('should instantiate', () => {
            const timer = new Timer('t1');
            expect(timer.name).to.equal('t1');
            expect(timer.qualifiedName).to.equal('t1');
            expect(timer.state).to.equal(ServiceState.IDLE);
        });

        it('should run', async () => {
            const timer = new Timer('t1');

            const json = timer.json().strategies[0];
            expect(json.parameters).to.have.lengthOf(2);
            expect(json.processValuesIn).to.equal(undefined);
            expect(json.processValuesOut).to.have.lengthOf(1);
            expect(json.reportParameters).to.equal(undefined);
            expect(json.parameters[0]).to.deep.equal({
                'min': 1,
                'name': 'duration',
                'unit': 'ms',
                'value': 10000
            });

            await timer.setParameters([{name: 'duron', value: 1000}]).then(expect.fail, (err) => err);

            await timer.setParameters([{name: 'remainingTime', value: 1000}]).then(expect.fail, (err) => err);

            await timer.setParameters([{name: 'duration', value: 100}, {name: 'updateRate', value: 10}]);

            let hit = 0;
            timer.eventEmitter.on('parameterChanged', (parameterChange) => {
                if (parameterChange.parameter.name === 'remainingTime') {
                    hit = hit + 1;
                }
            });
            await timer.start();
            expect(timer.state).to.equal(ServiceState.EXECUTE);
            expect(hit).to.equal(1);
            expect(timer.json().strategies[0].processValuesOut.find((p) => p.name === 'remainingTime'))
                .to.have.property('value')
                .to.equal(100);

            await delay(45);
            expect(hit).to.equal(5);
            expect(timer.json().strategies[0].processValuesOut.find((p) => p.name === 'remainingTime'))
                .to.have.property('value')
                .to.closeTo(55, 5);

            // do not count further on pause
            await timer.pause();
            expect(hit).to.equal(6);
            await delay(25);
            expect(hit).to.equal(6);
            expect(timer.json().strategies[0].processValuesOut.find((p) => p.name === 'remainingTime'))
                .to.have.property('value')
                .to.closeTo(55, 5);

            await timer.resume();
            expect(hit).to.equal(6);
            await delay(12);
            expect(hit).to.equal(7);
            expect(timer.json().strategies[0].processValuesOut.find((p) => p.name === 'remainingTime'))
                .to.have.property('value')
                .to.closeTo(43, 5);

            await delay(20);
            expect(hit).to.equal(9);
            expect(timer.json().strategies[0].processValuesOut.find((p) => p.name === 'remainingTime'))
                .to.have.property('value')
                .to.closeTo(23, 5);

            await timer.reset();
        });

        it('should restart', async () => {
            const timer = new Timer('t1');
            expect(timer.state).to.equal(ServiceState.IDLE);

            timer.start();
            await waitForStateChange(timer, 'EXECUTE');
            expect(timer.state).to.equal(ServiceState.EXECUTE);

            timer.restart();
            await waitForStateChange(timer, 'EXECUTE');
            expect(timer.state).to.equal(ServiceState.EXECUTE);

            timer.abort();
            await waitForStateChange(timer, 'ABORTED');
            expect(timer.state).to.equal(ServiceState.ABORTED);

            timer.reset();
            await waitForStateChange(timer, 'IDLE');
            expect(timer.state).to.equal(ServiceState.IDLE);
        });
    });

    describe('FunctionGenerator', () => {
        it('should run', async () => {
            const f1 = new FunctionGenerator('f1');
            expect(f1.state).to.equal(ServiceState.IDLE);

            let params = f1.json().strategies[0].parameters;
            expect(params).to.have.lengthOf(2);
            expect(f1.json().strategies[0].processValuesOut).to.have.lengthOf(1);

            await f1.setParameters([{name: 'function', value: 'sin(5*t)'}, {name: 'updateRate', value: 100}]);
            await f1.start();
            expect(f1.state).to.equal(ServiceState.EXECUTE);

            await delay(110);
            params = f1.json().strategies[0].processValuesOut;
            let value = params.find((p) => p.name === 'output');
            expect(value).to.have.property('value').to.be.closeTo(0.5, 0.03);
            await f1.pause();
            await delay(100);

            params = f1.json().strategies[0].processValuesOut;
            value = params.find((p) => p.name === 'output');
            expect(value).to.have.property('value').to.be.closeTo(0.841, 0.03);
            await f1.resume();
            await delay(100);

            await f1.stop();

            await f1.reset();
        });
    });

    describe('Storage', () => {
        it('should work', async () => {
            const s1 = new Storage('s1');
            let params = s1.json().strategies[0].parameters;
            expect(params).to.have.lengthOf(1);
            expect(params[0]).to.have.property('name', 'storage');
            expect(params[0]).to.have.property('value', undefined);

            s1.setParameters([{name: 'storage', value: 2}]);
            params = s1.json().strategies[0].parameters;
            expect(params).to.have.lengthOf(1);
            expect(params[0]).to.have.property('name', 'storage');
            expect(params[0]).to.have.property('value', 2);

            s1.setParameters([{name: 'storage', value: 'teststring'}]);
            params = s1.json().strategies[0].parameters;
            expect(params).to.have.lengthOf(1);
            expect(params[0]).to.have.property('name', 'storage');
            expect(params[0]).to.have.property('value', 'teststring');

            await s1.start();
            await s1.complete();
            await s1.reset();
            params = s1.json().strategies[0].parameters;
            expect(params).to.have.lengthOf(1);
        });
    });

    describe('FunctionGenerator', () => {
        it('should work', async () => {
            const f1 = new FunctionGenerator('s1');
            let params = f1.json().strategies[0].parameters;
            expect(params).to.have.lengthOf(2);
            expect(params[0]).to.have.property('name', 'function');
            expect(params[0]).to.have.property('value', 'sin(t)');

            f1.setParameters([{name: 'function', value: '2*t'}]);
            params = f1.json().strategies[0].parameters;
            expect(params[0]).to.have.property('name', 'function');
            expect(params[0]).to.have.property('value', '2*t');

            await f1.start();
            await new Promise((resolve) => {
                f1.eventEmitter.once('parameterChanged' , () => {
                    resolve();
                });
            });
            params = f1.json().strategies[0].processValuesOut;
            expect(params[0]).to.have.property('name', 'output');
            expect(params[0]).to.have.property('value').to.closeTo(2, 0.5);

            await f1.complete();
            await f1.reset();
        });
    });
});
