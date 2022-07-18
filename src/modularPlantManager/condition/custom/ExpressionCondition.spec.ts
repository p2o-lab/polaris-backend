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

import {ConditionType, PEAOptions} from '@p2olab/polaris-interface';
import {PEA} from '../../pea/PEA';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {MockupServer, waitForVariableChange} from '../../_utils';
import {ExpressionCondition} from './ExpressionCondition';
import {ConditionFactory} from '../ConditionFactory';
import {AnaViewMockup} from '../../pea/dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {ConnectionHandler} from '../../pea/connectionHandler/ConnectionHandler';
import {Endpoint, PEAModel} from '@p2olab/pimad-interface';
import {getEmptyPEAModel} from '../../pea/PEA.mockup';
import {getEndpointDataModel} from '../../pea/connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test for [[ExpressionCondition]]
 */
describe('ExpressionCondition', () => {

	describe('with MockupServer', () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let pea: PEA;
		let anaViewMockup: AnaViewMockup;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			anaViewMockup = new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
			await connectionHandler.connect();

			const peaModel: PEAModel = getEmptyPEAModel();
			peaModel.name = 'PEATestServer';
			peaModel.pimadIdentifier = 'PEATestServer';
			peaModel.endpoints.push({defaultValue: mockupServer.endpoint} as Endpoint);
			peaModel.dataAssemblies.push(anaViewMockup.getDataAssemblyModel());

			pea = new PEA(peaModel);
			await pea.connectAndSubscribe();
		});

		afterEach(async () => {
			if(pea) {
				await pea.disconnectAndUnsubscribe();
			}
			await mockupServer.shutdown();
		});


		it('should work with simple server expression', async () => {
			const expressionCondition = new ExpressionCondition(
				{type: ConditionType.expression, expression: 'PEATestServer.Variable.V>10'}, [pea]);
			expressionCondition.listen();

			expect(expressionCondition.getUsedPEAs().size).to.equal(1);

			anaViewMockup.v = 0;
			await waitForVariableChange(pea, 'Variable', 0);
			expect(expressionCondition).to.have.property('fulfilled', false);
			let value = expressionCondition.getValue();
			expect(value).to.equal(false);

			anaViewMockup.v = 11;
			await waitForVariableChange(pea, 'Variable', 11);
			value = expressionCondition.getValue();
			expect(value).to.equal(true);
			expect(expressionCondition).to.have.property('fulfilled', true);

			anaViewMockup.v = 8;
			await Promise.all([
				new Promise((resolve) => expressionCondition.once('stateChanged', resolve)),
				waitForVariableChange(pea, 'Variable', 8)
			]);
			value = expressionCondition.getValue();
			expect(value).to.equal(false);
			expect(expressionCondition).to.have.property('fulfilled', false);

			expressionCondition.clear();
			anaViewMockup.v = 12;
			expressionCondition.once('stateChanged', () => {
				throw new Error('State has changed after it was cleared');
			});
			await waitForVariableChange(pea, 'Variable', 12);
			value = expressionCondition.getValue();
			expect(value).to.equal(true);
			expect(expressionCondition).to.have.property('fulfilled', undefined);
		}).timeout(5000);

		it('should work with semi-complex expression', async () => {
			const expr: ExpressionCondition = ConditionFactory.create({
				type: ConditionType.expression,
				expression: 'cos(PEATestServer.Variable.V)^2 > 0.9'
			}, [pea]) as ExpressionCondition;
			expr.listen();

			anaViewMockup.v = 3.1;
			await Promise.all([
				new Promise((resolve) => expr.once('stateChanged', resolve)),
				waitForVariableChange(pea, 'Variable', 3.1)
			]);
			let value = expr.getValue();
			expect(value).to.equal(true);

			anaViewMockup.v = 0.7;
			await Promise.all([
				new Promise((resolve) => expr.once('stateChanged', resolve)),
				waitForVariableChange(pea, 'Variable', 0.7)
			]);
			value = expr.getValue();
			expect(value).to.equal(false);
		}).timeout(5000);

		it('should work with complex expression', async () => {
			const expr = ConditionFactory.create({
				type: ConditionType.expression,
				expression: 'sin(a)^2 + cos(PEATestServer.Variable)^2 < 0.5',
				scope: [
					{
						name: 'a',
						pea: 'PEATestServer',
						dataAssembly: 'Variable',
						variable: 'V'
					}
				]
			}, [pea]) as ExpressionCondition;

			anaViewMockup.v = 0.7;
			await new Promise((resolve) => pea.once('variableChanged', resolve));

			const value = expr.getValue();
			expect(value).to.equal(false);
		});
	});
});
