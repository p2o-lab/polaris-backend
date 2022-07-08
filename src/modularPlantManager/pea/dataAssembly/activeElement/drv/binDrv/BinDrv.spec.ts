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
import {BinDrv} from './BinDrv';
import {MockupServer} from '../../../../../_utils';
import {BinDrvMockup, getBinDrvDataAssemblyModel} from './BinDrv.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('BinDrv', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getBinDrvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create BinDrv',  () => {
			const dataAssembly = new BinDrv(options, connectionHandler);

			expect(dataAssembly.reset).to.be.not.undefined;
			expect(dataAssembly.interlock).to.be.not.undefined;
			expect(dataAssembly.opMode).to.be.not.undefined;

			expect(dataAssembly.communication.SafePos).to.be.not.undefined;
			expect(dataAssembly.communication.SafePosAct).to.be.not.undefined;

			expect(dataAssembly.communication.FwdAut).to.be.not.undefined;
			expect(dataAssembly.communication.FwdCtrl).to.be.not.undefined;
			expect(dataAssembly.communication.FwdEn).to.be.not.undefined;
			expect(dataAssembly.communication.FwdFbk).to.be.not.undefined;
			expect(dataAssembly.communication.FwdFbkCalc).to.be.not.undefined;
			expect(dataAssembly.communication.FwdOp).to.be.not.undefined;

			expect(dataAssembly.communication.RevAut).to.be.not.undefined;
			expect(dataAssembly.communication.RevCtrl).to.be.not.undefined;
			expect(dataAssembly.communication.RevEn).to.be.not.undefined;
			expect(dataAssembly.communication.RevFbk).to.be.not.undefined;
			expect(dataAssembly.communication.RevFbkCalc).to.be.not.undefined;
			expect(dataAssembly.communication.RevOp).to.be.not.undefined;

			expect(dataAssembly.communication.StopAut).to.be.not.undefined;
			expect(dataAssembly.communication.StopOp).to.be.not.undefined;
			expect(dataAssembly.communication.Trip).to.be.not.undefined;

			expect(Object.keys(dataAssembly.communication).length).to.equal(39);
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let dataAssembly: BinDrv;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const binDrvMockup = new BinDrvMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = binDrvMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();

			dataAssembly = new BinDrv(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			expect((dataAssembly).communication.OSLevel.value).equal(0);
			expect((dataAssembly).communication.WQC.value).equal(0);

			expect((dataAssembly).communication.StateChannel.value).equal(false);
			expect((dataAssembly).communication.StateOffAut.value).equal(false);
			expect((dataAssembly).communication.StateOpAut.value).equal(false);
			expect((dataAssembly).communication.StateAutAut.value).equal(false);
			expect((dataAssembly).communication.StateOffOp.value).equal(false);
			expect((dataAssembly).communication.StateOpOp.value).equal(false);
			expect((dataAssembly).communication.StateAutOp.value).equal(false);
			expect((dataAssembly).communication.StateOpAct.value).equal(false);
			expect((dataAssembly).communication.StateAutAct.value).equal(false);
			expect((dataAssembly).communication.StateOffAct.value).equal(true);

			expect(dataAssembly.communication.ResetOp.value).equal(false);
			expect(dataAssembly.communication.ResetAut.value).equal(false);

			expect(dataAssembly.communication.PermEn.value).equal(false);
			expect(dataAssembly.communication.Permit.value).equal(false);
			expect(dataAssembly.communication.IntlEn.value).equal(false);
			expect(dataAssembly.communication.Interlock.value).equal(false);
			expect(dataAssembly.communication.ProtEn.value).equal(false);
			expect(dataAssembly.communication.Protect.value).equal(false);

			expect(dataAssembly.communication.SafePos.value).equal(false);
			expect(dataAssembly.communication.SafePosAct.value).equal(false);

			expect(dataAssembly.communication.FwdAut.value).equal(false);
			expect(dataAssembly.communication.FwdCtrl.value).equal(false);
			expect(dataAssembly.communication.FwdEn.value).equal(false);
			expect(dataAssembly.communication.FwdFbk.value).equal(false);
			expect(dataAssembly.communication.FwdFbkCalc.value).equal(false);
			expect(dataAssembly.communication.FwdOp.value).equal(false);

			expect(dataAssembly.communication.RevAut.value).equal(false);
			expect(dataAssembly.communication.RevCtrl.value).equal(false);
			expect(dataAssembly.communication.RevEn.value).equal(false);
			expect(dataAssembly.communication.RevFbk.value).equal(false);
			expect(dataAssembly.communication.RevFbkCalc.value).equal(false);
			expect(dataAssembly.communication.RevOp.value).equal(false);

			expect(dataAssembly.communication.StopAut.value).equal(false);
			expect(dataAssembly.communication.StopOp.value).equal(false);
			expect(dataAssembly.communication.Trip.value).equal(false);
		}).timeout(4000);

	});
});
