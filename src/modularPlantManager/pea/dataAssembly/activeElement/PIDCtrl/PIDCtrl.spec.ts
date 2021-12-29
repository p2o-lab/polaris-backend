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
import {PIDCtrl} from './PIDCtrl';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './PIDCtrl.spec.json';
import {MockupServer} from '../../../../_utils';
import {PIDCtrlMockup} from './PIDCtrl.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PIDCtrl', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/PIDCtrl',
		dataItems: baseDataAssemblyOptions
	};
	describe('static', () => {

		it('should create PIDCtrl', async () => {
			const emptyOPCUAConnection = new OpcUaConnection();

			const da1 = new PIDCtrl(dataAssemblyOptions, emptyOPCUAConnection);

			expect(da1.wqc).to.be.not.undefined;
			expect(da1.osLevel).to.not.be.undefined;
			expect(da1.sourceMode).to.be.not.undefined;
			expect(da1.opMode).to.be.not.undefined;

			expect(da1.communication.PV).to.not.be.undefined;
			expect(da1.communication.PVSclMax).to.not.be.undefined;
			expect(da1.communication.PVSclMin).to.not.be.undefined;
			expect(da1.communication.PVUnit).to.not.be.undefined;

			expect(da1.communication.SP).to.not.be.undefined;
			expect(da1.communication.SPSclMax).to.not.be.undefined;
			expect(da1.communication.SPSclMin).to.not.be.undefined;
			expect(da1.communication.SPUnit).to.not.be.undefined;

			expect(da1.communication.SPMan).to.not.be.undefined;
			expect(da1.communication.SPManMin).to.not.be.undefined;
			expect(da1.communication.SPManMax).to.not.be.undefined;

			expect(da1.communication.SPInt).to.not.be.undefined;
			expect(da1.communication.SPIntMin).to.not.be.undefined;
			expect(da1.communication.SPIntMax).to.not.be.undefined;

			expect(da1.communication.MV).to.not.be.undefined;
			expect(da1.communication.MVMan).to.not.be.undefined;
			expect(da1.communication.MVMin).to.not.be.undefined;
			expect(da1.communication.MVMax).to.not.be.undefined;
			expect(da1.communication.MVSclMax).to.not.be.undefined;
			expect(da1.communication.MVSclMin).to.not.be.undefined;
			expect(da1.communication.MVUnit).to.not.be.undefined;

			expect(da1.communication.P).to.not.be.undefined;
			expect(da1.communication.Ti).to.not.be.undefined;
			expect(da1.communication.Td).to.not.be.undefined;

			expect(Object.keys(da1.communication).length).to.equal(43);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new PIDCtrlMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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

			const da1 = new PIDCtrl(dataAssemblyOptions, connection);
			const pv =  da1.subscribe();
			await connection.startMonitoring();
			await pv;

			expect(da1.communication.OSLevel.value).equal(0);
			expect(da1.communication.WQC.value).equal(0);

			expect(da1.communication.SrcChannel.value).equal(false);
			expect(da1.communication.SrcManAut.value).equal(false);
			expect(da1.communication.SrcIntAut.value).equal(false);
			expect(da1.communication.SrcIntOp.value).equal(false);
			expect(da1.communication.SrcManOp.value).equal(false);
			expect(da1.communication.SrcIntAct.value).equal(true);
			expect(da1.communication.SrcManAct.value).equal(false);

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

			expect(da1.communication.PV.value).equal(0);
			expect(da1.communication.PVSclMax.value).equal(0);
			expect(da1.communication.PVSclMin.value).equal(0);
			expect(da1.communication.PVUnit.value).equal(0);

			expect(da1.communication.SP.value).equal(0);
			expect(da1.communication.SPSclMax.value).equal(0);
			expect(da1.communication.SPSclMin.value).equal(0);
			expect(da1.communication.SPUnit.value).equal(0);

			expect(da1.communication.SPMan.value).equal(0);
			expect(da1.communication.SPManMin.value).equal(0);
			expect(da1.communication.SPManMax.value).equal(0);

			expect(da1.communication.SPInt.value).equal(0);
			expect(da1.communication.SPIntMin.value).equal(0);
			expect(da1.communication.SPIntMax.value).equal(0);

			expect(da1.communication.MV.value).equal(0);
			expect(da1.communication.MVMan.value).equal(0);
			expect(da1.communication.MVMin.value).equal(0);
			expect(da1.communication.MVMax.value).equal(0);
			expect(da1.communication.MVSclMax.value).equal(0);
			expect(da1.communication.MVSclMin.value).equal(0);
			expect(da1.communication.MVUnit.value).equal(0);

			expect(da1.communication.P.value).equal(0);
			expect(da1.communication.Ti.value).equal(0);
			expect(da1.communication.Td.value).equal(0);

		}).timeout(5000);

	});
});
