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
import {Vlv} from './Vlv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/monbinvlv.json';
import {MockupServer} from '../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {VlvMockup} from './Vlv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Vlv', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/',
		dataItems: baseDataAssemblyOptions
	};
	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create Vlv',  () => {

			const da1 = new Vlv(dataAssemblyOptions, emptyOPCUAConnection);
			expect(da1).to.be.not.undefined;
			expect(da1.osLevel).to.be.not.undefined;
			expect(da1.wqc).to.be.not.undefined;
			expect(da1.reset).to.be.not.undefined;
			expect(da1.opMode).to.be.not.undefined;
			expect(da1.interlock).to.be.not.undefined;

			expect(da1.communication.SafePos).to.be.not.undefined;
			expect(da1.communication.SafePosEn).to.be.not.undefined;
			expect(da1.communication.SafePosAct).to.be.not.undefined;
			expect(da1.communication.OpenAut).to.be.not.undefined;
			expect(da1.communication.OpenFbk).to.be.not.undefined;
			expect(da1.communication.OpenFbkCalc).to.be.not.undefined;
			expect(da1.communication.OpenOp).to.be.not.undefined;
			expect(da1.communication.CloseAut).to.be.not.undefined;
			expect(da1.communication.CloseFbk).to.be.not.undefined;
			expect(da1.communication.CloseFbkCalc).to.be.not.undefined;
			expect(da1.communication.CloseOp).to.be.not.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: VlvMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new VlvMockup(
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
			const da1 = new Vlv(dataAssemblyOptions, connection);
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;

			expect(da1.communication.OSLevel.value).equal(0);
			expect(da1.communication.WQC.value).equal(0);

			expect(da1.communication.PermEn.value).equal(false);
			expect(da1.communication.Permit.value).equal(false);
			expect(da1.communication.IntlEn.value).equal(false);
			expect(da1.communication.Interlock.value).equal(false);
			expect(da1.communication.ProtEn.value).equal(false);
			expect(da1.communication.Protect.value).equal(false);

			expect(da1.communication.ResetAut.value).equal(false);
			expect(da1.communication.ResetOp.value).equal(false);

			expect(da1.communication.StateChannel.value).equal(false);
			expect(da1.communication.StateOffAut.value).equal(false);
			expect(da1.communication.StateOpAut.value).equal(false);
			expect(da1.communication.StateAutAut.value).equal(false);
			expect(da1.communication.StateOffOp.value).equal(false);
			expect(da1.communication.StateOpOp.value).equal(false);
			expect(da1.communication.StateAutOp.value).equal(false);
			expect(da1.communication.StateOpAct.value).equal(false);
			expect(da1.communication.StateAutAct.value).equal(false);
			expect(da1.communication.StateOffAct.value).equal(true);

			expect(da1.communication.SafePos.value).equal(false);
			expect(da1.communication.SafePosEn.value).equal(false);
			expect(da1.communication.SafePosAct.value).equal(false);
			expect(da1.communication.OpenAut.value).equal(false);
			expect(da1.communication.OpenFbk.value).equal(false);
			expect(da1.communication.OpenFbkCalc.value).equal(false);
			expect(da1.communication.OpenOp.value).equal(false);
			expect(da1.communication.CloseAut.value).equal(false);
			expect(da1.communication.CloseFbk.value).equal(false);
			expect(da1.communication.CloseFbkCalc.value).equal(false);
			expect(da1.communication.CloseOp.value).equal(false);
		}).timeout(5000);
	});
});
