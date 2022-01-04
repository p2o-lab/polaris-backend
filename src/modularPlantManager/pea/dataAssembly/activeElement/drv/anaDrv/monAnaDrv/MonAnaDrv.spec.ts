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
			const dataAssemblyController = new MonAnaDrv(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController.feedbackMonitoring).to.not.be.undefined;
			expect(dataAssemblyController.sourceMode).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmErr).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmAHEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmAHLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmAHAct).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmALEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmALAct).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmALLim).to.not.be.undefined;
			expect(Object.keys(dataAssemblyController.communication).length).to.equal(68);
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
			const dataAssemblyController = new MonAnaDrv(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			
			expect((dataAssemblyController).communication.OSLevel.value).equal(0);
			expect((dataAssemblyController).communication.WQC.value).equal(0);

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

			expect(dataAssemblyController.communication.ResetOp.value).equal(false);
			expect(dataAssemblyController.communication.ResetAut.value).equal(false);

			expect(dataAssemblyController.communication.PermEn.value).equal(false);
			expect(dataAssemblyController.communication.Permit.value).equal(false);
			expect(dataAssemblyController.communication.IntlEn.value).equal(false);
			expect(dataAssemblyController.communication.Interlock.value).equal(false);
			expect(dataAssemblyController.communication.ProtEn.value).equal(false);
			expect(dataAssemblyController.communication.Protect.value).equal(false);

			expect(dataAssemblyController.communication.SafePos.value).equal(false);
			expect(dataAssemblyController.communication.SafePosAct.value).equal(false);

			expect(dataAssemblyController.communication.FwdAut.value).equal(false);
			expect(dataAssemblyController.communication.FwdCtrl.value).equal(false);
			expect(dataAssemblyController.communication.FwdEn.value).equal(false);
			expect(dataAssemblyController.communication.FwdFbk.value).equal(false);
			expect(dataAssemblyController.communication.FwdFbkCalc.value).equal(false);
			expect(dataAssemblyController.communication.FwdOp.value).equal(false);

			expect(dataAssemblyController.communication.RevAut.value).equal(false);
			expect(dataAssemblyController.communication.RevCtrl.value).equal(false);
			expect(dataAssemblyController.communication.RevEn.value).equal(false);
			expect(dataAssemblyController.communication.RevFbk.value).equal(false);
			expect(dataAssemblyController.communication.RevFbkCalc.value).equal(false);
			expect(dataAssemblyController.communication.RevOp.value).equal(false);

			expect(dataAssemblyController.communication.StopAut.value).equal(false);
			expect(dataAssemblyController.communication.StopOp.value).equal(false);
			expect(dataAssemblyController.communication.Trip.value).equal(false);
		}).timeout(4000);

	});

});