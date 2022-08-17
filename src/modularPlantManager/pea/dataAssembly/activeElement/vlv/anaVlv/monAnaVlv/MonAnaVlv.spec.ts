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
import {getEndpointDataModel} from '../../../../../connectionHandler/ConnectionHandler.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaVlv', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getMonAnaVlvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create MonAnaMonAnaVlv', () => {

			const dataAssembly = new MonAnaVlv(options, connectionHandler, true);
			expect(dataAssembly).to.not.be.undefined;
			expect(dataAssembly.feedBackMonitoring).to.not.be.undefined;
			expect(dataAssembly.dataItems.PosReachedFbk).to.not.be.undefined;
			expect(dataAssembly.dataItems.PosTolerance).to.not.be.undefined;
			expect(dataAssembly.dataItems.MonPosTi).to.not.be.undefined;
			expect(dataAssembly.dataItems.MonPosErr).to.not.be.undefined;
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
			const monAnaVlvMockup = new MonAnaVlvMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = monAnaVlvMockup.getDataAssemblyModel();
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

			const dataAssembly = new MonAnaVlv(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.OSLevel.value).equal(0);
			expect(dataAssembly.dataItems.WQC.value).equal(0);

			expect(dataAssembly.dataItems.PermEn.value).equal(false);
			expect(dataAssembly.dataItems.Permit.value).equal(false);
			expect(dataAssembly.dataItems.IntlEn.value).equal(false);
			expect(dataAssembly.dataItems.Interlock.value).equal(false);
			expect(dataAssembly.dataItems.ProtEn.value).equal(false);
			expect(dataAssembly.dataItems.Protect.value).equal(false);

			expect(dataAssembly.dataItems.ResetAut.value).equal(false);
			expect(dataAssembly.dataItems.ResetOp.value).equal(false);

			expect(dataAssembly.dataItems.StateChannel.value).equal(false);
			expect(dataAssembly.dataItems.StateOffAut.value).equal(false);
			expect(dataAssembly.dataItems.StateOpAut.value).equal(false);
			expect(dataAssembly.dataItems.StateAutAut.value).equal(false);
			expect(dataAssembly.dataItems.StateOffOp.value).equal(false);
			expect(dataAssembly.dataItems.StateOpOp.value).equal(false);
			expect(dataAssembly.dataItems.StateAutOp.value).equal(false);
			expect(dataAssembly.dataItems.StateOpAct.value).equal(false);
			expect(dataAssembly.dataItems.StateAutAct.value).equal(false);
			expect(dataAssembly.dataItems.StateOffAct.value).equal(true);

			expect(dataAssembly.dataItems.SafePos.value).equal(false);
			expect(dataAssembly.dataItems.SafePosEn.value).equal(false);
			expect(dataAssembly.dataItems.SafePosAct.value).equal(false);
			expect(dataAssembly.dataItems.OpenAut.value).equal(false);
			expect(dataAssembly.dataItems.OpenFbk.value).equal(false);
			expect(dataAssembly.dataItems.OpenFbkCalc.value).equal(false);
			expect(dataAssembly.dataItems.OpenOp.value).equal(false);
			expect(dataAssembly.dataItems.CloseAut.value).equal(false);
			expect(dataAssembly.dataItems.CloseFbk.value).equal(false);
			expect(dataAssembly.dataItems.CloseFbkCalc.value).equal(false);
			expect(dataAssembly.dataItems.CloseOp.value).equal(false);

			expect(dataAssembly.dataItems.Pos.value).equal(0);
			expect(dataAssembly.dataItems.PosFbk.value).equal(0);
			expect(dataAssembly.dataItems.PosFbkCalc.value).equal(false);
			expect(dataAssembly.dataItems.PosRbk.value).equal(0);
			expect(dataAssembly.dataItems.PosInt.value).equal(0);
			expect(dataAssembly.dataItems.PosMan.value).equal(0);
			expect(dataAssembly.dataItems.PosUnit.value).equal(0);
			expect(dataAssembly.dataItems.PosSclMax.value).equal(0);
			expect(dataAssembly.dataItems.PosSclMin.value).equal(0);
			expect(dataAssembly.dataItems.PosMin.value).equal(0);
			expect(dataAssembly.dataItems.PosMax.value).equal(0);
			expect(dataAssembly.dataItems.OpenAct.value).equal(false);
			expect(dataAssembly.dataItems.CloseAct.value).equal(false);

			expect(dataAssembly.dataItems.MonEn.value).equal(false);
			expect(dataAssembly.dataItems.MonSafePos.value).equal(false);
			expect(dataAssembly.dataItems.MonStatErr.value).equal(false);
			expect(dataAssembly.dataItems.MonDynErr.value).equal(false);
			expect(dataAssembly.dataItems.MonStatTi.value).equal(0);
			expect(dataAssembly.dataItems.MonDynTi.value).equal(0);

			expect(dataAssembly.dataItems.PosReachedFbk.value).equal(false);
			expect(dataAssembly.dataItems.PosTolerance.value).equal(0);
			expect(dataAssembly.dataItems.MonPosTi.value).equal(0);
			expect(dataAssembly.dataItems.MonPosErr.value).equal(false);

		}).timeout(5000);
	});
});
