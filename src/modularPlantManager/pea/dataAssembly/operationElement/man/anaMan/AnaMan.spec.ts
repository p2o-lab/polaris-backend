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
import {MockupServer} from '../../../../../_utils';

import {AnaMan} from './AnaMan';
import {DataAssemblyFactory} from '../../../DataAssemblyFactory';
import {AnaManMockup, getAnaManDataAssemblyModel} from './AnaMan.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaMan', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getAnaManDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create AnaMan',  () => {
			const dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as AnaMan;
			expect(dataAssembly.dataItems.VOut).to.not.equal(undefined);
			expect(dataAssembly.scaleSettings).to.not.be.undefined;
			expect(dataAssembly.unitSettings).to.not.be.undefined;
			expect(dataAssembly.valueLimitation).to.not.be.undefined;
			expect(dataAssembly.dataItems.VMan).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VRbk).to.not.equal(undefined);
			expect(dataAssembly.dataItems.VFbk).to.not.equal(undefined);
			expect(dataAssembly.defaultReadDataItem).equal(dataAssembly.dataItems.VOut);
			expect(dataAssembly.defaultReadDataItemType).to.equal('number');
			expect(dataAssembly.defaultWriteDataItem).equal(dataAssembly.dataItems.VMan);
			expect(dataAssembly.defaultWriteDataItemType).to.equal('number');
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			const anaManMockup = new AnaManMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = anaManMockup.getDataAssemblyModel();
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

			const dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as AnaMan;
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.OSLevel.value).to.equal(0);
			expect(dataAssembly.dataItems.VOut.value).to.equal(0);
			expect(dataAssembly.dataItems.VMan.value).to.equal(0);
			expect(dataAssembly.dataItems.VRbk.value).to.equal(0);
			expect(dataAssembly.dataItems.VFbk.value).to.equal(0);
			expect(dataAssembly.dataItems.VUnit.value).equal(0);
			expect(dataAssembly.dataItems.VSclMin.value).equal(0);
			expect(dataAssembly.dataItems.VSclMax.value).equal(0);
			expect(dataAssembly.dataItems.VMin.value).equal(0);
			expect(dataAssembly.dataItems.VMax.value).equal(0);
		}).timeout(4000);
	});
});
