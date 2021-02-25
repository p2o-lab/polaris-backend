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

import {PEAOptions} from '@p2olab/polaris-interface';
import {PEA} from '../../../pea';
import {ServiceState} from '../../../pea/dataAssembly';
import {Timer} from '../Timer';
import {
	AggregatedService,
	AggregatedServiceOptions,
	CommandEnableOptions,
	StateMachineOptions
} from './AggregatedService';

import {expect} from 'chai';
import * as fs from 'fs';
import {MockupServer} from '../../../_utils';

describe('AggregatedService', () => {

	it('creates with two aggregated timers', () => {
		const t1 = new Timer('t1');
		const t2 = new Timer('t2');

		const as = new AggregatedService({
			name: 'as_test',
			type: 'aggregatedService',
			necessaryServices: [
				{pea: '', service: 't1'},
				{pea: '', service: 't2'}
			],
			description: 'boring sync',
			version: '1.0.0',
			parameters: [],
			commandEnable: {} as CommandEnableOptions,
			stateMachine: {} as StateMachineOptions
		}, [], [t1, t2]);
		expect(as.services).to.have.lengthOf(2);
		expect(as.peas).to.have.lengthOf(0);
	});

	describe('with test server', () => {
		let mockupServer1: MockupServer;
		let mockupServer2: MockupServer;
		let pea1: PEA;
		let pea2: PEA;

		beforeEach(async function () {
			const peaJson: PEAOptions =
				JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8')).peas[0];

			this.timeout(5000);
			mockupServer1 = new MockupServer(4334);
			await mockupServer1.start();
			//mockupServer1.startSimulation();

			peaJson.id = 'PEA1';
			peaJson.opcuaServerUrl = 'opc.tcp://127.0.0.1:4334/PEATestServer';
			pea1 = new PEA(peaJson);
			await pea1.connect();

			mockupServer2 = new MockupServer(4335);
			await mockupServer2.start();
			//peaServer2.startSimulation();

			peaJson.id = 'PEA2';
			peaJson.opcuaServerUrl = 'opc.tcp://127.0.0.1:4335/PEATestServer';
			pea2 = new PEA(peaJson);
			await pea2.connect();
		});

		afterEach(async () => {
			await pea1.disconnect();
			await pea2.disconnect();
			await mockupServer1.shutdown();
			await mockupServer2.shutdown();
		});

		it('should work', async () => {
			const aggregatedServiceJson: AggregatedServiceOptions =
				JSON.parse(fs.readFileSync('assets/virtualService/aggregatedService_peatestserver.json', 'utf8'));
			const as = new AggregatedService(aggregatedServiceJson, [pea1, pea2]);

			expect(as.controlEnable).to.deep.equal({
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
			as.start();
			await Promise.all([
				as.waitForStateChangeWithTimeout('EXECUTE'),
				pea1.services[0].waitForStateChangeWithTimeout('EXECUTE'),
				pea2.services[0].waitForStateChangeWithTimeout('EXECUTE')
			]);

			expect(as.controlEnable).to.deep.equal({
				abort: true,
				complete: true,
				pause: true,
				reset: false,
				restart: true,
				resume: false,
				start: false,
				stop: true,
				unhold: false
			});
			as.complete();
			await Promise.all([
				as.waitForStateChangeWithTimeout('COMPLETED'),
				pea1.services[0].waitForStateChangeWithTimeout('COMPLETED'),
				pea2.services[0].waitForStateChangeWithTimeout('COMPLETED')
			]);

			expect(as.controlEnable).to.deep.equal({
				abort: true,
				complete: false,
				pause: false,
				reset: true,
				restart: false,
				resume: false,
				start: false,
				stop: true,
				unhold: false
			});
			as.reset();
			await Promise.all([
				as.waitForStateChangeWithTimeout('IDLE'),
				pea1.services[0].waitForStateChangeWithTimeout('IDLE'),
				pea2.services[0].waitForStateChangeWithTimeout('IDLE')
			]);
		});

		it('should work small', async () => {
			const aggregatedServiceJson: AggregatedServiceOptions = JSON.parse(
				fs.readFileSync('assets/virtualService/aggregatedService_peatestserver_small.json', 'utf8'));
			const as = new AggregatedService(aggregatedServiceJson, [pea1, pea2]);

			as.start();
			await Promise.all([
				as.waitForStateChangeWithTimeout('EXECUTE'),
				pea1.services[0].waitForStateChangeWithTimeout('EXECUTE'),
				pea2.services[0].waitForStateChangeWithTimeout('EXECUTE')
			]);

			as.complete();
			await Promise.all([
				as.waitForStateChangeWithTimeout('COMPLETED'),
				pea1.services[0].waitForStateChangeWithTimeout('COMPLETED'),
				pea2.services[0].waitForStateChangeWithTimeout('COMPLETED')
			]);

			as.reset();
			await Promise.all([
				as.waitForStateChangeWithTimeout('IDLE'),
				pea1.services[0].waitForStateChangeWithTimeout('IDLE'),
				pea2.services[0].waitForStateChangeWithTimeout('IDLE')
			]);

		}).timeout(5000);

		it('should work with complete cycle', async () => {
			const aggregatedServiceJson: AggregatedServiceOptions = JSON.parse(
				fs.readFileSync('assets/virtualService/aggregatedService_peatestserver_small.json', 'utf8'));
			const as = new AggregatedService(aggregatedServiceJson, [pea1, pea2]);

			as.start();
			await as.waitForStateChangeWithTimeout('EXECUTE');

			as.pause();
			await as.waitForStateChangeWithTimeout('PAUSED');

			as.resume();
			await as.waitForStateChangeWithTimeout('EXECUTE');

			as.restart();
			await as.waitForStateChangeWithTimeout('EXECUTE');

			as.stop();
			await as.waitForStateChangeWithTimeout('STOPPED');

			as.abort();
			await as.waitForStateChangeWithTimeout('ABORTED');

		}).timeout(10000);

		it('should work complex', async () => {
			const aggregatedServiceJson: AggregatedServiceOptions = JSON.parse(
				fs.readFileSync('assets/virtualService/aggregatedService_peatestserver_complex.json', 'utf8'));
			const as = new AggregatedService(aggregatedServiceJson, [pea1, pea2]);

			as.start();
			await pea1.services[0].waitForStateChangeWithTimeout('EXECUTE');
			expect(pea1.services[0].state).to.equal(ServiceState.EXECUTE);
			expect(pea2.services[0].state).to.not.equal(ServiceState.EXECUTE);
			expect(as.state).to.not.equal(ServiceState.EXECUTE);

			// wait for second service to be started
			await as.waitForStateChangeWithTimeout('EXECUTE');
			expect(pea1.services[0].state).to.equal(ServiceState.EXECUTE);
			expect(pea2.services[0].state).to.equal(ServiceState.EXECUTE);
			expect(as.state).to.equal(ServiceState.EXECUTE);
		});

	});
});
