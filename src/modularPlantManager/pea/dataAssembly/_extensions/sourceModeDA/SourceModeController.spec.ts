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
import * as baseDataAssemblyOptions from './SourceModeController.spec.json';
import {BinManInt} from '../../operationElement';
import {MockupServer} from '../../../../_utils';
import {SourceModeDAMockup} from './SourceModeDA.mockup';
import {SourceModeController} from './SourceModeController';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SourceModeController', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinManInt',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();

		it('should create SourceModeController', async () => {
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);

			new SourceModeController(da);
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

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			new SourceModeDAMockup(mockupServer.nameSpace, mockupNode,'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new SourceModeController(dataAssemblyController);

			await connection.connect();
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			
			expect(dataAssemblyController.communication.SrcChannel.value).equal(false);
			expect(dataAssemblyController.communication.SrcManAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcManOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAct.value).equal(true);
			expect(dataAssemblyController.communication.SrcManAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, manual', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: SourceModeDAMockup;
		let sourceMode: SourceModeController;
		let dataAssemblyController: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			mockup = new SourceModeDAMockup(
				mockupServer.nameSpace,
				mockupNode,
				'Variable');
			mockup.srcMode = SourceMode.Manual;
			await mockupServer.start();

			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection);
			sourceMode = new SourceModeController(dataAssemblyController);
			await connection.connect();
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
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
			expect(dataAssemblyController.communication.SrcManAct.value).to.be.true;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.false;
		});
		it('writeSourceMode, should set Intern', async () => {
			await sourceMode.writeSourceMode(SourceMode.Intern);
			await new Promise(f => setTimeout(f, 500)); // we have to wait for emit change
			expect(dataAssemblyController.communication.SrcManAct.value).to.be.false;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.true;
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await dataAssemblyController.communication.SrcIntOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Intern);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			return expect(sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Intern)).to.be
				.rejectedWith('Timeout: SourceMode did not change');
		}).timeout(4000);
	});

	describe('dynamic functions, Intern on', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let sourceMode: SourceModeController;
		let dataAssemblyController: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			new SourceModeDAMockup(mockupServer.nameSpace, mockupNode, 'Variable');
			await mockupServer.start();

			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection);
			sourceMode = new SourceModeController(dataAssemblyController);
			await connection.connect();
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
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
			expect(dataAssemblyController.communication.SrcManAct.value).to.be.true;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.false;
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			dataAssemblyController.communication.SrcManAct.value = true;
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await dataAssemblyController.communication.SrcManOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			return expect(sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual)).to.be
				.rejectedWith('Timeout: SourceMode did not change');
		}).timeout(5000);

		it('setToManualSourceMode()', async () => {
			await sourceMode.setToManualSourceMode();
			expect(dataAssemblyController.communication.SrcManAct.value).to.be.true;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.false;
		}).timeout(4000);
	});

});
