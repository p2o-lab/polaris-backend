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
import * as baseDataAssemblyOptions from '../../../../../../../tests/binserveparam.json';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../_utils';
import {BinServParamMockup} from './BinServParam.mockup';
import {Namespace, UAObject} from 'node-opcua';

import {BinServParam} from './BinServParam';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinServParam', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/BinServParam',
		dataItems: baseDataAssemblyOptions
	};

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create BinServParam', async () => {
			const da1 = new BinServParam(dataAssemblyOptions, emptyOPCUAConnection);
			expect(da1.communication.VExt).to.not.be.undefined;
			expect(da1.communication.VOp).to.not.be.undefined;
			expect(da1.communication.VInt).to.not.be.undefined;
			expect(da1.communication.VReq).to.not.be.undefined;
			expect(da1.communication.VOut).to.not.be.undefined;
			expect(da1.communication.VFbk).to.not.be.undefined;
			expect(da1.communication.VState0).to.not.be.undefined;
			expect(da1.communication.VState1).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new BinServParamMockup(
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

			//TODO new BinServParam()
			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as BinServParam;

			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect(da1.communication.WQC.value).equal(0);

			expect((da1).communication.StateChannel.value).equal(false);
			expect((da1).communication.StateOffAut.value).equal(false);
			expect((da1).communication.StateOpAut.value).equal(false);
			expect((da1).communication.StateAutAut.value).equal(false);
			expect((da1).communication.StateOffOp.value).equal(false);
			expect((da1).communication.StateOpOp.value).equal(false);
			expect((da1).communication.StateAutOp.value).equal(false);
			expect((da1).communication.StateOpAct.value).equal(false);
			expect((da1).communication.StateAutAct.value).equal(false);
			expect((da1).communication.StateOffAct.value).equal(true);

			expect(da1.communication.SrcChannel.value).equal(false);
			expect(da1.communication.SrcExtAut.value).equal(false);
			expect(da1.communication.SrcIntAut.value).equal(false);
			expect(da1.communication.SrcIntOp.value).equal(false);
			expect(da1.communication.SrcExtOp.value).equal(false);
			expect(da1.communication.SrcIntAct.value).equal(true);
			expect(da1.communication.SrcExtAct.value).equal(false);

			expect(da1.communication.Sync.value).equal(false);

			expect(da1.communication.VExt.value).equal(false);
			expect(da1.communication.VOp.value).equal(false);
			expect(da1.communication.VInt.value).equal(false);
			expect(da1.communication.VReq.value).equal(false);
			expect(da1.communication.VOut.value).equal(false);
			expect(da1.communication.VFbk.value).equal(false);

			expect(da1.communication.VState0.value).equal('off');
			expect(da1.communication.VState1.value).equal('on');
		}).timeout(4000);
	});
});
