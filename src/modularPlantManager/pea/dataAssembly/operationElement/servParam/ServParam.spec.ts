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
import {MockupServer} from '../../../../_utils';
import {ServParam} from './';
import {getServParamDataAssemblyModel, ServParamMockup} from './ServParam.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServParam', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getServParamDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create ServParam', () => {

			const dataAssembly = new ServParam(options, connectionHandler) as ServParam;
			expect(dataAssembly.serviceSourceMode).to.not.be.undefined;
			expect(dataAssembly.serviceOpMode).to.not.be.undefined;
			// expect(dataAssembly.wqc).to.not.be.undefined;
			expect(dataAssembly.communication.Sync).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const servParamMockup = new ServParamMockup(mockupServer.nameSpace,	mockupServer.rootObject,'Variable');
			options = servParamMockup.getDataAssemblyModel();
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

			const dataAssembly: ServParam = new ServParam(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			
			// expect(dataAssembly.communication.WQC.value).equal(0);
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
			expect(dataAssembly.communication.SrcChannel.value).equal(false);
			expect(dataAssembly.communication.SrcExtAut.value).equal(false);
			expect(dataAssembly.communication.SrcIntAut.value).equal(false);
			expect(dataAssembly.communication.SrcIntOp.value).equal(false);
			expect(dataAssembly.communication.SrcExtOp.value).equal(false);
			expect(dataAssembly.communication.SrcIntAct.value).equal(true);
			expect(dataAssembly.communication.SrcExtAct.value).equal(false);
			expect(dataAssembly.communication.Sync.value).equal(false);
		}).timeout(4000);
	});
});
