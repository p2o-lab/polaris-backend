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
import {BinManInt} from './BinManInt';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../../tests/binmanint.json';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../_utils';
import {BinManIntMockup} from '../BinMan/BinManInt.mockup';
import {Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinManInt', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/BinManInt',
		dataItems: baseDataAssemblyOptions
	};

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create BinManInt',  () => {
			const da1: BinManInt = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as BinManInt;
			expect(da1.sourceMode).to.be.not.undefined;
			expect(da1.communication.VInt).to.not.equal(undefined);
			expect(da1.wqc).to.not.equal(undefined);
			//rest is tested in BinMan
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new BinManIntMockup(
				mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject,
				'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334','','');
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
				if((typeof(dataAssemblyOptions.dataItems as any)[key] != 'string')){
					(dataAssemblyOptions.dataItems as any)[key].namespaceIndex = namespaceUrl;
				}
			}
			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as BinManInt;
			const pv =  da1.subscribe();
			await connection.startListening();
			await pv;

			expect(da1.communication.OSLevel.value).to.equal(0);

			expect(da1.communication.VOut.value).to.equal(false);
			expect(da1.communication.VMan.value).to.equal(false);
			expect(da1.communication.VRbk.value).to.equal(false);
			expect(da1.communication.VFbk.value).to.equal(false);
			expect(da1.communication.VState0.value).to.equal('off');
			expect(da1.communication.VState1.value).to.equal('on');

			expect(da1.communication.WQC.value).to.equal(0);
			expect(da1.communication.VInt.value).to.equal(false);
			expect(da1.communication.VMan.value).to.equal(false);

			expect(da1.communication.SrcChannel.value).equal(false);
			expect(da1.communication.SrcManAut.value).equal(false);
			expect(da1.communication.SrcIntAut.value).equal(false);
			expect(da1.communication.SrcIntOp.value).equal(false);
			expect(da1.communication.SrcManOp.value).equal(false);
			expect(da1.communication.SrcIntAct.value).equal(false);
			expect(da1.communication.SrcManAct.value).equal(true);
		}).timeout(4000);
	});
});
