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
import {BinMon} from '../../indicatorElement';
import {DataAssembly} from '../../DataAssembly';
import {WQC} from './WQC';
import {MockupServer} from '../../../../_utils';
import {WQCMockup} from './WQC.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaViewDataAssemblyModel} from '../../indicatorElement/AnaView/AnaView.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('WQC', () => {

	const options: DataAssemblyModel = getAnaViewDataAssemblyModel(2, 'Variable');


	describe('static WQC', () => {

		const staticWQCDataAssemblyModel = Object.assign({}, options);
		staticWQCDataAssemblyModel.dataItems = {...staticWQCDataAssemblyModel.dataItems, ...{WQC: {value: '255'}}} as any;
		let wqcObject: WQC;
		let da: DataAssembly;
		let connectionHandler: ConnectionHandler;

		beforeEach(()=>{
			connectionHandler = new ConnectionHandler();
		});

		it('should create WQC', async () => {
			wqcObject = new WQC(options, connectionHandler);
			expect((da as BinMon).communication.WQC).to.be.exist;
		});

		it('getter', async () => {
			wqcObject = new WQC(options, connectionHandler);
			expect(wqcObject.WQC).to.equal(255);
		});
	});

	describe('dynamic WQC', () => {

		let wqcObject: WQC;
		let da: DataAssembly;
		let connectionHandler: ConnectionHandler;

		beforeEach(()=>{
			connectionHandler = new ConnectionHandler();
		});

		it('should create WQC', async () => {
			wqcObject = new WQC(options, connectionHandler);
			expect((da as BinMon).communication.WQC).to.exist;
		});

		it('getter', async () => {
			wqcObject = new WQC(options, connectionHandler);
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
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			const dataAssembly = new WQC(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			expect(dataAssembly.WQC).to.equal(0);
		}).timeout(5000);
	});
});
