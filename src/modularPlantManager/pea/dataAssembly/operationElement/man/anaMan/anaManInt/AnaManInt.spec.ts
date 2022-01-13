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

import {OpcUaConnection} from '../../../../../connection';
import {AnaManInt} from './AnaManInt';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {DataAssemblyControllerFactory} from '../../../../DataAssemblyControllerFactory';
import {MockupServer} from '../../../../../../_utils';
import {AnaManIntMockup, getAnaManIntOptions} from './AnaManInt.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaManInt', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe( 'static',() => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getAnaManIntOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create AnaManInt',  () => {

			const dataAssemblyController: AnaManInt = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as AnaManInt;
			expect(dataAssemblyController.sourceMode).to.be.not.undefined;
			expect(dataAssemblyController.communication.VInt).to.not.equal(undefined);
			expect(dataAssemblyController.wqc).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const anaManIntMockup = new AnaManIntMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			dataAssemblyOptions = anaManIntMockup.getDataAssemblyOptions();
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpointUrl: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as AnaManInt;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.OSLevel.value).to.equal(0);
			expect(dataAssemblyController.communication.VOut.value).to.equal(0);
			expect(dataAssemblyController.communication.VMan.value).to.equal(0);
			expect(dataAssemblyController.communication.VRbk.value).to.equal(0);
			expect(dataAssemblyController.communication.VFbk.value).to.equal(0);
			expect(dataAssemblyController.communication.VUnit.value).equal(0);
			expect(dataAssemblyController.communication.VSclMin.value).equal(0);
			expect(dataAssemblyController.communication.VSclMax.value).equal(0);
			expect(dataAssemblyController.communication.VMin.value).equal(0);
			expect(dataAssemblyController.communication.VMax.value).equal(0);
			expect(dataAssemblyController.communication.WQC.value).to.equal(0);
			expect(dataAssemblyController.communication.VInt.value).to.equal(0);
			expect(dataAssemblyController.communication.VMan.value).to.equal(0);
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
