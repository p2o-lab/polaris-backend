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
import {MockupServer} from '../../../../../_utils';
import {LockView16} from './LockView16';
import {getLockView16DataAssemblyModel, LockView16Mockup} from './LockView16.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';
import {BaseDataItem} from '../../../dataItem/DataItem';
import {MTPDataTypes} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView16', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const emptyOPCUAConnection = new ConnectionHandler();
		options = getLockView16DataAssemblyModel(2, 'Variable', 'Variable');

		it('should create LockView16', async () => {
			const dataAssembly = new LockView16(options, emptyOPCUAConnection, true);
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.dataItems).to.be.not.undefined;
			expect(dataAssembly.wqc).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(8000);
			mockupServer = new MockupServer();
			const lockView16Mockup =new LockView16Mockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = lockView16Mockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			await connectionHandler.connect(adapterId);
		});

		afterEach(async function () {
			this.timeout(8000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new LockView16(options, connectionHandler, true);
			await dataAssembly.subscribe();
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => (dataAssembly.dataItems.In16Txt as BaseDataItem<string>).on('changed', resolve)));
			
			expect(dataAssembly.wqc.WQC).equal(0);
			expect(dataAssembly.dataItems.Logic.value).equal(false);
			expect(dataAssembly.dataItems.Out.value).equal(false);
			expect(dataAssembly.dataItems.OutQC.value).equal(0);

			expect(dataAssembly.dataItems.In1En.value).equal(false);
			expect(dataAssembly.dataItems.In1.value).equal(false);
			expect(dataAssembly.dataItems.In1QC.value).equal(0);
			expect(dataAssembly.dataItems.In1Inv.value).equal(false);
			expect(dataAssembly.dataItems.In1Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In2En.value).equal(false);
			expect(dataAssembly.dataItems.In2.value).equal(false);
			expect(dataAssembly.dataItems.In2QC.value).equal(0);
			expect(dataAssembly.dataItems.In2Inv.value).equal(false);
			expect(dataAssembly.dataItems.In2Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In3En.value).equal(false);
			expect(dataAssembly.dataItems.In3.value).equal(false);
			expect(dataAssembly.dataItems.In3QC.value).equal(0);
			expect(dataAssembly.dataItems.In3Inv.value).equal(false);
			expect(dataAssembly.dataItems.In3Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In4En.value).equal(false);
			expect(dataAssembly.dataItems.In4.value).equal(false);
			expect(dataAssembly.dataItems.In4QC.value).equal(0);
			expect(dataAssembly.dataItems.In4Inv.value).equal(false);
			expect(dataAssembly.dataItems.In4Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In5En.value).equal(false);
			expect(dataAssembly.dataItems.In5.value).equal(false);
			expect(dataAssembly.dataItems.In5QC.value).equal(0);
			expect(dataAssembly.dataItems.In5Inv.value).equal(false);
			expect(dataAssembly.dataItems.In5Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In6En.value).equal(false);
			expect(dataAssembly.dataItems.In6.value).equal(false);
			expect(dataAssembly.dataItems.In6QC.value).equal(0);
			expect(dataAssembly.dataItems.In6Inv.value).equal(false);
			expect(dataAssembly.dataItems.In6Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In7En.value).equal(false);
			expect(dataAssembly.dataItems.In7.value).equal(false);
			expect(dataAssembly.dataItems.In7QC.value).equal(0);
			expect(dataAssembly.dataItems.In7Inv.value).equal(false);
			expect(dataAssembly.dataItems.In7Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In8En.value).equal(false);
			expect(dataAssembly.dataItems.In8.value).equal(false);
			expect(dataAssembly.dataItems.In8QC.value).equal(0);
			expect(dataAssembly.dataItems.In8Inv.value).equal(false);
			expect(dataAssembly.dataItems.In8Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In9En.value).equal(false);
			expect(dataAssembly.dataItems.In9.value).equal(false);
			expect(dataAssembly.dataItems.In9QC.value).equal(0);
			expect(dataAssembly.dataItems.In9Inv.value).equal(false);
			expect(dataAssembly.dataItems.In9Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In10En.value).equal(false);
			expect(dataAssembly.dataItems.In10.value).equal(false);
			expect(dataAssembly.dataItems.In10QC.value).equal(0);
			expect(dataAssembly.dataItems.In10Inv.value).equal(false);
			expect(dataAssembly.dataItems.In10Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In11En.value).equal(false);
			expect(dataAssembly.dataItems.In11.value).equal(false);
			expect(dataAssembly.dataItems.In11QC.value).equal(0);
			expect(dataAssembly.dataItems.In11Inv.value).equal(false);
			expect(dataAssembly.dataItems.In11Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In12En.value).equal(false);
			expect(dataAssembly.dataItems.In12.value).equal(false);
			expect(dataAssembly.dataItems.In12QC.value).equal(0);
			expect(dataAssembly.dataItems.In12Inv.value).equal(false);
			expect(dataAssembly.dataItems.In12Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In13En.value).equal(false);
			expect(dataAssembly.dataItems.In13.value).equal(false);
			expect(dataAssembly.dataItems.In13QC.value).equal(0);
			expect(dataAssembly.dataItems.In13Inv.value).equal(false);
			expect(dataAssembly.dataItems.In13Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In14En.value).equal(false);
			expect(dataAssembly.dataItems.In14.value).equal(false);
			expect(dataAssembly.dataItems.In14QC.value).equal(0);
			expect(dataAssembly.dataItems.In14Inv.value).equal(false);
			expect(dataAssembly.dataItems.In14Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In15En.value).equal(false);
			expect(dataAssembly.dataItems.In15.value).equal(false);
			expect(dataAssembly.dataItems.In15QC.value).equal(0);
			expect(dataAssembly.dataItems.In15Inv.value).equal(false);
			expect(dataAssembly.dataItems.In15Txt.value).equal('testText');

			expect(dataAssembly.dataItems.In16En.value).equal(false);
			expect(dataAssembly.dataItems.In16.value).equal(false);
			expect(dataAssembly.dataItems.In16QC.value).equal(0);
			expect(dataAssembly.dataItems.In16Inv.value).equal(false);
			expect(dataAssembly.dataItems.In16Txt.value).equal('testText');
		}).timeout(8000);
	});
});
