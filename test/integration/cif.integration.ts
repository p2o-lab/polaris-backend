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
import {Module} from '../../src/model/core/Module';
import {ServiceState} from '../../src/model/core/enum';
import {manager} from '../../src/model/Manager';
import {expect} from 'chai';
import {later, testForStateChange} from '../helper';
import {Service} from '../../src/model/core/Service';
import {Parameter} from '../../src/model/recipe/Parameter';

describe('Integration test with CIF test PLC', function () {

    let module: Module;
    let service: Service;

    before(async function() {
        this.timeout(5000);
        manager.autoreset = true;
        const file = fs.readFileSync('assets/modules/module_cif.json');
        module = manager.loadModule(JSON.parse(file.toString()))[0];
        await module.connect();
        service = module.services[4];

        expect(() => {module.connect()}).to.not.throw();

        let json = await module.json();
        expect(json).to.have.property('id', 'CIF');
        assert.equal(json.id, 'CIF');
        assert.equal(json.endpoint, 'opc.tcp://10.6.51.200:4840');
        assert.equal(json.protected, false);
        assert.equal(json.connected, true);
        expect(json.services).to.have.lengthOf(6);

        const serviceStates = await module.getServiceStates();
        expect(serviceStates).to.have.lengthOf(6);
    });

    after(async() => {
        await later(500);
        await module.disconnect();
        const json = await module.json();
        assert.equal(json.connected, false);
    });

    it('should bring everything to idle', async () => {
        let result = await manager.stopAllServices();
        console.log(result);
        await later(500);

        await manager.resetAllServices();
        await later(500);
    });

    it('should provide correct service state', async () => {
        const state = await service.getServiceState();
        expect(state).to.equal(ServiceState.IDLE);
    });

    it('should provide correct control enable in IDLE state', async () => {
        const controlEnable = await service.getControlEnable();
        expect(controlEnable).to.deep.equal({
            "abort": true,
            "complete": false,
            "pause": false,
            "reset": false,
            "restart": false,
            "resume": false,
            "start": true,
            "stop": true,
            "unhold": false
        });
    });

    it('should provide correct undefined error string', async () => {
        const errorString = await service.getErrorString();
        expect(errorString).to.be.undefined;
    });

    it('should perform a service cycle', async function () {
        this.timeout(10000);

        assert.equal(service.name, 'Test_Service.Dosieren');

        const listener = service.subscribeToService();
        let param = new Parameter({name: "SollVolumenStrom", value: 1.3}, service);
        await service.start(service.strategies[0], [param]);
        await testForStateChange(listener, 'STARTING');
        await testForStateChange(listener, 'RUNNING');

        await service.pause();
        await testForStateChange(listener, 'PAUSING');
        await testForStateChange(listener, 'PAUSED');

        await service.resume();
        await testForStateChange(listener, 'RESUMING');
        await testForStateChange(listener, 'RUNNING');

        param.value =1.4;
        await service.restart(service.strategies[0], [param]);
        await testForStateChange(listener, 'STARTING');
        await testForStateChange(listener, 'RUNNING');

        await service.complete();
        await testForStateChange(listener, 'COMPLETING');
        await testForStateChange(listener, 'COMPLETED');

        // test auto reset
        // await service.reset();
        await testForStateChange(listener, 'RESETTING');
        await testForStateChange(listener, 'IDLE');
    });

});
