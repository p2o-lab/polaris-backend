/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {
	BaseDataAssemblyOptions, BinMonOptions, BinViewOptions, DataAssemblyOptions, DIntMonOptions, MonAnaDrvOptions,
	OpcUaNodeOptions,
	OperationMode, ServiceControlOptions
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../connection';
import {PEAController} from '../PEAController';
import {
	BinMon, BinView, DataAssemblyController, DataAssemblyControllerFactory,
	DIntMon, MonAnaDrv, ServiceControl, ServParam
} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {MockupServer} from '../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {
    describe('static', () => {
        const emptyOPCUAConnection = new OpcUaConnection('', '');
        it('should create DataAssemblyController', () => {
            expect(() => {
                const da1 = new DataAssemblyController({
                    name: 'name',
                    dataItems: {TagName: 'test', TagDescription: 'test',},
                    metaModelRef: 'analogitem'
                }, emptyOPCUAConnection);
                expect(da1.tagName).to.equal('test');
                expect(da1.tagDescription).to.equal('test');
            }).to.not.throw();
        });

        it('should fail with undefined connection', () => {
            expect(() => new DataAssemblyController({
                    name: 'name',
                    dataItems: {TagName: 'test', TagDescription: 'test'},
                    metaModelRef: 'analogitem'
                }, undefined as any)
            ).to.throw('Creating DataAssemblyController Error: No OpcUaConnection provided');
        });

        it('should fail with undefined dataitems', () => {
            expect(() => new DataAssemblyController(
                {dataItems:undefined as any, name:'test', metaModelRef:'Test'}, emptyOPCUAConnection)
            ).to.throw('Creating DataAssemblyController Error: No Communication variables found in DataAssemblyOptions');
        });

        describe('dynamic with PEATestServer', () => {

            let mockupServer: MockupServer;
            let connection: OpcUaConnection;

            beforeEach(async function () {
                this.timeout(4000);
                mockupServer = new MockupServer();
                await mockupServer.start();
                connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334','','');
                await connection.connect();
            });

            afterEach(async function () {
                this.timeout(4000);
                await connection.disconnect();
                await mockupServer.shutdown();
            });

            it('should ', async () => {

            });
            //TODO DataAssemblyControllers tagname and tagdescription are static, so dynamic test not needed?


/*            it('should set continuous value', async () => {
                const daPEA = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
                    .peas[0];
                const pea = new PEAController(daPEA);
                await pea.connect();

                const da = pea.services[0].procedures[0].parameters[0] as ServParam;
                const inputDa = pea.variables[0];
                expect(da.name).to.equal('Factor');
                expect(da.defaultReadDataItem?.value).to.equal(2);
                expect(inputDa.name).to.equal('Variable001');

                await new Promise((resolve) => inputDa.once('changed', resolve));

                const inputValue = inputDa.getDefaultReadValue();
                await da.setValue({value: '2 * ModuleTestServer.Variable001', name: da.name, continuous: true}, [pea]);
                await new Promise((resolve) => da.once('VRbk', resolve));
                expect(da.getDefaultReadValue()).to.be.closeTo(2 * inputValue, 0.05 * inputValue);

                await da.setValue({value: '11', name: da.name}, []);
                await new Promise((resolve) => da.on('VRbk', resolve));
                expect(da.getDefaultReadValue()).to.equal(11);
            });

            it('should create ServiceControl', async () => {
                const daJson = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
                    .peas[0].services[0];
                const da: ServiceControl = DataAssemblyControllerFactory.create(
                    {...daJson, metaModelRef: 'ServiceControl'} as any, connection) as ServiceControl;
                const p = da.subscribe();
                connection.startListening();
                await p;
                expect(da.name).to.equal('Service1');
                expect(da instanceof ServiceControl).to.equal(true);

                expect(da.opMode.getOperationMode()).to.equal(OpModeController.Offline);

                await da.opMode.setToOperatorOperationMode();
                expect(da.opMode.getOperationMode()).to.equal(OpModeController.Operator);

                await da.opMode.writeOpMode(OpModeController.Offline);
                await da.opMode.waitForOpModeToPassSpecificTest(OpModeController.Offline);

                await da.opMode.setToAutomaticOperationMode();
                expect(da.opMode.getOperationMode()).to.equal(OpModeController.Automatic);
            });*/
        });

    });
});
