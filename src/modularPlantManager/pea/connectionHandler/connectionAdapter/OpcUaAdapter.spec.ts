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
import {MockupServer} from '../../../_utils';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {OpcUaAdapter} from './OpcUaAdapter';
import {StringViewMockup} from '../../dataAssembly/indicatorElement/StringView/StringView.mockup';
import {Access} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('OpcUaAdapter', () => {

	it('should reject connecting to a server with too high port', async () => {
		expect(() => new OpcUaAdapter({endpoint: 'opc.tcp://127.0.0.1:4444'})).to.not.throw();
		expect(() => new OpcUaAdapter({endpoint: 'opc.tcp://127.0.0.1:44447777'})).to.throw();
	});

	it('should reject connecting to a server with not existing endpoint', async () => {
		await expect(() => new OpcUaAdapter({endpoint: ''})).to.throw;
	}).timeout(5000);


	describe('with test server', () => {
		let mockupServer: MockupServer;
		let mockupServerNamespace = '';
		let options: DataAssemblyModel;
		let mockup: StringViewMockup;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockupServerNamespace = mockupServer.nameSpaceUri;
			mockup = new StringViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = mockup.getDataAssemblyModel();
			await mockupServer.start();

		});

		after(async () => {
			if(mockupServer) {
				await mockupServer.shutdown();
			}
		});

		it('should connect to a opc ua test server and recognize a shutdown of this server', async () => {
			const opcUaAdapter = new OpcUaAdapter({endpoint: mockupServer.endpoint});
			await opcUaAdapter.initialize();
			const info = opcUaAdapter.getAdapterInfo();
			expect(opcUaAdapter.connected).to.equal(false);
			await opcUaAdapter.connect({endpointId: info.endpoints[0].id});
			expect(opcUaAdapter.connected).to.equal(true);

			await new Promise<void>((resolve) => {
				opcUaAdapter.once('disconnected', () => {
					expect(opcUaAdapter.connected).to.equal(false);
					resolve();
				});
				mockupServer.shutdown();
			});
		}).timeout(10000);


		it('should add and remove Nodes to connection for monitoring', async () => {
			const opcUaAdapter = new OpcUaAdapter({endpoint: mockupServer.endpoint});
			await opcUaAdapter.initialize();
			const info = opcUaAdapter.getAdapterInfo();
			expect(opcUaAdapter.connected).to.equal(false);
			await opcUaAdapter.connect({endpointId: info.endpoints[0].id});
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'Text')!.cIData!);
			expect(opcUaAdapter.monitoredNodesCount()).to.equal(1);
			opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'WQC')!.cIData!);
			expect(opcUaAdapter.monitoredNodesCount()).to.equal(2);
			opcUaAdapter.clearMonitoredNodes();
			expect(opcUaAdapter.monitoredNodesCount()).to.equal(0);
			await opcUaAdapter.disconnect();
		});


		it('should connect to MockupServer, read an opc item and disconnect', async () => {

			const opcUaAdapter = new OpcUaAdapter({endpoint: mockupServer.endpoint});
			expect(opcUaAdapter.connected).to.equal(false);

			await opcUaAdapter.initialize();
			const info = opcUaAdapter.getAdapterInfo();
			expect(opcUaAdapter.connected).to.equal(false);
			await opcUaAdapter.connect({endpointId: info.endpoints[0].id});
			expect(opcUaAdapter.connected).to.equal(true);

			await opcUaAdapter.readNode(options.dataItems.find(d => d.name === 'Text')!.cIData!)
				.then((result) => expect(result?.value.value).to.equal('dummyText'));
			await opcUaAdapter.disconnect();
		});

		it('should work after reconnection', async () => {
			const opcUaAdapter = new OpcUaAdapter({endpoint: mockupServer.endpoint});
			await opcUaAdapter.initialize();
			const info = opcUaAdapter.getAdapterInfo();
			expect(opcUaAdapter.connected).to.equal(false);
			await opcUaAdapter.connect({endpointId: info.endpoints[0].id});

			const eventName1 = opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'Text')!.cIData!);
			expect(opcUaAdapter.monitoredNodesCount()).to.equal(1);
			opcUaAdapter.startMonitoring().then();
			await new Promise(resolve => opcUaAdapter.on('monitoredNodeChanged', resolve));
			await opcUaAdapter.disconnect();
			expect(opcUaAdapter.connected).to.equal(false);
			await opcUaAdapter.connect({endpointId: info.endpoints[0].id});
			const eventName2 = opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'Text')!.cIData!);
			expect(eventName1).to.equal(eventName2);
			opcUaAdapter.startMonitoring().then();
			await new Promise((resolve) => opcUaAdapter.on('monitoredNodeChanged', resolve));
			expect(opcUaAdapter.monitoredNodesCount()).to.equal(1);
		}).timeout(4000);

		it('should not add same nodeId, invalid namespace should throw, should listen to multiple items', async () => {
			const opcUaAdapter = new OpcUaAdapter({endpoint: mockupServer.endpoint});
			await opcUaAdapter.initialize();
			const info = opcUaAdapter.getAdapterInfo();
			expect(opcUaAdapter.connected).to.equal(false);
			await opcUaAdapter.connect({endpointId: info.endpoints[0].id});
			expect(opcUaAdapter.connected).to.equal(true);

			opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'Text')!.cIData!);
			expect(opcUaAdapter.monitoredNodesCount()).equals(1);

			opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'Text')!.cIData!);
			expect(opcUaAdapter.monitoredNodesCount()).equals(1);

			opcUaAdapter.addDataItemToMonitoring({nodeId: {identifier: 'nonexistant', namespaceIndex: mockupServerNamespace, access: Access.ReadWriteAccess}});

			expect(opcUaAdapter.monitoredNodesCount()).equals(2);

			opcUaAdapter.addDataItemToMonitoring(options.dataItems.find(d => d.name === 'WQC')!.cIData!);
			expect(opcUaAdapter.monitoredNodesCount()).equals(3);
			await opcUaAdapter.disconnect();
		}).timeout(5000);

	});

});
