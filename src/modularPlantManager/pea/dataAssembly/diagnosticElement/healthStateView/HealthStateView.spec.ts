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

import {HealthStateView} from './HealthStateView';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../_utils';
import {getHealthStateViewDataAssemblyModel, HealthStateViewMockup} from './HealthStateView.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('HealthStateView', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const emptyOPCUAConnection = new ConnectionHandler();
		options = getHealthStateViewDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create HealthStateView', async () => {
			const dataAssembly = new HealthStateView(options, emptyOPCUAConnection, true);
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.dataItems).to.be.not.undefined;
			expect(dataAssembly.wqc).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			const healthStateViewMockup = new HealthStateViewMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = healthStateViewMockup.getDataAssemblyModel();await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new HealthStateView(options, connectionHandler, true);
			await dataAssembly.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve)=> dataAssembly.on('changed', resolve));

			expect(dataAssembly.dataItems.WQC.value).equal(0);
		}).timeout(4000);
	});
});
