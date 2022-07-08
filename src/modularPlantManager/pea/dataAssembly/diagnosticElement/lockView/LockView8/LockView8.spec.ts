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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {MockupServer} from '../../../../../_utils';
import {LockView8} from './LockView8';
import {getLockView8DataAssemblyModel, LockView8Mockup} from './LockView8.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView8', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getLockView8DataAssemblyModel(2, 'Variable', 'Variable');

		it('should create LockView8', async () => {
			const dataAssembly = new LockView8(options, connectionHandler);
			expect(dataAssembly).to.be.not.undefined;
			expect(dataAssembly.communication).to.be.not.undefined;
			expect(dataAssembly.wqc).to.be.not.undefined;
		});

	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(8000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const lockView8Mockup = new LockView8Mockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			options = lockView8Mockup.getDataAssemblyModel();
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(8000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new LockView8(options, connectionHandler);
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.In8Txt.on('changed', resolve)));

			expect(dataAssembly.wqc.WQC).equal(0);
			expect(dataAssembly.Logic.value).equal(false);
			expect(dataAssembly.Out.value).equal(false);
			expect(dataAssembly.OutQC.value).equal(0);

			expect(dataAssembly.In1En.value).equal(false);
			expect(dataAssembly.In1.value).equal(false);
			expect(dataAssembly.In1QC.value).equal(0);
			expect(dataAssembly.In1Inv.value).equal(false);
			expect(dataAssembly.In1Txt.value).equal('testText');

			expect(dataAssembly.In2En.value).equal(false);
			expect(dataAssembly.In2.value).equal(false);
			expect(dataAssembly.In2QC.value).equal(0);
			expect(dataAssembly.In2Inv.value).equal(false);
			expect(dataAssembly.In2Txt.value).equal('testText');

			expect(dataAssembly.In3En.value).equal(false);
			expect(dataAssembly.In3.value).equal(false);
			expect(dataAssembly.In3QC.value).equal(0);
			expect(dataAssembly.In3Inv.value).equal(false);
			expect(dataAssembly.In3Txt.value).equal('testText');

			expect(dataAssembly.In4En.value).equal(false);
			expect(dataAssembly.In4.value).equal(false);
			expect(dataAssembly.In4QC.value).equal(0);
			expect(dataAssembly.In4Inv.value).equal(false);
			expect(dataAssembly.In4Txt.value).equal('testText');

			expect(dataAssembly.In5En.value).equal(false);
			expect(dataAssembly.In5.value).equal(false);
			expect(dataAssembly.In5QC.value).equal(0);
			expect(dataAssembly.In5Inv.value).equal(false);
			expect(dataAssembly.In5Txt.value).equal('testText');

			expect(dataAssembly.In6En.value).equal(false);
			expect(dataAssembly.In6.value).equal(false);
			expect(dataAssembly.In6QC.value).equal(0);
			expect(dataAssembly.In6Inv.value).equal(false);
			expect(dataAssembly.In6Txt.value).equal('testText');

			expect(dataAssembly.In7En.value).equal(false);
			expect(dataAssembly.In7.value).equal(false);
			expect(dataAssembly.In7QC.value).equal(0);
			expect(dataAssembly.In7Inv.value).equal(false);
			expect(dataAssembly.In7Txt.value).equal('testText');

			expect(dataAssembly.In8En.value).equal(false);
			expect(dataAssembly.In8.value).equal(false);
			expect(dataAssembly.In8QC.value).equal(0);
			expect(dataAssembly.In8Inv.value).equal(false);
			expect(dataAssembly.In8Txt.value).equal('testText');
		}).timeout(8000);
	});
});
