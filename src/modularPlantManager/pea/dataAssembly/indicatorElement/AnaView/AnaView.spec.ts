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
import {MockupServer} from '../../../../_utils';
import {AnaView} from './AnaView';
import {AnaViewMockup, getAnaViewDataAssemblyModel} from './AnaView.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaView', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getAnaViewDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create AnaView', async () => {
			const dataAssembly: AnaView = new AnaView(options, connectionHandler);
			expect(dataAssembly.dataItems.V).to.not.equal(undefined);
			expect(dataAssembly.dataItems.WQC).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VSclMax).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VSclMin).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VUnit).to.not.equal(undefined);
			expect(dataAssembly.dataItems.TagName).to.not.equal(undefined);
			expect(dataAssembly.dataItems.TagDescription).to.not.equal(undefined);
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			const anaViewMockup = new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = anaViewMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly: AnaView = new AnaView(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.V.value).equal(0);
			expect(dataAssembly.dataItems.WQC.value).equal(0);
			expect(dataAssembly.dataItems.VUnit.value).equal(0);
			expect(dataAssembly.dataItems.VSclMin.value).equal(0);
			expect(dataAssembly.dataItems.VSclMax.value).equal(0);
		}).timeout(4000);
	});
});
