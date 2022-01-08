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
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../../../_utils';
import {getMonAnaVlvOptions, MonAnaVlvMockup} from './MonAnaVlv.mockup';
import {MonAnaVlv} from './MonAnaVlv';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaVlv', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getMonAnaVlvOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create MonAnaMonAnaVlv', () => {

			const dataAssemblyController = new MonAnaVlv(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController).to.not.be.undefined;
			expect(dataAssemblyController.feedBackMonitoring).to.not.be.undefined;
			expect(dataAssemblyController.communication.PosReachedFbk).to.not.be.undefined;
			expect(dataAssemblyController.communication.PosTolerance).to.not.be.undefined;
			expect(dataAssemblyController.communication.MonPosTi).to.not.be.undefined;
			expect(dataAssemblyController.communication.MonPosErr).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const monAnaVlvMockup = new MonAnaVlvMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			dataAssemblyOptions = monAnaVlvMockup.getDataAssemblyOptions();
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

			const dataAssemblyController = new MonAnaVlv(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.OSLevel.value).equal(0);
			expect(dataAssemblyController.communication.WQC.value).equal(0);

			expect(dataAssemblyController.communication.PermEn.value).equal(false);
			expect(dataAssemblyController.communication.Permit.value).equal(false);
			expect(dataAssemblyController.communication.IntlEn.value).equal(false);
			expect(dataAssemblyController.communication.Interlock.value).equal(false);
			expect(dataAssemblyController.communication.ProtEn.value).equal(false);
			expect(dataAssemblyController.communication.Protect.value).equal(false);

			expect(dataAssemblyController.communication.ResetAut.value).equal(false);
			expect(dataAssemblyController.communication.ResetOp.value).equal(false);

			expect(dataAssemblyController.communication.StateChannel.value).equal(false);
			expect(dataAssemblyController.communication.StateOffAut.value).equal(false);
			expect(dataAssemblyController.communication.StateOpAut.value).equal(false);
			expect(dataAssemblyController.communication.StateAutAut.value).equal(false);
			expect(dataAssemblyController.communication.StateOffOp.value).equal(false);
			expect(dataAssemblyController.communication.StateOpOp.value).equal(false);
			expect(dataAssemblyController.communication.StateAutOp.value).equal(false);
			expect(dataAssemblyController.communication.StateOpAct.value).equal(false);
			expect(dataAssemblyController.communication.StateAutAct.value).equal(false);
			expect(dataAssemblyController.communication.StateOffAct.value).equal(true);

			expect(dataAssemblyController.communication.SafePos.value).equal(false);
			expect(dataAssemblyController.communication.SafePosEn.value).equal(false);
			expect(dataAssemblyController.communication.SafePosAct.value).equal(false);
			expect(dataAssemblyController.communication.OpenAut.value).equal(false);
			expect(dataAssemblyController.communication.OpenFbk.value).equal(false);
			expect(dataAssemblyController.communication.OpenFbkCalc.value).equal(false);
			expect(dataAssemblyController.communication.OpenOp.value).equal(false);
			expect(dataAssemblyController.communication.CloseAut.value).equal(false);
			expect(dataAssemblyController.communication.CloseFbk.value).equal(false);
			expect(dataAssemblyController.communication.CloseFbkCalc.value).equal(false);
			expect(dataAssemblyController.communication.CloseOp.value).equal(false);

			expect(dataAssemblyController.communication.Pos.value).equal(0);
			expect(dataAssemblyController.communication.PosFbk.value).equal(0);
			expect(dataAssemblyController.communication.PosFbkCalc.value).equal(false);
			expect(dataAssemblyController.communication.PosRbk.value).equal(0);
			expect(dataAssemblyController.communication.PosInt.value).equal(0);
			expect(dataAssemblyController.communication.PosMan.value).equal(0);
			expect(dataAssemblyController.communication.PosUnit.value).equal(0);
			expect(dataAssemblyController.communication.PosSclMax.value).equal(0);
			expect(dataAssemblyController.communication.PosSclMin.value).equal(0);
			expect(dataAssemblyController.communication.PosMin.value).equal(0);
			expect(dataAssemblyController.communication.PosMax.value).equal(0);
			expect(dataAssemblyController.communication.OpenAct.value).equal(false);
			expect(dataAssemblyController.communication.CloseAct.value).equal(false);

			expect(dataAssemblyController.communication.MonEn.value).equal(false);
			expect(dataAssemblyController.communication.MonSafePos.value).equal(false);
			expect(dataAssemblyController.communication.MonStatErr.value).equal(false);
			expect(dataAssemblyController.communication.MonDynErr.value).equal(false);
			expect(dataAssemblyController.communication.MonStatTi.value).equal(0);
			expect(dataAssemblyController.communication.MonDynTi.value).equal(0);

			expect(dataAssemblyController.communication.PosReachedFbk.value).equal(false);
			expect(dataAssemblyController.communication.PosTolerance.value).equal(0);
			expect(dataAssemblyController.communication.MonPosTi.value).equal(0);
			expect(dataAssemblyController.communication.MonPosErr.value).equal(false);

		}).timeout(5000);
	});
});
