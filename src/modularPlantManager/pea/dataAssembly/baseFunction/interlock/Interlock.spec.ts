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
import {Interlock} from './Interlock';
import {MockupServer} from '../../../../_utils';
import {InterlockMockup} from './Interlock.mockup';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {getMonBinVlvDataAssemblyModel} from '../../activeElement/vlv/binVlv/monBinVlv/MonBinVlv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Interlock', () => {

	let options: DataAssemblyModel;

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();
		options = getMonBinVlvDataAssemblyModel(2, 'Variable', 'Variable');

		it('should create Interlock', () => {
			const dataAssembly = new Interlock(options, connectionHandler);
			expect(dataAssembly).to.not.to.undefined;
			expect(dataAssembly.PermEn).to.not.to.undefined;
			expect(dataAssembly.Permit).to.not.to.undefined;
			expect(dataAssembly.IntlEn).to.not.to.undefined;
			expect(dataAssembly.Interlock).to.not.to.undefined;
			expect(dataAssembly.ProtEn).to.not.to.undefined;
			expect(dataAssembly.Protect).to.not.to.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new InterlockMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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

			const dataAssembly = new Interlock(options, connectionHandler);
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));

			expect(dataAssembly.PermEn.value).equal(false);
			expect(dataAssembly.Permit.value).equal(false);
			expect(dataAssembly.IntlEn.value).equal(false);
			expect(dataAssembly.Interlock.value).equal(false);
			expect(dataAssembly.ProtEn.value).equal(false);
			expect(dataAssembly.Protect.value).equal(false);
		}).timeout(5000);
	});
});
