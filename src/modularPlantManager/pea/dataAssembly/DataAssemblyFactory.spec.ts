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
	BaseDataAssemblyOptions, DataAssemblyOptions,
	OpcUaNodeOptions
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../connection';
import {PEA} from '../PEA';
import {
	AnaMan,
	BinMon, BinView, DataAssembly, DataAssemblyFactory,
	DIntMan, DIntMon, MonAnaDrv, ServiceControl, ServParam
} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {PEAMockup} from '../PEA.mockup';
import {MockupServer} from '../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssemblyFactory', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const parseJson = require('json-parse-better-errors');
	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should use default DataAssembly when provided type not found', () => {
			const dA1 = DataAssemblyFactory.create({
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
			expect(dA1 instanceof DataAssembly).to.equal(true);
			expect(dA1.toJson()).to.deep.equal({
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
				namespaceIndex: 'CODESYSSPV3/3S/IecVarAccess',
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

		it('should fail without provided PEA', async () => {
			expect(() => DataAssemblyFactory.create(
				{name: 'test', interfaceClass: 'none', communication: {} as BaseDataAssemblyOptions},
				emptyOPCUAConnection)
			).to.throw('creteDataItem Failed');

		});

		it('should create ServiceControl', async () => {
			const daOptions: BaseDataAssemblyOptions = parseJson(fs.readFileSync(
				'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssembly/ServiceControl.json',
				'utf8'), null, 60);
			const da1: ServiceControl = DataAssemblyFactory.create({
				name: 'serviceControl1',
				interfaceClass: 'ServiceControl',
				communication: daOptions
			} as DataAssemblyOptions, emptyOPCUAConnection) as ServiceControl;
			expect(da1 instanceof ServiceControl).to.equal(true);
			expect(da1.communication.CommandExt).to.not.equal(undefined);
			expect(da1.communication.WQC).to.not.equal(undefined);
			expect(da1.communication.TagName).to.equal(undefined);
		});

		it('should create BinView', async () => {
			const da1 = DataAssemblyFactory.create({
				name: 'binview1',
				interfaceClass: 'BinView',
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
			expect(da1 instanceof BinView).to.equal(true);
			expect(da1.toJson()).to.deep.equal({
				name: 'binview1',
				readonly: true,
				timestamp: undefined,
				type: 'boolean',
				value: true
			});

			const da2 = DataAssemblyFactory.create({
				name: 'binview2',
				interfaceClass: 'BinView',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: {},
					WQC: null,
					V: {value: 0},
					VState0: {value: 'on'},
					VState1: {value: 'off'}
				} as any
			}, emptyOPCUAConnection);
			expect(da2.toJson().value).to.equal(false);
		});

		it('should create BinMon', async () => {
			const da1 = DataAssemblyFactory.create({
				name: 'binmon1',
				interfaceClass: 'BinMon',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: {},
					WQC: null,
					V: {value: true},
					VState0: {value: 'on'},
					VState1: {value: 'off'},
					VFlutEn: null
				} as any
			}, emptyOPCUAConnection);
			expect(da1 instanceof BinMon).to.equal(true);
			expect(da1.toJson()).to.deep.equal({
				name: 'binmon1',
				readonly: true,
				timestamp: undefined,
				type: 'boolean',
				value: true
			});
		});

		it('should create DigMon', async () => {
			const da1 = DataAssemblyFactory.create({
				name: 'digmon1',
				interfaceClass: 'DigMon',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: null,
					WQC: null,
					V: {value: 23},
					VUnit: {value: 1038},
					VSclMax: {value: 100},
					VSclMin: {value: 0}
				} as any
			}, emptyOPCUAConnection);
			expect(da1 instanceof DIntMon).to.equal(true);
			expect(da1.toJson()).to.deep.equal({
				name: 'digmon1',
				readonly: true,
				timestamp: undefined,
				type: 'number',
				unit: 'L',
				value: 23,
				max: 100,
				min: 0
			});
		});

		it('should create ExtIntDigOp', async () => {
			const da1 = DataAssemblyFactory.create({
				name: 'extintdigop1',
				interfaceClass: 'ExtIntDigOp',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: null,
					WQC: null,
					VRbk: {value: 23},
					VUnit: {value: 1038},
					VSclMax: {value: 100},
					VSclMin: {value: 0}
				} as any
			}, emptyOPCUAConnection);
			expect(da1 instanceof DIntMan).to.equal(true);
			expect(da1.toJson()).to.deep.equal({
				name: 'extintdigop1',
				readonly: false,
				requestedValue: undefined,
				timestamp: undefined,
				type: 'number',
				unit: 'L',
				value: 23,
				max: 100,
				min: 0
			});
		});

		it('should create MonAnaDrv', async () => {
			const da1 = DataAssemblyFactory.create({
				name: 'MonAnaDrv1',
				interfaceClass: 'MonAnaDrv',
				communication: {
					OSLevel: null,
					TagDescription: null,
					TagName: null,
					WQC: null,
					RpmFbk: {value: 50}
				}
			} as any, emptyOPCUAConnection);
			expect(da1 instanceof MonAnaDrv).to.equal(true);
			expect(da1.toJson()).to.deep.equal({
				name: 'MonAnaDrv1',
				readonly: false,
				requestedValue: undefined,
				timestamp: undefined,
				type: 'number',
				value: 50,
			});
		});
	});

	describe('dynamic with PEATestServer', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			await mockupServer.start();

			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://127.0.0.1:4334/PEATestServer');
			await connection.connect();
		});

		afterEach(async () => {
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe and unsubscribe from ExtIntAnaOp', async () => {
			const daJson = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0].services[0].procedures[0].parameters[0];
			const da = DataAssemblyFactory.create(daJson as any, connection) as AnaMan;

			await da.subscribe();

			da.setParameter(2);
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 2) {
					resolve();
				}
			}));
			expect(da.defaultWriteDataItem?.value).to.equal(2);

			await da.setParameter(3, 'VExt');
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 3) {
					resolve();
				}
			}));

			da.unsubscribe();
			da.setParameter(2);
			await Promise.race([
				new Promise((resolve, reject) => da.on('changed', reject)),
				new Promise((resolve) => setTimeout(resolve, 500))
			]);
		}).timeout(5000);

		it('should set value', async () => {
			const daJson = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0].services[0].procedures[0].parameters[0];
			const da = DataAssemblyFactory.create(daJson as any, connection) as AnaMan;

			await da.subscribe();

			await da.setValue({value: 11, name: 'abc'}, []);
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 11) {
					resolve();
				}
			}));
			expect(da.defaultWriteDataItem?.value).to.equal(11);

			await da.setValue({value: 12, name: 'abc'}, []);
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 12) {
					resolve();
				}
			}));
			expect(da.defaultWriteDataItem?.value).to.equal(12);
		}).timeout(5000);

		it('should set continuous value', async () => {
			const daPEA = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEA(daPEA);
			await pea.connect();

			const da = pea.services[0].procedures[0].parameters[0] as ServParam;
			const inputDa = pea.variables[0];
			await da.subscribe();
			await inputDa.subscribe();

			await new Promise((resolve) => inputDa.on('changed', () => resolve()));

			da.setValue({value: '2 * PEATestServer.Variable001', name: da.name, continuous: true}, [pea]);
			const inputValue = inputDa.getDefaultReadValue();
			await new Promise((resolve) => da.on('changed', () => resolve()));
			expect(da.getDefaultReadValue()).to.be.closeTo(2 * inputValue, 0.05 * inputValue);

			await da.setValue({value: '11', name: da.name}, []);
			await new Promise((resolve) => da.on('changed', () => resolve()));
			expect(da.getDefaultReadValue()).to.equal(11);
		}).timeout(5000);

	});

});
