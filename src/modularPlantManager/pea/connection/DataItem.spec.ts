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

import {OpcUaConnection} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {OpcUaDataItem} from './OpcUaDataItem';
import {PEAMockup} from '../PEA.mockup';
import {MockupServer} from '../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataItem', () => {

	describe('static', () => {

		const connection = new OpcUaConnection('PEATestServer', 'opc.tcp://127.0.0.1:4334/PEATestServer');

		it('should work with float', () => {
			const di = OpcUaDataItem.fromOptions(
				{value: 1.2, dataType: 'Float', nodeId: 'test', namespaceIndex: 'test2'},
				connection, 'read', 'number');
			expect(di.value).to.equal(1.2);
		});

		it('should work with float conversion', () => {
			const di = OpcUaDataItem.fromOptions(
				{value: '1.2', dataType: 'Float', nodeId: 'test', namespaceIndex: 'test2'},
				connection, 'read', 'number');
			expect(di.value).to.equal(1.2);
		});

		it('should work with value = 0', () => {
			const di = OpcUaDataItem.fromOptions(
				{value: 0.0, dataType: 'Float', nodeId: 'test', namespaceIndex: 'test2'},
				connection, 'read', 'number');
			expect(di.value).to.equal(0);
		});

		it('should work with negative value', () => {
			const di = OpcUaDataItem.fromOptions(
				{value: -2, dataType: 'Float', nodeId: 'test', namespaceIndex: 'test2'},
				connection, 'read', 'number');
			expect(di.value).to.equal(-2.0);
		});

		it('should work with undefined value', () => {
			const di = OpcUaDataItem.fromOptions(
				{value: undefined, dataType: 'Float', nodeId: 'test', namespaceIndex: 'test2'},
				connection, 'read', 'number');
			expect(di.value).to.equal(null);
			expect(di.access).to.equal('read');
		});

		it('should work with undefined value', () => {
			const di = OpcUaDataItem.fromOptions(
				{
					value: undefined,
					dataType: 'Float',
					nodeId: 'test',
					namespaceIndex: 'test2'
				}, connection, 'write', 'number');
			expect(di.value).to.equal(undefined);
			expect(di.access).to.equal('write');
		});

		it('should work with string conversion', () => {
			const di = OpcUaDataItem.fromOptions(
				{value: 1.2, dataType: 'Float', nodeId: 'test', namespaceIndex: 'test2'},
				connection, 'read', 'string');
			expect(di.value).to.equal('1.2');
		});

		it('should reject working when not connected', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.Factor.VExt',
					dataType: 'Double'
				}, connection, 'write', 'number');
			await expect(di.read()).to.be.rejectedWith('namespace');
		});
	});

	describe('with testserver', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		before(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.start();

			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://127.0.0.1:4334/PEATestServer');
			await connection.connect();
		});

		after(async () => {
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.CurrentTime.Text',
					dataType: 'String'
				}, connection, 'write', 'string');

			await di.subscribe();

			await connection.startListening();

			await new Promise((resolve) => di.on('changed', resolve));
			expect(di.value).to.equal('initial value');
		});

		it('should subscribe, disconnect and resubscribe', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.CurrentTime.Text',
					dataType: 'String'
				}, connection, 'write', 'string');

			await di.subscribe();
			await connection.startListening();
			await new Promise((resolve) => di.on('changed', resolve));

			await connection.disconnect();
			await connection.connect();

			await di.subscribe();
			await connection.startListening();
			await new Promise((resolve) => di.on('changed', resolve));
		});

		it('should write', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.Factor.VExt',
					dataType: 'Double'
				}, connection, 'write', 'number');
			await di.write(22.0);

			const value = await di.read();
			expect(value).to.be.equal(22.0);
		});

		it('should fail while writing with wrong datatype', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.Factor.VExt',
					dataType: 'Float'
				}, connection, 'write', 'number');

			await expect(di.write(22)).to.be.rejectedWith('value supplied for ' +
				'the attribute is not of the same type');
		});

		it('should fail while writing with wrong datatype 2', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.Factor.VExt',
					dataType: 'abc'
				}, connection, 'write', 'number');

			await expect(di.write(22)).to.be.rejectedWith('datatype abc must be registered');
		});

		it('should fail while writing with wrong datatype 3', async () => {
			const di = OpcUaDataItem.fromOptions(
				{
					namespaceIndex: 'urn:NodeOPCUA-Server-default',
					nodeId: 'Service1.Factor.VExt',
					dataType: 'Byte'
				}, connection, 'write', 'number');

			await expect(di.write(22)).to.be.rejectedWith('value supplied for the ' +
				'attribute is not of the same type');
		});
	});
});
