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
import {DataAssemblyOptions, ServiceSourceMode} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../operationElement/servParam/anaServParam/AnaServParam.spec.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {ServiceSourceModeController} from './ServiceSourceModeController';
import {MockupServer} from '../../../../_utils';
import {ServiceSourceModeMockup} from './ServiceSourceMode.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceSourceMode', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperatorElement/AnaServParam',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();

		it('should create ServiceSourceMode', () => {
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as any;
			const serviceSourceModeController = new ServiceSourceModeController(da);
			expect(serviceSourceModeController).to.not.be.undefined;
			expect(da.communication.SrcChannel).to.not.be.undefined;
			expect(da.communication.SrcExtAut).to.not.be.undefined;
			expect(da.communication.SrcIntAut).to.not.be.undefined;
			expect(da.communication.SrcIntOp).to.not.be.undefined;
			expect(da.communication.SrcExtOp).to.not.be.undefined;
			expect(da.communication.SrcIntAct).to.not.be.undefined;
			expect(da.communication.SrcExtAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ServiceSourceModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new ServiceSourceModeController(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.SrcChannel.value).equal(false);
			expect(dataAssemblyController.communication.SrcExtAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcExtOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAct.value).equal(true);
			expect(dataAssemblyController.communication.SrcExtAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, Extern on', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: ServiceSourceModeMockup;
		let serviceSourceModeController: ServiceSourceModeController;
		let dataAssemblyController: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new ServiceSourceModeMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			serviceSourceModeController = new ServiceSourceModeController(dataAssemblyController);
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

		it('getServiceSourceMode, should be intern', () => {
			expect(serviceSourceModeController.getServiceSourceMode()).to.equal(ServiceSourceMode.Intern);
		});
		it('isServiceSourceMode', () => {
			expect(serviceSourceModeController.isServiceSourceMode(ServiceSourceMode.Intern)).to.be.true;
			expect(serviceSourceModeController.isServiceSourceMode(ServiceSourceMode.Extern)).to.be.false;
		});
		it('setToExternalServiceSourceMode(), nothing should happen', async () => {
			await serviceSourceModeController.setToExternalServiceSourceMode();
			expect(mockup.srcIntAct).to.be.false;
			expect(mockup.srcExtAct).to.be.true;
		}).timeout(4000);
	});

	describe('dynamic functions, Intern on', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: ServiceSourceModeMockup;
		let serviceSourceModeController: ServiceSourceModeController;
		let dataAssemblyController: any;
		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			mockup = new ServiceSourceModeMockup(
				mockupServer.nameSpace,
				mockupNode,
				'Variable');
			mockup.srcMode= ServiceSourceMode.Intern;
			await mockupServer.start();

			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection);
			serviceSourceModeController = new ServiceSourceModeController(dataAssemblyController);
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

		it('getServiceSourceMode', async () => {
			expect(serviceSourceModeController.getServiceSourceMode()).to.equal(ServiceSourceMode.Intern);
		});

		it('isServiceSourceMode', async () => {
			expect(serviceSourceModeController.isServiceSourceMode(ServiceSourceMode.Intern)).to.be.true;
			expect(serviceSourceModeController.isServiceSourceMode(ServiceSourceMode.Extern)).to.be.false;
		});

		it('waitForServiceSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			dataAssemblyController.communication.SrcExtAct.value = true;
			await serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		});

		it('waitForServiceSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await dataAssemblyController.communication.SrcExtOp.write(true);
			await serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		}).timeout(4000);

		it('waitForServiceSourceModeToPassSpecificTest, timeout', async () => {
			expect(dataAssemblyController.communication.SrcExtAct.value).to.be.false;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.true;
			return expect(serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern)).to.be
				.rejectedWith('Timeout: ServiceSourceMode did not change');
		}).timeout(4000);

		it('should change ServiceSourceMode to external and back to internal', async () => {
			await serviceSourceModeController.setToExternalServiceSourceMode();
			expect(mockup.srcExtAct).to.be.true;
			expect(mockup.srcIntAct).to.be.false;
			expect(dataAssemblyController.communication.SrcExtAct.value).to.be.true;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.false;
			await serviceSourceModeController.setToInternalServiceSourceMode();
			expect(mockup.srcExtAct).to.be.false;
			expect(mockup.srcIntAct).to.be.true;
			expect(dataAssemblyController.communication.SrcExtAct.value).to.be.false;
			expect(dataAssemblyController.communication.SrcIntAct.value).to.be.true;
		}).timeout(4000);
	});

});

