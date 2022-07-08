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


import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {ServiceSourceMode} from '@p2olab/polaris-interface';
import {ServiceSourceModeController} from './ServiceSourceModeController';
import {MockupServer} from '../../../../_utils';
import {ServiceSourceModeMockup} from './ServiceSourceMode.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaServParamDataAssemblyModel} from '../../operationElement/servParam/anaServParam/AnaServParam.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceSourceMode', () => {

	const options = getAnaServParamDataAssemblyModel(2, 'Variable', 'Variable');

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();

		it('should create ServiceSourceMode', () => {
			const da = new ServiceSourceModeController(options, connectionHandler);
			expect(da).to.not.be.undefined;
			expect(da.SrcChannel).to.not.be.undefined;
			expect(da.SrcExtAut).to.not.be.undefined;
			expect(da.SrcIntAut).to.not.be.undefined;
			expect(da.SrcIntOp).to.not.be.undefined;
			expect(da.SrcExtOp).to.not.be.undefined;
			expect(da.SrcIntAct).to.not.be.undefined;
			expect(da.SrcExtAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ServiceSourceModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new ServiceSourceModeController(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.SrcChannel.value).equal(false);
			expect(dataAssembly.SrcExtAut.value).equal(false);
			expect(dataAssembly.SrcIntAut.value).equal(false);
			expect(dataAssembly.SrcIntOp.value).equal(false);
			expect(dataAssembly.SrcExtOp.value).equal(false);
			expect(dataAssembly.SrcIntAct.value).equal(true);
			expect(dataAssembly.SrcExtAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, Extern on', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceSourceModeMockup;
		let serviceSourceModeController: ServiceSourceModeController;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new ServiceSourceModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			dataAssembly = new ServiceSourceModeController(options, connectionHandler);
			await connectionHandler.connect();
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
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
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceSourceModeMockup;
		let serviceSourceModeController: ServiceSourceModeController;
		let dataAssembly: any;
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

			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			dataAssembly = new ServiceSourceModeController(options, connectionHandler);
			await connectionHandler.connect();
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
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
			dataAssembly.SrcExtAct.value = true;
			await serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		});

		it('waitForServiceSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await dataAssembly.SrcExtOp.write(true);
			await serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		}).timeout(4000);

		it('waitForServiceSourceModeToPassSpecificTest, timeout', async () => {
			expect(dataAssembly.SrcExtAct.value).to.be.false;
			expect(dataAssembly.SrcIntAct.value).to.be.true;
			return expect(serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern)).to.be
				.rejectedWith('Timeout: ServiceSourceMode did not change');
		}).timeout(4000);

		it('should change ServiceSourceMode to external and back to internal', async () => {
			await serviceSourceModeController.setToExternalServiceSourceMode();
			expect(mockup.srcExtAct).to.be.true;
			expect(mockup.srcIntAct).to.be.false;
			expect(dataAssembly.SrcExtAct.value).to.be.true;
			expect(dataAssembly.SrcIntAct.value).to.be.false;
			await serviceSourceModeController.setToInternalServiceSourceMode();
			expect(mockup.srcExtAct).to.be.false;
			expect(mockup.srcIntAct).to.be.true;
			expect(dataAssembly.SrcExtAct.value).to.be.false;
			expect(dataAssembly.SrcIntAct.value).to.be.true;
		}).timeout(4000);
	});
});
