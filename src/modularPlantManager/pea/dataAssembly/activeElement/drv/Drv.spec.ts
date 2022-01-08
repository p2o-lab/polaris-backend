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
import {
	Drv
} from './Drv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../_utils';
import {DrvMockup, getDrvOptions} from './Drv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Drv', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getDrvOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create Drv',  () => {
			const dataAssemblyController = new Drv(dataAssemblyOptions, emptyOPCUAConnection);

			expect(dataAssemblyController.reset).to.be.not.undefined;
			expect(dataAssemblyController.interlock).to.be.not.undefined;
			expect(dataAssemblyController.opMode).to.be.not.undefined;

			expect(dataAssemblyController.communication.SafePos).to.be.not.undefined;
			expect(dataAssemblyController.communication.SafePosAct).to.be.not.undefined;

			expect(dataAssemblyController.communication.FwdAut).to.be.not.undefined;
			expect(dataAssemblyController.communication.FwdCtrl).to.be.not.undefined;
			expect(dataAssemblyController.communication.FwdEn).to.be.not.undefined;
			expect(dataAssemblyController.communication.FwdFbk).to.be.not.undefined;
			expect(dataAssemblyController.communication.FwdFbkCalc).to.be.not.undefined;
			expect(dataAssemblyController.communication.FwdOp).to.be.not.undefined;

			expect(dataAssemblyController.communication.RevAut).to.be.not.undefined;
			expect(dataAssemblyController.communication.RevCtrl).to.be.not.undefined;
			expect(dataAssemblyController.communication.RevEn).to.be.not.undefined;
			expect(dataAssemblyController.communication.RevFbk).to.be.not.undefined;
			expect(dataAssemblyController.communication.RevFbkCalc).to.be.not.undefined;
			expect(dataAssemblyController.communication.RevOp).to.be.not.undefined;

			expect(dataAssemblyController.communication.StopAut).to.be.not.undefined;
			expect(dataAssemblyController.communication.StopOp).to.be.not.undefined;
			expect(dataAssemblyController.communication.Trip).to.be.not.undefined;

			expect(Object.keys(dataAssemblyController.communication).length).to.equal(39);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let dataAssemblyController: Drv;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const drvMockup = new DrvMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dataAssemblyOptions = drvMockup.getDataAssemblyOptions();
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
			dataAssemblyController = new Drv(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
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
