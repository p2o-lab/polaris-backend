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


import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {Service} from '../../../src/model/core/Service';
import {Module} from '../../../src/model/core/Module';
import {expect} from 'chai';
import {ServiceCommand} from '@p2olab/polaris-interface';
import {waitForStateChange} from '../../helper';
import * as fs from "fs";
import * as parseJson from 'json-parse-better-errors';

describe('Service', () => {

    let moduleServer: ModuleTestServer;

    before(function (done) {
        moduleServer = new ModuleTestServer();
        moduleServer.start(done);
    });

    after((done) => {
        moduleServer.shutdown(done);
    });


    it('should load from options', async function() {
        this.timeout(10000);

        const moduleJson = parseJson(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'), null, 60)
            .modules[0];

        let serviceJson = moduleJson.services[0];

        // copy object
        let moduleWithoutService = JSON.parse(JSON.stringify(moduleJson));
        moduleWithoutService.services = [];

        const module = new Module(moduleWithoutService);
        const service = new Service(serviceJson, module);

        await module.connect();

        let result = await service.getOverview();
        expect(result).to.have.property('controlEnable')
            .to.deep.equal({
                abort: true,
                complete: true,
                pause: true,
                reset: true,
                restart: true,
                resume: true,
                start: true,
                stop: true,
                unhold: true
            });

        expect(result).to.have.property('currentStrategy', 'Strategy 1');
        expect(result).to.have.property('name', 'Service1');
        expect(result).to.have.property('opMode', 0);
        expect(result).to.have.property('status', 'IDLE');

        await service.subscribeToService();
        let stateChangeCount=0;
        service.on('state', (state) => {
            console.log('state changed', state);

            stateChangeCount++;
        });

        await service.execute(ServiceCommand.start);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');
        await service.execute(ServiceCommand.restart);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');
        await service.execute(ServiceCommand.stop);
        await waitForStateChange(service, 'STOPPING');
        await waitForStateChange(service, 'STOPPED');
        await service.execute(ServiceCommand.reset);
        await waitForStateChange(service, 'IDLE');
        await service.execute(ServiceCommand.start);
        await waitForStateChange(service, 'STARTING');
        await waitForStateChange(service, 'EXECUTE');
        await service.execute(ServiceCommand.pause);
        await waitForStateChange(service, 'PAUSING');
        await waitForStateChange(service, 'PAUSED');
        await service.execute(ServiceCommand.resume);
        await waitForStateChange(service, 'RESUMING');
        await waitForStateChange(service, 'EXECUTE');
        await service.execute(ServiceCommand.complete);
        await waitForStateChange(service, 'COMPLETING');
        await waitForStateChange(service, 'COMPLETED');
        await service.execute(ServiceCommand.abort);
        await waitForStateChange(service, 'ABORTING');
        await waitForStateChange(service, 'ABORTED');

        expect(stateChangeCount).to.equal(18);

        await module.disconnect();
    });
});
