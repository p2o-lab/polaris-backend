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

import {Step} from './Step';
import {expect} from 'chai';
import {MockupServer} from '../../_utils';

describe('Step', () => {

	it('should fail to create with missing name', () => {
		expect(() => new Step({name: '', operations: [], transitions: []}, [])).to.throw('missing');
	});

	it('should fail to create with missing operations', () => {
		expect(() => new Step({name: 'test', operations: [], transitions: []}, [])).to.throw('missing');
	});

	it('should fail to create with missing name', () => {
		expect(() => new Step({name: 'test', operations: [], transitions: []}, [])).to.throw('missing');
	});

	it('should create', () => {
		expect(new Step({name: 'test', operations: [], transitions: []}, [])).to.have.property('name', 'test');
	});

	describe('with Mockup', () => {

		let mockupServer: MockupServer;

		beforeEach(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
		});

		afterEach(async () => {
			await mockupServer.shutdown();
		});
		/*
		it('should execute step', async () => {
			await mockupServer.start();
			const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString())
				.peas[0];
			pea = new PEAController(peaJson);
			await pea.connect();
			const step = new Step({
				name: 'S0.CheckInitialConditions',
				operations: [{
					service: 'Service1',
					command: ServiceCommand.start
				}],
				transitions: [
					{
						nextStep: 'completed',
						condition: {
							type: ConditionType.state,
							pea: 'PEATestServer',
							service: 'Service1',
							state: 'starting'
						}
					}
				]
			}, [pea]);

			step.execute();
			await new Promise((resolve) => step.on('completed', resolve));
		});
		*/
	});
});
