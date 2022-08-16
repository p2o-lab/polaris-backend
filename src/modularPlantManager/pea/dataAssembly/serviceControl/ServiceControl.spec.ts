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

import {
	ServiceControl
} from './ServiceControl';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../../../_utils';
import {getServiceControlDataAssemblyModel, ServiceControlMockup} from './ServiceControl.mockup';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {getEndpointDataModel} from '../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceControl', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getServiceControlDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create ServiceControl', async () => {
			const dataAssembly = new ServiceControl(options, connectionHandler, true);
			expect(dataAssembly.opMode).to.not.equal(undefined);
			expect(dataAssembly.serviceSourceMode).to.not.equal(undefined);

			expect(dataAssembly.dataItems.WQC).to.not.equal(undefined);
			expect(dataAssembly.dataItems.CommandOp).to.not.equal(undefined);
			expect(dataAssembly.dataItems.CommandExt).to.not.equal(undefined);
			expect(dataAssembly.dataItems.CommandInt).to.not.equal(undefined);
			expect(dataAssembly.dataItems.CommandEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.StateCur).to.not.equal(undefined);
			expect(dataAssembly.dataItems.ProcedureOp).to.not.equal(undefined);
			expect(dataAssembly.dataItems.ProcedureExt).to.not.equal(undefined);
			expect(dataAssembly.dataItems.ProcedureInt).to.not.equal(undefined);
			expect(dataAssembly.dataItems.ProcedureCur).to.not.equal(undefined);
			expect(dataAssembly.dataItems.ProcedureReq).to.not.equal(undefined);
			expect(dataAssembly.dataItems.InteractQuestionID).to.not.equal(undefined);
			expect(dataAssembly.dataItems.InteractAnswerID).to.not.equal(undefined);
			expect(dataAssembly.dataItems.PosTextID).to.not.equal(undefined);
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
			const serviceControlMockup =new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = serviceControlMockup.getDataAssemblyModel();
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

			const dataAssembly = new ServiceControl(options, connectionHandler, true);
			await dataAssembly.subscribe();
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.WQC.value).equal(0);
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

		}).timeout(4000);
	});
});
