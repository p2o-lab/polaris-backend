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

import {OpcUaNodeOptions} from '@p2olab/polaris-interface';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import * as delay from 'timeout-as-promise';
import {isAutomaticState, isManualState, OpMode, opModetoJson} from '../../../src/model/core/enum';
import {Module} from '../../../src/model/core/Module';
import {AdvAnaOp, AnaServParam, ExtAnaOp, ExtIntAnaOp} from '../../../src/model/dataAssembly/AnaOp';
import {AnaView} from '../../../src/model/dataAssembly/AnaView';
import {DataAssembly} from '../../../src/model/dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../../../src/model/dataAssembly/DataAssemblyFactory';
import {StrView} from '../../../src/model/dataAssembly/Str';
import {ModuleTestServer, TestServerVariable} from '../../../src/moduleTestServer/ModuleTestServer';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {

    let moduleServer: ModuleTestServer;
    let moduleJson;
    let moduleJsonDosierer;
    let module: Module;
    let moduleDosierer: Module;

    before(async () => {
        moduleServer = new ModuleTestServer();
        await moduleServer.start();

        moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
            .modules[0];
        module = new Module(moduleJson);
        moduleJsonDosierer = JSON.parse(fs.readFileSync('assets/modules/module_dosierer_1.1.0.json').toString())
            .modules[0];
        moduleDosierer = new Module(moduleJsonDosierer);

        await module.connect();
        await delay(500);
    });

    after(async () => {
        await module.disconnect();
        await moduleServer.shutdown();
    });

    it('should fail with missing parameters', () => {
        expect(() => {
            const a = new DataAssembly(undefined, undefined);
        }).to.throw();
        const opcUaNode: OpcUaNodeOptions = {
            namespace_index: 'CODESYSSPV3/3S/IecVarAccess',
            node_id: 'i=12',
            data_type: 'Float'
        };
        expect(() => {
            const a = new DataAssembly({
                name: 'name',
                communication: [opcUaNode],
                interface_class: 'analogitem'
            }, undefined);
        }).to.throw();
    });

    it('should fail without provided module', async () => {
        expect(() => DataAssemblyFactory.create(
            {name: 'test', interface_class: 'none', communication: null}, null)
        ).to.throw(/No module for data assembly/);

    });

    it('should create AnaView', async () => {
        const moduleCifJson = JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString()).modules[0];
        const daJson = moduleCifJson.process_values[3];
        const da = DataAssemblyFactory.create(daJson, module);

        expect(da instanceof AnaView).to.equal(true);
        expect(da instanceof ExtIntAnaOp).to.equal(false);
        expect(da instanceof AdvAnaOp).to.equal(false);

        if (da instanceof AnaView) {
            expect(da.VSclMin).to.have.property('value', '0');
            expect(da.VSclMax).to.have.property('value', '35');
            expect(da.V).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.Application.Test_AnaView.L001_PV.rPV');
            expect(da.VUnit).to.have.property('value', '1038');
        }
    });

    it('should create ExtIntAnaOp', async () => {
        const daJson = moduleJson.services[0].strategies[0].parameters[0];
        const da = DataAssemblyFactory.create(daJson, module);

        expect(da instanceof ExtAnaOp).to.equal(true);
        expect(da instanceof ExtIntAnaOp).to.equal(true);
        expect(da instanceof AdvAnaOp).to.equal(false);

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

        if (da instanceof ExtIntAnaOp) {
            expect(da.VOut).to.have.property('node_id', 'Service1.Parameter1.V');
            expect(da.VOut).to.have.property('value', 20);
        }
    });

    it('should create AnaServParam', async () => {
        const daJson = moduleJsonDosierer.services[0].strategies[1].parameters[0];
        const da = DataAssemblyFactory.create(daJson, moduleDosierer);

        expect(da instanceof ExtAnaOp).to.equal(true);
        expect(da instanceof ExtIntAnaOp).to.equal(true);
        expect(da instanceof AdvAnaOp).to.equal(false);
        expect(da instanceof AnaServParam).to.equal(true);

        if (da instanceof AnaServParam) {
            expect(da.VOut).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VOut');
            expect(da.VInt).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VInt');
            expect(da.VMin).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VMin');
            expect(da.VMax).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VMax');
            expect(da.WQC).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.WQC');
            expect(da.OpMode).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.OpMode.binary');
            expect(da.VExt).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VExt');
            expect(da.VSclMax).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VSclMax');
            expect(da.VSclMin).to.have.property('node_id',
                '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VSclMin');
        }
    });

    it('should create StrView', async () => {
        const daJson = moduleJson.services[0].strategies[0].parameters[2];
        const da = DataAssemblyFactory.create(daJson, module);

        expect(da instanceof ExtAnaOp).to.equal(false);
        expect(da instanceof ExtIntAnaOp).to.equal(false);
        expect(da instanceof AdvAnaOp).to.equal(false);

        expect(da instanceof StrView).to.equal(true);

        if (da instanceof StrView) {
            expect(da.OSLevel).to.deep.equal({
                data_type: 'Byte',
                namespace_index: 'urn:NodeOPCUA-Server-default',
                node_id: 'Service1.ErrorMsg.OSLevel'
            });

            expect(da.Text).to.have.property('node_id', 'Service1.ErrorMsg.Text');
            expect(da.Text).to.have.property('value', 'initial value');
        }
    });

});
