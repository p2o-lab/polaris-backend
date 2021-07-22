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

import {OperationOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {PEAController, Service} from '../../../pea';
import {Operation} from '../../index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {PEAMockup} from '../../../pea/PEA.mockup';
import {MockupServer} from '../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Operation', () => {
	const delay = require('timeout-as-promise');
	/*
	context('constructor', () => {

		let pea: PEAController;

		before(() => {
			const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString())
				.peas[0];
			pea = new PEAController(peaJson);
		});

		it('should fail with missing options', () => {
			expect(() => new Operation({} as OperationOptions, [])).to.throw();
		});

		it('should fail with missing PEAs', () => {
			expect(() => new Operation({
				service: '',
				command: ServiceCommand.start
			}, [])).to.throw('No PEAs specified');
		});

		it('should fail with missing 3', () => {
			expect(() => new Operation({
				pea: 'test',
				service: '',
				command: ServiceCommand.start
			}, [pea])).to.throw('Could not find');
		});

		it('should fail with wrong service name', () => {
			expect(() => new Operation({
				pea: 'PEATestServer',
				service: 'test',
				command: ServiceCommand.start
			}, [pea])).to.throw('Could not find service with name test');
		});

		it('should fail with wrong procedure name', () => {
			expect(() => new Operation({
				pea: 'PEATestServer',
				service: 'Service1',
				procedure: 'dd',
				command: ServiceCommand.start
			}, [pea])).to.throw('not be found');
		});

		it('should work', () => {
			const op = new Operation({
				pea: 'PEATestServer',
				service: 'Service1',
				command: 'start' as any,
				parameter: [{name: 'Parameter001', value: 3}]
			}, [pea]);
			expect(op).to.have.property('pea');
			expect(op.json()).to.deep.equal({
				command: 'start',
				pea: 'PEATestServer',
				parameter: [
					{
						name: 'Parameter001',
						value: 3
					}
				],
				service: 'Service1',
				state: undefined,
				procedure: 'Procedure 1'
			});
		});
	});

	describe('with Mockup', () => {

		let mockupServer: MockupServer;
		let pea: PEAController;
		let service: Service;

		beforeEach(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.start();

			const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString())
				.peas[0];
			pea = new PEAController(peaJson);
			service = pea.services[0];

			await pea.connect();
		});

		afterEach(async () => {
			await pea.disconnect();
			await mockupServer.shutdown();
		});

		it('should execute operation', async () => {
			const operation = new Operation({
				service: 'Service1',
				command: 'start' as ServiceCommand
			}, [pea]);

			await operation.execute();
			await service.waitForStateChangeWithTimeout('EXECUTE', 3000);
			expect(operation.json()).to.have.property('state', 'completed');
		});

		it('should try execute operation until it works', async () => {
			const operation = new Operation({
				service: 'Service1',
				command: 'complete' as ServiceCommand
			}, [pea]);

			operation.execute();
			await delay(200);
			expect(operation.json()).to.have.property('state', 'executing');
			// set precondition for operation
			service.executeCommand(ServiceCommand.start);

			await service.waitForStateChangeWithTimeout('COMPLETED', 3000);
			expect(operation.json()).to.have.property('state', 'completed');

		}).timeout(3000);

		it('should try execute operation until it is stopped', async () => {
			const operation = new Operation({
				service: 'Service1',
				command: 'complete' as ServiceCommand
			}, [pea]);

			operation.execute();
			await delay(200);
			expect(operation.json()).to.have.property('state', 'executing');
			operation.stop();
			expect(operation.json()).to.have.property('state', 'aborted');

		});

		it('should try execute operation until timeout', async () => {
			const operation = new Operation({
				service: 'Service1',
				command: 'complete' as ServiceCommand
			}, [pea]);

			operation.execute();
			await delay(3000);
			expect(operation.json()).to.have.property('state', 'executing');
			await delay(2050);
			expect(operation.json()).to.have.property('state', 'aborted');

		}).timeout(8000);
	});
	*/
});
