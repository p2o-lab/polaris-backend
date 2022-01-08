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

import {OpcUaConnection} from '../../../connection';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {LimitMonitoring} from './LimitMonitoring';
import {DataAssemblyController} from '../../DataAssemblyController';
import {AnaMon} from '../../indicatorElement';
import {MockupServer} from '../../../../_utils';
import {DataType} from 'node-opcua';
import {LimitMonitoringMockup} from './LimitMonitoring.mockup';
import {getAnaMonOptions} from '../../indicatorElement/AnaView/AnaMon/AnaMon.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoring', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getAnaMonOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create LimitMonitoring', async () => {

			const dataAssemblyController = new AnaMon(dataAssemblyOptions, emptyOPCUAConnection);
			const limitMonitoring = new LimitMonitoring(dataAssemblyController);

			expect(limitMonitoring).to.not.be.undefined;

			expect(dataAssemblyController.communication.VAHEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.VAHLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.VAHAct).to.not.be.undefined;

			expect(dataAssemblyController.communication.VWHEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.VWHLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.VWHAct).to.not.be.undefined;

			expect(dataAssemblyController.communication.VTHEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.VTHLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.VTHAct).to.not.be.undefined;

			expect(dataAssemblyController.communication.VTLEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.VTLLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.VTLAct).to.not.be.undefined;

			expect(dataAssemblyController.communication.VWLEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.VWLLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.VWLAct).to.not.be.undefined;

			expect(dataAssemblyController.communication.VALEn).to.not.be.undefined;
			expect(dataAssemblyController.communication.VALLim).to.not.be.undefined;
			expect(dataAssemblyController.communication.VALAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new LimitMonitoringMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'Ana');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new LimitMonitoring(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			
			expect(dataAssemblyController.communication.VAHEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VAHLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VAHAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VWHEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VWHLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VWHAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VTHEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VTHLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VTHAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VTLEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VTLLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VTLAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VWLEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VWLLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VWLAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VALEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VALLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VALAct.value).to.equal(false);
		}).timeout(5000);
	});
});
