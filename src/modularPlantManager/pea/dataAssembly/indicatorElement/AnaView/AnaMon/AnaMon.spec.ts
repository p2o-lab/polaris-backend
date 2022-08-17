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
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaMon', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getAnaMonDataAssemblyModel(2, 'Variable', 'Variable') as DataAssemblyModel;

		it('should create AnaMon', async () => {
			const dataAssembly: AnaMon = new AnaMon(options, connectionHandler,true);
			expect(dataAssembly.dataItems.TagName).to.not.equal(undefined);
			expect(dataAssembly.dataItems.TagDescription).to.not.equal(undefined);
			expect(dataAssembly.dataItems.V).to.not.equal(undefined);
			expect(dataAssembly.dataItems.WQC).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VSclMax).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VSclMin).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VUnit).to.not.equal(undefined);

			expect(dataAssembly.dataItems.OSLevel).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VAHEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VAHLim).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VAHAct).to.not.equal(undefined);

			expect(dataAssembly.dataItems.VWHEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VWHLim).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VWHAct).to.not.equal(undefined);

			expect(dataAssembly.dataItems.VTHEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VTHLim).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VTHAct).to.not.equal(undefined);

			expect(dataAssembly.dataItems.VTLEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VTLLim).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VTLAct).to.not.equal(undefined);

			expect(dataAssembly.dataItems.VWLEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VWLLim).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VWLAct).to.not.equal(undefined);

			expect(dataAssembly.dataItems.VALEn).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VALLim).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VALAct).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const anaMonMockup = new AnaMonMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = anaMonMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new AnaMon(options, connectionHandler, true);
			await dataAssembly.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.V.value).equal(0);
			expect(dataAssembly.dataItems.WQC.value).equal(0);
			expect(dataAssembly.dataItems.VUnit.value).equal(0);
			expect(dataAssembly.dataItems.VSclMin.value).equal(0);
			expect(dataAssembly.dataItems.VSclMax.value).equal(0);
			expect(dataAssembly.dataItems.OSLevel.value).to.equal(0);
			expect(dataAssembly.dataItems.VAHEn.value).to.equal(false);
			expect(dataAssembly.dataItems.VAHLim.value).to.equal(0);
			expect(dataAssembly.dataItems.VAHAct.value).to.equal(false);
			expect(dataAssembly.dataItems.VWHEn.value).to.equal(false);
			expect(dataAssembly.dataItems.VWHLim.value).to.equal(0);
			expect(dataAssembly.dataItems.VWHAct.value).to.equal(false);
			expect(dataAssembly.dataItems.VTHEn.value).to.equal(false);
			expect(dataAssembly.dataItems.VTHLim.value).to.equal(0);
			expect(dataAssembly.dataItems.VTHAct.value).to.equal(false);
			expect(dataAssembly.dataItems.VTLEn.value).to.equal(false);
			expect(dataAssembly.dataItems.VTLLim.value).to.equal(0);
			expect(dataAssembly.dataItems.VTLAct.value).to.equal(false);
			expect(dataAssembly.dataItems.VWLEn.value).to.equal(false);
			expect(dataAssembly.dataItems.VWLLim.value).to.equal(0);
			expect(dataAssembly.dataItems.VWLAct.value).to.equal(false);
			expect(dataAssembly.dataItems.VALEn.value).to.equal(false);
			expect(dataAssembly.dataItems.VALLim.value).to.equal(0);
			expect(dataAssembly.dataItems.VALAct.value).to.equal(false);
		}).timeout(4000);
	});
});
