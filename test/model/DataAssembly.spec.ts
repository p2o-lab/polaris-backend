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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {Module} from '../../src/model/core/Module';
import {DataAssemblyFactory} from '../../src/model/dataAssembly/DataAssemblyFactory';
import {ModuleTestServer, TestServerVariable} from '../../src/moduleTestServer/ModuleTestServer';
import {isAutomaticState, isManualState, OpMode, opModetoJson} from '../../src/model/core/enum';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {

    let moduleServer: ModuleTestServer;
    let moduleJson;
    let module: Module;

    before(async () => {
        moduleServer = new ModuleTestServer();
        await moduleServer.start();

        moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
            .modules[0];
        module = new Module(moduleJson);

        await module.connect();

    });

    after(async () => {
        await module.disconnect();
        await moduleServer.shutdown();
    });

    it('should create', async () => {
        expect(() => DataAssemblyFactory.create(
            {name: 'test', interface_class: 'none', communication: null}, null)
        ).to.throw(/No module for data assembly/);

        const daJson = moduleJson.services[0].strategies[0].parameters[0];
        const da = DataAssemblyFactory.create(daJson, module);

        expect(DataAssemblyFactory.isExtAnaOp(da)).to.equal(true);
        expect(DataAssemblyFactory.isExtIntAnaOp(da)).to.equal(true);
        expect(DataAssemblyFactory.isAdvAnaOp(da)).to.equal(false);

        let opMode = await da.getOpMode();
        expect(opModetoJson(opMode)).to.deep.equal({state: 'off', source: 'internal'});

        (moduleServer.services[0].parameter[0] as TestServerVariable).opMode = OpMode.stateManAct;

        await da.waitForOpModeToPassSpecificTest(isManualState);
        opMode = await da.getOpMode();
        expect(opModetoJson(opMode)).to.deep.equal({state: 'manual', source: 'internal'});

        da.waitForOpModeToPassSpecificTest(isAutomaticState);
        (moduleServer.services[0].parameter[0] as TestServerVariable).opMode = OpMode.stateAutAct;
        opMode = await da.getOpMode();
        expect(opModetoJson(opMode)).to.deep.equal({state: 'automatic', source: 'internal'});
    });

});
