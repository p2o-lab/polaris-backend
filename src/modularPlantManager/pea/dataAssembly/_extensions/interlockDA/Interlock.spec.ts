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
import * as baseDataAssemblyOptions from '../../../../../../tests/monbinvlv.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {MonBinVlv} from '../../activeElement';
import {Interlock} from './Interlock';
import {MockupServer} from '../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {InterlockDAMockup} from './InterlockDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Interlock', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/MonBinVlv',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create Interlock', () => {
			const da1 = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as MonBinVlv;
			const interlock = new Interlock(da1); //this will set communication variables
			expect(interlock).to.not.to.undefined;
			expect(da1.communication.PermEn).to.not.to.undefined;
			expect(da1.communication.Permit).to.not.to.undefined;
			expect(da1.communication.IntlEn).to.not.to.undefined;
			expect(da1.communication.Interlock).to.not.to.undefined;
			expect(da1.communication.ProtEn).to.not.to.undefined;
			expect(da1.communication.Protect).to.not.to.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: InterlockDAMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new InterlockDAMockup(
				mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject,
				'Variable');
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
			new Interlock(da1);
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;

			expect(da1.communication.PermEn.value).equal(false);
			expect(da1.communication.Permit.value).equal(false);
			expect(da1.communication.IntlEn.value).equal(false);
			expect(da1.communication.Interlock.value).equal(false);
			expect(da1.communication.ProtEn.value).equal(false);
			expect(da1.communication.Protect.value).equal(false);
		}).timeout(5000);
	});
});