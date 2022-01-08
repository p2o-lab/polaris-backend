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
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../../_utils';
import {LockView16} from './LockView16';
import {getLockView16Options, LockView16Mockup} from './LockView16.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView16', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getLockView16Options(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create LockView16', async () => {
			const dataAssemblyController = new LockView16(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController).to.be.not.undefined;
			expect(dataAssemblyController.communication).to.be.not.undefined;
			expect(dataAssemblyController.wqc).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(8000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const lockView16Mockup =new LockView16Mockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dataAssemblyOptions = lockView16Mockup.getDataAssemblyOptions();
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

			const dataAssemblyController = new LockView16(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.communication.In16Txt.on('changed', resolve)));
			
			expect(dataAssemblyController.communication.WQC.value).equal(0);
			expect(dataAssemblyController.communication.Logic.value).equal(false);
			expect(dataAssemblyController.communication.Out.value).equal(false);
			expect(dataAssemblyController.communication.OutQC.value).equal(0);

			expect(dataAssemblyController.communication.In1En.value).equal(false);
			expect(dataAssemblyController.communication.In1.value).equal(false);
			expect(dataAssemblyController.communication.In1QC.value).equal(0);
			expect(dataAssemblyController.communication.In1Inv.value).equal(false);
			expect(dataAssemblyController.communication.In1Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In2En.value).equal(false);
			expect(dataAssemblyController.communication.In2.value).equal(false);
			expect(dataAssemblyController.communication.In2QC.value).equal(0);
			expect(dataAssemblyController.communication.In2Inv.value).equal(false);
			expect(dataAssemblyController.communication.In2Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In3En.value).equal(false);
			expect(dataAssemblyController.communication.In3.value).equal(false);
			expect(dataAssemblyController.communication.In3QC.value).equal(0);
			expect(dataAssemblyController.communication.In3Inv.value).equal(false);
			expect(dataAssemblyController.communication.In3Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In4En.value).equal(false);
			expect(dataAssemblyController.communication.In4.value).equal(false);
			expect(dataAssemblyController.communication.In4QC.value).equal(0);
			expect(dataAssemblyController.communication.In4Inv.value).equal(false);
			expect(dataAssemblyController.communication.In4Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In5En.value).equal(false);
			expect(dataAssemblyController.communication.In5.value).equal(false);
			expect(dataAssemblyController.communication.In5QC.value).equal(0);
			expect(dataAssemblyController.communication.In5Inv.value).equal(false);
			expect(dataAssemblyController.communication.In5Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In6En.value).equal(false);
			expect(dataAssemblyController.communication.In6.value).equal(false);
			expect(dataAssemblyController.communication.In6QC.value).equal(0);
			expect(dataAssemblyController.communication.In6Inv.value).equal(false);
			expect(dataAssemblyController.communication.In6Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In7En.value).equal(false);
			expect(dataAssemblyController.communication.In7.value).equal(false);
			expect(dataAssemblyController.communication.In7QC.value).equal(0);
			expect(dataAssemblyController.communication.In7Inv.value).equal(false);
			expect(dataAssemblyController.communication.In7Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In8En.value).equal(false);
			expect(dataAssemblyController.communication.In8.value).equal(false);
			expect(dataAssemblyController.communication.In8QC.value).equal(0);
			expect(dataAssemblyController.communication.In8Inv.value).equal(false);
			expect(dataAssemblyController.communication.In8Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In9En.value).equal(false);
			expect(dataAssemblyController.communication.In9.value).equal(false);
			expect(dataAssemblyController.communication.In9QC.value).equal(0);
			expect(dataAssemblyController.communication.In9Inv.value).equal(false);
			expect(dataAssemblyController.communication.In9Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In10En.value).equal(false);
			expect(dataAssemblyController.communication.In10.value).equal(false);
			expect(dataAssemblyController.communication.In10QC.value).equal(0);
			expect(dataAssemblyController.communication.In10Inv.value).equal(false);
			expect(dataAssemblyController.communication.In10Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In11En.value).equal(false);
			expect(dataAssemblyController.communication.In11.value).equal(false);
			expect(dataAssemblyController.communication.In11QC.value).equal(0);
			expect(dataAssemblyController.communication.In11Inv.value).equal(false);
			expect(dataAssemblyController.communication.In11Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In12En.value).equal(false);
			expect(dataAssemblyController.communication.In12.value).equal(false);
			expect(dataAssemblyController.communication.In12QC.value).equal(0);
			expect(dataAssemblyController.communication.In12Inv.value).equal(false);
			expect(dataAssemblyController.communication.In12Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In13En.value).equal(false);
			expect(dataAssemblyController.communication.In13.value).equal(false);
			expect(dataAssemblyController.communication.In13QC.value).equal(0);
			expect(dataAssemblyController.communication.In13Inv.value).equal(false);
			expect(dataAssemblyController.communication.In13Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In14En.value).equal(false);
			expect(dataAssemblyController.communication.In14.value).equal(false);
			expect(dataAssemblyController.communication.In14QC.value).equal(0);
			expect(dataAssemblyController.communication.In14Inv.value).equal(false);
			expect(dataAssemblyController.communication.In14Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In15En.value).equal(false);
			expect(dataAssemblyController.communication.In15.value).equal(false);
			expect(dataAssemblyController.communication.In15QC.value).equal(0);
			expect(dataAssemblyController.communication.In15Inv.value).equal(false);
			expect(dataAssemblyController.communication.In15Txt.value).equal('testText');

			expect(dataAssemblyController.communication.In16En.value).equal(false);
			expect(dataAssemblyController.communication.In16.value).equal(false);
			expect(dataAssemblyController.communication.In16QC.value).equal(0);
			expect(dataAssemblyController.communication.In16Inv.value).equal(false);
			expect(dataAssemblyController.communication.In16Txt.value).equal('testText');
		}).timeout(8000);
	});
});
