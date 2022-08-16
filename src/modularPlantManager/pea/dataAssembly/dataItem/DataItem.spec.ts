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
import {DataItemModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../_utils';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {OpcUaDataItem} from './DataItem';
import {DataItemFactory} from './DataItemFactory';
import {getEmptyCIDataModel, getEmptyDataItemModel} from './DataItem.mockup';
import {getEndpointDataModel} from '../../connectionHandler/ConnectionHandler.mockup';
import {Access} from '@p2olab/pimad-types';
import {BinProcessValueInMockup} from '../inputElement/processValueIn/BinProcessValueIn/BinProcessValueIn.mockup';
import {AnaProcessValueInMockup} from '../inputElement/processValueIn/AnaProcessValueIn/AnaProcessValueIn.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataItem', () => {

	describe('StaticDataItem', () => {

		describe('Type number', () => {

			it('should work with default value', () => {
				const dataItemModel: DataItemModel = getEmptyDataItemModel();
				dataItemModel.defaultValue = '1.2';
				dataItemModel.value = '1.2';
				dataItemModel.dataType = 'number';
				const dataItem = DataItemFactory.create<string>({dataItemModel: dataItemModel, dataType: 'number'});
				expect(dataItem.defaultValue).to.equal(1.2);
				expect(dataItem.value).to.equal(1.2);
			});

			it('should work without value', () => {
				const dataItemModel: DataItemModel = getEmptyDataItemModel();
				dataItemModel.defaultValue = '1.2';
				const dataItem = DataItemFactory.create<number>({dataItemModel: dataItemModel, dataType: 'number'});
				expect(dataItem.defaultValue).to.equal(1.2);
				expect(dataItem.value).to.equal(1.2);
			});
		});

		describe('Type string', () => {

			it('should work with float default value', () => {
				const dataItemModel: DataItemModel = getEmptyDataItemModel();
				dataItemModel.defaultValue = '1.2';
				dataItemModel.value = '1.2';
				const dataItem = DataItemFactory.create<string>({dataItemModel: dataItemModel, dataType: 'string'});
				expect(dataItem.value).to.equal('1.2');
			});

			it('should work with string default value', () => {
				const dataItemModel: DataItemModel = getEmptyDataItemModel();
				dataItemModel.defaultValue = 'abc';
				dataItemModel.value = 'abc';
				const dataItem = DataItemFactory.create<string>({dataItemModel: dataItemModel, dataType: 'string'});
				expect(dataItem.value).to.equal('abc');
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
			let adapterId: string;

			before(async function () {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				new BinProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
				const anaParam = new AnaProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable2');
				anaParam.scaleSettings.vSclMax = 20;
				await mockupServer.start();
				connectionHandler = new ConnectionHandler();
				adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			});

			after(async () => {
				await connectionHandler.disconnect();
				await mockupServer.shutdown();
			});

			it('should subscribe', async () => {
				const dataItemModel: DataItemModel = getEmptyDataItemModel();
				dataItemModel.defaultValue = '0';
				dataItemModel.dataType = 'boolean';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = Access.ReadWriteAccess;
				ciOptions.nodeId.identifier = 'Variable.VExt';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				dataItemModel.cIData = ciOptions;

				const dataItem = DataItemFactory.create<boolean>({dataItemModel: dataItemModel, dataType: 'boolean', connectionHandler: connectionHandler});
				await connectionHandler.connect(adapterId);
				await new Promise((resolve) => dataItem.on('changed', resolve));
				expect(dataItem.value).to.equal(false);
			});


			it('should write', async () => {
				const dataItemModel: DataItemModel = getEmptyDataItemModel();
				dataItemModel.defaultValue = '0';
				const ciOptions = getEmptyCIDataModel();
				ciOptions.nodeId.access = Access.ReadWriteAccess;
				ciOptions.nodeId.identifier = 'Variable2.VExt';
				ciOptions.nodeId.namespaceIndex = mockupServer.nameSpaceUri;
				dataItemModel.cIData = ciOptions;

				const dataItem = DataItemFactory.create<number>({dataItemModel: dataItemModel, dataType: 'number', connectionHandler: connectionHandler});
				const valueBefore = await dataItem.read();
				expect(valueBefore).to.be.equal(0);
				await dataItem.write(12);
				const value = await dataItem.read();
				expect(value).to.be.equal(12);
			});
		});
	});
});

