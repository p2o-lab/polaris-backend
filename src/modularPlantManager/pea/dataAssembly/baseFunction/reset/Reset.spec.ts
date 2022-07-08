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
import {Reset} from './Reset';
import {MockupServer} from '../../../../_utils';
import {ResetMockup} from './Reset.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getMonBinVlvDataAssemblyModel} from '../../activeElement/vlv/binVlv/monBinVlv/MonBinVlv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Reset', () => {

	const options = getMonBinVlvDataAssemblyModel(2, 'Variable', 'Variable');

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();

		it('should create Reset',  () => {
			const dataAssembly = new Reset(options, connectionHandler); //this will set communication dataAssemblies
			expect(dataAssembly).to.not.to.undefined;
			expect(dataAssembly.ResetAut).to.not.to.undefined;
			expect(dataAssembly.ResetOp).to.not.to.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ResetMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			await connectionHandler.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new Reset(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			expect(dataAssembly.ResetAut.value).to.be.false;
			expect(dataAssembly.ResetOp.value).to.be.false;

		}).timeout(5000);
	});
});
