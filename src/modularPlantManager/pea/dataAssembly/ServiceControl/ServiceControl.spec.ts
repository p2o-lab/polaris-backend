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

import {
	DataAssemblyOptions,
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../../connection';
import {
	ServiceControl
} from './ServiceControl';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as baseDataAssemblyOptions from './ServiceControl.spec.json';
import {MockupServer} from '../../../_utils';
import {ServiceControlMockup} from './ServiceControl.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceControl', () => {

	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'ServiceControl',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create ServiceControl', async () => {
			const da1 = new ServiceControl(dataAssemblyOptions, emptyOPCUAConnection);
			expect(da1.opMode).to.not.equal(undefined);
			expect(da1.serviceSourceMode).to.not.equal(undefined);

			expect(da1.communication.WQC).to.not.equal(undefined);
			expect(da1.communication.CommandOp).to.not.equal(undefined);
			expect(da1.communication.CommandExt).to.not.equal(undefined);
			expect(da1.communication.CommandInt).to.not.equal(undefined);
			expect(da1.communication.CommandEn).to.not.equal(undefined);
			expect(da1.communication.StateCur).to.not.equal(undefined);
			expect(da1.communication.ProcedureOp).to.not.equal(undefined);
			expect(da1.communication.ProcedureExt).to.not.equal(undefined);
			expect(da1.communication.ProcedureInt).to.not.equal(undefined);
			expect(da1.communication.ProcedureCur).to.not.equal(undefined);
			expect(da1.communication.ProcedureReq).to.not.equal(undefined);
			expect(da1.communication.InteractQuestionID).to.not.equal(undefined);
			expect(da1.communication.InteractAnswerID).to.not.equal(undefined);
			expect(da1.communication.PosTextID).to.not.equal(undefined);
		});
	});


	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
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

			const da1 = new ServiceControl(dataAssemblyOptions, connection);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;

			expect(da1.communication.WQC.value).equal(0);
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

			expect(da1.communication.SrcChannel.value).equal(false);
			expect(da1.communication.SrcExtAut.value).equal(false);
			expect(da1.communication.SrcIntAut.value).equal(false);
			expect(da1.communication.SrcIntOp.value).equal(false);
			expect(da1.communication.SrcExtOp.value).equal(false);
			expect(da1.communication.SrcIntAct.value).equal(true);
			expect(da1.communication.SrcExtAct.value).equal(false);

		}).timeout(4000);
	});
});
