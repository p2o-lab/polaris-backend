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

import {OpcUaConnection} from './OpcUaConnection';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('OpcUaConnection', () => {

	it('should reject connecting to a server with too high port', async () => {
		const connection = new OpcUaConnection();
		connection.initialize({endpoint: 'opc.tcp://127.0.0.1:44447777'});
		expect(connection.isConnected()).to.equal(false);
		await expect(connection.connect()).to.be.rejected;
	});

	it('should reject connecting to a server with not existing endpoint', async () => {
		const connection = new OpcUaConnection();
		connection.initialize({endpoint: ''});
		expect(connection.isConnected()).to.equal(false);
		await expect(connection.connect()).to.be.rejected;
		expect(connection.isConnected()).to.equal(false);
	}).timeout(5000);


	it('should connect to a opc ua test server and recognize a shutdown of this server', async () => {

		const mockupServer = new MockupServer();
		await mockupServer.start();

		const connection = new OpcUaConnection();
        connection.initialize({endpoint: mockupServer.endpoint});

		expect(connection.isConnected()).to.equal(false);
		await connection.connect();
		expect(connection.isConnected()).to.equal(true);

		await new Promise<void>((resolve) => {
			connection.once('disconnected', () => {
				expect(connection.isConnected()).to.equal(false);
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


		it('should add and remove Nodes to connection for monitoring', async () => {
			const connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
			connection.addNodeToMonitoring('trigger', mockupServerNamespace);
			expect(connection.monitoredNodesCount()).to.equal(1);
			connection.addNodeToMonitoring('trigger1', mockupServerNamespace);
			expect(connection.monitoredNodesCount()).to.equal(2);
			connection.clearMonitoredNodes();
			expect(connection.monitoredNodesCount()).to.equal(0);
			await connection.disconnect();
		});


		it('should connect to MockupServer, read an opc item and disconnect', async () => {

			const connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();
			expect(connection.isConnected()).to.equal(true);

			await connection.readNode('trigger', mockupServerNamespace).then((result) => expect(result?.value.value).to.equal(false));
			await connection.disconnect();
		});

		it('should connect to a opc ua test server, subscribe to one opc ua item and disconnect', async () => {
			const connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();

			const eventName = connection.addNodeToMonitoring('trigger', mockupServerNamespace);
			await connection.createSubscription();
			const eventEmitter = await connection.startMonitoring();
			await new Promise(resolve => eventEmitter.on(eventName, resolve));

			await connection.disconnect();
		});

		it('should work after reconnection', async () => {
			const connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();

			const eventName1 = connection.addNodeToMonitoring('trigger', mockupServerNamespace);
			expect(connection.monitoredNodesCount()).to.equal(1);
			await connection.createSubscription();
			await connection.startMonitoring();
			await new Promise(resolve => connection.eventEmitter.on(eventName1, resolve));
			await connection.disconnect();

			expect(connection.monitoredNodesCount()).to.equal(1);
			await connection.connect();

			const eventName2 = connection.addNodeToMonitoring('trigger', mockupServerNamespace);
			expect(eventName1).to.equal(eventName2);
			await connection.createSubscription();
			await connection.startMonitoring();
			await new Promise((resolve) => connection.eventEmitter.on(eventName1, resolve));
			expect(connection.monitoredNodesCount()).to.equal(1);
		}).timeout(4000);

		it('should not add same nodeId, invalid namespace should throw, should listen to multiple items', async () => {
			const connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();
			expect(connection.isConnected()).to.equal(true);

			connection.addNodeToMonitoring('trigger', mockupServerNamespace);
			expect(connection.monitoredNodesCount()).equals(1);

			connection.addNodeToMonitoring('trigger', mockupServerNamespace);
			expect(connection.monitoredNodesCount()).equals(1);

			connection.addNodeToMonitoring('nonexistant', mockupServerNamespace);

			expect(connection.monitoredNodesCount()).equals(2);

			const invalidUrn = 'urn:nan';
			expect(() => connection.addNodeToMonitoring('nonexistant', invalidUrn))
				.to.throw(`Failed to resolve namespace ${invalidUrn}!`);
			expect(connection.monitoredNodesCount()).equals(2);

			connection.addNodeToMonitoring('Service1.OpMode', mockupServerNamespace);
			expect(connection.monitoredNodesCount()).equals(3);
			await connection.createSubscription();
			await connection.startMonitoring();
			await connection.disconnect();

		}).timeout(5000);

		it('should connect with username and password', async () => {
			const connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
			await connection.disconnect();
		});

		it('updateServerSettings(), should work', () => {
			// TODO
		});

	});

});
