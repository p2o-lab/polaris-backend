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


import {ModuleTestServer, TestServerService} from '../../../src/moduleTestServer/ModuleTestServer';
import {Service} from '../../../src/model/core/Service';
import {Module} from '../../../src/model/core/Module';
import {expect} from 'chai';
import {ServiceCommand} from '@p2olab/polaris-interface';
import {waitForStateChange} from '../../helper';
import * as fs from 'fs';
import * as parseJson from 'json-parse-better-errors';
import {OpMode} from '../../../src/model/core/enum';
import * as delay from 'timeout-as-promise';

describe('Service', () => {

    let moduleServer: ModuleTestServer;
    let service: Service;
    let testService: TestServerService;
    let module: Module;

    beforeEach(async () => {
        moduleServer = new ModuleTestServer();
        await moduleServer.start();
        moduleServer.startSimulation();
        testService = moduleServer.services[0];

        const moduleJson = parseJson(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'), null, 60)
            .modules[0];
        let serviceJson = moduleJson.services[0];

        // copy object
        let moduleWithoutService = JSON.parse(JSON.stringify(moduleJson));
        moduleWithoutService.services = [];

        module = new Module(moduleWithoutService);
        service = new Service(serviceJson, module);

        await module.connect();
    });

    afterEach(async () => {
        await module.disconnect();
        moduleServer.stopSimulation();
        await moduleServer.shutdown();
    });

    it('waitForOpModeSpecificTest', async () => {
        expect(service.name).to.equal('Service1');
        testService.varOpmode = OpMode.stateAutAct;
        let opMode = await service.getOpMode();
        expect(opMode).to.equal(OpMode.stateAutAct);

        testService.varOpmode = 0;
        await service.execute(ServiceCommand.start);

        opMode = await service.getOpMode();
        expect(opMode).to.equal(OpMode.stateAutAct + OpMode.srcExtAct);
    });

    it('full service state cycle', async () => {

        let result = await service.getOverview();
        expect(result).to.have.property('status', 'IDLE');
        expect(result).to.have.property('controlEnable')
            .to.deep.equal({
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            start: true,
            stop: true,
            unhold: false
        });

        expect(result).to.have.property('currentStrategy', 'Strategy 1');
        expect(result).to.have.property('name', 'Service1');
        expect(result).to.have.property('opMode').to.deep.equal({
            state: 'off',
            source: 'internal'
        });



        service.subscribeToService();
        await service.setOperationMode();

        result = await service.getOverview();
        expect(result).to.have.property('status', 'IDLE');
        expect(result).to.have.property('controlEnable')
            .to.deep.equal({
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            start: true,
            stop: true,
            unhold: false
        });

        expect(result).to.have.property('currentStrategy', 'Strategy 1');
        expect(result).to.have.property('name', 'Service1');
        expect(result).to.have.property('opMode').to.deep.equal({
            state: 'automatic',
            source: 'external'
        });

        await delay(50);
        let stateChangeCount = 0;
        service.eventEmitter.on('state', () => {
            stateChangeCount++;
        });

        service.execute(ServiceCommand.start);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.restart);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.stop);
        await waitForStateChange(service, 'STOPPING');
        await waitForStateChange(service, 'STOPPED');

        service.execute(ServiceCommand.reset);
        await waitForStateChange(service, 'IDLE');

        service.execute(ServiceCommand.start);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.pause);
        await waitForStateChange(service, 'PAUSING');
        await waitForStateChange(service, 'PAUSED');

        service.execute(ServiceCommand.resume);
        await waitForStateChange(service, 'RESUMING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.complete);
        await waitForStateChange(service, 'COMPLETING');
        await waitForStateChange(service, 'COMPLETED');

        service.execute(ServiceCommand.abort);
        await waitForStateChange(service, 'ABORTING');
        await waitForStateChange(service, 'ABORTED');

        service.execute(ServiceCommand.reset);
        await waitForStateChange(service, 'IDLE');

        service.execute(ServiceCommand.start);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');

        service.execute(ServiceCommand.complete);
        await waitForStateChange(service, 'COMPLETING');
        await waitForStateChange(service, 'COMPLETED');

        expect(stateChangeCount).to.equal(22);
    }).timeout(10000).retries(3);
});
