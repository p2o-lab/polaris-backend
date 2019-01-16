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
import {later, testForStateChange} from '../helper';

describe('Integration test with CIF test PLC', function () {

    let module: Module;

    before(() => {
        const file = fs.readFileSync('assets/modules/module_cif.json');
        module = manager.loadModule(JSON.parse(file.toString()))[0];
    });


    it('should connect to CIF', async function () {

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
    });

    it('should bring everything to idle', async () => {
       await manager.stopAllServices();
       await later(500);

       await manager.resetAllServices();
       await later(500);

       const state = await module.services[5].getServiceState();
       expect(state).to.equal(ServiceState.IDLE)

    });

    it('perform a service cycle', async function() {
        this.timeout(10000);
        const service = module.services[5];
        assert.equal(service.name, 'Test_Service.Vorlegen');

        const listener = service.subscribeToService();
        await service.start(service.strategies[0], undefined);
        await testForStateChange(listener, 'RUNNING');

        await service.complete();
        await testForStateChange(listener, 'COMPLETED');

        // test auto reset
        // await service.reset();
        await testForStateChange(listener, 'IDLE');

        await later(500);
        await module.disconnect();
        const json = await module.json();
        assert.equal(json.connected, false);
        return json;
    });

});
