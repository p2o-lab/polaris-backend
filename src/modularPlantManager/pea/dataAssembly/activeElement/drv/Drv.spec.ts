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

import {
	Drv
} from './Drv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../_utils';
import {DrvMockup, getDrvDataAssemblyModel} from './Drv.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Drv', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getDrvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create Drv',  () => {
			const dataAssembly = new Drv(options, connectionHandler);

			expect(dataAssembly.reset).to.be.not.undefined;
			expect(dataAssembly.interlock).to.be.not.undefined;
			expect(dataAssembly.opMode).to.be.not.undefined;

			expect(dataAssembly.dataItems.SafePos).to.be.not.undefined;
			expect(dataAssembly.dataItems.SafePosAct).to.be.not.undefined;

			expect(Object.keys(dataAssembly.dataItems).length).to.equal(39);
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let dataAssembly: Drv;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const drvMockup = new DrvMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			options = drvMockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			dataAssembly = new Drv(options, connectionHandler, true);
			await dataAssembly.subscribe();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			expect((dataAssembly).dataItems.OSLevel.value).equal(0);
			expect((dataAssembly).dataItems.WQC.value).equal(0);

			expect((dataAssembly).dataItems.StateChannel.value).equal(false);
			expect((dataAssembly).dataItems.StateOffAut.value).equal(false);
			expect((dataAssembly).dataItems.StateOpAut.value).equal(false);
			expect((dataAssembly).dataItems.StateAutAut.value).equal(false);
			expect((dataAssembly).dataItems.StateOffOp.value).equal(false);
			expect((dataAssembly).dataItems.StateOpOp.value).equal(false);
			expect((dataAssembly).dataItems.StateAutOp.value).equal(false);
			expect((dataAssembly).dataItems.StateOpAct.value).equal(false);
			expect((dataAssembly).dataItems.StateAutAct.value).equal(false);
			expect((dataAssembly).dataItems.StateOffAct.value).equal(true);

			expect(dataAssembly.dataItems.ResetOp.value).equal(false);
			expect(dataAssembly.dataItems.ResetAut.value).equal(false);

			expect(dataAssembly.dataItems.PermEn.value).equal(false);
			expect(dataAssembly.dataItems.Permit.value).equal(false);
			expect(dataAssembly.dataItems.IntlEn.value).equal(false);
			expect(dataAssembly.dataItems.Interlock.value).equal(false);
			expect(dataAssembly.dataItems.ProtEn.value).equal(false);
			expect(dataAssembly.dataItems.Protect.value).equal(false);
			
			expect(dataAssembly.dataItems.SafePos.value).equal(false);
			expect(dataAssembly.dataItems.SafePosAct.value).equal(false);
		}).timeout(4000);

	});
});
