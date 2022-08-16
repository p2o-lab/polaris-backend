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
import {FeedbackMonitoring} from './FeedbackMonitoring';
import {MockupServer} from '../../../../_utils';
import {FeedbackMonitoringMockup} from './FeedbackMonitoring.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getMonBinVlvDataAssemblyModel} from '../../activeElement/vlv/binVlv/monBinVlv/MonBinVlv.mockup';
import {DataAssemblyFactory} from '../../DataAssemblyFactory';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';
import {MonBinVlvDataItems} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoring', () => {

	const connectionHandler = new ConnectionHandler();
	const referenceDataAssemblyModel = getMonBinVlvDataAssemblyModel(2, 'Variable', 'Variable');
	const referenceDataAssembly = DataAssemblyFactory.create(referenceDataAssemblyModel, connectionHandler);

	describe('static', () => {

		it('should create FeedbackMonitoring', () => {
			const baseFunction = new FeedbackMonitoring(referenceDataAssembly.dataItems as MonBinVlvDataItems);
			expect(baseFunction.dataItems.MonEn).to.not.to.undefined;
			expect(baseFunction.dataItems.MonSafePos).to.not.to.undefined;
			expect(baseFunction.dataItems.MonStatErr).to.not.to.undefined;
			expect(baseFunction.dataItems.MonDynErr).to.not.to.undefined;
			expect(baseFunction.dataItems.MonStatTi).to.not.to.undefined;
			expect(baseFunction.dataItems.MonDynTi).to.not.to.undefined;
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new FeedbackMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const baseFunction = new FeedbackMonitoring(referenceDataAssembly.dataItems as MonBinVlvDataItems);
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
			expect(baseFunction.dataItems.MonEn.value).equal(false);
			expect(baseFunction.dataItems.MonSafePos.value).equal(false);
			expect(baseFunction.dataItems.MonStatErr.value).equal(false);
			expect(baseFunction.dataItems.MonDynErr.value).equal(false);
			expect(baseFunction.dataItems.MonStatTi.value).equal(0);
			expect(baseFunction.dataItems.MonDynTi.value).equal(0);
		}).timeout(5000);
	});
});
