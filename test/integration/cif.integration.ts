/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import * as assert from 'assert';
import * as fs from 'fs';
import { Module } from '../../src/model/Module';
import { ServiceState } from '../../src/model/enum';
import { promiseTimeout } from '../../src/timeout-promise';
import { manager } from '../../src/model/Manager';
import { expect } from 'chai';

describe('Integration test with CIF test PLC', function () {

    let module: Module;

    before(() => {
        const file = fs.readFileSync('assets/modules/module_cif.json');
        module = new Module(JSON.parse(file.toString()).modules[0]);
    });

    /** wait
     *
     * @param {number} delay in milliseconds
     * @returns {Promise<any>}
     */
    function later(delay: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    async function testForStateChange(listener, expectedState: string) {
        try {
            await promiseTimeout(1000, new Promise((resolve) => {
                listener.on('state', (state) => {
                    if (ServiceState[state] === expectedState) {
                        resolve();
                    }
                });
            }));
        } catch (err) {
            assert.fail(`Failed to reach ${expectedState} within 1000ms`);
        }
    }

    it('should connect to CIF', async function () {
        this.timeout(10000);
        manager.autoreset = true;
        await module.connect();

        let json = await module.json();
        expect(json).to.have.property('id', 'CIF');
        assert.equal(json.id, 'CIF');
        assert.equal(json.endpoint, 'opc.tcp://10.6.51.200:4840');
        assert.equal(json.protected, false);
        assert.equal(json.connected, true);
        expect(json.services).to.have.lengthOf(6);

        const serviceStates = await module.getServiceStates();

        const service = module.services[5];
        assert.equal(service.name, 'Test_Service.Vorlegen');

        const listener = service.subscribeToService();
        // listener.on('state', state => console.log(ServiceState[state]));

        // bring service to IDLE
        if (await service.getServiceState() !== ServiceState.ABORTED) {
            await service.abort();
            await testForStateChange(listener, 'ABORTED');
        }

        await service.reset();
        await testForStateChange(listener, 'IDLE');

        await service.start(service.strategies[0], undefined);
        await testForStateChange(listener, 'RUNNING');

        await service.complete();
        await testForStateChange(listener, 'COMPLETED');

        // test auto reset
        // await service.reset();
        await testForStateChange(listener, 'IDLE');

        await later(500);
        await module.disconnect();
        json = await module.json();
        assert.equal(json.connected, false);
        return json;
    });

});
