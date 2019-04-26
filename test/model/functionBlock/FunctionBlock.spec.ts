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
import {Timer} from '../../../src/model/functionBlock/Timer';
import {Storage} from '../../../src/model/functionBlock/Storage';
import * as delay from 'timeout-as-promise';
import {ServiceState} from '../../../src/model/core/enum';
import {FunctionGenerator} from '../../../src/model/functionBlock/FunctionGenerator';


describe('VirtualService', () => {

    describe('Timer', () => {
        it('should run', async () => {
            let timer = new Timer('t1');
            expect(timer.state).to.equal(ServiceState.IDLE);

            let params = await timer.getCurrentParameters();
            expect(params).to.have.lengthOf(3);
            expect(params[0]).to.deep.equal({
                "min": 1,
                "name": "duration",
                "unit": "ms",
                "value": 10000
            });

            await timer.setParameters([{name: 'duron', value: 1000}]).then(expect.fail, err => err);

            await timer.setParameters([{name: 'remainingTime', value: 1000}]).then(expect.fail, err => err);

            await timer.setParameters([{name: 'duration', value: 500}, {name:'updateRate', value: 50}]);

            let hit = 0;
            timer.listenToVariable('remainingTime').on('changed', () => { hit = hit+1});
            await timer.start();
            expect(timer.state).to.equal(ServiceState.EXECUTE);

            await delay(200);
            await timer.pause();
            expect(hit).to.equal(5);
            await delay(80);

            await timer.resume();

            await delay(310);

            expect(hit).to.equal(10);

            await timer.reset();
        });
    });

    describe('FunctionGenerator', () => {
        it('should run', async () => {
            let f1 = new FunctionGenerator('f1');
            expect(f1.state).to.equal(ServiceState.IDLE);

            let params = await f1.getCurrentParameters();
            expect(params).to.have.lengthOf(3);

            await f1.setParameters([{name: 'function', value: "sin(5*t)"}, {name: 'updateRate', value: 100}]);
            await f1.start();
            expect(f1.state).to.equal(ServiceState.EXECUTE);

            await delay(120);
            params = await f1.getCurrentParameters();
            let value = params.find(p => p.name === 'output');
            expect(value).to.have.property('value').to.be.closeTo(0.5,0.03);
            await f1.pause();
            await delay(100);

            params = await f1.getCurrentParameters();
            value = params.find(p => p.name === 'output');
            expect(value).to.have.property('value').to.be.closeTo(0.841,0.03);
            await f1.resume();
            await delay(100);

            await f1.stop();

            await f1.reset();
        });
    });

    describe('Storage', () => {
        it('should work', async () => {
            const s1 = new Storage('s1');
            let params = await s1.getCurrentParameters();
            expect(params).to.have.lengthOf(1);
            expect(params[0]).to.have.property('name', 'storage');
            expect(params[0]).to.have.property('value', undefined);

            s1.setParameters([{name: "storage", value: 2}]);
            params = await s1.getCurrentParameters();
            expect(params).to.have.lengthOf(1);
            expect(params[0]).to.have.property('name', 'storage');
            expect(params[0]).to.have.property('value', 2);

            s1.setParameters([{name: "storage", value: "teststring"}]);
            params = await s1.getCurrentParameters();
            expect(params).to.have.lengthOf(1);
            expect(params[0]).to.have.property('name', 'storage');
            expect(params[0]).to.have.property('value', "teststring");

            await s1.start();
            await s1.complete();
            await s1.reset();
            params = await s1.getCurrentParameters();
            expect(params).to.have.lengthOf(1);
        })
    })
});