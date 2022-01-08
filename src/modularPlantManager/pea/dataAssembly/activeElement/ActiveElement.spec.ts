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

import {OpcUaConnection} from '../../connection';
import {ActiveElement} from './ActiveElement';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../_utils';
import {ActiveElementMockup, getActiveElementOptions} from './ActiveElement.mockup';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ActiveElement', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		it('should create ActiveElement', () => {
			const emptyOPCUAConnection = new OpcUaConnection();
			emptyOPCUAConnection.initialize({endpoint : ''});
			dataAssemblyOptions = getActiveElementOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;
			const dataAssemblyController = new ActiveElement(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController).to.be.not.undefined;
			expect(dataAssemblyController.wqc).to.be.not.undefined;
			expect(dataAssemblyController.osLevel).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new ActiveElementMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dataAssemblyOptions = mockup.getDataAssemblyOptions();
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint : mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = new ActiveElement(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.WQC.value).equal(0);
			expect(dataAssemblyController.communication.OSLevel.value).equal(0);
		}).timeout(4000);
	});
});
