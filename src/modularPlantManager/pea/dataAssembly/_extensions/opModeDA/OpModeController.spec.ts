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
import {OpModeDAMockup} from './OpModeDA.mockup';
import {OpModeController} from './OpModeController';

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
		it('should create OpModeController', () => {

			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as any;
			const opMode = new OpModeController(da);

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
		let mockup: OpModeDAMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new OpModeDAMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');
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

			const da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new OpModeController(da1);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;

			expect((da1).communication.StateChannel.value).equal(false);
			expect((da1).communication.StateOffAut.value).equal(false);
			expect((da1).communication.StateOpAut.value).equal(false);
			expect((da1).communication.StateAutAut.value).equal(false);
			expect((da1).communication.StateOffOp.value).equal(false);
			expect((da1).communication.StateOpOp.value).equal(false);
			expect((da1).communication.StateAutOp.value).equal(false);
			expect((da1).communication.StateOpAct.value).equal(false);
			expect((da1).communication.StateAutAct.value).equal(false);
			expect((da1).communication.StateOffAct.value).equal(true);
		}).timeout(5000);
	});

	describe('dynamic functions, Offline', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: OpModeDAMockup;
		let opMode: OpModeController;
		let da1: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new OpModeDAMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});

			da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			opMode = new OpModeController(da1);
			await connection.connect();
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
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
		it('isOffState', () => {
			expect(opMode.isOffState()).to.be.true;
		});

		it('setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(da1.communication.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), should set to Operator', async () => {
			await opMode.setToOperatorOperationMode();
			expect(da1.communication.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});

	describe('dynamic functions, Operator', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: OpModeDAMockup;
		let opMode: OpModeController;
		let da1: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new OpModeDAMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable', OperationMode.Operator);
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});

			da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			opMode = new OpModeController(da1);
			await connection.connect();
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('getOperationMode, should be Operator', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Operator);
		});
		it('isOpMode', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.true;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.false;
		});
		it('setToAutomaticOperationMode(), should set to Automatic', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(da1.communication.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

		it('setToOperatorOperationMode(), nothing should happen', async () => {
			await opMode.setToOperatorOperationMode();
			expect(da1.communication.StateOpAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Operator);
		});
	});
	describe('dynamic functions, Automatic', async () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: OpModeDAMockup;
		let opMode: OpModeController;
		let da1: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new OpModeDAMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable', OperationMode.Automatic);
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			opMode = new OpModeController(da1);
			await connection.connect();
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('getOperationMode, should be Automatic', () => {
			expect(opMode.getOperationMode()).to.equal(OperationMode.Automatic);
		});
		it('isOpMode', () => {
			expect(opMode.isOpMode(OperationMode.Offline)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Operator)).to.be.false;
			expect(opMode.isOpMode(OperationMode.Automatic)).to.be.true;
		});
		it('isOffState', () => {
			expect(opMode.isOffState()).to.be.false;
		});

		it('setToAutomaticOperationMode(), nothing should happen', async () => {
			await opMode.setToAutomaticOperationMode();
			expect(da1.communication.StateAutAct.value).to.be.true;
			expect(mockup.opMode = OperationMode.Automatic);
		});

	});
	//TODO test more
});

