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
import {OpModeMockup} from './OpMode.mockup';
import {OpMode} from './OpMode';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaServParamDataAssemblyModel} from '../../operationElement/servParam/anaServParam/AnaServParam.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpMode', () => {

	const options = getAnaServParamDataAssemblyModel(2, 'Variable', 'Variable');

	describe('static', () => {
		const connectionHandler = new ConnectionHandler();
		it('should create OpMode', () => {

			const da = new OpMode(options, connectionHandler);

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
			new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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

			const dataAssembly = new OpMode(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect((dataAssembly).StateChannel.value).equal(false);
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
		let mockup: OpModeMockup;
		let opMode: OpMode;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new OpModeMockup(mockupServer.nameSpace,	mockupServer.rootObject,'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});

			dataAssembly = new OpMode(options, connectionHandler);
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

		it('should pass getOperationMode, should be Offline', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Offline);
		});
		it('isOpMode', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.true;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.false;
		});

		it('isOfflineState', () => {
			expect(opMode.isOfflineState()).to.be.true;
			expect(opMode.isOperatorState()).to.be.false;
			expect(opMode.isAutomaticState()).to.be.false;
		});

		it('should pass setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.false;
			expect(dataAssembly.StateOpAct.value).to.be.false;
			expect(dataAssembly.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('should pass setToOperatorOperationMode(), should set to Operator', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.false;
			expect(dataAssembly.StateOpAct.value).to.be.true;
			expect(dataAssembly.StateAutAct.value).to.be.false;
			expect(mockup.opMode = OperationMode.Operator);
		});

		it('setToOfflineOperationMode(), should set to Offline', async () => {
			await opMode.setToOfflineOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.true;
			expect(dataAssembly.StateOpAct.value).to.be.false;
			expect(dataAssembly.StateAutAct.value).to.be.false;
			expect(mockup.opMode = OperationMode.Offline);
		});
	});

	describe('dynamic functions, Operator', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: OpModeMockup;
		let opMode: OpMode;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with Operator OperationMode
			mockup = new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Operator);
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});

			dataAssembly = new OpMode(options, connectionHandler);
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

		it('should pass getOperationMode, should be Operator', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Operator);
		});

		it('should pass isOpMode Operator', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.true;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.false;
		});

		it('should pass switch state setToAutomaticOperationMode()', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.false;
			expect(dataAssembly.StateOpAct.value).to.be.false;
			expect(dataAssembly.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('should happen nothing if already on requested OpMode, ', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.false;
			expect(dataAssembly.StateOpAct.value).to.be.true;
			expect(dataAssembly.StateAutAct.value).to.be.false;
			expect(mockup.opMode = OperationMode.Operator);
		});

	});
	describe('dynamic functions, Automatic', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: OpModeMockup;
		let opMode: OpMode;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with Automatic OperationMode
			mockup = new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Automatic);
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			dataAssembly = new OpMode(options, connectionHandler);
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

		it('should pass getOperationMode, should be Automatic', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Automatic);
		});

		it('should pass isAutomaticState', () => {
			expect(opMode.isOfflineState()).to.be.false;
			expect(opMode.isOperatorState()).to.be.false;
			expect(opMode.isAutomaticState()).to.be.true;
		});

		it('should pass isOpMode Automatic', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.true;
		});

		it('setToAutomaticOperationMode() while already in Automatic --> nothing should happen', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.false;
			expect(dataAssembly.StateOpAct.value).to.be.false;
			expect(dataAssembly.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode()', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.false;
			expect(dataAssembly.StateOpAct.value).to.be.true;
			expect(dataAssembly.StateAutAct.value).to.be.false;
			expect(mockup.opMode = OperationMode.Operator);
		});

		it('setToOfflineOperationMode()', async () => {
			await opMode.setToOfflineOperationMode();
			expect(dataAssembly.StateOffAct.value).to.be.true;
			expect(dataAssembly.StateOpAct.value).to.be.false;
			expect(dataAssembly.StateAutAct.value).to.be.false;
			expect(mockup.opMode = OperationMode.Offline);
		});

	});
});
