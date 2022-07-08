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

import {BinMon} from './BinMon';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../../_utils';
import {BinMonMockup, getBinMonDataAssemblyModel} from './BinMon.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMon', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getBinMonDataAssemblyModel(2, 'Variable', 'Variable') as DataAssemblyModel;

		it('should create BinMon', async () => {
			const dataAssembly: BinMon = new BinMon(options, connectionHandler);

			expect(dataAssembly.communication.TagName).to.not.equal(undefined);
			expect(dataAssembly.communication.TagDescription).to.not.equal(undefined);
			
			expect(dataAssembly.communication.WQC).to.not.equal(undefined);
			expect(dataAssembly.communication.V).to.not.equal(undefined);
			expect(dataAssembly.communication.VState0).to.not.equal(undefined);
			expect(dataAssembly.communication.VState1).to.not.equal(undefined);
			expect(dataAssembly.communication.OSLevel).to.not.equal(undefined);
			expect(dataAssembly.communication.VFlutEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VFlutTi).to.not.equal(undefined);
			expect(dataAssembly.communication.VFlutCnt).to.not.equal(undefined);
			expect(dataAssembly.communication.VFlutAct).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const binMonMockup = new BinMonMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = binMonMockup.getDataAssemblyModel();
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

			const dataAssembly: BinMon = new BinMon(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.communication.WQC.value).equal(0);
			expect(dataAssembly.communication.V.value).equal(false);
			expect(dataAssembly.communication.VState0.value).equal('state0_active');
			expect(dataAssembly.communication.VState1.value).equal('state1_active');

			expect(dataAssembly.communication.VFlutEn.value).equal(false);
			expect(dataAssembly.communication.VFlutAct.value).equal(false);
			expect(dataAssembly.communication.VFlutTi.value).equal(0);
			expect(dataAssembly.communication.VFlutCnt.value).equal(0);
		}).timeout(4000);
	});
});
