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
import {isAutomaticState, isManualState, OpMode, opModetoJson} from '../../../src/model/core/enum';
import {Module} from '../../../src/model/core/Module';
import {AdvAnaOp, AnaServParam, ExtAnaOp, ExtIntAnaOp} from '../../../src/model/dataAssembly/AnaOp';
import {AnaView} from '../../../src/model/dataAssembly/AnaView';
import {DataAssembly} from '../../../src/model/dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../../../src/model/dataAssembly/DataAssemblyFactory';
import {StrView} from '../../../src/model/dataAssembly/Str';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {TestServerVariable} from '../../../src/moduleTestServer/ModuleTestVariable';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {

    describe('static', () => {
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
                const a = new DataAssembly(<any>{
                    name: 'name',
                    communication: {
                        TagName: opcUaNode as OpcUaNodeOptions,
                        TagDescription: opcUaNode as OpcUaNodeOptions,
                        OSLevel: opcUaNode as OpcUaNodeOptions,
                        WQC: null,
                        access: 'read'
                    },
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
            const module = new Module(moduleCifJson);

            const daJson1 = moduleCifJson.process_values.find((d) => d.name === 'Test_AnaView.L004');
            const da1 = DataAssemblyFactory.create(daJson1, module);

            const daJson2 = moduleCifJson.process_values.find((d) => d.name === 'Sensoren.L001');
            const da2 = DataAssemblyFactory.create(daJson2, module);

            expect(da1 instanceof AnaView).to.equal(true);
            expect(da1 instanceof ExtIntAnaOp).to.equal(false);
            expect(da1 instanceof AdvAnaOp).to.equal(false);

            expect(da1 instanceof AnaView).to.equals(true);
            if (da1 instanceof AnaView) {
                expect(da1.communication.OSLevel).to.have.property('access', 'write');
                expect(da1.communication.V).to.have.property('access', 'read');
                expect(da1.communication.VSclMin).to.have.property('value', 0);
                expect(da1.communication.VSclMax).to.have.property('value', 35.5);
                expect(da1.communication.V).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.Application.Test_AnaView.L001_PV.rPV');
                expect(da1.communication.VUnit).to.have.property('value', 1038);
                expect(da1.getUnit()).to.equal('L');

                expect(da1.toJson()).to.deep.equal({
                    name: 'Test_AnaView.L004',
                    min: 0,
                    max: 35.5,
                    value: undefined,
                    unit: 'L',
                    type: 'number',
                    readonly: true
                });

                da1.communication.V.value = 12.3;

                expect(da1.toJson()).to.deep.equal({
                    name: 'Test_AnaView.L004',
                    min: 0,
                    max: 35.5,
                    value: 12.3,
                    unit: 'L',
                    type: 'number',
                    readonly: true
                });
            }

            expect(da2 instanceof AnaView).to.equals(true);
            if (da2 instanceof AnaView) {
                expect(da2.communication.VSclMin).to.have.property('value', 0);
                expect(da2.communication.VSclMax).to.have.property('value', 30);
                expect(da2.communication.V).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.Application.Sensoren.L001.V');
                expect(da2.communication.VUnit).to.have.property('value', 1038);
                expect(da2.getUnit()).to.equal('L');
            }
        });
    });

    describe('with testserver', () => {

        let moduleServer: ModuleTestServer;
        let moduleJson;
        let moduleJsonDosierer;
        let module: Module;
        let moduleDosierer: Module;

        before(async function () {
            this.timeout(5000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();

            moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            module = new Module(moduleJson);
            moduleJsonDosierer = JSON.parse(fs.readFileSync('assets/modules/module_dosierer_1.1.0.json').toString())
                .modules[0];
            moduleDosierer = new Module(moduleJsonDosierer);

            await module.connect();
        });

        after(async () => {
            await module.disconnect();
            await moduleServer.shutdown();
        });

        it('should create ExtIntAnaOp', async () => {
            const daJson = moduleJson.services[0].strategies[0].parameters[0];
            const da = DataAssemblyFactory.create(daJson, module) as ExtIntAnaOp;

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

            await da.subscribe();
            if (da instanceof ExtIntAnaOp) {
                expect(da.communication.VOut).to.have.property('nodeId', 'Service1.Parameter1.V');
                expect(da.communication.VOut).to.have.property('value', 20);
                const json = da.toJson();
                expect(json).to.have.property('name', 'Parameter001');
                expect(json).to.have.property('readonly', false);
                expect(json).to.have.property('type', 'number');
                expect(json).to.have.property('value', 20);
                expect(json).to.have.property('min');
                expect(json).to.have.property('max');
                expect(json).to.have.property('unit');
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
                expect(da.communication.VOut).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VOut');
                expect(da.communication.VInt).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VInt');
                expect(da.communication.VMin).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VMin');
                expect(da.communication.VMax).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VMax');
                expect(da.WQC).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.WQC');
                expect(da.communication.OpMode).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.OpMode.binary');
                expect(da.communication.VExt).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VExt');
                expect(da.communication.VSclMax).to.have.property('nodeId',
                    '|var|WAGO 750-8202 PFC200 2ETH RS.App_Dosing.Services.Fill.SetVolume.VSclMax');
                expect(da.communication.VSclMin).to.have.property('nodeId',
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
                await da.subscribe();
                expect(da.OSLevel).to.have.property('dataType', 'Byte');
                expect(da.OSLevel).to.have.property('namespaceIndex', 'urn:NodeOPCUA-Server-default');
                expect(da.OSLevel).to.have.property('nodeId', 'Service1.ErrorMsg.OSLevel');

                expect(da.Text).to.have.property('nodeId', 'Service1.ErrorMsg.Text');
                expect(da.Text).to.have.property('value', 'initial value');

                const json = da.toJson();
                expect(json).to.have.property('name', 'ErrorMsg');
                expect(json).to.have.property('readonly', true);
                expect(json).to.have.property('type', 'string');
                expect(json).to.have.property('value', 'initial value');
            }
        });
    });

});
