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
import {DataAssemblyOptions, OperationMode} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../operationElement/servParam/anaServParam/AnaServParam.spec.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {MockupServer} from '../../../../_utils';
import {OpModeMockup} from './OpMode.mockup';
import {OpMode} from './OpMode';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpMode', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperatorElement/AnaServParam',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create OpMode', () => {

			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as any;
			const opMode = new OpMode(da);

			expect(opMode).to.not.be.undefined;
			expect((da).communication.StateChannel).to.not.be.undefined;
			expect((da).communication.StateOffAut).to.not.be.undefined;
			expect((da).communication.StateOpAut).to.not.be.undefined;
			expect((da).communication.StateAutAut).to.not.be.undefined;
			expect((da).communication.StateOffOp).to.not.be.undefined;
			expect((da).communication.StateOpOp).to.not.be.undefined;
			expect((da).communication.StateAutOp).to.not.be.undefined;
			expect((da).communication.StateOpAct).to.not.be.undefined;
			expect((da).communication.StateAutAct).to.not.be.undefined;
			expect((da).communication.StateOffAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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
			new OpMode(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect((dataAssemblyController).communication.StateChannel.value).equal(false);
			expect((dataAssemblyController).communication.StateOffAut.value).equal(false);
			expect((dataAssemblyController).communication.StateOpAut.value).equal(false);
			expect((dataAssemblyController).communication.StateAutAut.value).equal(false);
			expect((dataAssemblyController).communication.StateOffOp.value).equal(false);
			expect((dataAssemblyController).communication.StateOpOp.value).equal(false);
			expect((dataAssemblyController).communication.StateAutOp.value).equal(false);
			expect((dataAssemblyController).communication.StateOpAct.value).equal(false);
			expect((dataAssemblyController).communication.StateAutAct.value).equal(false);
			expect((dataAssemblyController).communication.StateOffAct.value).equal(true);
		}).timeout(5000);
	});

	describe('dynamic functions, Offline', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: OpModeMockup;
		let opMode: OpMode;
		let dataAssemblyController: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new OpModeMockup(mockupServer.nameSpace,	mockupServer.rootObject,'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});

			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			opMode = new OpMode(dataAssemblyController);
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

		it('getOperationMode, should be Offline', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Offline);
		});
		it('isOpMode', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.true;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.false;
		});
		it('isOfflineState', () => {
			expect(opMode.isOfflineState()).to.be.true;
		});

		it('setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(dataAssemblyController.communication.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), should set to Operator', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssemblyController.communication.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});

		it('setToOfflineOperationMode(), should set to Offline', async () => {
			await opMode.setToOfflineOperationMode();
			expect(dataAssemblyController.communication.StateOffAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Offline);
		});
	});

	describe('dynamic functions, Operator', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: OpModeMockup;
		let opMode: OpMode;
		let dataAssemblyController: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with Operator OperationMode
			mockup = new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Operator);
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});

			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			opMode = new OpMode(dataAssemblyController);
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

		it('getOperationMode, should be Operator', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Operator);
		});
		it('Verify correct State recognition', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.true;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.false;
		});
		it('setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(dataAssemblyController.communication.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), nothing should happen', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssemblyController.communication.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});
	describe('dynamic functions, Automatic', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: OpModeMockup;
		let opMode: OpMode;
		let dataAssemblyController: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			// initialize with Automatic OperationMode
			mockup = new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', OperationMode.Automatic);
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			opMode = new OpMode(dataAssemblyController);
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

		it('getOperationMode, should be Automatic', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Automatic);
		});

		it('Verify correct state recognition', () => {
			expect(opMode.isOfflineState()).to.be.false;
			expect(opMode.isOperatorState()).to.be.false;
			expect(opMode.isAutomaticState()).to.be.true;
		});

		it('Verify correct state check', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.true;
		});

		it('setToAutomaticOperationMode() while already in Automatic --> nothing should happen', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(dataAssemblyController.communication.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode()', async () => {
			await opMode.setToOperatorOperationMode();
			expect(dataAssemblyController.communication.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});

		it('setToOfflineOperationMode()', async () => {
			await opMode.setToOfflineOperationMode();
			expect(dataAssemblyController.communication.StateOffAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Offline);
		});

	});
});
