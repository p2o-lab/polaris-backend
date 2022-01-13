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
import {MockupServer} from '../../_utils';
import {DynamicDataItemOptions} from './DataItemFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpcUaDataItem', () => {
	describe('with mockup server', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		before(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpointUrl: mockupServer.endpoint});
			await connection.connect();
		});

		after(async () => {
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe', async () => {
			const options: DynamicDataItemOptions = {
				type: 'boolean',
				defaultValue: false,
				dynamicDataItemOptions: {
					dataType: 'Boolean',
					writable: false,
					namespaceIndex: mockupServer.nameSpaceUri,
					nodeId: 'trigger'
				}
			};
			const dataItem = new OpcUaDataItem<boolean>(options, connection);
			await dataItem.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve) => dataItem.on('changed', resolve));
			expect(dataItem.value).to.equal(false);
		});

		it('should subscribe, disconnect and resubscribe', async () => {
			const options: DynamicDataItemOptions = {
				type: 'boolean',
				defaultValue: false,
				dynamicDataItemOptions: {
					dataType: 'Boolean',
					writable: false,
					namespaceIndex: mockupServer.nameSpaceUri,
					nodeId: 'trigger'
				}
			};
			const dataItem = new OpcUaDataItem(options, connection);
			await dataItem.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve) => dataItem.on('changed', resolve));
			await connection.disconnect();
			await connection.connect();

			await dataItem.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve) => dataItem.on('changed', resolve));
		}).timeout(5000);

		it('should write', async () => {
			const options: DynamicDataItemOptions = {
				type: 'number',
				defaultValue: 0,
				dynamicDataItemOptions: {
					dataType: 'Float',
					writable: true,
					namespaceIndex: mockupServer.nameSpaceUri,
					nodeId: 'testNumber'
				}
			};
			const dataItem = new OpcUaDataItem<number>(options, connection);
			const valueBefore = await dataItem.read();
			expect(valueBefore).to.be.equal(0);
			await dataItem.write(12);
			const value = await dataItem.read();
			expect(value).to.be.equal(12);
			await expect(dataItem.write('abc')).to.be.fulfilled;
		});

		it('should fail while writing with wrong datatype', async () => {
			const options: DynamicDataItemOptions = {
				type: 'number',
				defaultValue: 0,
				dynamicDataItemOptions: {
					dataType: 'abc',
					writable: true,
					namespaceIndex: mockupServer.nameSpaceUri,
					nodeId: 'testNumber'
				}
			};
			const dataItem = new OpcUaDataItem<number>(options, connection);
			await expect(dataItem.write(22)).to.be.rejectedWith('datatype abc must be registered');
		});

		it('should fail while writing with wrong datatype', async () => {
			const options: DynamicDataItemOptions = {
				type: 'boolean',
				defaultValue: 0,
				dynamicDataItemOptions: {
					dataType: 'Boolean',
					writable: true,
					namespaceIndex: mockupServer.nameSpaceUri,
					nodeId: 'testNumber'
				}
			};
			const dataItem = new OpcUaDataItem<boolean>(options, connection);
			await expect(dataItem.write(22)).to.be.rejectedWith(
				'Invalid variant arrayType: Scalar  dataType: Boolean value:22 (javascript type = number )');
			await expect(dataItem.write('abc')).to.be.rejectedWith(
				'Invalid variant arrayType: Scalar  dataType: Boolean value:abc (javascript type = string )');
		});
	});
});
