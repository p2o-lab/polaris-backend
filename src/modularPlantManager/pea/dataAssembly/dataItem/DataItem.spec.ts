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
import {DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../_utils';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {OpcUaDataItem} from './DataItem';
import {DataItemFactory} from './DataItemFactory';
import {getEmptyCIDataModel, getEmptyDataItemModel} from './DataItem.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataItem', () => {

	describe('StaticDataItem', () => {

		describe('Type number', () => {

			it('should work with default value', () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = '1.2';
				options.value = '1.2';
				const dataItem = DataItemFactory.create<number>(options);
				expect(dataItem.defaultValue).to.equal(1.2);
				expect(dataItem.value).to.equal(1.2);
			});

			it('should work without value', () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = '1.2';
				const dataItem = DataItemFactory.create<number>(options);
				expect(dataItem.defaultValue).to.equal(1.2);
				expect(dataItem.value).to.equal(1.2);
			});

			it('should work with boolean default value true', () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = 'true';
				options.value = 'true';
				const dataItem = DataItemFactory.create<number>(options);
				expect(dataItem.defaultValue).to.equal(1);
				expect(dataItem.value).to.equal(1);
			});

			it('should work with boolean default value false', () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = 'false';
				options.value = 'false';
				const dataItem = DataItemFactory.create<number>(options);
				expect(dataItem.defaultValue).to.equal(0);
				expect(dataItem.value).to.equal(0);
			});
			// TODO: extend tests '', 'sefsef', '0.1', etc.
		});

		describe('Type string', () => {

			it('should work with float default value', () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = '1.2';
				options.value = '1.2';
				const dataItem = DataItemFactory.create<string>(options);
				expect(dataItem.value).to.equal('1.2');
			});

			it('should work with string default value', () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = 'abc';
				options.value = 'abc';
				const dataItem = DataItemFactory.create<string>(options);
				expect(dataItem.value).to.equal('1.2');
			});


		});

		describe('Type boolean', () => {
			// TODO
		});
	});

	describe('DynamicDataItem', () => {
		describe('with mockup server', () => {
			let mockupServer: MockupServer;
			let connectionHandler: ConnectionHandler;

			before(async function () {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				await mockupServer.start();
				connectionHandler= new ConnectionHandler();
				connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
				await connectionHandler.connect();
			});

			after(async () => {
				await connectionHandler.disconnect();
				await mockupServer.shutdown();
			});

			it('should subscribe', async () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = '0';
				options.dataType = 'boolean';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
				ciOptions.nodeId.identifier = 'trigger';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				options.cIData = ciOptions;

				const dataItem = DataItemFactory.create<boolean>(options, connectionHandler);
				await connectionHandler.connect();
				await new Promise((resolve) => dataItem.on('changed', resolve));
				expect(dataItem.value).to.equal(false);
			});

			it('should subscribe, disconnect and resubscribe', async () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = '0';
				options.dataType = 'boolean';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
				ciOptions.nodeId.identifier = 'trigger';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				options.cIData = ciOptions;

				const dataItem = DataItemFactory.create<boolean>(options, connectionHandler);
				await connectionHandler.connect();
				await new Promise((resolve) => dataItem.on('changed', resolve));
				await connectionHandler.disconnect();
				await connectionHandler.connect();

				await new Promise((resolve) => dataItem.on('changed', resolve));
			}).timeout(5000);

			it('should write', async () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.defaultValue = '0';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
				ciOptions.nodeId.identifier = 'testNumber';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				options.cIData = ciOptions;

				const dataItem = DataItemFactory.create<number>(options, connectionHandler);
				const valueBefore = await dataItem.read();
				expect(valueBefore).to.be.equal(0);
				await dataItem.write(12);
				const value = await dataItem.read();
				expect(value).to.be.equal(12);
			});

			it('should fail while writing with wrong datatype', async () => {

				const options: DataItemModel = getEmptyDataItemModel();
				options.dataType = 'number';
				options.defaultValue = '0';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
				ciOptions.nodeId.identifier = 'testNumber';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				options.cIData = ciOptions;

				const dataItem = new OpcUaDataItem<number>(options, connectionHandler);
				await expect(dataItem.write(22)).to.be.rejectedWith('datatype abc must be registered');
			});

			it('should fail while writing with wrong datatype', async () => {
				const options: DataItemModel = getEmptyDataItemModel();
				options.dataType = 'boolean';
				options.defaultValue = '0';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
				ciOptions.nodeId.identifier = 'testNumber';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				options.cIData = ciOptions;

				const dataItem = new OpcUaDataItem<boolean>(options, connectionHandler);
				await expect(dataItem.write(22)).to.be.rejectedWith(
					'Invalid variant arrayType: Scalar  dataType: Boolean value:22 (javascript type = number )');
				await expect(dataItem.write('abc')).to.be.rejectedWith(
					'Invalid variant arrayType: Scalar  dataType: Boolean value:abc (javascript type = string )');
			});
		});
	});
});

