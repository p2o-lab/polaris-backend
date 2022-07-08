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
import {LimitMonitoring} from './LimitMonitoring';
import {MockupServer} from '../../../../_utils';
import {LimitMonitoringMockup} from './LimitMonitoring.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getAnaMonDataAssemblyModel} from '../../indicatorElement/AnaView/AnaMon/AnaMon.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoring', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getAnaMonDataAssemblyModel(2, 'Variable', 'Variable') as DataAssemblyModel;

		it('should create LimitMonitoring', async () => {

			const limitMonitoring = new LimitMonitoring(options, connectionHandler);

			expect(limitMonitoring).to.not.be.undefined;

			expect(limitMonitoring.VAHEn).to.not.be.undefined;
			expect(limitMonitoring.VAHLim).to.not.be.undefined;
			expect(limitMonitoring.VAHAct).to.not.be.undefined;

			expect(limitMonitoring.VWHEn).to.not.be.undefined;
			expect(limitMonitoring.VWHLim).to.not.be.undefined;
			expect(limitMonitoring.VWHAct).to.not.be.undefined;

			expect(limitMonitoring.VTHEn).to.not.be.undefined;
			expect(limitMonitoring.VTHLim).to.not.be.undefined;
			expect(limitMonitoring.VTHAct).to.not.be.undefined;

			expect(limitMonitoring.VTLEn).to.not.be.undefined;
			expect(limitMonitoring.VTLLim).to.not.be.undefined;
			expect(limitMonitoring.VTLAct).to.not.be.undefined;

			expect(limitMonitoring.VWLEn).to.not.be.undefined;
			expect(limitMonitoring.VWLLim).to.not.be.undefined;
			expect(limitMonitoring.VWLAct).to.not.be.undefined;

			expect(limitMonitoring.VALEn).to.not.be.undefined;
			expect(limitMonitoring.VALLim).to.not.be.undefined;
			expect(limitMonitoring.VALAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new LimitMonitoringMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'Ana');
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

			const limitMonitoring = new LimitMonitoring(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => limitMonitoring.on('changed', resolve)));
			
			expect(limitMonitoring.VAHEn.value).to.equal(false);
			expect(limitMonitoring.VAHLim.value).to.equal(0);
			expect(limitMonitoring.VAHAct.value).to.equal(false);

			expect(limitMonitoring.VWHEn.value).to.equal(false);
			expect(limitMonitoring.VWHLim.value).to.equal(0);
			expect(limitMonitoring.VWHAct.value).to.equal(false);

			expect(limitMonitoring.VTHEn.value).to.equal(false);
			expect(limitMonitoring.VTHLim.value).to.equal(0);
			expect(limitMonitoring.VTHAct.value).to.equal(false);

			expect(limitMonitoring.VTLEn.value).to.equal(false);
			expect(limitMonitoring.VTLLim.value).to.equal(0);
			expect(limitMonitoring.VTLAct.value).to.equal(false);

			expect(limitMonitoring.VWLEn.value).to.equal(false);
			expect(limitMonitoring.VWLLim.value).to.equal(0);
			expect(limitMonitoring.VWLAct.value).to.equal(false);

			expect(limitMonitoring.VALEn.value).to.equal(false);
			expect(limitMonitoring.VALLim.value).to.equal(0);
			expect(limitMonitoring.VALAct.value).to.equal(false);
		}).timeout(5000);
	});
});
