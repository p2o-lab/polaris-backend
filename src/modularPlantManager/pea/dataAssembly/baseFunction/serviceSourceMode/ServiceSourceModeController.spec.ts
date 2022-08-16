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
import {DataAssemblyFactory} from '../../DataAssemblyFactory';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';
import {AnaServParamDataItems} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceSourceMode', () => {

	const connectionHandler = new ConnectionHandler();
	const referenceDataAssemblyModel = getAnaServParamDataAssemblyModel(2, 'Variable', 'Variable');
	const referenceDataAssembly = DataAssemblyFactory.create(referenceDataAssemblyModel, connectionHandler);

	describe('static', () => {

		it('should create ServiceSourceMode', () => {
			const baseFunction = new ServiceSourceModeController(referenceDataAssembly.dataItems as AnaServParamDataItems);
			expect(baseFunction).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcChannel).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcExtAut).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcIntAut).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcIntOp).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcExtOp).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcIntAct).to.not.be.undefined;
			expect(baseFunction.dataItems.SrcExtAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ServiceSourceModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const baseFunction = new ServiceSourceModeController(referenceDataAssembly.dataItems as AnaServParamDataItems);
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));

			expect(baseFunction.dataItems.SrcChannel.value).equal(false);
			expect(baseFunction.dataItems.SrcExtAut.value).equal(false);
			expect(baseFunction.dataItems.SrcIntAut.value).equal(false);
			expect(baseFunction.dataItems.SrcIntOp.value).equal(false);
			expect(baseFunction.dataItems.SrcExtOp.value).equal(false);
			expect(baseFunction.dataItems.SrcIntAct.value).equal(true);
			expect(baseFunction.dataItems.SrcExtAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, Extern on', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceSourceModeMockup;
		let serviceSourceModeController: ServiceSourceModeController;
		let baseFunction: any;
		let adapterId: string;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new ServiceSourceModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new ServiceSourceModeController(this.dataItems);
			await baseFunction.subscribe();
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
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
		let baseFunction: any;
		let adapterId: string;

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
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new ServiceSourceModeController(this.dataItems);
			await baseFunction.subscribe();
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
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
			baseFunction.SrcExtAct.value = true;
			await serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		});

		it('waitForServiceSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await baseFunction.SrcExtOp.write(true);
			await serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		}).timeout(4000);

		it('waitForServiceSourceModeToPassSpecificTest, timeout', async () => {
			expect(baseFunction.SrcExtAct.value).to.be.false;
			expect(baseFunction.SrcIntAct.value).to.be.true;
			return expect(serviceSourceModeController.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern)).to.be
				.rejectedWith('Timeout: ServiceSourceMode did not change');
		}).timeout(4000);

		it('should change ServiceSourceMode to external and back to internal', async () => {
			await serviceSourceModeController.setToExternalServiceSourceMode();
			expect(mockup.srcExtAct).to.be.true;
			expect(mockup.srcIntAct).to.be.false;
			expect(baseFunction.SrcExtAct.value).to.be.true;
			expect(baseFunction.SrcIntAct.value).to.be.false;
			await serviceSourceModeController.setToInternalServiceSourceMode();
			expect(mockup.srcExtAct).to.be.false;
			expect(mockup.srcIntAct).to.be.true;
			expect(baseFunction.SrcExtAct.value).to.be.false;
			expect(baseFunction.SrcIntAct.value).to.be.true;
		}).timeout(4000);
	});
});
