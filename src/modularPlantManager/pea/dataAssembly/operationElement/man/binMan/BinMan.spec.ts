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
import * as baseDataAssemblyOptions from './BinMan.spec.json';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../_utils';
import {BinManMockup} from './BinMan.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMan', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/BinMan',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create BinMan', () => {
			//TODO new BinMan()
			const da1: BinMan = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as BinMan;
			expect(da1.communication.VOut).to.not.equal(undefined);
			expect(da1.communication.VState0).to.not.equal(undefined);
			expect(da1.communication.VState1).to.not.equal(undefined);
			expect(da1.communication.VMan).to.not.equal(undefined);
			expect(da1.communication.VRbk).to.not.equal(undefined);
			expect(da1.communication.VFbk).to.not.equal(undefined);
			expect(da1.defaultReadDataItem).equal(da1.communication.VOut);
			expect(da1.defaultReadDataItemType).to.equal('boolean');
			expect(da1.defaultWriteDataItem).equal(da1.communication.VMan);
			expect(da1.defaultWriteDataItemType).to.equal('boolean');
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new BinManMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
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

			//TODO new BinMan()

			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as BinMan;
			const pv =  da1.subscribe();
			await connection.startMonitoring();
			await pv;

			expect(da1.communication.OSLevel.value).to.equal(0);

			expect(da1.communication.VOut.value).to.equal(false);
			expect(da1.communication.VMan.value).to.equal(false);
			expect(da1.communication.VRbk.value).to.equal(false);
			expect(da1.communication.VFbk.value).to.equal(false);
			expect(da1.communication.VState0.value).to.equal('off');
			expect(da1.communication.VState1.value).to.equal('on');
		}).timeout(4000);
	});
});
