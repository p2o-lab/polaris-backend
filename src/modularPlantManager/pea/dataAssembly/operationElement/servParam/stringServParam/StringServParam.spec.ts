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

import {StringServParam} from './StringServParam';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../../../../../_utils';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {DataAssemblyFactory} from '../../../DataAssemblyFactory';
import {getStringServParamDataAssemblyModel, StringServParamMockup} from './StringServParam.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('StringServParam', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const emptyOPCUAConnection = new ConnectionHandler();
		options = getStringServParamDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create StringServParam', () => {
			const dataAssembly = DataAssemblyFactory.create(options, emptyOPCUAConnection) as StringServParam;
			expect(dataAssembly.serviceSourceMode).to.not.be.undefined;
			expect(dataAssembly.serviceOpMode).to.not.be.undefined;
			// expect(dataAssembly.wqc).to.not.be.undefined;
			expect(dataAssembly.dataItems.Sync).to.not.be.undefined;
			expect(dataAssembly.dataItems.VExt).to.not.be.undefined;
			expect(dataAssembly.dataItems.VOp).to.not.be.undefined;
			expect(dataAssembly.dataItems.VInt).to.not.be.undefined;
			expect(dataAssembly.dataItems.VReq).to.not.be.undefined;
			expect(dataAssembly.dataItems.VOut).to.not.be.undefined;
			expect(dataAssembly.dataItems.VFbk).to.not.be.undefined;
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
			const stringServParamMockup = new StringServParamMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = stringServParamMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as StringServParam;
			await dataAssembly.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			
			// expect(dataAssembly.dataItems.WQC.value).equal(0);

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

			expect(dataAssembly.dataItems.SrcChannel.value).equal(false);
			expect(dataAssembly.dataItems.SrcExtAut.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntAut.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntOp.value).equal(false);
			expect(dataAssembly.dataItems.SrcExtOp.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntAct.value).equal(true);
			expect(dataAssembly.dataItems.SrcExtAct.value).equal(false);

			expect(dataAssembly.dataItems.Sync.value).equal(false);

			expect(dataAssembly.dataItems.VExt.value).equal('');
			expect(dataAssembly.dataItems.VOp.value).equal('');
			expect(dataAssembly.dataItems.VInt.value).equal('');
			expect(dataAssembly.dataItems.VReq.value).equal('');
			expect(dataAssembly.dataItems.VOut.value).equal('');
			expect(dataAssembly.dataItems.VFbk.value).equal('');
		}).timeout(4000);
	});
});
