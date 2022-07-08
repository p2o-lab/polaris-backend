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

/* eslint-disable */
import {PEA, Service} from '../../../pea';
import {Parameter} from '../../index';

import {expect} from 'chai';
import * as fs from 'fs';
import {MockupServer} from '../../../_utils';
/* eslint-enable */

describe('Parameter', () => {
	/*
		context('static', () => {
			let service: Service;
			let pea: PEAController;

			before(() => {
				const file = fs.readFileSync('assets/peas/pea_cif.json');

				pea = new PEAController(JSON.parse(file.toString()).peas[0]);
				service = pea.services[0];
			});

			it('should load', () => new Parameter({
					name: 'var1',
					value: 3
				}, [pea])
			);

			it('should load without PEAs', () => new Parameter({
					name: 'var1',
					value: 3
				}, [])
			);

			it('should load with expression', async () => {
				const param = new Parameter({
					name: 'var1',
					value: '3+2'
				}, [pea]);
				expect(await param.getValue()).to.equal(5);
			});

			it('should load with complex expression', async () => {
				const param = new Parameter({
					name: 'var1',
					value: 'sin(3)+2'
				}, [pea]);
				expect(await param.getValue()).to.be.closeTo(2.14, 0.01);
			});

			it('should provide 0 with empty expression', async () => {
				const param = new Parameter({
					name: 'var1',
					value: ''
				}, [pea]);
				expect(await param.getValue()).to.equal(0);
			});

			it('should provide 0 with no expression', async () => {
				const param = new Parameter({
					name: 'var1',
					value: ''
				}, []);
				expect(await param.getValue()).to.equal(0);
			});

			it('should provide 0 with non valid expression', async () => {
				expect(() => new Parameter({
					name: 'var1',
					value: 'ssd+4335.,dflkp94'
				}, [])).to.throw('Parsing error');
			});
		});
		/*
		context('with Mockup', () => {
			let service: Service;
			let pea: PEAController;
			let mockupServer: MockupServer;

			beforeEach(async function before() {
				this.timeout(5000);
				mockupServer = new MockupServer();
				await mockupServer.start();
				const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'))
					.peas[0];
				pea = new PEAController(peaJson);
				service = pea.services[0];
				await pea.connect();
			});

			afterEach(async () => {
				await pea.disconnect();
				await mockupServer.shutdown();
			});

			it('should load with complex expression and given scopeArray', async () => {
				const param = new Parameter({
					name: 'Parameter001',
					value: 'sin(a)^2 + cos(PEATestServer.Variable001)^2',
					scope: [
						{
							name: 'a',
							pea: 'PEATestServer',
							dataAssembly: 'Variable001',
							variable: 'V'
						}
					]

				}, [pea]);
				expect(param.scopeArray).to.have.lengthOf(2);
				expect(param.scopeArray[1].getScopeValue()).to.deep.equal({
					peaTestServer: {
						Variable001: 20
					}
				});
				expect(param.scopeArray[0].getScopeValue()).to.deep.equal({a: 20});
				expect(param.getValue()).to.be.closeTo(1, 0.01);
			});

			it('should load with complex expression with dataAssembly dataAssemblies', () => {
				const param = new Parameter({
					name: 'Parameter001',
					value: '2 * PEATestServer.Variable001.V + peaTestServer.Variable002 + Variable\\.003'
				}, [pea]);
				expect(param.getValue()).to.be.greaterThan(0.01);
			});

			it('should evaluate simple expression', () => {
				const param = new Parameter({
					name: 'Parameter001',
					value: '2 * 3'
				}, [pea]);
				expect(param.getValue()).to.equal(6);
			});

			it('should listen to dynamic parameter', async () => {
				const param = new Parameter({
					name: 'Parameter001',
					value: '2 * PEATestServer.Variable001.V'
				}, [pea]);
				expect(param.scopeArray[0].dataAssembly.subscriptionActive).to.equal(true);
				expect(param.scopeArray[0].dataAssembly.name).to.equal('Variable001');
				expect(param.scopeArray[0].dataAssembly.defaultReadDataItem?.value).to.equal(20);

				//(mockupServer.dataAssemblies[0] as PEATestNumericVariable).v = 10;
				await new Promise((resolve) => {
					param.listenToScopeArray().once('changed', () => resolve());
				});
				expect(param.getValue()).to.equal(20);
			});

			it('should stop listen to dynamic parameter', async () => {
				const param = new Parameter({
					name: 'Parameter001',
					value: '2 * PEATestServer.Variable001.V'
				}, [pea]);

				param.listenToScopeArray();
				//(peaTestServer.dataAssemblies[0] as PEATestNumericVariable).v = 10;
				await Promise.race([
					new Promise((resolve) => param.once('changed', resolve)),
					new Promise((resolve, reject) => setTimeout(reject, 1000, 'timeout'))
				]);

				param.unlistenToScopeArray();
				//(peaTestServer.dataAssemblies[0] as PEATestNumericVariable).v = 11;
				await Promise.race([
					new Promise((resolve, reject) => param.once('changed', reject)),
					new Promise((resolve) => setTimeout(resolve, 1000))
				]);
			});

			it('should allow to listen multiple times', async () => {
				const param = new Parameter({
					name: 'Parameter001',
					value: '2 * PEATestServer.Variable001.V'
				}, [pea]);
				expect(param.scopeArray[0].dataAssembly.listenerCount('changed')).to.equal(0);
				expect(param.scopeArray[0].dataItem.listenerCount('changed')).to.equal(2);

				param.listenToScopeArray();
				param.listenToScopeArray();
				param.listenToScopeArray();
				param.listenToScopeArray();
				expect(param.scopeArray[0].dataAssembly.listenerCount('changed')).to.equal(1);
				expect(param.scopeArray[0].dataItem.listenerCount('changed')).to.equal(2);

				param.unlistenToScopeArray();
				expect(param.scopeArray[0].dataAssembly.listenerCount('changed')).to.equal(0);
				expect(param.scopeArray[0].dataItem.listenerCount('changed')).to.equal(2);
			});

		});
		*/
});
