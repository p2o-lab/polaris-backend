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
import {MockupServer} from '../../../../_utils';
import {getLimitMonitoringDataItemModel, LimitMonitoringMockup} from './LimitMonitoring.mockup';
import {LimitMonitoringRuntime} from './LimitMonitoring';
import { ConnectionHandler } from 'src/modularPlantManager/pea/connectionHandler/ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoringMockup', () => {

	describe('static', () => {

		let mockupServer: MockupServer;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
		});

		describe('DIntLimitMonitoring', () => {

			it('should create DIntLimitMonitoring', async () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'DInt');
				expect(mockup).to.not.be.undefined;
			});

			it('static DataItemOptions', () => {
				const options = getLimitMonitoringDataItemModel(1, 'Test', 'DInt');

				expect(Object.keys(options).length).to.equal(18);
				expect(options.find(i => i.name === 'VAHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLAct')).to.not.be.undefined;
			});

			it('dynamic DataItemOptions', () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'DInt');
				const options = mockup.getDataItemModel();

				expect(Object.keys(options).length).to.equal(18);
				expect(options.find(i => i.name === 'VAHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLAct')).to.not.be.undefined;
			});

		});

		describe('AnaLimitMonitoring', () => {

			it('should create AnaLimitMonitoring', async () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'Ana');
				expect(mockup).to.not.be.undefined;
			});

			it('static AnaLimitMonitoring DataItemOptions', () => {
				const options = getLimitMonitoringDataItemModel(1, 'Test', 'Ana');

				expect(Object.keys(options).length).to.equal(18);
				expect(options.find(i => i.name === 'VAHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLAct')).to.not.be.undefined;
			});

			it('dynamic AnaLimitMonitoring DataItemOptions', () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'Ana');

				const options = mockup.getDataItemModel();

				expect(Object.keys(options).length).to.equal(18);
				expect(options.find(i => i.name === 'VAHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VAHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTHAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VALAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VWLAct')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLEn')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLLim')).to.not.be.undefined;
				expect(options.find(i => i.name === 'VTLAct')).to.not.be.undefined;
			});
		});

	});

	describe('dynamic', () => {

		describe('AnaLimitMonitoring', () => {

			let mockupServer: MockupServer;
			let connectionHandler: ConnectionHandler;

			beforeEach(async function () {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				new LimitMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'Ana');
				await mockupServer.start();
				connectionHandler= new ConnectionHandler();
				connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
				await connectionHandler.connect();
			});
			afterEach(async () => {
				await connectionHandler.disconnect();
				await mockupServer.shutdown();
			});

			it('set and get VAHLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VAHLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VAHLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VWHLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VWHLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VWHLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VTHLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VTHLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VTHLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VTLLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VTLLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VTLLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VALLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VALLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VALLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VWLLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VWLLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VWLLim', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

		});


		describe('DIntLimitMonitoring', () => {

			let mockupServer: MockupServer;
			let connectionHandler: ConnectionHandler;
			beforeEach(async function () {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				new LimitMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'DInt');
				await mockupServer.start();
				connectionHandler= new ConnectionHandler();
				connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
				await connectionHandler.connect();
			});
			afterEach(async () => {
				await connectionHandler.disconnect();
				await mockupServer.shutdown();
			});

			it('set and get VAHLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VWHLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VTHLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VTLLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VALLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);

			it('set and get VWLLim', async () => {
				await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
				await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.RpmMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
		});

	});
});
