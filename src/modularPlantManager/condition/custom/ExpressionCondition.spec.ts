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

import {ConditionType} from '@p2olab/polaris-interface';
import {PEA} from '../../pea';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {MockupServer, waitForVariableChange, PEATestNumericVariable} from '../../_utils';
import {ExpressionCondition} from './ExpressionCondition';
import {ConditionFactory} from '../ConditionFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test for [[Condition]]
 */
describe('ConditionFactory', () => {
	describe('without test server', () => {
		// TODO: Add Test
	});

	describe('with MockupServer', () => {
		let mockupServer: MockupServer;
		let pea: PEA;
		let var0: PEATestNumericVariable;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.start();
		});

		afterEach(async () => {
			await mockupServer.shutdown();
		});

		describe('ExpressionCondition', () => {

			it('should work with simple server expression', async () => {
				const expr = new ExpressionCondition(
					{type: ConditionType.expression, expression: 'PEATestServer.Variable001.V>10'}, [pea]);
				expr.listen();

				expect(expr.getUsedPEAs().size).to.equal(1);

				var0.v = 0;
				await waitForVariableChange(pea, 'Variable001', 0);
				expect(expr).to.have.property('fulfilled', false);
				let value = expr.getValue();
				expect(value).to.equal(false);

				var0.v = 11;
				await waitForVariableChange(pea, 'Variable001', 11);
				value = expr.getValue();
				expect(value).to.equal(true);
				expect(expr).to.have.property('fulfilled', true);

				var0.v = 8;
				await Promise.all([
					new Promise((resolve) => expr.once('stateChanged', resolve)),
					waitForVariableChange(pea, 'Variable001', 8)
				]);
				value = expr.getValue();
				expect(value).to.equal(false);
				expect(expr).to.have.property('fulfilled', false);

				expr.clear();
				var0.v = 12;
				expr.once('stateChanged', () => {
					throw new Error('State has changed after it was cleared');
				});
				await waitForVariableChange(pea, 'Variable001', 12);
				value = expr.getValue();
				expect(value).to.equal(true);
				expect(expr).to.have.property('fulfilled', undefined);
			}).timeout(5000);

			it('should work with semi-complex expression', async () => {
				const expr: ExpressionCondition = ConditionFactory.create({
					type: ConditionType.expression,
					expression: 'cos(PEATestServer.Variable001.V)^2 > 0.9'
				}, [pea]) as ExpressionCondition;
				expr.listen();

				var0.v = 3.1;
				await Promise.all([
					new Promise((resolve) => expr.once('stateChanged', resolve)),
					waitForVariableChange(pea, 'Variable001', 3.1)
				]);
				let value = expr.getValue();
				expect(value).to.equal(true);

				var0.v = 0.7;
				await Promise.all([
					new Promise((resolve) => expr.once('stateChanged', resolve)),
					waitForVariableChange(pea, 'Variable001', 0.7)
				]);
				value = expr.getValue();
				expect(value).to.equal(false);
			}).timeout(5000);

			it('should work with complex expression', async () => {
				const expr = ConditionFactory.create({
					type: ConditionType.expression,
					expression: 'sin(a)^2 + cos(PEATestServer.Variable001)^2 < 0.5',
					scope: [
						{
							name: 'a',
							pea: 'PEATestServer',
							dataAssembly: 'Variable001',
							variable: 'V'
						}
					]
				}, [pea]) as ExpressionCondition;

				var0.v = 0.7;
				await new Promise((resolve) => pea.once('variableChanged', resolve));

				const value = expr.getValue();
				expect(value).to.equal(false);
			});

		});

	});

});
