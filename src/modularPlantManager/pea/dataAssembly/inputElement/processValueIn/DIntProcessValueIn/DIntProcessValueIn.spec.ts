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
import {DIntProcessValueInMockup, getDIntProcessValueInDataAssemblyModel} from './DIntProcessValueIn.mockup';

import {DIntProcessValueIn} from './DIntProcessValueIn';
import {DataAssemblyFactory} from '../../../DataAssemblyFactory';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntProcessValueIn', () => {

	let options: DataAssemblyModel;
	
	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getDIntProcessValueInDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create DIntProcessValueIn', async () => {
			const dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as DIntProcessValueIn;
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.dataItems.VExt).to.be.not.undefined;
			expect(dataAssembly.dataItems.VSclMax).to.be.not.undefined;
			expect(dataAssembly.dataItems.VSclMin).to.be.not.undefined;
			expect(dataAssembly.dataItems.VUnit).to.be.not.undefined;
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let dIntProcessValueInMockup: DIntProcessValueInMockup;
		let dataAssembly: DIntProcessValueIn;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			dIntProcessValueInMockup = new DIntProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dIntProcessValueInMockup.scaleSettings.vSclMax= 1;
			options = dIntProcessValueInMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			dataAssembly = DataAssemblyFactory.create(options, connectionHandler) as DIntProcessValueIn;
			await dataAssembly.subscribe();
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			expect(dataAssembly.dataItems.VExt.value).equal(0);
			expect(dataAssembly.dataItems.VUnit.value).equal(0);
			expect(dataAssembly.dataItems.VSclMin.value).equal(0);
			expect(dataAssembly.dataItems.VSclMax.value).equal(1);
		}).timeout(4000);

		it('setparameter', async () => {
			await dataAssembly.setParameter(1,'VExt');
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			expect(dIntProcessValueInMockup.vExt).equal(1);
		}).timeout(4000);

	});
});
