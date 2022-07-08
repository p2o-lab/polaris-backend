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
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../../../_utils';
import {getMonAnaVlvDataAssemblyModel, MonAnaVlvMockup} from './MonAnaVlv.mockup';
import {MonAnaVlv} from './MonAnaVlv';
import {ConnectionHandler} from '../../../../../connectionHandler/ConnectionHandler';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaVlv', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getMonAnaVlvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create MonAnaMonAnaVlv', () => {

			const dataAssembly = new MonAnaVlv(options, connectionHandler);
			expect(dataAssembly).to.not.be.undefined;
			expect(dataAssembly.feedBackMonitoring).to.not.be.undefined;
			expect(dataAssembly.communication.PosReachedFbk).to.not.be.undefined;
			expect(dataAssembly.communication.PosTolerance).to.not.be.undefined;
			expect(dataAssembly.communication.MonPosTi).to.not.be.undefined;
			expect(dataAssembly.communication.MonPosErr).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const monAnaVlvMockup = new MonAnaVlvMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = monAnaVlvMockup.getDataAssemblyModel();
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

			const dataAssembly = new MonAnaVlv(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.communication.OSLevel.value).equal(0);
			expect(dataAssembly.communication.WQC.value).equal(0);

			expect(dataAssembly.communication.PermEn.value).equal(false);
			expect(dataAssembly.communication.Permit.value).equal(false);
			expect(dataAssembly.communication.IntlEn.value).equal(false);
			expect(dataAssembly.communication.Interlock.value).equal(false);
			expect(dataAssembly.communication.ProtEn.value).equal(false);
			expect(dataAssembly.communication.Protect.value).equal(false);

			expect(dataAssembly.communication.ResetAut.value).equal(false);
			expect(dataAssembly.communication.ResetOp.value).equal(false);

			expect(dataAssembly.communication.StateChannel.value).equal(false);
			expect(dataAssembly.communication.StateOffAut.value).equal(false);
			expect(dataAssembly.communication.StateOpAut.value).equal(false);
			expect(dataAssembly.communication.StateAutAut.value).equal(false);
			expect(dataAssembly.communication.StateOffOp.value).equal(false);
			expect(dataAssembly.communication.StateOpOp.value).equal(false);
			expect(dataAssembly.communication.StateAutOp.value).equal(false);
			expect(dataAssembly.communication.StateOpAct.value).equal(false);
			expect(dataAssembly.communication.StateAutAct.value).equal(false);
			expect(dataAssembly.communication.StateOffAct.value).equal(true);

			expect(dataAssembly.communication.SafePos.value).equal(false);
			expect(dataAssembly.communication.SafePosEn.value).equal(false);
			expect(dataAssembly.communication.SafePosAct.value).equal(false);
			expect(dataAssembly.communication.OpenAut.value).equal(false);
			expect(dataAssembly.communication.OpenFbk.value).equal(false);
			expect(dataAssembly.communication.OpenFbkCalc.value).equal(false);
			expect(dataAssembly.communication.OpenOp.value).equal(false);
			expect(dataAssembly.communication.CloseAut.value).equal(false);
			expect(dataAssembly.communication.CloseFbk.value).equal(false);
			expect(dataAssembly.communication.CloseFbkCalc.value).equal(false);
			expect(dataAssembly.communication.CloseOp.value).equal(false);

			expect(dataAssembly.communication.Pos.value).equal(0);
			expect(dataAssembly.communication.PosFbk.value).equal(0);
			expect(dataAssembly.communication.PosFbkCalc.value).equal(false);
			expect(dataAssembly.communication.PosRbk.value).equal(0);
			expect(dataAssembly.communication.PosInt.value).equal(0);
			expect(dataAssembly.communication.PosMan.value).equal(0);
			expect(dataAssembly.communication.PosUnit.value).equal(0);
			expect(dataAssembly.communication.PosSclMax.value).equal(0);
			expect(dataAssembly.communication.PosSclMin.value).equal(0);
			expect(dataAssembly.communication.PosMin.value).equal(0);
			expect(dataAssembly.communication.PosMax.value).equal(0);
			expect(dataAssembly.communication.OpenAct.value).equal(false);
			expect(dataAssembly.communication.CloseAct.value).equal(false);

			expect(dataAssembly.communication.MonEn.value).equal(false);
			expect(dataAssembly.communication.MonSafePos.value).equal(false);
			expect(dataAssembly.communication.MonStatErr.value).equal(false);
			expect(dataAssembly.communication.MonDynErr.value).equal(false);
			expect(dataAssembly.communication.MonStatTi.value).equal(0);
			expect(dataAssembly.communication.MonDynTi.value).equal(0);

			expect(dataAssembly.communication.PosReachedFbk.value).equal(false);
			expect(dataAssembly.communication.PosTolerance.value).equal(0);
			expect(dataAssembly.communication.MonPosTi.value).equal(0);
			expect(dataAssembly.communication.MonPosErr.value).equal(false);

		}).timeout(5000);
	});
});
