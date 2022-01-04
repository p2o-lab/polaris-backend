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
import {DataAssemblyController} from '../../DataAssemblyController';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../activeElement/vlv/binVlv/monBinVlv/MonBinVlv.spec.json';
import {FeedbackMonitoring} from './FeedbackMonitoring';
import {MockupServer} from '../../../../_utils';
import {FeedbackMonitoringDAMockup} from './FeedbackMonitoringDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoring', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/MonBinVlv',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();

		it('should create FeedbackMonitoring', () => {
			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as any;
			const feedbackMonitoring = new FeedbackMonitoring(dataAssemblyController);
			expect(feedbackMonitoring).to.not.to.undefined;
			expect(dataAssemblyController.communication.MonEn).to.not.to.undefined;
			expect(dataAssemblyController.communication.MonSafePos).to.not.to.undefined;
			expect(dataAssemblyController.communication.MonStatErr).to.not.to.undefined;
			expect(dataAssemblyController.communication.MonDynErr).to.not.to.undefined;
			expect(dataAssemblyController.communication.MonStatTi).to.not.to.undefined;
			expect(dataAssemblyController.communication.MonDynTi).to.not.to.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new FeedbackMonitoringDAMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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

			new FeedbackMonitoring(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.MonEn.value).equal(false);
			expect(dataAssemblyController.communication.MonSafePos.value).equal(false);
			expect(dataAssemblyController.communication.MonStatErr.value).equal(false);
			expect(dataAssemblyController.communication.MonDynErr.value).equal(false);
			expect(dataAssemblyController.communication.MonStatTi.value).equal(0);
			expect(dataAssemblyController.communication.MonDynTi.value).equal(0);
		}).timeout(5000);
	});
});
