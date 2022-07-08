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
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaServParamDataAssemblyModel} from '../../operationElement/servParam/anaServParam/AnaServParam.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceOpMode', () => {

	const options = getAnaServParamDataAssemblyModel(2, 'Variable', 'Variable');

	describe('static', () => {
		const connectionHandler = new ConnectionHandler();
		it('should create ServiceOpMode', () => {

			const da = new ServiceOpMode(options, connectionHandler);
			expect(da).to.not.be.undefined;
			expect((da).StateChannel).to.not.be.undefined;
			expect((da).StateOffAut).to.not.be.undefined;
			expect((da).StateOpAut).to.not.be.undefined;
			expect((da).StateAutAut).to.not.be.undefined;
			expect((da).StateOffOp).to.not.be.undefined;
			expect((da).StateOpOp).to.not.be.undefined;
			expect((da).StateAutOp).to.not.be.undefined;
			expect((da).StateOpAct).to.not.be.undefined;
			expect((da).StateAutAct).to.not.be.undefined;
			expect((da).StateOffAct).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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

			const dataAssembly = new ServiceOpMode(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.StateChannel.value).equal(false);
			expect((dataAssembly).StateOffAut.value).equal(false);
			expect((dataAssembly).StateOpAut.value).equal(false);
			expect((dataAssembly).StateAutAut.value).equal(false);
			expect((dataAssembly).StateOffOp.value).equal(false);
			expect((dataAssembly).StateOpOp.value).equal(false);
			expect((dataAssembly).StateAutOp.value).equal(false);
			expect((dataAssembly).StateOpAct.value).equal(false);
			expect((dataAssembly).StateAutAct.value).equal(false);
			expect((dataAssembly).StateOffAct.value).equal(true);
		}).timeout(5000);
	});

	describe('dynamic functions, Offline', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceOpModeMockup;
		let opMode: ServiceOpMode;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});

			dataAssembly = new ServiceOpMode(options,  connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
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
			expect(dataAssembly.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), should set to Operator', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssembly.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});

	describe('dynamic functions, Operator', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceOpModeMockup;
		let opMode: ServiceOpMode;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with operator
			mockup = new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Operator);
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});

			dataAssembly = new ServiceOpMode(options, connectionHandler);
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
			expect(dataAssembly.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), nothing should happen', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssembly.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});
	describe('dynamic functions, Automatic', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: ServiceOpModeMockup;
		let opMode: ServiceOpMode;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with Automatic
			mockup = new ServiceOpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Automatic);
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			dataAssembly = new ServiceOpMode(options, connectionHandler);
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
			expect(dataAssembly.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

	});
});
