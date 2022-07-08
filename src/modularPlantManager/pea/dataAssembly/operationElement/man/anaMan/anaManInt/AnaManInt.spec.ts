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

import {AnaManInt} from './AnaManInt';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {DataAssemblyFactory} from '../../../../DataAssemblyFactory';
import {MockupServer} from '../../../../../../_utils';
import {AnaManIntMockup, getAnaManIntDataAssemblyModel} from './AnaManInt.mockup';
import {ConnectionHandler} from '../../../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaManInt', () => {

	let options: DataAssemblyModel;

	describe( 'static',() => {

		const connectionHandler = new ConnectionHandler();
		options = getAnaManIntDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create AnaManInt',  () => {

			const dataAssembly: AnaManInt = DataAssemblyFactory.create(options, connectionHandler) as AnaManInt;
			expect(dataAssembly.sourceMode).to.be.not.undefined;
			expect(dataAssembly.communication.VInt).to.not.equal(undefined);
			expect(dataAssembly.wqc).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const anaManIntMockup = new AnaManIntMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = anaManIntMockup.getDataAssemblyModel();
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

			const dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as AnaManInt;
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.communication.OSLevel.value).to.equal(0);
			expect(dataAssembly.communication.VOut.value).to.equal(0);
			expect(dataAssembly.communication.VMan.value).to.equal(0);
			expect(dataAssembly.communication.VRbk.value).to.equal(0);
			expect(dataAssembly.communication.VFbk.value).to.equal(0);
			expect(dataAssembly.communication.VUnit.value).equal(0);
			expect(dataAssembly.communication.VSclMin.value).equal(0);
			expect(dataAssembly.communication.VSclMax.value).equal(0);
			expect(dataAssembly.communication.VMin.value).equal(0);
			expect(dataAssembly.communication.VMax.value).equal(0);
			expect(dataAssembly.communication.WQC.value).to.equal(0);
			expect(dataAssembly.communication.VInt.value).to.equal(0);
			expect(dataAssembly.communication.VMan.value).to.equal(0);
			expect(dataAssembly.communication.SrcChannel.value).equal(false);
			expect(dataAssembly.communication.SrcManAut.value).equal(false);
			expect(dataAssembly.communication.SrcIntAut.value).equal(false);
			expect(dataAssembly.communication.SrcIntOp.value).equal(false);
			expect(dataAssembly.communication.SrcManOp.value).equal(false);
			expect(dataAssembly.communication.SrcIntAct.value).equal(true);
			expect(dataAssembly.communication.SrcManAct.value).equal(false);
		}).timeout(4000);
	});
});
