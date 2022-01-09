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

import {OpcUaConnection} from '../../../../connection';
import {BinMan} from './BinMan';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../_utils';
import {BinManMockup, getBinManOptions} from './BinMan.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMan', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getBinManOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create BinMan', () => {

			const dataAssemblyController = new BinMan(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController.communication.VOut).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VState0).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VState1).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VMan).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VRbk).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VFbk).to.not.equal(undefined);

			expect(dataAssemblyController.defaultReadDataItem).equal(dataAssemblyController.communication.VOut);
			expect(dataAssemblyController.defaultReadDataItemType).to.equal('boolean');
			expect(dataAssemblyController.defaultWriteDataItem).equal(dataAssemblyController.communication.VMan);
			expect(dataAssemblyController.defaultWriteDataItemType).to.equal('boolean');
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const binManMockup = new BinManMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			dataAssemblyOptions = binManMockup.getDataAssemblyOptions();
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

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as BinMan;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.OSLevel.value).to.equal(0);
			expect(dataAssemblyController.communication.VOut.value).to.equal(false);
			expect(dataAssemblyController.communication.VMan.value).to.equal(false);
			expect(dataAssemblyController.communication.VRbk.value).to.equal(false);
			expect(dataAssemblyController.communication.VFbk.value).to.equal(false);
			expect(dataAssemblyController.communication.VState0.value).to.equal('off');
			expect(dataAssemblyController.communication.VState1.value).to.equal('on');
		}).timeout(4000);
	});
});
