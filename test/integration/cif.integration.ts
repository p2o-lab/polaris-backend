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
import * as delay from 'timeout-as-promise';
import { waitForStateChange} from '../helper';
import {Service} from '../../src/model/core/Service';
import {Parameter} from '../../src/model/recipe/Parameter';
import {ServiceCommand} from '@plt/pfe-ree-interface';

describe.skip('CIF Integration', function () {

    let module: Module;
    let service: Service;

    before(async function() {
        this.timeout(5000);
        manager.autoreset = true;
        const file = fs.readFileSync('assets/modules/module_cif.json');
        module = manager.loadModule(JSON.parse(file.toString()))[0];
        let index = module.services.findIndex((service) => service.name === 'Test_Service.Service1');
        module.services.splice(index, 1);
        index = module.services.findIndex((service) => service.name === 'Test_Service.Service2');
        module.services.splice(index, 1);
        await module.connect();
        expect(async () => {await module.connect()}).to.not.throw();
        service = module.services.find((service) => service.name === 'Test_Service.Dosieren');
    });

    after(async() => {
        await delay(200);
        await module.disconnect();
        const json = await module.json();
        assert.equal(json.connected, false);
    });

    it('should be succesfully connected', async() => {
        let json = await module.json();
        expect(json).to.have.property('id', 'CIF');
        assert.equal(json.endpoint, 'opc.tcp://10.6.51.200:4840');
        assert.equal(json.protected, false);
        assert.equal(json.connected, true);
        expect(json.services).to.have.lengthOf(4);

        const serviceStates = await module.getServiceStates();
        expect(serviceStates).to.have.lengthOf(4);
    });

    it('should bring everything to idle and perform a service cycle', async function() {
        this.timeout(10000);
        await manager.abortAllServices();
        await delay(250);

        await manager.resetAllServices();
        await delay(250);

        expect(service).has.property('name', 'Test_Service.Dosieren');
        const state = await service.getServiceState();
        expect(state).to.equal(ServiceState.IDLE);

        const controlEnable = await service.getControlEnable();
        expect(controlEnable).to.deep.equal({
            'abort': true,
            'complete': false,
            'pause': false,
            'reset': false,
            'restart': false,
            'resume': false,
            'start': true,
            'stop': true,
            'unhold': false
        });


        let param = new Parameter({name: 'SollVolumenStrom', value: 1.3}, service);
        service.execute(ServiceCommand.start, service.strategies[0], [param]);
        //await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.pause);
        //await waitForStateChange(service, 'PAUSING');
        await waitForStateChange(service, 'PAUSED');

        service.execute(ServiceCommand.resume);
        //await waitForStateChange(service, 'RESUMING');
        await waitForStateChange(service, 'EXECUTE');

        // does not work every time
        param.value = 1.4;
        //service.execute(ServiceCommand.restart, service.strategies[0], [param]);
        //await waitForStateChange(service, 'STARTING');
        //await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.complete);
        //await waitForStateChange(service, 'COMPLETING');
        await waitForStateChange(service, 'COMPLETED');

        // test auto reset
        //await waitForStateChange(service, 'RESETTING');
        await waitForStateChange(service, 'IDLE');

        service.execute(ServiceCommand.start);
        //await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.stop);
        //await waitForStateChange(service, 'STOPPING');
        await waitForStateChange(service, 'STOPPED');

        service.execute(ServiceCommand.abort);
        //await waitForStateChange(service, 'ABORTING');
        await waitForStateChange(service, 'ABORTED');

        service.execute(ServiceCommand.reset).catch((err) => console.log('already triggered by autoreset'));
        //await waitForStateChange(service, 'RESETTING');
        await waitForStateChange(service, 'IDLE');
    });

    it('should provide correct service overview', async () => {
        const json = await service.getOverview();
        expect(json).to.be.property('name');
        expect(json).to.be.property('opMode');
        expect(json).to.be.property('status');
        expect(json).to.be.property('strategies');
        expect(json).to.be.property('parameters');
        expect(json).to.be.property('currentStrategy');
        expect(json).to.be.property('_lastStatusChange');
        expect(json).to.be.property('controlEnable');
    });

});
