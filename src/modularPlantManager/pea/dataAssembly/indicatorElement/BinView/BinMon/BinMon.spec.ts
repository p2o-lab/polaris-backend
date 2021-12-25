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
import {BinMon} from './BinMon';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './BinMon.spec.json';
import {MockupServer} from '../../../../../_utils';
import {BinMonMockup} from './BinMon.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMon', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create BinMon', async () => {
			const da1: BinMon = new BinMon(dataAssemblyOptions, emptyOPCUAConnection);

			expect(da1.tagName).to.equal('Variable');
			expect(da1.tagDescription).to.equal('Test');
			
			expect(da1.communication.WQC).to.not.equal(undefined);
			expect(da1.communication.V).to.not.equal(undefined);
			expect(da1.communication.VState0).to.not.equal(undefined);
			expect(da1.communication.VState1).to.not.equal(undefined);
			expect(da1.communication.OSLevel).to.not.equal(undefined);
			expect(da1.communication.VFlutEn).to.not.equal(undefined);
			expect(da1.communication.VFlutTi).to.not.equal(undefined);
			expect(da1.communication.VFlutCnt).to.not.equal(undefined);
			expect(da1.communication.VFlutAct).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new BinMonMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');
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

			const da1: BinMon = new BinMon(dataAssemblyOptions, connection);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect(da1.communication.WQC.value).equal(0);
			expect(da1.communication.V.value).equal(false);
			expect(da1.communication.VState0.value).equal('state0_active');
			expect(da1.communication.VState1.value).equal('state1_active');

			expect(da1.communication.VFlutEn.value).equal(false);
			expect(da1.communication.VFlutAct.value).equal(false);
			expect(da1.communication.VFlutTi.value).equal(0);
			expect(da1.communication.VFlutCnt.value).equal(0);
		}).timeout(4000);
	});
});
