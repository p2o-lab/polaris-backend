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

import {LockView4} from './LockView4';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../../_utils';
import {getLockView4DataAssemblyModel, LockView4Mockup} from './LockView4.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView4', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const emptyOPCUAConnection = new ConnectionHandler();
		options = getLockView4DataAssemblyModel(2, 'Variable', 'Variable') as DataAssemblyModel;

		it('should create LockView4', async () => {
			const dataAssembly = new LockView4(options, emptyOPCUAConnection);
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.dataItems).to.be.not.undefined;
			expect(dataAssembly.wqc).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			const lockView4Mockup = new LockView4Mockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = lockView4Mockup.getDataAssemblyModel();
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

			const dataAssembly = new LockView4(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.dataItems.In4Txt.on('changed', resolve)));

			expect(dataAssembly.wqc.WQC).equal(0);
			expect(dataAssembly.dataItems.Logic.value).equal(false);
			expect(dataAssembly.dataItems.Out.value).equal(false);
			expect(dataAssembly.dataItems.OutQC.value).equal(0);

			expect(dataAssembly.dataItems.In1En.value).equal(false);
			expect(dataAssembly.dataItems.In1.value).equal(false);
			expect(dataAssembly.dataItems.In1QC.value).equal(0);
			expect(dataAssembly.dataItems.In1Inv.value).equal(false);
			expect(dataAssembly.dataItems.In1Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In2En.value).equal(false);
			expect(dataAssembly.dataItems.In2.value).equal(false);
			expect(dataAssembly.dataItems.In2QC.value).equal(0);
			expect(dataAssembly.dataItems.In2Inv.value).equal(false);
			expect(dataAssembly.dataItems.In2Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In3En.value).equal(false);
			expect(dataAssembly.dataItems.In3.value).equal(false);
			expect(dataAssembly.dataItems.In3QC.value).equal(0);
			expect(dataAssembly.dataItems.In3Inv.value).equal(false);
			expect(dataAssembly.dataItems.In3Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In4En.value).equal(false);
			expect(dataAssembly.dataItems.In4.value).equal(false);
			expect(dataAssembly.dataItems.In4QC.value).equal(0);
			expect(dataAssembly.dataItems.In4Inv.value).equal(false);
			expect(dataAssembly.dataItems.In4Txt.value).equal('testText');
		}).timeout(4000);
	});
});
