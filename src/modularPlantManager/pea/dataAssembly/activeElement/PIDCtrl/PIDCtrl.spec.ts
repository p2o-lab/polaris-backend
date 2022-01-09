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
import {MockupServer} from '../../../../_utils';
import {getPIDCtrlOptions, PIDCtrlMockup} from './PIDCtrl.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PIDCtrl', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		dataAssemblyOptions = getPIDCtrlOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create PIDCtrl', async () => {
			const emptyOPCUAConnection = new OpcUaConnection();

			const dataAssemblyController = new PIDCtrl(dataAssemblyOptions, emptyOPCUAConnection);

			expect(dataAssemblyController.wqc).to.be.not.undefined;
			expect(dataAssemblyController.osLevel).to.not.be.undefined;
			expect(dataAssemblyController.sourceMode).to.be.not.undefined;
			expect(dataAssemblyController.opMode).to.be.not.undefined;

			expect(dataAssemblyController.communication.PV).to.not.be.undefined;
			expect(dataAssemblyController.communication.PVSclMax).to.not.be.undefined;
			expect(dataAssemblyController.communication.PVSclMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.PVUnit).to.not.be.undefined;

			expect(dataAssemblyController.communication.SP).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPSclMax).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPSclMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPUnit).to.not.be.undefined;

			expect(dataAssemblyController.communication.SPMan).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPManMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPManMax).to.not.be.undefined;

			expect(dataAssemblyController.communication.SPInt).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPIntMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.SPIntMax).to.not.be.undefined;

			expect(dataAssemblyController.communication.MV).to.not.be.undefined;
			expect(dataAssemblyController.communication.MVMan).to.not.be.undefined;
			expect(dataAssemblyController.communication.MVMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.MVMax).to.not.be.undefined;
			expect(dataAssemblyController.communication.MVSclMax).to.not.be.undefined;
			expect(dataAssemblyController.communication.MVSclMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.MVUnit).to.not.be.undefined;

			expect(dataAssemblyController.communication.P).to.not.be.undefined;
			expect(dataAssemblyController.communication.Ti).to.not.be.undefined;
			expect(dataAssemblyController.communication.Td).to.not.be.undefined;

			expect(Object.keys(dataAssemblyController.communication).length).to.equal(45);
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const pidCtrlMockup =new PIDCtrlMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dataAssemblyOptions = pidCtrlMockup.getDataAssemblyOptions();
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

			const dataAssemblyController = new PIDCtrl(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.OSLevel.value).equal(0);
			expect(dataAssemblyController.communication.WQC.value).equal(0);

			expect(dataAssemblyController.communication.SrcChannel.value).equal(false);
			expect(dataAssemblyController.communication.SrcManAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAut.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcManOp.value).equal(false);
			expect(dataAssemblyController.communication.SrcIntAct.value).equal(true);
			expect(dataAssemblyController.communication.SrcManAct.value).equal(false);

			expect(dataAssemblyController.communication.StateChannel.value).equal(false);
			expect(dataAssemblyController.communication.StateOffAut.value).equal(false);
			expect(dataAssemblyController.communication.StateOpAut.value).equal(false);
			expect(dataAssemblyController.communication.StateAutAut.value).equal(false);
			expect(dataAssemblyController.communication.StateOffOp.value).equal(false);
			expect(dataAssemblyController.communication.StateOpOp.value).equal(false);
			expect(dataAssemblyController.communication.StateAutOp.value).equal(false);
			expect(dataAssemblyController.communication.StateOpAct.value).equal(false);
			expect(dataAssemblyController.communication.StateAutAct.value).equal(false);
			expect(dataAssemblyController.communication.StateOffAct.value).equal(true);

			expect(dataAssemblyController.communication.PV.value).equal(0);
			expect(dataAssemblyController.communication.PVSclMax.value).equal(0);
			expect(dataAssemblyController.communication.PVSclMin.value).equal(0);
			expect(dataAssemblyController.communication.PVUnit.value).equal(0);

			expect(dataAssemblyController.communication.SP.value).equal(0);
			expect(dataAssemblyController.communication.SPSclMax.value).equal(0);
			expect(dataAssemblyController.communication.SPSclMin.value).equal(0);
			expect(dataAssemblyController.communication.SPUnit.value).equal(0);

			expect(dataAssemblyController.communication.SPMan.value).equal(0);
			expect(dataAssemblyController.communication.SPManMin.value).equal(0);
			expect(dataAssemblyController.communication.SPManMax.value).equal(0);

			expect(dataAssemblyController.communication.SPInt.value).equal(0);
			expect(dataAssemblyController.communication.SPIntMin.value).equal(0);
			expect(dataAssemblyController.communication.SPIntMax.value).equal(0);

			expect(dataAssemblyController.communication.MV.value).equal(0);
			expect(dataAssemblyController.communication.MVMan.value).equal(0);
			expect(dataAssemblyController.communication.MVMin.value).equal(0);
			expect(dataAssemblyController.communication.MVMax.value).equal(0);
			expect(dataAssemblyController.communication.MVSclMax.value).equal(0);
			expect(dataAssemblyController.communication.MVSclMin.value).equal(0);
			expect(dataAssemblyController.communication.MVUnit.value).equal(0);

			expect(dataAssemblyController.communication.P.value).equal(0);
			expect(dataAssemblyController.communication.Ti.value).equal(0);
			expect(dataAssemblyController.communication.Td.value).equal(0);

		}).timeout(5000);

	});
});
