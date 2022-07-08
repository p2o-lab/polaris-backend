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

import {AnaMon} from './AnaMon';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../../_utils';
import {AnaMonMockup, getAnaMonDataAssemblyModel} from './AnaMon.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaMon', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getAnaMonDataAssemblyModel(2, 'Variable', 'Variable') as DataAssemblyModel;

		it('should create AnaMon', async () => {
			const dataAssembly: AnaMon = new AnaMon(options, connectionHandler);
			expect(dataAssembly.dataItems.TagName).to.not.equal(undefined);
			expect(dataAssembly.dataItems.TagDescription).to.not.equal(undefined);
			expect(dataAssembly.communication.V).to.not.equal(undefined);
			expect(dataAssembly.communication.WQC).to.not.equal(undefined);
			expect(dataAssembly.communication.VSclMax).to.not.equal(undefined);
			expect(dataAssembly.communication.VSclMin).to.not.equal(undefined);
			expect(dataAssembly.communication.VUnit).to.not.equal(undefined);

			expect(dataAssembly.communication.OSLevel).to.not.equal(undefined);
			expect(dataAssembly.communication.VAHEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VAHLim).to.not.equal(undefined);
			expect(dataAssembly.communication.VAHAct).to.not.equal(undefined);

			expect(dataAssembly.communication.VWHEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VWHLim).to.not.equal(undefined);
			expect(dataAssembly.communication.VWHAct).to.not.equal(undefined);

			expect(dataAssembly.communication.VTHEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VTHLim).to.not.equal(undefined);
			expect(dataAssembly.communication.VTHAct).to.not.equal(undefined);

			expect(dataAssembly.communication.VTLEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VTLLim).to.not.equal(undefined);
			expect(dataAssembly.communication.VTLAct).to.not.equal(undefined);

			expect(dataAssembly.communication.VWLEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VWLLim).to.not.equal(undefined);
			expect(dataAssembly.communication.VWLAct).to.not.equal(undefined);

			expect(dataAssembly.communication.VALEn).to.not.equal(undefined);
			expect(dataAssembly.communication.VALLim).to.not.equal(undefined);
			expect(dataAssembly.communication.VALAct).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const anaMonMockup = new AnaMonMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = anaMonMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new AnaMon(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.communication.V.value).equal(0);
			expect(dataAssembly.communication.WQC.value).equal(0);
			expect(dataAssembly.communication.VUnit.value).equal(0);
			expect(dataAssembly.communication.VSclMin.value).equal(0);
			expect(dataAssembly.communication.VSclMax.value).equal(0);
			expect(dataAssembly.communication.OSLevel.value).to.equal(0);
			expect(dataAssembly.communication.VAHEn.value).to.equal(false);
			expect(dataAssembly.communication.VAHLim.value).to.equal(0);
			expect(dataAssembly.communication.VAHAct.value).to.equal(false);
			expect(dataAssembly.communication.VWHEn.value).to.equal(false);
			expect(dataAssembly.communication.VWHLim.value).to.equal(0);
			expect(dataAssembly.communication.VWHAct.value).to.equal(false);
			expect(dataAssembly.communication.VTHEn.value).to.equal(false);
			expect(dataAssembly.communication.VTHLim.value).to.equal(0);
			expect(dataAssembly.communication.VTHAct.value).to.equal(false);
			expect(dataAssembly.communication.VTLEn.value).to.equal(false);
			expect(dataAssembly.communication.VTLLim.value).to.equal(0);
			expect(dataAssembly.communication.VTLAct.value).to.equal(false);
			expect(dataAssembly.communication.VWLEn.value).to.equal(false);
			expect(dataAssembly.communication.VWLLim.value).to.equal(0);
			expect(dataAssembly.communication.VWLAct.value).to.equal(false);
			expect(dataAssembly.communication.VALEn.value).to.equal(false);
			expect(dataAssembly.communication.VALLim.value).to.equal(0);
			expect(dataAssembly.communication.VALAct.value).to.equal(false);
		}).timeout(4000);
	});
});
