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

import {OpcUaConnection} from '../../../../connection';
import {StringServParam} from './StringServParam';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../../../../../_utils';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {getStringServParamOptions, StringServParamMockup} from './StringServParam.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('StringServParam', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getStringServParamOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create StringServParam', () => {
			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as StringServParam;
			expect(dataAssemblyController.serviceSourceMode).to.not.be.undefined;
			expect(dataAssemblyController.serviceOpMode).to.not.be.undefined;
			expect(dataAssemblyController.wqc).to.not.be.undefined;
			expect(dataAssemblyController.communication.Sync).to.not.be.undefined;
			expect(dataAssemblyController.communication.VExt).to.not.be.undefined;
			expect(dataAssemblyController.communication.VOp).to.not.be.undefined;
			expect(dataAssemblyController.communication.VInt).to.not.be.undefined;
			expect(dataAssemblyController.communication.VReq).to.not.be.undefined;
			expect(dataAssemblyController.communication.VOut).to.not.be.undefined;
			expect(dataAssemblyController.communication.VFbk).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const stringServParamMockup = new StringServParamMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			dataAssemblyOptions = stringServParamMockup.getDataAssemblyOptions();
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

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as StringServParam;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			
			expect(dataAssemblyController.communication.WQC.value).equal(0);

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

			expect(dataAssemblyController.communication.SrcChannel.value).equal(false);
			expect(dataAssemblyController.communication.SrcExtAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcExtOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAct.value).equal(true);
			expect(dataAssemblyController.communication.SrcExtAct.value).equal(false);

			expect(dataAssemblyController.communication.Sync.value).equal(false);

			expect(dataAssemblyController.communication.VExt.value).equal('');
			expect(dataAssemblyController.communication.VOp.value).equal('');
			expect(dataAssemblyController.communication.VInt.value).equal('');
			expect(dataAssemblyController.communication.VReq.value).equal('');
			expect(dataAssemblyController.communication.VOut.value).equal('');
			expect(dataAssemblyController.communication.VFbk.value).equal('');
		}).timeout(4000);
	});
});
