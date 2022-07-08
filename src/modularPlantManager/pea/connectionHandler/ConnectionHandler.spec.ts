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
import {MockupServer} from '../../_utils';
import {ConnectionHandler} from './ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('OpcUaConnection', () => {

	it('should reject connecting to a server with too high port', async () => {
		const connectionHandler = new ConnectionHandler();
		connectionHandler.setupConnectionAdapter({endpointUrl: 'opc.tcp://127.0.0.1:44447777'});
		expect(connectionHandler.connectionEstablished).to.equal(false);
		await expect(connectionHandler.connect()).to.be.rejected;
	});

	it('should reject connecting to a server with not existing endpoint', async () => {
		const connectionHandler = new ConnectionHandler();
		connectionHandler.setupConnectionAdapter({endpointUrl: ''});
		expect(connectionHandler.connectionEstablished).to.equal(false);
		await expect(connectionHandler.connect()).to.be.rejected;
		expect(connectionHandler.connectionEstablished).to.equal(false);
	}).timeout(5000);


	it('should connect to a opc ua test server and recognize a shutdown of this server', async () => {

		const mockupServer = new MockupServer();
		await mockupServer.start();

		const connectionHandler = new ConnectionHandler();
        connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});

		expect(connectionHandler.connectionEstablished).to.equal(false);
		await connectionHandler.connect();
		expect(connectionHandler.connectionEstablished).to.equal(true);

		await new Promise<void>((resolve) => {
			connectionHandler.once('disconnected', () => {
				expect(connectionHandler.connectionEstablished).to.equal(false);
				resolve();
			});
			mockupServer.shutdown();
		});
	}).timeout(3000);


	describe('with test server', () => {
		let mockupServer: MockupServer;
		let mockupServerNamespace = '';

		before(async () => {
			mockupServer = new MockupServer();
			await mockupServer.start();
			mockupServerNamespace = mockupServer.nameSpaceUri;
		});

		after(async () => {
			if(mockupServer) {
				await mockupServer.shutdown();
			}
		});


		it('should add and remove Nodes to connectionHandler for monitoring', async () => {
			const connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(connectionHandler.monitoredDataItemsCount()).to.equal(1);
			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger1', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(connectionHandler.monitoredDataItemsCount()).to.equal(2);
			connectionHandler.clearMonitoredDataItems();
			expect(connectionHandler.monitoredDataItemsCount()).to.equal(0);
			await connectionHandler.disconnect();
		});


		it('should connect to MockupServer, read an opc item and disconnect', async () => {

			const connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			expect(connectionHandler.connectionEstablished).to.equal(false);

			await connectionHandler.connect();
			expect(connectionHandler.connectionEstablished).to.equal(true);

			await connectionHandler.readDataItemValue({nodeId: {identifier: 'trigger', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}})
				.then((result) => expect(result?.value.value).to.equal(false));
			await connectionHandler.disconnect();
		});

		it('should connect to a opc ua test server, subscribe to one opc ua item and disconnect', async () => {
			const connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			expect(connectionHandler.connectionEstablished).to.equal(false);

			await connectionHandler.connect();

			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			await connectionHandler.connect();
			await new Promise(resolve => connectionHandler.on('monitoredDataItemChanged', resolve));

			await connectionHandler.disconnect();
		});

		it('should work after reconnection', async () => {
			const connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();

			const eventName1 = connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(connectionHandler.monitoredDataItemsCount()).to.equal(1);
			await connectionHandler.connect();
			await new Promise(resolve => connectionHandler.on('monitoredDataItemChanged', resolve));
			await connectionHandler.disconnect();

			expect(connectionHandler.monitoredDataItemsCount()).to.equal(1);
			await connectionHandler.connect();

			const eventName2 = connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(eventName1).to.equal(eventName2);
			await connectionHandler.connect();
			await new Promise((resolve) => connectionHandler.on('monitoredDataItemChanged', resolve));
			expect(connectionHandler.monitoredDataItemsCount()).to.equal(1);
		}).timeout(4000);

		it('should not add same nodeId, invalid namespace should throw, should listen to multiple items', async () => {
			const connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			expect(connectionHandler.connectionEstablished).to.equal(false);

			await connectionHandler.connect();
			expect(connectionHandler.connectionEstablished).to.equal(true);

			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(connectionHandler.monitoredDataItemsCount()).equals(1);

			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'trigger1', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(connectionHandler.monitoredDataItemsCount()).equals(1);

			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'nonexisting', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});

			expect(connectionHandler.monitoredDataItemsCount()).equals(2);

			const invalidUrn = 'urn:nan';
			expect(() => connectionHandler.addDataItemToMonitoring(
				{nodeId: {identifier: 'nonexistant', namespaceIndex: invalidUrn, access: DataItemAccessLevel.ReadWrite}}))
				.to.throw(`Failed to resolve namespace ${invalidUrn}!`);
			expect(connectionHandler.monitoredDataItemsCount()).equals(2);

			connectionHandler.addDataItemToMonitoring({nodeId: {identifier: 'Service1.OpMode', namespaceIndex: mockupServerNamespace, access: DataItemAccessLevel.ReadWrite}});
			expect(connectionHandler.monitoredDataItemsCount()).equals(3);
			await connectionHandler.connect();
			await connectionHandler.disconnect();

		}).timeout(5000);

		it('should connect with username and password', async () => {
			const connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
			await connectionHandler.disconnect();
		});

	});

});
