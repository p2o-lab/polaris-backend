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
import {LimitMonitoring} from './LimitMonitoring';
import {MockupServer} from '../../../../_utils';
import {LimitMonitoringMockup} from './LimitMonitoring.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaMonDataAssemblyModel} from '../../indicatorElement/AnaView/AnaMon/AnaMon.mockup';
import {DataAssemblyFactory} from '../../DataAssemblyFactory';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';
import {AnaMonDataItems} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoring', () => {

	const connectionHandler = new ConnectionHandler();
	const referenceDataAssemblyModel = getAnaMonDataAssemblyModel(2, 'Variable', 'Variable');
	const referenceDataAssembly = DataAssemblyFactory.create(referenceDataAssemblyModel, connectionHandler);

	describe('static', () => {


		it('should create LimitMonitoring', async () => {

			const limitMonitoring = new LimitMonitoring(referenceDataAssembly.dataItems as AnaMonDataItems);

			expect(limitMonitoring).to.not.be.undefined;

			expect(limitMonitoring.dataItems.VAHEn).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VAHLim).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VAHAct).to.not.be.undefined;

			expect(limitMonitoring.dataItems.VWHEn).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VWHLim).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VWHAct).to.not.be.undefined;

			expect(limitMonitoring.dataItems.VTHEn).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VTHLim).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VTHAct).to.not.be.undefined;

			expect(limitMonitoring.dataItems.VTLEn).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VTLLim).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VTLAct).to.not.be.undefined;

			expect(limitMonitoring.dataItems.VWLEn).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VWLLim).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VWLAct).to.not.be.undefined;

			expect(limitMonitoring.dataItems.VALEn).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VALLim).to.not.be.undefined;
			expect(limitMonitoring.dataItems.VALAct).to.not.be.undefined;
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
			new LimitMonitoringMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'Ana');
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

			const limitMonitoring = new LimitMonitoring(referenceDataAssembly.dataItems as AnaMonDataItems);
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => limitMonitoring.on('changed', resolve)));
			
			expect(limitMonitoring.dataItems.VAHEn.value).to.equal(false);
			expect(limitMonitoring.dataItems.VAHLim.value).to.equal(0);
			expect(limitMonitoring.dataItems.VAHAct.value).to.equal(false);

			expect(limitMonitoring.dataItems.VWHEn.value).to.equal(false);
			expect(limitMonitoring.dataItems.VWHLim.value).to.equal(0);
			expect(limitMonitoring.dataItems.VWHAct.value).to.equal(false);

			expect(limitMonitoring.dataItems.VTHEn.value).to.equal(false);
			expect(limitMonitoring.dataItems.VTHLim.value).to.equal(0);
			expect(limitMonitoring.dataItems.VTHAct.value).to.equal(false);

			expect(limitMonitoring.dataItems.VTLEn.value).to.equal(false);
			expect(limitMonitoring.dataItems.VTLLim.value).to.equal(0);
			expect(limitMonitoring.dataItems.VTLAct.value).to.equal(false);

			expect(limitMonitoring.dataItems.VWLEn.value).to.equal(false);
			expect(limitMonitoring.dataItems.VWLLim.value).to.equal(0);
			expect(limitMonitoring.dataItems.VWLAct.value).to.equal(false);

			expect(limitMonitoring.dataItems.VALEn.value).to.equal(false);
			expect(limitMonitoring.dataItems.VALLim.value).to.equal(0);
			expect(limitMonitoring.dataItems.VALAct.value).to.equal(false);
		}).timeout(5000);
	});
});
