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

import {ServiceCommand} from '@p2olab/polaris-interface';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {ClientSession, OPCUAClient} from 'node-opcua-client';
import {OPCUAServer} from 'node-opcua-server';
import * as delay from 'timeout-as-promise';
import {Module} from '../../../src/model/core/Module';
import {Operation} from '../../../src/model/recipe/Operation';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {waitForStateChange} from '../../helper';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Operation', () => {

    describe('OPC UA server mockup', () => {

        let moduleServer: ModuleTestServer;

        before(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
        });

        after(async () => {
            await moduleServer.shutdown();
        });

        it('should try execute operation until it works', async () => {

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            const module = new Module(moduleJson);
            const service = module.services[0];

            await module.connect();

            const operation = new Operation({
                service: 'Service1',
                command: 'complete' as ServiceCommand
            }, [module]);

            operation.execute();
            await delay(600);
            service.execute(ServiceCommand.start);

            await waitForStateChange(service, 'COMPLETED', 3000);

        }).timeout(10000);

    });

});
