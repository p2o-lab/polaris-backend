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

import {OpcUaConnection} from '../../../connection';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyController} from '../../DataAssemblyController';
import {DataAssemblyOptions, SourceMode} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/binmanint.json';
import {BinManInt} from '../../operationElement';
import {MockupServer} from '../../../../_utils';
import {SourceModeDAMockup} from './SourceModeDA.mockup';
import {Namespace, UAObject} from 'node-opcua';
import {SourceModeController} from './SourceModeController';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SourceModeController', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinManInt',
		dataItems: baseDataAssemblyOptions
	};
	for (const key in dataAssemblyOptions.dataItems as any) {
		//skip static values
		if ((typeof (dataAssemblyOptions.dataItems as any)[key] != 'string')) {
			(dataAssemblyOptions.dataItems as any)[key].namespaceIndex = namespaceUrl;
		}
	}
	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create SourceModeController', async () => {
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);

			const sourceModeController = new SourceModeController(da);
			expect((da as BinManInt).communication.SrcChannel).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcManAut).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcIntAut).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcIntOp).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcManOp).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcIntAct).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcManAct).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: SourceModeDAMockup;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.namespace as Namespace).addObject({
				organizedBy: mockupServer.rootComponent as UAObject,
				browseName: 'Variable',
			});
			mockup = new SourceModeDAMockup(
				mockupServer.namespace as Namespace,
				mockupNode,
				'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334', '', '');
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			const da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			const sourceMode = new SourceModeController(da1);
			await connection.connect();
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;
			expect(da1.communication.SrcChannel.value).equal(false);
			expect(da1.communication.SrcManAut.value).equal(false);
			expect(da1.communication.SrcIntAut.value).equal(false);
			expect(da1.communication.SrcIntOp.value).equal(false);
			expect(da1.communication.SrcManOp.value).equal(false);
			expect(da1.communication.SrcIntAct.value).equal(true);
			expect(da1.communication.SrcManAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, manual', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: SourceModeDAMockup;
		let sourceMode: SourceModeController;
		let da1: any;
		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.namespace as Namespace).addObject({
				organizedBy: mockupServer.rootComponent as UAObject,
				browseName: 'Variable',
			});
			mockup = new SourceModeDAMockup(
				mockupServer.namespace as Namespace,
				mockupNode,
				'Variable');
			mockup.srcMode = SourceMode.Manual;
			await mockupServer.start();

			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334', '', '');
			da1 = new DataAssemblyController(dataAssemblyOptions, connection);
			sourceMode = new SourceModeController(da1);
			await connection.connect();
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;
		});
		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('getSourceMode, should be manual', () => {
			expect(sourceMode.getSourceMode()).to.equal(SourceMode.Manual);
		});
		it('isSourceMode', () => {
			expect(sourceMode.isSourceMode(SourceMode.Manual)).to.be.true;
			expect(sourceMode.isSourceMode(SourceMode.Intern)).to.be.false;
		});
		it('setToManualalSourceMode(), nothing should happen', async () => {
			await sourceMode.setToManualSourceMode();
			expect(da1.communication.SrcManAct.value).to.be.true;
			expect(da1.communication.SrcIntAct.value).to.be.false;
		});
		it('writeSourceMode, should set Intern', async () => {
			await sourceMode.writeSourceMode(SourceMode.Intern);
			await new Promise(f => setTimeout(f, 500)); // we have to wait for emit change
			expect(da1.communication.SrcManAct.value).to.be.false;
			expect(da1.communication.SrcIntAct.value).to.be.true;
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await da1.communication.SrcIntOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Intern);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			//TODO need to be implemented
			//	await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});
	});
	//TODO test more

	describe('dynamic functions, Intern on', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: SourceModeDAMockup;
		let sourceMode: SourceModeController;
		let da1: any;
		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.namespace as Namespace).addObject({
				organizedBy: mockupServer.rootComponent as UAObject,
				browseName: 'Variable',
			});
			mockup = new SourceModeDAMockup(
				mockupServer.namespace as Namespace,
				mockupNode,
				'Variable');
			await mockupServer.start();

			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334', '', '');
			da1 = new DataAssemblyController(dataAssemblyOptions, connection);
			sourceMode = new SourceModeController(da1);
			await connection.connect();
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;
		});
		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('getSourceMode', async () => {
			expect(sourceMode.getSourceMode()).to.equal(SourceMode.Intern);
		});

		it('isSourceMode', async () => {
			expect(sourceMode.isSourceMode(SourceMode.Intern)).to.be.true;
			expect(sourceMode.isSourceMode(SourceMode.Manual)).to.be.false;
		});

		it('writeSourceMode, should set Manual', async () => {
			await sourceMode.writeSourceMode(SourceMode.Manual);
			await new Promise(f => setTimeout(f, 500)); // we have to wait for emit change
			expect(da1.communication.SrcManAct.value).to.be.true;
			expect(da1.communication.SrcIntAct.value).to.be.false;
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			da1.communication.SrcManAct.value = true;
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await da1.communication.SrcManOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			//TODO need to be implemented
			//	await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('setToManualSourceMode()', async () => {
			await sourceMode.setToManualSourceMode();
			expect(da1.communication.SrcManAct.value).to.be.true;
			expect(da1.communication.SrcIntAct.value).to.be.false;
		}).timeout(4000);
	});
	//TODO test more

});
