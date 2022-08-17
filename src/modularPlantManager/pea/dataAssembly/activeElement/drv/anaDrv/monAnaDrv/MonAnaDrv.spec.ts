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

import {MonAnaDrv} from './MonAnaDrv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../../../_utils';

import {getMonAnaDrvDataAssemblyModel, MonAnaDrvMockup} from './MonAnaDrv.mockup';
import {ConnectionHandler} from '../../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../../connectionHandler/ConnectionHandler.mockup';
import {toURI} from 'node-opcua';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaDrv', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getMonAnaDrvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create MonAnaDrv',  () => {
			const dataAssembly = new MonAnaDrv(options, connectionHandler, true);
			expect(dataAssembly.feedbackMonitoring).to.not.be.undefined;
			expect(dataAssembly.sourceMode).to.not.be.undefined;

			expect(dataAssembly.dataItems.RpmErr).to.not.be.undefined;

			expect(dataAssembly.dataItems.RpmAHEn).to.not.be.undefined;
			expect(dataAssembly.dataItems.RpmAHLim).to.not.be.undefined;
			expect(dataAssembly.dataItems.RpmAHAct).to.not.be.undefined;
			expect(dataAssembly.dataItems.RpmALEn).to.not.be.undefined;
			expect(dataAssembly.dataItems.RpmALAct).to.not.be.undefined;
			expect(dataAssembly.dataItems.RpmALLim).to.not.be.undefined;
			expect(Object.keys(dataAssembly.dataItems).length).to.equal(70);
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const monAnaDrvMockup =new MonAnaDrvMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = monAnaDrvMockup.getDataAssemblyModel();
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
			const dataAssembly = new MonAnaDrv(options, connectionHandler, true);
			await dataAssembly.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			
			expect((dataAssembly).dataItems.OSLevel.value).equal(0);
			expect((dataAssembly).dataItems.WQC.value).equal(0);

			expect((dataAssembly).dataItems.StateChannel.value).equal(false);
			expect((dataAssembly).dataItems.StateOffAut.value).equal(false);
			expect((dataAssembly).dataItems.StateOpAut.value).equal(false);
			expect((dataAssembly).dataItems.StateAutAut.value).equal(false);
			expect((dataAssembly).dataItems.StateOffOp.value).equal(false);
			expect((dataAssembly).dataItems.StateOpOp.value).equal(false);
			expect((dataAssembly).dataItems.StateAutOp.value).equal(false);
			expect((dataAssembly).dataItems.StateOpAct.value).equal(false);
			expect((dataAssembly).dataItems.StateAutAct.value).equal(false);
			expect((dataAssembly).dataItems.StateOffAct.value).equal(true);

			expect(dataAssembly.dataItems.ResetOp.value).equal(false);
			expect(dataAssembly.dataItems.ResetAut.value).equal(false);

			expect(dataAssembly.dataItems.PermEn.value).equal(false);
			expect(dataAssembly.dataItems.Permit.value).equal(false);
			expect(dataAssembly.dataItems.IntlEn.value).equal(false);
			expect(dataAssembly.dataItems.Interlock.value).equal(false);
			expect(dataAssembly.dataItems.ProtEn.value).equal(false);
			expect(dataAssembly.dataItems.Protect.value).equal(false);

			expect(dataAssembly.dataItems.SafePos.value).equal(false);
			expect(dataAssembly.dataItems.SafePosAct.value).equal(false);

			expect(dataAssembly.dataItems.FwdAut.value).equal(false);
			expect(dataAssembly.dataItems.FwdCtrl.value).equal(false);
			expect(dataAssembly.dataItems.FwdEn.value).equal(false);
			expect(dataAssembly.dataItems.FwdFbk.value).equal(false);
			expect(dataAssembly.dataItems.FwdFbkCalc.value).equal(false);
			expect(dataAssembly.dataItems.FwdOp.value).equal(false);

			expect(dataAssembly.dataItems.RevAut.value).equal(false);
			expect(dataAssembly.dataItems.RevCtrl.value).equal(false);
			expect(dataAssembly.dataItems.RevEn.value).equal(false);
			expect(dataAssembly.dataItems.RevFbk.value).equal(false);
			expect(dataAssembly.dataItems.RevFbkCalc.value).equal(false);
			expect(dataAssembly.dataItems.RevOp.value).equal(false);

			expect(dataAssembly.dataItems.StopAut.value).equal(false);
			expect(dataAssembly.dataItems.StopOp.value).equal(false);
			expect(dataAssembly.dataItems.Trip.value).equal(false);
		}).timeout(4000);

	});

});
