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

import {PEA} from '../PEA';
import {OpcUaDataItem} from '../pea/connection';
import {ScopeItem} from './ScopeItem';

import {expect} from 'chai';
import {Expression} from 'expr-eval';
import * as fs from 'fs';
import {PEATestNumericVariable, waitForParameterChange, waitForVariableChange} from '../_utils';
import { MockupServer} from '../_utils';

/**
 * Tests for [[ScopeItem]]
 */
describe('ScopeItem', () => {

	let peaTestServer: PEA;
	let peaDosierer: PEA;

	before(() => {
		peaDosierer = new PEA(
			JSON.parse(fs.readFileSync('assets/peas/pea_dosierer_1.1.0.json').toString()).peas[0]);
		peaTestServer = new PEA(
			JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString()).peas[0]);
	});

	it('should work for normal expression', () => {
		const extraction = ScopeItem.extractFromExpressionString(
			'PEATestServer.Variable001 + 3', [peaTestServer]);
		expect(extraction.scopeItems).to.have.lengthOf(1);
		expect(extraction.scopeItems[0].name).to.equal('PEATestServer.Variable001');
	});

	it('should work for multiple variables', () => {
		const extraction = ScopeItem.extractFromExpressionString(
			'PEATestServer.Variable001 + PEATestServer.Variable002', [peaTestServer]);
		expect(extraction.scopeItems).to.have.lengthOf(2);
		expect(extraction.scopeItems[0].name).to.equal('PEATestServer.Variable001');
		expect(extraction.scopeItems[1].name).to.equal('PEATestServer.Variable002');
	});

	it('should work for multiple times of same variables', () => {
		const extraction = ScopeItem.extractFromExpressionString(
			'PEATestServer.Variable001 + PEATestServer.Variable001', [peaTestServer]);
		expect(extraction.scopeItems).to.have.lengthOf(1);
		expect(extraction.scopeItems[0].name).to.equal('PEATestServer.Variable001');
	});

	it('should work for expression with special characters', () => {
		const extraction = ScopeItem.extractFromExpressionString('PEATestServer.Variable\\.003 + 3',
			[peaTestServer]);
		expect(extraction.scopeItems).to.have.lengthOf(1);
		expect((extraction.scopeItems[0].dataItem as OpcUaDataItem<any>).nodeId).to.equal('TestServerVariable.3.V');
		expect(extraction.scopeItems[0].name).to.equal('PEATestServer.Variable__003');
	});

	it('should work for @', () => {
		const extraction = ScopeItem.extractFromExpressionString('2 + @PEATestServer.Variable001',
			[peaTestServer]);
		expect(extraction.scopeItems).to.have.lengthOf(1);
		expect((extraction.scopeItems[0].dataItem as OpcUaDataItem<any>).nodeId).to.equal('Variable1.V');
		expect(extraction.scopeItems[0].name).to.equal('PEATestServer.Variable001');
	});

	it('should return null without PEAs', () => {
		expect(ScopeItem.extractFromExpressionVariable('Variable001', []))
			.to.equal(null);
	});

	it('should return ScopeItem 1', () => {
		const item = ScopeItem.extractFromExpressionVariable('Variable001', [peaTestServer]);
		expect(item).to.have.property('pea').to.have.property('id', 'PEATestServer');
		expect(item).to.have.property('name', 'Variable001');
		expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.V');
	});

	it('should return ScopeItem 2', () => {
		const item = ScopeItem.extractFromExpressionVariable('Variable001.VUnit', [peaTestServer]);
		expect(item).to.have.property('pea').to.have.property('id', 'PEATestServer');
		expect(item).to.have.property('name', 'Variable001.VUnit');
		expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.VUnit');
	});

	it('should return ScopeItem 3', () => {
		const item = ScopeItem.extractFromExpressionVariable('Variable001.V', [peaTestServer]);
		expect(item).to.have.property('pea').to.have.property('id', 'PEATestServer');
		expect(item).to.have.property('name', 'Variable001.V');
		expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.V');
	});

	it('should return ScopeItem 4', async () => {
		const item = ScopeItem.extractFromExpressionVariable('PEATestServer.Variable001.VUnit',
			[peaTestServer, peaDosierer]);
		expect(item).to.have.property('pea').to.have.property('id', 'PEATestServer');
		expect(item).to.have.property('name', 'PEATestServer.Variable001.VUnit');
		expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.VUnit');
	});

	it('should return ScopeItem 5', () => {
		const item = ScopeItem.extractFromExpressionVariable('PEATestServer.Service1.Factor',
			[peaTestServer, peaDosierer]);
		expect(item).to.have.property('pea').to.have.property('id', 'PEATestServer');
		expect(item).to.have.property('name', 'PEATestServer.Service1.Factor');
		expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Service1.Factor.V');
	});

	it('should return null when parameter name is not existant', () => {
		const item = ScopeItem.extractFromExpressionVariable('PEATestServer.Service1.Parameter00x',
			[peaTestServer, peaDosierer]);
		expect(item).to.equal(null);
	});

	it('should return null if service name is not existant', () => {
		const item = ScopeItem.extractFromExpressionVariable('PEATestServer.Service5.Parameter00x',
			[peaTestServer, peaDosierer]);
		expect(item).to.equal(null);
	});

	it('should return null when no PEA is given and more than one PEA available', () => {
		expect(ScopeItem.extractFromExpressionVariable('Variable001', [peaTestServer, peaDosierer]))
			.to.equal(null);
	});

	context('with pea testserver', () => {

		let mockupServer: MockupServer;

		before(async function () {
			this.timeout(5000);
			mockupServer = new MockupServer();
			await mockupServer.start();

			await peaTestServer.connect();
		});

		after(async () => {
			await peaTestServer.disconnect();
			await mockupServer.shutdown();
		});

		it('get scope value for variable', async () => {
			const item = ScopeItem.extractFromExpressionVariable('PEATestServer.Variable001',
				[peaTestServer, peaDosierer]);
			expect(item.getScopeValue()).to.deep.equal({
				'PEATestServer': {
					'Variable001': 20
				}
			});

			//(peaServer.variables[0] as PEATestNumericVariable).v = 3;
			await waitForVariableChange(peaTestServer, 'Variable001', 3);
			expect(item.getScopeValue()).to.deep.equal({
				'PEATestServer': {
					'Variable001': 3
				}
			});

			//(peaServer.variables[0] as PEATestNumericVariable).v = 4;
			await waitForVariableChange(peaTestServer, 'Variable001', 4);
			expect(item.getScopeValue()).to.deep.equal({
				'PEATestServer': {
					'Variable001': 4
				}
			});
		}).timeout(5000);

		it('get scope value for parameter', async () => {
			const item = ScopeItem.extractFromExpressionVariable('PEATestServer.Service1.Factor',
				[peaTestServer, peaDosierer]);

			expect(item.name).to.equal('PEATestServer.Service1.Factor');
			expect((item.dataItem as OpcUaDataItem<any>).nodeId).to.equal('Service1.Factor.V');
			expect(item.getScopeValue()).to.deep.equal({
				'PEATestServer': {
					'Service1': {
						'Factor': 2
					}
				}
			});

			//peaServer.services[0].factor.v = 30;
			await waitForParameterChange(peaTestServer, 'Factor', 30);
			expect(item.getScopeValue()).to.deep.equal({
				'PEATestServer': {
					'Service1': {
						'Factor': 30
					}
				}
			});
		}).timeout(5000);

		it('should work with state', () => {
			const data: { expression: Expression; scopeItems: ScopeItem[] } =
				ScopeItem.extractFromExpressionString('PEATestServer.Service1.state==\'IDLE\'', [peaTestServer]);
			expect(data.scopeItems).to.have.lengthOf(1);
			expect(data.scopeItems[0]).to.have.property('pea').to.have.property('id', 'PEATestServer');
			expect(data.scopeItems[0]).to.have.property('name', 'PEATestServer.Service1.state');
			expect(data.scopeItems[0]).to.have.property('dataItem').to.have.property('nodeId', 'Service1.State');

			const tasks = data.scopeItems.map((item) => {
				return item.getScopeValue();
			});
			const assign = require('assign-deep');
			const scope = assign(...tasks);
			expect(scope).to.deep.equal({
				PEATestServer: {
					Service1: {
						state: 'IDLE'
					}
				}
			});
			expect(data.expression.evaluate(scope)).to.equal(true);
		});

	});
});
