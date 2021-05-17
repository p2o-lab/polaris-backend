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
	BinMon, BinView, DataAssembly, DataAssemblyFactory,
	DIntMon, MonAnaDrv, ServiceControl, ServParam
} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {MockupServer} from '../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const parseJson = require('json-parse-better-errors');

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should use default DataAssembly when provided type not found', () => {
			const da1 = DataAssemblyFactory.create({
				name: 'xyz',
				interfaceClass: 'SomethingStrange',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: {},
					WQC: null,
					V: {value: 22},
					VState0: {value: 'on'},
					VState1: {value: 'off'}
				} as any
			}, emptyOPCUAConnection);
			expect(da1 instanceof DataAssembly).to.equal(true);
			expect(da1.toJson()).to.deep.equal({
				name: 'xyz',
				readonly: true,
				timestamp: undefined,
				type: 'number',
				value: undefined
			});

			const da2 = DataAssemblyFactory.create({
				name: 'xyz2',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: null,
					WQC: null
				}
			} as any, emptyOPCUAConnection);
			expect(da2 instanceof DataAssembly).to.equal(true);
		});

		it('should fail with xyz', () => {
			const opcUaNode: OpcUaNodeOptions = {
				namespaceIndex: 'P2OGalaxy',
				nodeId: 'i=12',
				dataType: 'Float'
			};
			expect(() => new DataAssembly({
					name: 'name',
					communication: {
						TagName: opcUaNode as OpcUaNodeOptions,
						TagDescription: opcUaNode as OpcUaNodeOptions,
						OSLevel: opcUaNode as OpcUaNodeOptions,
						WQC: null,
						access: 'read'
					} as any,
					interfaceClass: 'analogitem'
				}, emptyOPCUAConnection)
			).to.throw('Cannot set property \'TagName\' of undefined');
		});

		it('should fail without provided PEAController', async () => {
			expect(() => DataAssemblyFactory.create(
				{name: 'test', interfaceClass: 'none', communication: {} as BaseDataAssemblyOptions},
				emptyOPCUAConnection)
			).to.throw('createDataItem Failed');

		});

		it('should have correct createDataItem method', async () => {
			const daOptions: BaseDataAssemblyOptions =
				parseJson(fs.readFileSync(
					'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/DataAssembly.json',
					'utf8'), null, 60);

			const options: DataAssemblyOptions = {
				name: 'test',
				interfaceClass: 'DataAssembly',
				communication: daOptions
			};
			const da1 = new DataAssembly(options, emptyOPCUAConnection);
			expect(da1.communication.TagName).to.not.equal(undefined);
			expect(da1.communication.TagDescription).to.not.equal(undefined);
		});

		it('should create ServiceControl', async () => {
			const daOptions: ServiceControlOptions =
				parseJson(fs.readFileSync(
					'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/ServiceControl.json',
					'utf8'), null, 60);
			const da1: ServiceControl = DataAssemblyFactory.create({
				name: 'serviceControl1',
				interfaceClass: 'ServiceControl',
				communication: daOptions
			}, emptyOPCUAConnection) as ServiceControl;
			expect(da1 instanceof ServiceControl).to.equal(true);
			expect(da1.communication.CommandExt).to.not.equal(undefined);
			expect(da1.communication.WQC).to.equal(undefined);
			expect(da1.communication.TagName).to.equal(undefined);
		});

		it('should create BinView', async () => {
			const daOptions: BinViewOptions =
				parseJson(fs.readFileSync(
					'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/indicatorElement/BinView.json',
					'utf8'), null, 60);
			daOptions.V.value = 22;
			daOptions.VState0.value = 'on';
			daOptions.VState1.value = 'off';
			const da1: BinView = DataAssemblyFactory.create({
				name: 'binview1',
				interfaceClass: 'BinView',
				communication: daOptions
			}, emptyOPCUAConnection) as BinView;
			expect(da1 instanceof BinView).to.equal(true);
			expect(da1.communication.V?.value).to.equal(true);

			daOptions.V.value = 0;
			const da2 = DataAssemblyFactory.create({
				name: 'binview2',
				interfaceClass: 'BinView',
				communication: daOptions
			}, emptyOPCUAConnection) as BinView;
			expect(da2.communication.V?.value).to.equal(false);
		});

		it('should create BinMon', async () => {
			const daOptions: BinMonOptions =
				parseJson(fs.readFileSync(
					'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/indicatorElement/BinMon.json',
					'utf8'), null, 60);
			daOptions.V.value = true;
			const da1 = DataAssemblyFactory.create({
				name: 'binmon1',
				interfaceClass: 'BinMon',
				communication: daOptions
			}, emptyOPCUAConnection) as BinMon;
			expect(da1 instanceof BinMon).to.equal(true);
			expect(da1.communication.V?.value).to.equal(true);
		});

		it('should create DIntMon', async () => {
			const daOptions: DIntMonOptions =
				parseJson(fs.readFileSync(
					'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/indicatorElement/DIntMon.json',
					'utf8'), null, 60);
			daOptions.V.value = 23;
			daOptions.VUnit.value = 1038;
			daOptions.VSclMax.value = 100;
			daOptions.VSclMin.value = 0;
			const da1 = DataAssemblyFactory.create({
				name: 'digmon1',
				interfaceClass: 'DigMon',
				communication: daOptions
			}, emptyOPCUAConnection) as DIntMon;
			expect(da1 instanceof DIntMon).to.equal(true);
			expect(da1.communication.VUnit?.value).to.equal('L');
			expect(da1.communication.V?.value).to.equal(23);
			expect(da1.communication.VSclMax?.value).to.equal(100);
			expect(da1.communication.VSclMin?.value).to.equal(0);
		});

		it('should create MonAnaDrv', async () => {
			const daOptions: MonAnaDrvOptions =
				parseJson(fs.readFileSync(
					'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/activeElement/drv/MonAnaDrv.json',
					'utf8'), null, 60);
			const da1 = DataAssemblyFactory.create({
				name: 'MonAnaDrv1',
				interfaceClass: 'MonAnaDrv',
				communication: daOptions
			} as any, emptyOPCUAConnection) as MonAnaDrv;
			expect(da1 instanceof MonAnaDrv).to.equal(true);
		});
	});

	describe('dynamic with PEATestServer', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function() {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.start();

			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://127.0.0.1:4334/PEATestServer');
			await connection.connect();
		});

		afterEach(async function() {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should set continuous value', async () => {
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
			const da: ServiceControl = DataAssemblyFactory.create(
				{...daJson, interfaceClass: 'ServiceControl'} as any, connection) as ServiceControl;
			const p = da.subscribe();
			connection.startListening();
			await p;
			expect(da.name).to.equal('Service1');
			expect(da instanceof ServiceControl).to.equal(true);

			expect(da.getOperationMode()).to.equal(OperationMode.Offline);

			await da.setToOperatorOperationMode();
			expect(da.getOperationMode()).to.equal(OperationMode.Operator);

			await da.writeOpMode(OperationMode.Offline);
			await da.waitForOpModeToPassSpecificTest(OperationMode.Offline);

			await da.setToAutomaticOperationMode();
			expect(da.getOperationMode()).to.equal(OperationMode.Automatic);
		});
	});

});
