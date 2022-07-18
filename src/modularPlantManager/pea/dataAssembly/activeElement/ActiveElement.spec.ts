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

import {ActiveElement} from './ActiveElement';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../_utils';
import {ActiveElementMockup, getActiveElementOptions} from './ActiveElement.mockup';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../connectionHandler/ConnectionHandler.mockup';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ActiveElement', () => {

	let dataAssemblyModel: DataAssemblyModel;

	describe('static', () => {

		it('should create ActiveElement', () => {
			const connectionHandler = new ConnectionHandler();
			dataAssemblyModel = getActiveElementOptions(2, 'Variable', 'Variable') as DataAssemblyModel;
			const dataAssembly = new ActiveElement(dataAssemblyModel, connectionHandler);
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.wqc).to.be.not.undefined;
			expect(dataAssembly.osLevel).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new ActiveElementMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dataAssemblyModel = mockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new ActiveElement(dataAssemblyModel, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.wqc.WQC).equal(0);
			expect(dataAssembly.osLevel.osLevel).equal(0);
		}).timeout(4000);
	});
});
