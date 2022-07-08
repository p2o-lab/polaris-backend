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

import {PIDCtrl} from './PIDCtrl';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../_utils';
import {getPIDCtrlDataAssemblyModel, PIDCtrlMockup} from './PIDCtrl.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PIDCtrl', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		options = getPIDCtrlDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create PIDCtrl', async () => {
			const connectionHandler = new ConnectionHandler();

			const dataAssembly = new PIDCtrl(options, connectionHandler);

			expect(dataAssembly.wqc).to.be.not.undefined;
			expect(dataAssembly.osLevel).to.not.be.undefined;
			expect(dataAssembly.sourceMode).to.be.not.undefined;
			expect(dataAssembly.opMode).to.be.not.undefined;

			expect(dataAssembly.communication.PV).to.not.be.undefined;
			expect(dataAssembly.communication.PVSclMax).to.not.be.undefined;
			expect(dataAssembly.communication.PVSclMin).to.not.be.undefined;
			expect(dataAssembly.communication.PVUnit).to.not.be.undefined;

			expect(dataAssembly.communication.SP).to.not.be.undefined;
			expect(dataAssembly.communication.SPSclMax).to.not.be.undefined;
			expect(dataAssembly.communication.SPSclMin).to.not.be.undefined;
			expect(dataAssembly.communication.SPUnit).to.not.be.undefined;

			expect(dataAssembly.communication.SPMan).to.not.be.undefined;
			expect(dataAssembly.communication.SPManMin).to.not.be.undefined;
			expect(dataAssembly.communication.SPManMax).to.not.be.undefined;

			expect(dataAssembly.communication.SPInt).to.not.be.undefined;
			expect(dataAssembly.communication.SPIntMin).to.not.be.undefined;
			expect(dataAssembly.communication.SPIntMax).to.not.be.undefined;

			expect(dataAssembly.communication.MV).to.not.be.undefined;
			expect(dataAssembly.communication.MVMan).to.not.be.undefined;
			expect(dataAssembly.communication.MVMin).to.not.be.undefined;
			expect(dataAssembly.communication.MVMax).to.not.be.undefined;
			expect(dataAssembly.communication.MVSclMax).to.not.be.undefined;
			expect(dataAssembly.communication.MVSclMin).to.not.be.undefined;
			expect(dataAssembly.communication.MVUnit).to.not.be.undefined;

			expect(dataAssembly.communication.P).to.not.be.undefined;
			expect(dataAssembly.communication.Ti).to.not.be.undefined;
			expect(dataAssembly.communication.Td).to.not.be.undefined;

			expect(Object.keys(dataAssembly.communication).length).to.equal(45);
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const pidCtrlMockup =new PIDCtrlMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = pidCtrlMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new PIDCtrl(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.communication.OSLevel.value).equal(0);
			expect(dataAssembly.communication.WQC.value).equal(0);

			expect(dataAssembly.communication.SrcChannel.value).equal(false);
			expect(dataAssembly.communication.SrcManAut.value).equal(false);
			expect(dataAssembly.communication.SrcIntAut.value).equal(false);
			expect(dataAssembly.communication.SrcIntOp.value).equal(false);
			expect(dataAssembly.communication.SrcManOp.value).equal(false);
			expect(dataAssembly.communication.SrcIntAct.value).equal(true);
			expect(dataAssembly.communication.SrcManAct.value).equal(false);

			expect(dataAssembly.communication.StateChannel.value).equal(false);
			expect(dataAssembly.communication.StateOffAut.value).equal(false);
			expect(dataAssembly.communication.StateOpAut.value).equal(false);
			expect(dataAssembly.communication.StateAutAut.value).equal(false);
			expect(dataAssembly.communication.StateOffOp.value).equal(false);
			expect(dataAssembly.communication.StateOpOp.value).equal(false);
			expect(dataAssembly.communication.StateAutOp.value).equal(false);
			expect(dataAssembly.communication.StateOpAct.value).equal(false);
			expect(dataAssembly.communication.StateAutAct.value).equal(false);
			expect(dataAssembly.communication.StateOffAct.value).equal(true);

			expect(dataAssembly.communication.PV.value).equal(0);
			expect(dataAssembly.communication.PVSclMax.value).equal(0);
			expect(dataAssembly.communication.PVSclMin.value).equal(0);
			expect(dataAssembly.communication.PVUnit.value).equal(0);

			expect(dataAssembly.communication.SP.value).equal(0);
			expect(dataAssembly.communication.SPSclMax.value).equal(0);
			expect(dataAssembly.communication.SPSclMin.value).equal(0);
			expect(dataAssembly.communication.SPUnit.value).equal(0);

			expect(dataAssembly.communication.SPMan.value).equal(0);
			expect(dataAssembly.communication.SPManMin.value).equal(0);
			expect(dataAssembly.communication.SPManMax.value).equal(0);

			expect(dataAssembly.communication.SPInt.value).equal(0);
			expect(dataAssembly.communication.SPIntMin.value).equal(0);
			expect(dataAssembly.communication.SPIntMax.value).equal(0);

			expect(dataAssembly.communication.MV.value).equal(0);
			expect(dataAssembly.communication.MVMan.value).equal(0);
			expect(dataAssembly.communication.MVMin.value).equal(0);
			expect(dataAssembly.communication.MVMax.value).equal(0);
			expect(dataAssembly.communication.MVSclMax.value).equal(0);
			expect(dataAssembly.communication.MVSclMin.value).equal(0);
			expect(dataAssembly.communication.MVUnit.value).equal(0);

			expect(dataAssembly.communication.P.value).equal(0);
			expect(dataAssembly.communication.Ti.value).equal(0);
			expect(dataAssembly.communication.Td.value).equal(0);

		}).timeout(5000);

	});
});
