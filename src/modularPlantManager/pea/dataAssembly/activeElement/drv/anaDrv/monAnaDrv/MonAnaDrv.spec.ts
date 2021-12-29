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

import {OpcUaConnection} from '../../../../../connection';
import {MonAnaDrv} from './MonAnaDrv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './MonAnaDrv.spec.json';
import {MockupServer} from '../../../../../../_utils';

import {MonAnaDrvMockup} from './MonAnaDrv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaDrv', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/MonAnaDrv',
		dataItems: baseDataAssemblyOptions
	};
	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create MonAnaDrv',  () => {
			const da1 = new MonAnaDrv(dataAssemblyOptions, emptyOPCUAConnection);
			expect(da1.feedbackMonitoring).to.not.be.undefined;
			expect(da1.sourceMode).to.not.be.undefined;

			expect(da1.communication.RpmErr).to.not.be.undefined;

			expect(da1.communication.RpmAHEn).to.not.be.undefined;
			expect(da1.communication.RpmAHLim).to.not.be.undefined;
			expect(da1.communication.RpmAHAct).to.not.be.undefined;
			expect(da1.communication.RpmALEn).to.not.be.undefined;
			expect(da1.communication.RpmALAct).to.not.be.undefined;
			expect(da1.communication.RpmALLim).to.not.be.undefined;
			expect(Object.keys(da1.communication).length).to.equal(68);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new MonAnaDrvMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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
			const da1 = new MonAnaDrv(dataAssemblyOptions, connection);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect((da1).communication.OSLevel.value).equal(0);
			expect((da1).communication.WQC.value).equal(0);

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

			expect(da1.communication.ResetOp.value).equal(false);
			expect(da1.communication.ResetAut.value).equal(false);

			expect(da1.communication.PermEn.value).equal(false);
			expect(da1.communication.Permit.value).equal(false);
			expect(da1.communication.IntlEn.value).equal(false);
			expect(da1.communication.Interlock.value).equal(false);
			expect(da1.communication.ProtEn.value).equal(false);
			expect(da1.communication.Protect.value).equal(false);

			expect(da1.communication.SafePos.value).equal(false);
			expect(da1.communication.SafePosAct.value).equal(false);

			expect(da1.communication.FwdAut.value).equal(false);
			expect(da1.communication.FwdCtrl.value).equal(false);
			expect(da1.communication.FwdEn.value).equal(false);
			expect(da1.communication.FwdFbk.value).equal(false);
			expect(da1.communication.FwdFbkCalc.value).equal(false);
			expect(da1.communication.FwdOp.value).equal(false);

			expect(da1.communication.RevAut.value).equal(false);
			expect(da1.communication.RevCtrl.value).equal(false);
			expect(da1.communication.RevEn.value).equal(false);
			expect(da1.communication.RevFbk.value).equal(false);
			expect(da1.communication.RevFbkCalc.value).equal(false);
			expect(da1.communication.RevOp.value).equal(false);

			expect(da1.communication.StopAut.value).equal(false);
			expect(da1.communication.StopOp.value).equal(false);
			expect(da1.communication.Trip.value).equal(false);
		}).timeout(4000);

	});

});
