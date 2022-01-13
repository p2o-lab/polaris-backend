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
import {Vlv} from './Vlv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../_utils';
import {getVlvOptions, VlvMockup} from './Vlv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Vlv', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getVlvOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create Vlv',  () => {

			const dataAssemblyController = new Vlv(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController).to.be.not.undefined;
			expect(dataAssemblyController.osLevel).to.be.not.undefined;
			expect(dataAssemblyController.wqc).to.be.not.undefined;
			expect(dataAssemblyController.reset).to.be.not.undefined;
			expect(dataAssemblyController.opMode).to.be.not.undefined;
			expect(dataAssemblyController.interlock).to.be.not.undefined;

			expect(dataAssemblyController.communication.SafePos).to.be.not.undefined;
			expect(dataAssemblyController.communication.SafePosEn).to.be.not.undefined;
			expect(dataAssemblyController.communication.SafePosAct).to.be.not.undefined;
			expect(dataAssemblyController.communication.OpenAut).to.be.not.undefined;
			expect(dataAssemblyController.communication.OpenFbk).to.be.not.undefined;
			expect(dataAssemblyController.communication.OpenFbkCalc).to.be.not.undefined;
			expect(dataAssemblyController.communication.OpenOp).to.be.not.undefined;
			expect(dataAssemblyController.communication.CloseAut).to.be.not.undefined;
			expect(dataAssemblyController.communication.CloseFbk).to.be.not.undefined;
			expect(dataAssemblyController.communication.CloseFbkCalc).to.be.not.undefined;
			expect(dataAssemblyController.communication.CloseOp).to.be.not.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const vlvMockup = new VlvMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			dataAssemblyOptions = vlvMockup.getDataAssemblyOptions();
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpointUrl: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = new Vlv(dataAssemblyOptions, connection);
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
		}).timeout(5000);
	});
});
