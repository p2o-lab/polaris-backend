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

import {ModuleOptions} from '@p2olab/polaris-interface';
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';
import {AggregatedService, AggregatedServiceOptions} from '../../../src/model/virtualService/AggregatedService';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {waitForStateChange} from '../../helper';

describe('AggregatedService', () => {

    let moduleServer1: ModuleTestServer;
    let moduleServer2: ModuleTestServer;

    beforeEach(async () => {
        moduleServer1 = new ModuleTestServer(4334);
        moduleServer2 = new ModuleTestServer(4335);
        await moduleServer1.start();
        await moduleServer2.start();
        moduleServer1.startSimulation();
        moduleServer2.startSimulation();
    });

    afterEach(async () => {
        await moduleServer1.shutdown();
        await moduleServer2.shutdown();
    });

    it('should work', async () => {
        const moduleJson: ModuleOptions =
            JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8')).modules[0];

        moduleJson.id = 'PEA1';
        moduleJson.opcua_server_url = 'opc.tcp://127.0.0.1:4334/ModuleTestServer';
        const module1 = new Module(moduleJson);
        await module1.connect();

        moduleJson.id = 'PEA2';
        moduleJson.opcua_server_url = 'opc.tcp://127.0.0.1:4335/ModuleTestServer';
        const module2 = new Module(moduleJson);
        await module2.connect();

        const aggregatedServiceJson: AggregatedServiceOptions =
            JSON.parse(fs.readFileSync('assets/virtualService/aggregatedService_moduletestserver.json', 'utf8'));

        const as = new AggregatedService(aggregatedServiceJson, [module1, module2]);

        as.start();

        await waitForStateChange(as, 'EXECUTE');
    }).timeout(5000);

});
