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
import {OperationMode} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../_utils';
import {ServiceOpMode} from './ServiceOpMode';
import {ServiceOpModeMockup} from './ServiceOpMode.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaServParamDataAssemblyModel} from '../../operationElement/servParam/anaServParam/AnaServParam.mockup';
import {DataAssemblyFactory} from '../../DataAssemblyFactory';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';
import {AnaServParamDataItems} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceOpMode', () => {

	const connectionHandler = new ConnectionHandler();
	const referenceDataAssemblyModel = getAnaServParamDataAssemblyModel(2, 'Variable', 'Variable');
	const referenceDataAssembly = DataAssemblyFactory.create(referenceDataAssemblyModel, connectionHandler);

	describe('static', () => {

		it('should create ServiceOpMode', () => {

			const baseFunction = new ServiceOpMode(referenceDataAssembly.dataItems as AnaServParamDataItems);
			expect(baseFunction).to.not.be.undefined;
			expect(baseFunction.dataItems.StateChannel).to.not.be.undefined;
			expect(baseFunction.dataItems.StateOffAut).to.not.be.undefined;
			expect(baseFunction.dataItems.StateOpAut).to.not.be.undefined;
			expect(baseFunction.dataItems.StateAutAut).to.not.be.undefined;
			expect(baseFunction.dataItems.StateOffOp).to.not.be.undefined;
			expect(baseFunction.dataItems.StateOpOp).to.not.be.undefined;
			expect(baseFunction.dataItems.StateAutOp).to.not.be.undefined;
			expect(baseFunction.dataItems.StateOpAct).to.not.be.undefined;
			expect(baseFunction.dataItems.StateAutAct).to.not.be.undefined;
			expect(baseFunction.dataItems.StateOffAct).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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

			const baseFunction = new ServiceOpMode(referenceDataAssembly.dataItems as AnaServParamDataItems);
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));

			expect(baseFunction.dataItems.StateChannel.value).equal(false);
			expect(baseFunction.dataItems.StateOffAut.value).equal(false);
			expect(baseFunction.dataItems.StateOpAut.value).equal(false);
			expect(baseFunction.dataItems.StateAutAut.value).equal(false);
			expect(baseFunction.dataItems.StateOffOp.value).equal(false);
			expect(baseFunction.dataItems.StateOpOp.value).equal(false);
			expect(baseFunction.dataItems.StateAutOp.value).equal(false);
			expect(baseFunction.dataItems.StateOpAct.value).equal(false);
			expect(baseFunction.dataItems.StateAutAct.value).equal(false);
			expect(baseFunction.dataItems.StateOffAct.value).equal(true);
		}).timeout(5000);
	});

	describe('dynamic functions, Offline', async () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceOpModeMockup;
		let opMode: ServiceOpMode;
		let baseFunction: any;
		let adapterId: string;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new ServiceOpMode(this.dataItems);
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('getOperationMode, should be Offline', () => {
			expect(opMode.getServiceOperationMode()).to.equal(OperationMode.Offline);
		});
		it('isOpMode', () => {
			expect(opMode.isServiceOpMode(OperationMode.Offline)).to.be.true;
			expect(opMode.isServiceOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isServiceOpMode(OperationMode.Automatic)).to.be.false;
		});
		it('isOffState', () => {
			expect(opMode.isOfflineState()).to.be.true;
		});

		it('setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(baseFunction.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), should set to Operator', async () => {
			await opMode.setToOperatorOperationMode();
			expect(baseFunction.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});

	describe('dynamic functions, Operator', async () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceOpModeMockup;
		let opMode: ServiceOpMode;
		let baseFunction: any;
		let adapterId: string;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with operator
			mockup = new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Operator);
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new ServiceOpMode(this.dataItems);
			await baseFunction.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('getOperationMode, should be Operator', () => {
			expect(opMode.getServiceOperationMode()).to.equal(OperationMode.Operator);
		});

		it('isOpMode', () => {
			expect(opMode.isServiceOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isServiceOpMode(OperationMode.Operator)).to.be.true;
			expect(opMode.isServiceOpMode(OperationMode.Automatic)).to.be.false;
		});
		it('setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(baseFunction.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), nothing should happen', async () => {
			await opMode.setToOperatorOperationMode();
			expect(baseFunction.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});
	describe('dynamic functions, Automatic', async () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceOpModeMockup;
		let opMode: ServiceOpMode;
		let baseFunction: any;
		let adapterId: string;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with Automatic
			mockup = new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Automatic);
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new ServiceOpMode(this.dataItems);
			await baseFunction.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('getServiceOperationMode, should be Automatic', () => {
			expect(opMode.getServiceOperationMode()).to.equal(OperationMode.Automatic);
		});

		it('isServiceOpMode', () => {
			expect(opMode.isServiceOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isServiceOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isServiceOpMode(OperationMode.Automatic)).to.be.true;
		});

		it('isOffState', () => {
			expect(opMode.isOfflineState()).to.be.false;
		});

		it('setToAutomaticOperationMode(), nothing should happen', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(baseFunction.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

	});
});
