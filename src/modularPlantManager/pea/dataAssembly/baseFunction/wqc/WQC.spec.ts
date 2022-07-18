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
import {AnaViewRuntime, BinMon} from '../../indicatorElement';
import {DataAssembly} from '../../DataAssembly';
import {WQC} from './WQC';
import {MockupServer} from '../../../../_utils';
import {WQCMockup} from './WQC.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaViewDataAssemblyModel} from '../../indicatorElement/AnaView/AnaView.mockup';
import {DataAssemblyFactory} from '../../DataAssemblyFactory';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('WQC', () => {

	const connectionHandler = new ConnectionHandler();
	const referenceDataAssemblyModel = getAnaViewDataAssemblyModel(2, 'Variable', 'Variable');
	const referenceDataAssembly = DataAssemblyFactory.create(referenceDataAssemblyModel, connectionHandler);

	describe('static WQC', () => {

		let wqcObject: WQC;
		let da: DataAssembly;

		it('should create WQC', async () => {
			wqcObject = new WQC(referenceDataAssembly.dataItems as AnaViewRuntime);
			expect((da as BinMon).dataItems.WQC).to.be.exist;
		});

		it('getter', async () => {
			wqcObject = new WQC(referenceDataAssembly.dataItems as AnaViewRuntime);
			expect(wqcObject.WQC).to.equal(255);
		});
	});

	describe('dynamic WQC', () => {

		let wqcObject: WQC;
		let da: DataAssembly;

		it('should create WQC', async () => {
			wqcObject = new WQC(referenceDataAssembly.dataItems as AnaViewRuntime);
			expect((da as BinMon).dataItems.WQC).to.exist;
		});

		it('getter', async () => {
			wqcObject = new WQC(referenceDataAssembly.dataItems as AnaViewRuntime);
			expect(wqcObject.WQC).to.equal(0);
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new WQCMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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
			const dataAssembly = new WQC(referenceDataAssembly.dataItems as AnaViewRuntime);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			expect(dataAssembly.WQC).to.equal(0);
		}).timeout(5000);
	});
});
