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
import {namespaceUrl} from '../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpcUaConnection', () => {

	it('should reject connecting to a server with too high port', async () => {
		const connection = new OpcUaConnection('test', 'opc.tcp://127.0.0.1:44447777');
		expect(connection.isConnected()).to.equal(false);
		await expect(connection.connect()).to.be.rejected;
	});

	it('should reject connecting to a server with not existing endpoint', async () => {
		const connection = new OpcUaConnection('test', '');
		expect(connection.isConnected()).to.equal(false);
		await expect(connection.connect()).to.be.rejected;
		expect(connection.isConnected()).to.equal(false);
	}).timeout(5000);

	it('should connect to a opc ua test server and recognize a shutdown of this server', async () => {
/*		const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
		const mockupServer = new MockupServer();
		await mockupServer.start();

		expect(connection.isConnected()).to.equal(false);
		await connection.connect();
		expect(connection.isConnected()).to.equal(true);

		await new Promise((resolve) => {
			connection.once('disconnected', () => {
				expect(connection.isConnected()).to.equal(false);
				resolve();
			});
			mockupServer.shutdown();
		});*/
		// TODO this is currently throwing an error
	}).timeout(3000);


	describe('with test server', () => {
		let mockupServer: MockupServer;

		before(async () => {
			mockupServer = new MockupServer();
			await mockupServer.start();
		});

		after(async () => {
			if(mockupServer) await mockupServer.shutdown();
		});

		it('should connect to a opc ua test server, read an opc item and disconnect', async () => {
			const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();
			expect(connection.isConnected()).to.equal(true);

			await connection.readOpcUaNode('trigger', namespaceUrl)
				.then(datavalue => expect(datavalue?.value.value).to.equal(false));
			await connection.disconnect();
		});

		it('should connect to a opc ua test server, subscribes to one opc item and disconnect', async () => {
			const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();
			expect(connection.isConnected()).to.equal(true);

			const eventName = connection.addOpcUaNode('trigger', namespaceUrl);
			const eventEmitter = await connection.startListening();
			await new Promise(resolve => eventEmitter.on(eventName, resolve));

			await connection.disconnect();
		});

		it('should work after reconnection', async () => {
			const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();
			expect(connection.isConnected()).to.equal(true);

			const eventName1 = connection.addOpcUaNode('trigger', namespaceUrl);
			await connection.startListening();
			expect(connection.monitoredItemSize()).to.equal(1);
			await new Promise(resolve => connection.eventEmitter.on(eventName1, resolve));

			await connection.disconnect();
			expect(connection.monitoredItemSize()).to.equal(0);
			await connection.connect();

			const eventName2 = connection.addOpcUaNode('trigger', namespaceUrl);
			expect(eventName1).to.equal(eventName2);
			await connection.startListening();
			await new Promise(resolve => connection.eventEmitter.on(eventName1, resolve));
			expect(connection.monitoredItemSize()).to.equal(1);
		}).timeout(4000);

		it('should not add same nodeId, invalid namespace should throw, should listen to multiple items', async () => {
			const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
			expect(connection.isConnected()).to.equal(false);

			await connection.connect();
			expect(connection.isConnected()).to.equal(true);

			connection.addOpcUaNode('trigger', namespaceUrl);
			expect(connection.monitoredItemSize()).equals(1);

			connection.addOpcUaNode('trigger', namespaceUrl);
			expect(connection.monitoredItemSize()).equals(1);

			connection.addOpcUaNode('nonexistant', namespaceUrl);

			expect(connection.monitoredItemSize()).equals(2);

			expect(() => connection.addOpcUaNode('nonexistant', 'urn:nan'))
				.to.throw('Could not resolve namespace');
			expect(connection.monitoredItemSize()).equals(2);

			connection.addOpcUaNode('Service1.OpMode', namespaceUrl);
			expect(connection.monitoredItemSize()).equals(3);
			await connection.startListening();
			await connection.disconnect();
		}).timeout(5000);

		it('should connect with username and password', async () => {
			const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334', 'admin', '1234');
			await connection.connect();
			await connection.disconnect();
		});

		it('should fail connecting with wrong username and password', async () => {
			const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334', 'admin', 'empty');
			await expect(connection.connect()).to.be.rejectedWith('BadUserAccessDenied');
			await connection.disconnect();
		});
	});

});
