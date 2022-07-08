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


import {Vlv} from './Vlv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../_utils';
import {getVlvDataAssemblyModel, VlvMockup} from './Vlv.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Vlv', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getVlvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create Vlv',  () => {

			const dataAssembly = new Vlv(options, connectionHandler);
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.osLevel).to.be.not.undefined;
			expect(dataAssembly.wqc).to.be.not.undefined;
			expect(dataAssembly.reset).to.be.not.undefined;
			expect(dataAssembly.opMode).to.be.not.undefined;
			expect(dataAssembly.interlock).to.be.not.undefined;

			expect(dataAssembly.communication.SafePos).to.be.not.undefined;
			expect(dataAssembly.communication.SafePosEn).to.be.not.undefined;
			expect(dataAssembly.communication.SafePosAct).to.be.not.undefined;
			expect(dataAssembly.communication.OpenAut).to.be.not.undefined;
			expect(dataAssembly.communication.OpenFbk).to.be.not.undefined;
			expect(dataAssembly.communication.OpenFbkCalc).to.be.not.undefined;
			expect(dataAssembly.communication.OpenOp).to.be.not.undefined;
			expect(dataAssembly.communication.CloseAut).to.be.not.undefined;
			expect(dataAssembly.communication.CloseFbk).to.be.not.undefined;
			expect(dataAssembly.communication.CloseFbkCalc).to.be.not.undefined;
			expect(dataAssembly.communication.CloseOp).to.be.not.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const vlvMockup = new VlvMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = vlvMockup.getDataAssemblyModel();
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

			const dataAssembly = new Vlv(options, connectionHandler);
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
		}).timeout(5000);
	});
});
