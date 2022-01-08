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

import {ConditionType, PEAOptions, ServiceOptions} from '@p2olab/polaris-interface';
import {PEAController} from '../pea';
import {ConditionFactory, ExpressionCondition, NotCondition, TimeCondition} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as peaOptions from '../peaOptions.spec.json';
import {MockupServer, waitForVariableChange} from '../_utils';
import {AnaViewMockup} from '../pea/dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {OpcUaConnection} from '../pea/connection';
import {ServiceControlMockup} from '../pea/dataAssembly/serviceControl/ServiceControl.mockup';
import {ProcedureOptions} from '@p2olab/polaris-interface/dist/service/options';
import {HealthStateViewMockup} from '../pea/dataAssembly/diagnosticElement/healthStateView/HealthStateView.mockup';
import {ServiceMtpCommand} from '../pea/serviceSet/service/enum';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test for [[Condition]]
 */
describe('Condition', () => {
	const delay = require('timeout-as-promise');
	describe('without test server', () => {

		it('should listen to a time condition of 0.1s', (done) => {
			const condition = new TimeCondition({type: ConditionType.time, duration: 0.1});

			expect(condition.json()).to.deep.equal({type: 'time', duration: 0.1});

			expect(condition).to.have.property('fulfilled', false);

			condition.listen().on('stateChanged', () => {
				expect(condition).to.have.property('fulfilled', true);
				done();
			});

			expect(condition).to.have.property('fulfilled', false);
		});

		it('should listen to an AND condition of two time conditions', async () => {
			const condition = ConditionFactory.create({
				type: ConditionType.and,
				conditions: [
					{type: ConditionType.time, duration: 0.2},
					{type: ConditionType.time, duration: 0.1}
				]
			}, []);
			expect(condition.json()).to.deep.equal({
				type: 'and',
				conditions:
					[{type: 'time', duration: 0.2},
						{type: 'time', duration: 0.1}]
			});
			condition.listen().on('stateChanged', () => {
				expect(condition).to.have.property('fulfilled', true);
			});
			expect(condition).to.have.property('fulfilled', false);
			await delay(150);
			expect(condition).to.have.property('fulfilled', false);
			await delay(60);
			expect(condition).to.have.property('fulfilled', true);
		});

		it('should listen to a OR condition of two time conditions', async () => {
			const condition = ConditionFactory.create({
				type: ConditionType.or,
				conditions: [
					{type: ConditionType.time, duration: 0.5},
					{type: ConditionType.time, duration: 0.1}
				]
			}, []);
			expect(condition.json()).to.deep.equal({
				type: 'or',
				conditions:
					[{type: 'time', duration: 0.5},
						{type: 'time', duration: 0.1}]
			});
			let hit = false;
			condition.listen().on('stateChanged', () => {
				expect(condition).to.have.property('fulfilled', true);
				hit = true;
			});
			await delay(60);
			expect(condition).to.have.property('fulfilled', false);
			await delay(50);
			expect(condition).to.have.property('fulfilled', true);
			expect(hit).to.equal(true);
		});

		it('should listen to a NOT condition', async () => {
			const condition: NotCondition = ConditionFactory.create({
				type: ConditionType.not,
				condition: {type: ConditionType.time, duration: 0.1}
			}, []) as NotCondition;
			expect(condition.json()).to.deep.equal({type: 'not', condition: {type: 'time', duration: 0.1}});

			condition.listen();
			await delay(10);
			expect(condition).to.have.property('fulfilled', true);
			await delay(100);
			expect(condition).to.have.property('fulfilled', false);

			condition.clear();
		});

		it('should fail with wrong parameter', () => {
			expect(() => ConditionFactory.create({type: ConditionType.time, duration: -10}, []))
				.to.throw();
		});

		describe('ExpressionCondition', () => {

			it('should work with simple expression', async () => {
				const expr = new ExpressionCondition({type: ConditionType.expression, expression: '4>3'});
				expr.listen();
				const value = expr.getValue();
				expect(value).to.equal(true);
			});

			it('should work with complex expression', async () => {

				const pea = new PEAController(peaOptions as unknown as PEAOptions);
				const expr = ConditionFactory.create({
					type: ConditionType.expression,
					expression: 'sin(a)^2 + cos(a)^2 < 0.5',
					scope: [
						{
							name: 'a',
							pea: `${pea.id}`,
							dataAssembly: 'Variable',
							variable: 'V'
						}
					]
				}, [pea]) as ExpressionCondition;
				expect(expr.getValue()).to.equal(false);
			});
		});
	});


describe('with MockupServer containing a PEAController', () => {

	let mockupServer: MockupServer;
	let connection: OpcUaConnection;
	let pea: PEAController;
	let anaViewMockup: AnaViewMockup;
	let serviceControlMockup: ServiceControlMockup;
	let healthStateViewMockup: HealthStateViewMockup;

		beforeEach(async function () {
			this.timeout(10000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			anaViewMockup = new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
			serviceControlMockup = new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject,'Service1');
			healthStateViewMockup = new HealthStateViewMockup(mockupServer.nameSpace, mockupServer.rootObject,'Procedure1');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();

			const procedureOptions: ProcedureOptions = {
				dataAssembly: [healthStateViewMockup.getDataAssemblyOptions()],
				id: 'Procedure1',
				isDefault: true,
				isSelfCompleting: false,
				name: 'Procedure1',
				parameters: []
			};

			const serviceOptions: ServiceOptions = {
				communication: serviceControlMockup.getDataAssemblyOptions().dataItems as any,
				name: 'Service1',
				procedures: [procedureOptions]};

			const peaOptions: PEAOptions = {
				dataAssemblies: [anaViewMockup.getDataAssemblyOptions()],
				id: 'PEATestServer',
				name: 'PEATestServer',
				opcuaServerUrl: mockupServer.endpoint,
				pimadIdentifier: '',
				services: [serviceOptions]
			};

			pea = new PEAController(peaOptions);
			await pea.connectAndSubscribe();
		});

		afterEach(async () => {
			if(pea) {
				await pea.disconnectAndUnsubscribe();
			}
			await mockupServer.shutdown();
		});

		it('specialized as VariableCondition should work', async () => {
			const condition = ConditionFactory.create({
				type: ConditionType.variable,
				pea: 'PEATestServer',
				dataAssembly: 'Variable',
				variable: 'V',
				operator: '>',
				value: 25
			}, [pea]);

			condition.listen();
			expect(condition).to.have.property('fulfilled', undefined);
			await new Promise((resolve) => pea.once('variableChanged', resolve));
			expect(condition).to.have.property('fulfilled', false);

			anaViewMockup.v = 22;
			await waitForVariableChange(pea, 'Variable', 22);
			expect(condition).to.have.property('fulfilled', false);

			anaViewMockup.v = 26;
			await new Promise<void>((resolve) => {
				condition.once('stateChanged', () => {
					resolve();
				});
			});
			expect(condition).to.have.property('fulfilled', true);

			condition.clear();
			anaViewMockup.v = 24.4;
			expect(condition).to.have.property('fulfilled', undefined);
			anaViewMockup.v = 37;
			expect(condition).to.have.property('fulfilled', undefined);

		}).timeout(10000);

		it('specialized as StateCondition should work', async function () {

			const condition = ConditionFactory.create({
				type: ConditionType.state,
				pea: 'PEATestServer',
				service: 'Service1',
				state: 'completed'
			}, [pea]);
			expect(condition.json()).to.deep.equal(
				{
					pea: 'PEATestServer',
					service: 'Service1',
					state: 'completed',
					type: 'state'
				});

			condition.listen();

			expect(pea.services[0]).to.have.property('name', 'Service1');
			expect(condition).to.have.property('fulfilled', false);

			serviceControlMockup.sendCommand(ServiceMtpCommand.START);
			await delay(100);
			expect(condition).to.have.property('fulfilled', false);
			serviceControlMockup.sendCommand(ServiceMtpCommand.COMPLETE);
			await new Promise<void>((resolve) => {
				condition.on('stateChanged', function test(state) {
					if (state) {
						condition.removeListener('stateChanged', test);
						resolve();
					}
				});
			});
			expect(condition).to.have.property('fulfilled', true);

			condition.clear();
			expect(condition).to.have.property('fulfilled', undefined);
			serviceControlMockup.sendCommand(ServiceMtpCommand.START);
			await delay(100);
			expect(condition).to.have.property('fulfilled', undefined);
			serviceControlMockup.sendCommand(ServiceMtpCommand.COMPLETE);
			await delay(100);
			expect(condition).to.have.property('fulfilled', undefined);

		}).timeout(5000);

		it('should not react on a closed condition', async () => {

			const condition = ConditionFactory.create({
				type: ConditionType.state,
				pea: 'PEATestServer',
				service: 'Service1',
				state: 'completed'
			}, [pea]);

			condition.listen();
			expect(condition).to.have.property('fulfilled', false);
			expect(condition.listenerCount('stateChanged')).to.equal(0);

			condition.clear();
			expect(condition).to.have.property('fulfilled', undefined);
			expect(condition.listenerCount('stateChanged')).to.equal(0);

			condition.listen();
			expect(condition).to.have.property('fulfilled', false);

			serviceControlMockup.sendCommand(ServiceMtpCommand.START);
			serviceControlMockup.sendCommand(ServiceMtpCommand.COMPLETE);
			await new Promise<void>((resolve) => {
				condition.on('stateChanged', (state) => {
					if (state) {
						resolve();
					}
				});
			});
			condition.clear();
		}).timeout(5000);

		describe('ExpressionCondition', () => {

			it('should work with simple server expression', async () => {
				const expr = new ExpressionCondition(
					{type: ConditionType.expression, expression: 'PEATestServer.Variable.V>10'}, [pea]);
				expr.listen();

				expect(expr.getUsedPEAs().size).to.equal(1);

				anaViewMockup.v = 0;
				await waitForVariableChange(pea, 'Variable', 0);
				expect(expr).to.have.property('fulfilled', false);
				let value = expr.getValue();
				expect(value).to.equal(false);

				anaViewMockup.v = 11;
				await waitForVariableChange(pea, 'Variable', 11);
				value = expr.getValue();
				expect(value).to.equal(true);
				expect(expr).to.have.property('fulfilled', true);

				anaViewMockup.v = 8;
				await Promise.all([
					new Promise((resolve) => expr.once('stateChanged', resolve)),
					waitForVariableChange(pea, 'Variable', 8)
				]);
				value = expr.getValue();
				expect(value).to.equal(false);
				expect(expr).to.have.property('fulfilled', false);

				expr.clear();
				anaViewMockup.v = 12;
				expr.once('stateChanged', () => {
					throw new Error('State has changed after it was cleared');
				});
				await waitForVariableChange(pea, 'Variable', 12);
				value = expr.getValue();
				expect(value).to.equal(true);
				expect(expr).to.have.property('fulfilled', undefined);
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

});
