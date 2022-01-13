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
import {getLimitMonitoringDataItemOptions, LimitMonitoringMockup} from './LimitMonitoring.mockup';
import {OpcUaConnection} from '../../../connection';
import {LimitMonitoringRuntime} from './LimitMonitoring';

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
				const options = getLimitMonitoringDataItemOptions(1, 'Test', 'DInt') as LimitMonitoringRuntime;

				expect(Object.keys(options).length).to.equal(18);
				expect(options.VAHEn).to.not.be.undefined;
				expect(options.VAHLim).to.not.be.undefined;
				expect(options.VAHAct).to.not.be.undefined;
				expect(options.VWHEn).to.not.be.undefined;
				expect(options.VWHLim).to.not.be.undefined;
				expect(options.VWHAct).to.not.be.undefined;
				expect(options.VTHEn).to.not.be.undefined;
				expect(options.VTHLim).to.not.be.undefined;
				expect(options.VTHAct).to.not.be.undefined;
				expect(options.VALEn).to.not.be.undefined;
				expect(options.VALLim).to.not.be.undefined;
				expect(options.VALAct).to.not.be.undefined;
				expect(options.VWLEn).to.not.be.undefined;
				expect(options.VWLLim).to.not.be.undefined;
				expect(options.VWLAct).to.not.be.undefined;
				expect(options.VTLEn).to.not.be.undefined;
				expect(options.VTLLim).to.not.be.undefined;
				expect(options.VTLAct).to.not.be.undefined;
			});

			it('dynamic DataItemOptions', () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'DInt');
				const options = mockup.getDataItemOptions() as LimitMonitoringRuntime;

				expect(Object.keys(options).length).to.equal(18);
				expect(options.VAHEn).to.not.be.undefined;
				expect(options.VAHLim).to.not.be.undefined;
				expect(options.VAHAct).to.not.be.undefined;
				expect(options.VWHEn).to.not.be.undefined;
				expect(options.VWHLim).to.not.be.undefined;
				expect(options.VWHAct).to.not.be.undefined;
				expect(options.VTHEn).to.not.be.undefined;
				expect(options.VTHLim).to.not.be.undefined;
				expect(options.VTHAct).to.not.be.undefined;
				expect(options.VALEn).to.not.be.undefined;
				expect(options.VALLim).to.not.be.undefined;
				expect(options.VALAct).to.not.be.undefined;
				expect(options.VWLEn).to.not.be.undefined;
				expect(options.VWLLim).to.not.be.undefined;
				expect(options.VWLAct).to.not.be.undefined;
				expect(options.VTLEn).to.not.be.undefined;
				expect(options.VTLLim).to.not.be.undefined;
				expect(options.VTLAct).to.not.be.undefined;
			});

		});

		describe('AnaLimitMonitoring', () => {

			it('should create AnaLimitMonitoring', async () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'Ana');
				expect(mockup).to.not.be.undefined;
			});

			it('static AnaLimitMonitoring DataItemOptions', () => {
				const options = getLimitMonitoringDataItemOptions(1, 'Test', 'Ana') as LimitMonitoringRuntime;

				expect(Object.keys(options).length).to.equal(18);
				expect(options.VAHEn).to.not.be.undefined;
				expect(options.VAHLim).to.not.be.undefined;
				expect(options.VAHAct).to.not.be.undefined;
				expect(options.VWHEn).to.not.be.undefined;
				expect(options.VWHLim).to.not.be.undefined;
				expect(options.VWHAct).to.not.be.undefined;
				expect(options.VTHEn).to.not.be.undefined;
				expect(options.VTHLim).to.not.be.undefined;
				expect(options.VTHAct).to.not.be.undefined;
				expect(options.VALEn).to.not.be.undefined;
				expect(options.VALLim).to.not.be.undefined;
				expect(options.VALAct).to.not.be.undefined;
				expect(options.VWLEn).to.not.be.undefined;
				expect(options.VWLLim).to.not.be.undefined;
				expect(options.VWLAct).to.not.be.undefined;
				expect(options.VTLEn).to.not.be.undefined;
				expect(options.VTLLim).to.not.be.undefined;
				expect(options.VTLAct).to.not.be.undefined;
			});

			it('dynamic AnaLimitMonitoring DataItemOptions', () => {
				const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', 'Ana');

				const options = mockup.getDataItemOptions() as LimitMonitoringRuntime;

				expect(Object.keys(options).length).to.equal(18);
				expect(options.VAHEn).to.not.be.undefined;
				expect(options.VAHLim).to.not.be.undefined;
				expect(options.VAHAct).to.not.be.undefined;
				expect(options.VWHEn).to.not.be.undefined;
				expect(options.VWHLim).to.not.be.undefined;
				expect(options.VWHAct).to.not.be.undefined;
				expect(options.VTHEn).to.not.be.undefined;
				expect(options.VTHLim).to.not.be.undefined;
				expect(options.VTHAct).to.not.be.undefined;
				expect(options.VALEn).to.not.be.undefined;
				expect(options.VALLim).to.not.be.undefined;
				expect(options.VALAct).to.not.be.undefined;
				expect(options.VWLEn).to.not.be.undefined;
				expect(options.VWLLim).to.not.be.undefined;
				expect(options.VWLAct).to.not.be.undefined;
				expect(options.VTLEn).to.not.be.undefined;
				expect(options.VTLLim).to.not.be.undefined;
				expect(options.VTLAct).to.not.be.undefined;
			});
		});

	});

	describe('dynamic', () => {

		describe('AnaLimitMonitoring', () => {

			let mockupServer: MockupServer;
			let connection: OpcUaConnection;

			beforeEach(async function () {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				new LimitMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'Ana');
				await mockupServer.start();
				connection = new OpcUaConnection();
				connection.initialize({endpointUrl: mockupServer.endpoint});
				await connection.connect();
			});
			afterEach(async () => {
				await connection.disconnect();
				await mockupServer.shutdown();
			});

			it('set and get VAHLim', async () => {
				await connection.writeNode('Variable.VAHLim', mockupServer.nameSpaceUri, 1, 'Double');
				await connection.readNode('Variable.VAHLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VWHLim', async () => {
				await connection.writeNode('Variable.VWHLim', mockupServer.nameSpaceUri, 1, 'Double');
				await connection.readNode('Variable.VWHLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VTHLim', async () => {
				await connection.writeNode('Variable.VTHLim', mockupServer.nameSpaceUri, 1, 'Double');
				await connection.readNode('Variable.VTHLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VTLLim', async () => {
				await connection.writeNode('Variable.VTLLim', mockupServer.nameSpaceUri, 1, 'Double');
				await connection.readNode('Variable.VTLLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VALLim', async () => {
				await connection.writeNode('Variable.VALLim', mockupServer.nameSpaceUri, 1, 'Double');
				await connection.readNode('Variable.VALLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VWLLim', async () => {
				await connection.writeNode('Variable.VWLLim', mockupServer.nameSpaceUri, 1, 'Double');
				await connection.readNode('Variable.VWLLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			//TODO: get the rest of values

		});


		describe('DIntLimitMonitoring', () => {

			let mockupServer: MockupServer;
			let connection: OpcUaConnection;
			beforeEach(async function () {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				new LimitMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'DInt');
				await mockupServer.start();
				connection = new OpcUaConnection();
				connection.initialize({endpointUrl: mockupServer.endpoint});
				await connection.connect();
			});
			afterEach(async () => {
				await connection.disconnect();
				await mockupServer.shutdown();
			});

			it('set and get VAHLim', async () => {
				await connection.writeNode('Variable.VAHLim', mockupServer.nameSpaceUri, 1, 'Int32');
				await connection.readNode('Variable.VAHLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VWHLim', async () => {
				await connection.writeNode('Variable.VWHLim', mockupServer.nameSpaceUri, 1, 'Int32');
				await connection.readNode('Variable.VWHLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VTHLim', async () => {
				await connection.writeNode('Variable.VTHLim', mockupServer.nameSpaceUri, 1, 'Int32');
				await connection.readNode('Variable.VTHLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VTLLim', async () => {
				await connection.writeNode('Variable.VTLLim', mockupServer.nameSpaceUri, 1, 'Int32');
				await connection.readNode('Variable.VTLLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VALLim', async () => {
				await connection.writeNode('Variable.VALLim', mockupServer.nameSpaceUri, 1, 'Int32');
				await connection.readNode('Variable.VALLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			it('set and get VWLLim', async () => {
				await connection.writeNode('Variable.VWLLim', mockupServer.nameSpaceUri, 1, 'Int32');
				await connection.readNode('Variable.VWLLim', mockupServer.nameSpaceUri)
					.then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
			}).timeout(2000);
			//TODO: get the rest of values
		});

	});
});
