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
import * as baseDataAssemblyOptions from '../../../../../../tests/anamon.json';
import {LimitMonitoring} from './LimitMonitoring';
import {DataAssemblyController} from '../../DataAssemblyController';
import {AnaMon} from '../../indicatorElement';
import {MockupServer} from '../../../../_utils';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {LimitMonitoringDAMockup} from './LimitMonitoringDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoring', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaMon',
		dataItems: baseDataAssemblyOptions
	};

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create LimitMonitoring', async () => {

			const da1 = new AnaMon(dataAssemblyOptions, emptyOPCUAConnection);
			const limitMonitoring = new LimitMonitoring(da1);

			expect(limitMonitoring).to.not.be.undefined;

			expect(da1.communication.VAHEn).to.not.be.undefined;
			expect(da1.communication.VAHLim).to.not.be.undefined;
			expect(da1.communication.VAHAct).to.not.be.undefined;

			expect(da1.communication.VWHEn).to.not.be.undefined;
			expect(da1.communication.VWHLim).to.not.be.undefined;
			expect(da1.communication.VWHAct).to.not.be.undefined;

			expect(da1.communication.VTHEn).to.not.be.undefined;
			expect(da1.communication.VTHLim).to.not.be.undefined;
			expect(da1.communication.VTHAct).to.not.be.undefined;

			expect(da1.communication.VTLEn).to.not.be.undefined;
			expect(da1.communication.VTLLim).to.not.be.undefined;
			expect(da1.communication.VTLAct).to.not.be.undefined;

			expect(da1.communication.VWLEn).to.not.be.undefined;
			expect(da1.communication.VWLLim).to.not.be.undefined;
			expect(da1.communication.VWLAct).to.not.be.undefined;

			expect(da1.communication.VALEn).to.not.be.undefined;
			expect(da1.communication.VALLim).to.not.be.undefined;
			expect(da1.communication.VALAct).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: LimitMonitoringDAMockup<any>;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new LimitMonitoringDAMockup(
				mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject,
				'Variable', DataType.Double);
			//TODO: do for Int32
			await mockupServer.start();
			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334', '', '');
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			// set namespaceUrl
			for (const key in dataAssemblyOptions.dataItems as any) {
				//skip static values
				if ((typeof (dataAssemblyOptions.dataItems as any)[key] != 'string')) {
					(dataAssemblyOptions.dataItems as any)[key].namespaceIndex = namespaceUrl;
				}
			}
			const da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new LimitMonitoring(da1);
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;
			
			expect(da1.communication.VAHEn.value).to.equal(false);
			expect(da1.communication.VAHLim.value).to.equal(0);
			expect(da1.communication.VAHAct.value).to.equal(false);

			expect(da1.communication.VWHEn.value).to.equal(false);
			expect(da1.communication.VWHLim.value).to.equal(0);
			expect(da1.communication.VWHAct.value).to.equal(false);

			expect(da1.communication.VTHEn.value).to.equal(false);
			expect(da1.communication.VTHLim.value).to.equal(0);
			expect(da1.communication.VTHAct.value).to.equal(false);

			expect(da1.communication.VTLEn.value).to.equal(false);
			expect(da1.communication.VTLLim.value).to.equal(0);
			expect(da1.communication.VTLAct.value).to.equal(false);

			expect(da1.communication.VWLEn.value).to.equal(false);
			expect(da1.communication.VWLLim.value).to.equal(0);
			expect(da1.communication.VWLAct.value).to.equal(false);

			expect(da1.communication.VALEn.value).to.equal(false);
			expect(da1.communication.VALLim.value).to.equal(0);
			expect(da1.communication.VALAct.value).to.equal(false);
		}).timeout(5000);
	});
});
