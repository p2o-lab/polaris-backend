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
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/lockview.json';
import {MockupServer} from '../../../../_utils';
import {LockView8} from './LockView8';
import {LockView8Mockup} from './LockView8.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView8', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/LockView8',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();

		it('should create LockView8', async () => {
			const da1 = new LockView8(dataAssemblyOptions, emptyOPCUAConnection);
			expect(da1).to.be.not.undefined;
			expect(da1.communication).to.be.not.undefined;
			expect(da1.wqc).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(8000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new LockView8Mockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');

			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(8000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const da1 = new LockView8(dataAssemblyOptions, connection);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect(da1.communication.WQC.value).equal(0);
			expect(da1.communication.Logic.value).equal(false);
			expect(da1.communication.Out.value).equal(false);
			expect(da1.communication.OutQC.value).equal(0);

			expect(da1.communication.In1En.value).equal(false);
			expect(da1.communication.In1.value).equal(false);
			expect(da1.communication.In1QC.value).equal(0);
			expect(da1.communication.In1Inv.value).equal(false);
			expect(da1.communication.In1Txt.value).equal('testText');

			expect(da1.communication.In2En.value).equal(false);
			expect(da1.communication.In2.value).equal(false);
			expect(da1.communication.In2QC.value).equal(0);
			expect(da1.communication.In2Inv.value).equal(false);
			expect(da1.communication.In2Txt.value).equal('testText');

			expect(da1.communication.In3En.value).equal(false);
			expect(da1.communication.In3.value).equal(false);
			expect(da1.communication.In3QC.value).equal(0);
			expect(da1.communication.In3Inv.value).equal(false);
			expect(da1.communication.In3Txt.value).equal('testText');

			expect(da1.communication.In8En.value).equal(false);
			expect(da1.communication.In8.value).equal(false);
			expect(da1.communication.In8QC.value).equal(0);
			expect(da1.communication.In8Inv.value).equal(false);
			expect(da1.communication.In8Txt.value).equal('testText');

			expect(da1.communication.In5En.value).equal(false);
			expect(da1.communication.In5.value).equal(false);
			expect(da1.communication.In5QC.value).equal(0);
			expect(da1.communication.In5Inv.value).equal(false);
			expect(da1.communication.In5Txt.value).equal('testText');

			expect(da1.communication.In6En.value).equal(false);
			expect(da1.communication.In6.value).equal(false);
			expect(da1.communication.In6QC.value).equal(0);
			expect(da1.communication.In6Inv.value).equal(false);
			expect(da1.communication.In6Txt.value).equal('testText');

			expect(da1.communication.In7En.value).equal(false);
			expect(da1.communication.In7.value).equal(false);
			expect(da1.communication.In7QC.value).equal(0);
			expect(da1.communication.In7Inv.value).equal(false);
			expect(da1.communication.In7Txt.value).equal('testText');

			expect(da1.communication.In8En.value).equal(false);
			expect(da1.communication.In8.value).equal(false);
			expect(da1.communication.In8QC.value).equal(0);
			expect(da1.communication.In8Inv.value).equal(false);
			expect(da1.communication.In8Txt.value).equal('testText');
		}).timeout(8000);
	});
});
