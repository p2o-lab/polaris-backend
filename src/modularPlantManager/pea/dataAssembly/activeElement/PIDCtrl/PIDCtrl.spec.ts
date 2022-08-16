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
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';

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

			expect(dataAssembly.dataItems.PV).to.not.be.undefined;
			expect(dataAssembly.dataItems.PVSclMax).to.not.be.undefined;
			expect(dataAssembly.dataItems.PVSclMin).to.not.be.undefined;
			expect(dataAssembly.dataItems.PVUnit).to.not.be.undefined;

			expect(dataAssembly.dataItems.SP).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPSclMax).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPSclMin).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPUnit).to.not.be.undefined;

			expect(dataAssembly.dataItems.SPMan).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPManMin).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPManMax).to.not.be.undefined;

			expect(dataAssembly.dataItems.SPInt).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPIntMin).to.not.be.undefined;
			expect(dataAssembly.dataItems.SPIntMax).to.not.be.undefined;

			expect(dataAssembly.dataItems.MV).to.not.be.undefined;
			expect(dataAssembly.dataItems.MVMan).to.not.be.undefined;
			expect(dataAssembly.dataItems.MVMin).to.not.be.undefined;
			expect(dataAssembly.dataItems.MVMax).to.not.be.undefined;
			expect(dataAssembly.dataItems.MVSclMax).to.not.be.undefined;
			expect(dataAssembly.dataItems.MVSclMin).to.not.be.undefined;
			expect(dataAssembly.dataItems.MVUnit).to.not.be.undefined;

			expect(dataAssembly.dataItems.P).to.not.be.undefined;
			expect(dataAssembly.dataItems.Ti).to.not.be.undefined;
			expect(dataAssembly.dataItems.Td).to.not.be.undefined;

			expect(Object.keys(dataAssembly.dataItems).length).to.equal(45);
		});
	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const pidCtrlMockup =new PIDCtrlMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = pidCtrlMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new PIDCtrl(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect(adapterId);
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.dataItems.OSLevel.value).equal(0);
			expect(dataAssembly.dataItems.WQC.value).equal(0);

			expect(dataAssembly.dataItems.SrcChannel.value).equal(false);
			expect(dataAssembly.dataItems.SrcManAut.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntAut.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntOp.value).equal(false);
			expect(dataAssembly.dataItems.SrcManOp.value).equal(false);
			expect(dataAssembly.dataItems.SrcIntAct.value).equal(true);
			expect(dataAssembly.dataItems.SrcManAct.value).equal(false);

			expect(dataAssembly.dataItems.StateChannel.value).equal(false);
			expect(dataAssembly.dataItems.StateOffAut.value).equal(false);
			expect(dataAssembly.dataItems.StateOpAut.value).equal(false);
			expect(dataAssembly.dataItems.StateAutAut.value).equal(false);
			expect(dataAssembly.dataItems.StateOffOp.value).equal(false);
			expect(dataAssembly.dataItems.StateOpOp.value).equal(false);
			expect(dataAssembly.dataItems.StateAutOp.value).equal(false);
			expect(dataAssembly.dataItems.StateOpAct.value).equal(false);
			expect(dataAssembly.dataItems.StateAutAct.value).equal(false);
			expect(dataAssembly.dataItems.StateOffAct.value).equal(true);

			expect(dataAssembly.dataItems.PV.value).equal(0);
			expect(dataAssembly.dataItems.PVSclMax.value).equal(0);
			expect(dataAssembly.dataItems.PVSclMin.value).equal(0);
			expect(dataAssembly.dataItems.PVUnit.value).equal(0);

			expect(dataAssembly.dataItems.SP.value).equal(0);
			expect(dataAssembly.dataItems.SPSclMax.value).equal(0);
			expect(dataAssembly.dataItems.SPSclMin.value).equal(0);
			expect(dataAssembly.dataItems.SPUnit.value).equal(0);

			expect(dataAssembly.dataItems.SPMan.value).equal(0);
			expect(dataAssembly.dataItems.SPManMin.value).equal(0);
			expect(dataAssembly.dataItems.SPManMax.value).equal(0);

			expect(dataAssembly.dataItems.SPInt.value).equal(0);
			expect(dataAssembly.dataItems.SPIntMin.value).equal(0);
			expect(dataAssembly.dataItems.SPIntMax.value).equal(0);

			expect(dataAssembly.dataItems.MV.value).equal(0);
			expect(dataAssembly.dataItems.MVMan.value).equal(0);
			expect(dataAssembly.dataItems.MVMin.value).equal(0);
			expect(dataAssembly.dataItems.MVMax.value).equal(0);
			expect(dataAssembly.dataItems.MVSclMax.value).equal(0);
			expect(dataAssembly.dataItems.MVSclMin.value).equal(0);
			expect(dataAssembly.dataItems.MVUnit.value).equal(0);

			expect(dataAssembly.dataItems.P.value).equal(0);
			expect(dataAssembly.dataItems.Ti.value).equal(0);
			expect(dataAssembly.dataItems.Td.value).equal(0);

		}).timeout(5000);

	});
});
