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
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './IndicatorElement.spec.json';
import * as baseDataAssemblyOptionsStatic from './IndicatorElementStatic.spec.json';

import {IndicatorElement} from './IndicatorElement';
import {MockupServer} from '../../../_utils';
import {IndicatorElementMockup} from './IndicatorElement.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('IndicatorElement', () => {

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create IndicatorElement, static WQC', () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
				dataItems: baseDataAssemblyOptionsStatic
			};
			const dataAssemblyController = new IndicatorElement(dataAssemblyOptions, emptyOPCUAConnection) ;
			expect(dataAssemblyController.communication.WQC).to.equal(undefined);
			expect(dataAssemblyController.wqc.WQC).to.equal(0);
		});
		it('should create IndicatorElement, dynamic WQC', () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
				dataItems: baseDataAssemblyOptions
			};
			const dataAssemblyController = new IndicatorElement(dataAssemblyOptions, emptyOPCUAConnection) ;
			expect(dataAssemblyController.communication.WQC).to.not.be.undefined;
			expect(dataAssemblyController.wqc.WQC).to.be.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		const dataAssemblyOptions: DataAssemblyOptions = {
			name: 'Variable',
			metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
			dataItems: baseDataAssemblyOptions
		};

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new IndicatorElementMockup(	mockupServer.nameSpace,	mockupServer.rootObject,'Variable');
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

			const dataAssemblyController = new IndicatorElement(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.WQC.value).equal(0);
		}).timeout(4000);
	});
});
