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
import * as baseDataAssemblyOptions from './BinManInt.spec.json';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../_utils';
import {BinManIntMockup} from './BinManInt.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinManInt', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/BinManInt',
		dataItems: baseDataAssemblyOptions
	};

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create BinManInt',  () => {
			const dataAssemblyController: BinManInt = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as BinManInt;
			expect(dataAssemblyController.sourceMode).to.be.not.undefined;
			expect(dataAssemblyController.communication.VInt).to.not.equal(undefined);
			expect(dataAssemblyController.wqc).to.not.equal(undefined);
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
			new BinManIntMockup(mockupServer.nameSpace,	mockupServer.rootObject,'Variable');
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

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as BinManInt;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.OSLevel.value).to.equal(0);
			expect(dataAssemblyController.communication.VOut.value).to.equal(false);
			expect(dataAssemblyController.communication.VMan.value).to.equal(false);
			expect(dataAssemblyController.communication.VRbk.value).to.equal(false);
			expect(dataAssemblyController.communication.VFbk.value).to.equal(false);
			expect(dataAssemblyController.communication.VState0.value).to.equal('off');
			expect(dataAssemblyController.communication.VState1.value).to.equal('on');
			expect(dataAssemblyController.communication.WQC.value).to.equal(0);
			expect(dataAssemblyController.communication.VInt.value).to.equal(false);
			expect(dataAssemblyController.communication.VMan.value).to.equal(false);
			expect(dataAssemblyController.communication.SrcChannel.value).equal(false);
			expect(dataAssemblyController.communication.SrcManAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcManOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAct.value).equal(true);
			expect(dataAssemblyController.communication.SrcManAct.value).equal(false);
		}).timeout(4000);
	});
});
