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

import {BinManInt} from './BinManInt';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {DataAssemblyFactory} from '../../../../DataAssemblyFactory';
import {MockupServer} from '../../../../../../_utils';
import {BinManIntMockup, getBinManIntDataAssemblyModel} from './BinManInt.mockup';
import {ConnectionHandler} from '../../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../../connectionHandler/ConnectionHandler.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinManInt', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getBinManIntDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create BinManInt',  () => {
			const dataAssembly: BinManInt = DataAssemblyFactory.create(options, connectionHandler) as BinManInt;
			expect(dataAssembly.sourceMode).to.be.not.undefined;
			expect(dataAssembly.dataItems.VInt).to.not.equal(undefined);
			expect(dataAssembly.wqc).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			const binManIntMockup = new BinManIntMockup(mockupServer.nameSpace,	mockupServer.rootObject,'Variable');
			options = binManIntMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as BinManInt;
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.OSLevel.value).to.equal(0);
			expect(dataAssembly.dataItems.VOut.value).to.equal(false);
			expect(dataAssembly.dataItems.VMan.value).to.equal(false);
			expect(dataAssembly.dataItems.VRbk.value).to.equal(false);
			expect(dataAssembly.dataItems.VFbk.value).to.equal(false);
			expect(dataAssembly.dataItems.VState0.value).to.equal('off');
			expect(dataAssembly.dataItems.VState1.value).to.equal('on');
			expect(dataAssembly.dataItems.WQC.value).to.equal(0);
			expect(dataAssembly.dataItems.VInt.value).to.equal(false);
			expect(dataAssembly.dataItems.VMan.value).to.equal(false);
			expect(dataAssembly.dataItems.SrcChannel.value).equal(false);
			expect(dataAssembly.dataItems.SrcManAut.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntAut.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntOp.value).equal(false);
			expect(dataAssembly.dataItems.SrcManOp.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntAct.value).equal(true);
			expect(dataAssembly.dataItems.SrcManAct.value).equal(false);
		}).timeout(4000);
	});
});
