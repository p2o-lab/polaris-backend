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
import {DIntMan} from './DIntMan';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../_utils';
import {DIntManMockup, getDIntManOptions} from './DIntMan.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntMan', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getDIntManOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create DIntMan',  () => {
			const dataAssemblyController: DIntMan = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as DIntMan;
			expect(dataAssemblyController.communication.VOut).to.not.equal(undefined);
			expect(dataAssemblyController.scaleSettings).to.not.be.undefined;
			expect(dataAssemblyController.unitSettings).to.not.be.undefined;
			expect(dataAssemblyController.valueLimitation).to.not.be.undefined;

			expect(dataAssemblyController.communication.VMan).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VRbk).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VFbk).to.not.equal(undefined);


			expect(dataAssemblyController.defaultReadDataItem).equal(dataAssemblyController.communication.VOut);
			expect(dataAssemblyController.defaultReadDataItemType).to.equal('number');
			expect(dataAssemblyController.defaultWriteDataItem).equal(dataAssemblyController.communication.VMan);
			expect(dataAssemblyController.defaultWriteDataItemType).to.equal('number');
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const dIntManMockup = new DIntManMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			dataAssemblyOptions = dIntManMockup.getDataAssemblyOptions();await mockupServer.start();
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

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as DIntMan;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.OSLevel.value).to.equal(0);
			expect(dataAssemblyController.communication.VOut.value).to.equal(0);
			expect(dataAssemblyController.communication.VMan.value).to.equal(0);
			expect(dataAssemblyController.communication.VRbk.value).to.equal(0);
			expect(dataAssemblyController.communication.VFbk.value).to.equal(0);
			expect(dataAssemblyController.communication.VUnit.value).equal(0);
			expect(dataAssemblyController.communication.VSclMin.value).equal(0);
			expect(dataAssemblyController.communication.VSclMax.value).equal(0);
			expect(dataAssemblyController.communication.VMin.value).equal(0);
			expect(dataAssemblyController.communication.VMax.value).equal(0);
		}).timeout(4000);
	});
});
