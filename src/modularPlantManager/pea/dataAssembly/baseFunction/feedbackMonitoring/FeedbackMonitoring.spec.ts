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
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {FeedbackMonitoring} from './FeedbackMonitoring';
import {MockupServer} from '../../../../_utils';
import {FeedbackMonitoringMockup} from './FeedbackMonitoring.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getMonBinVlvDataAssemblyModel} from '../../activeElement/vlv/binVlv/monBinVlv/MonBinVlv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoring', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();

		it('should create FeedbackMonitoring', () => {

			options = getMonBinVlvDataAssemblyModel(2, 'Variable', 'Variable');
			const dataAssembly = new FeedbackMonitoring(options, connectionHandler);
			expect(dataAssembly.MonEn).to.not.to.undefined;
			expect(dataAssembly.MonSafePos).to.not.to.undefined;
			expect(dataAssembly.MonStatErr).to.not.to.undefined;
			expect(dataAssembly.MonDynErr).to.not.to.undefined;
			expect(dataAssembly.MonStatTi).to.not.to.undefined;
			expect(dataAssembly.MonDynTi).to.not.to.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new FeedbackMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new FeedbackMonitoring(options, connectionHandler) as any;
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.MonEn.value).equal(false);
			expect(dataAssembly.MonSafePos.value).equal(false);
			expect(dataAssembly.MonStatErr.value).equal(false);
			expect(dataAssembly.MonDynErr.value).equal(false);
			expect(dataAssembly.MonStatTi.value).equal(0);
			expect(dataAssembly.MonDynTi.value).equal(0);
		}).timeout(5000);
	});
});
