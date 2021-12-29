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
import {OPCUAClient} from 'node-opcua-client';
import {MockupServer} from '../_utils';

chai.use(chaiAsPromised);

describe('PEATestServer', () => {

	let mockupServer: MockupServer;

	beforeEach(async () => {
		mockupServer = new MockupServer();
		await mockupServer.start();
	});

	afterEach(async () => {
		await mockupServer.shutdown();
	});

	it('should connect to OPC UA server', async () => {
		const client = OPCUAClient.create({
			// eslint-disable-next-line @typescript-eslint/camelcase
			endpoint_must_exist: false,
			connectionStrategy: {
				maxRetry: 10
			}
		});

		await client.connect('opc.tcp://localhost:4334/');
		await client.createSession();

	/*	let result = await session.read({nodeId: 'ns=1;s=Service1.State'});
		expect(result.value.value).to.equal(ServiceState.IDLE);

		//peaServer.services[0].varStatus = 8;
		result = await session.read({nodeId: 'ns=1;s=Service1.State'});
		expect(result.value.value).to.equal(ServiceState.STARTING);

		const result2 = await session.read({nodeId: 'ns=1;s=Service1.CommandEnable'});
		const ce = controlEnableToJson(result2.value.value);
		expect(ce).to.deep.equal({
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			start: true,
			stop: true,
			unhold: false
		});

		const result3 = await session.read({nodeId: 'ns=0;i=2255'});
		expect(result3.value.value).to.deep.equal(['http://opcfoundation.org/UA/',
			'urn:NodeOPCUA-Server-default']);
*/
		await client.disconnect();
	});

});
