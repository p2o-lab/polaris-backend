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

import {ModularPlantManager} from '../ModularPlantManager';
import {ServiceState} from '../pea/dataAssembly';
import {
	FunctionGenerator,
	Storage,
	Timer
} from './polServiceInstances';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {POLServiceFactory} from './POLServiceFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('POLServiceFactory', () => {
	const delay = require('timeout-as-promise');
	const parseJson = require('json-parse-better-errors');

	describe('via ModularPlantManager', () => {
		it('should instantiate two timers', async () => {
			const manager = new ModularPlantManager();
			manager.addPOLService({name: 'timer1', type: 'timer'});
			manager.addPOLService({name: 'timer2', type: 'timer'});

			expect(manager.polServices).to.have.lengthOf(2);
		});
	});

	describe('Factory', () => {
		it('should instantiate timer', () => {
			const timerJson = parseJson(fs.readFileSync('assets/polService/timer.json', 'utf8'), null, 60);

			const timer = POLServiceFactory.create(timerJson);

			expect(timer.json().type).equal('Timer');
			expect(timer.json().name).equal('timer1');
			const json = timer.json().procedures[0];
			expect(json.parameters).deep.equal([
				{
					min: 1,
					name: 'duration',
					unit: 'ms',
					value: 10000
				},
				{
					min: 100,
					name: 'updateRate',
					unit: 'ms',
					value: 1000
				}]);
			expect(json.processValuesOut).to.deep.equal([
				{
					name: 'remainingTime',
					readonly: true,
					unit: 'ms',
					value: 10000
				}
			]);
		});

		it('should instantiate aggregated service', async() => {
			const manager = new ModularPlantManager();
			const peaSet = await manager.loadPEAController(
				JSON.parse(fs.readFileSync('assets/peas/achema_demonstrator/peas_achema.json').toString()));
			expect(peaSet).to.have.lengthOf(3);

			const asJson = parseJson(
				fs.readFileSync('assets/polService/polService_achema_dose_fill.json', 'utf8'), null, 60);

			const aggregatedService = POLServiceFactory.create(asJson, peaSet);

			const json = aggregatedService.json();
			expect(json.type).equal('AggregatedService');
			expect(json.name).equal('DoseFill');
			expect(json.parameters).deep.equal([]);
			expect(json.procedures[0].parameters).deep.equal([
				{
					default: '0',
					name: 'SetVolume',
					type: 'ExtAnaOp',
					unit: '1038'
				}
			]);
		});
		it('should fail with unknown pol service type', () => {
			expect(() => POLServiceFactory.create({type: 'unknown', name: 'myUnknownPOLService'}))
				.to.throw('Unknown pol service type');
		});

	});

	describe('Timer', () => {
		it('should instantiate', () => {
			const timer = new Timer('t1');
			expect(timer.name).to.equal('t1');
			expect(timer.qualifiedName).to.equal('t1');
			expect(timer.state).to.equal(ServiceState.IDLE);
		});

		it('should run', async () => {
			const timer = new Timer('t1');

			const json = timer.json().procedures[0];
			expect(json.parameters).to.have.lengthOf(2);
			expect(json.processValuesIn).to.equal(undefined);
			expect(json.processValuesOut).to.have.lengthOf(1);
			expect(json.reportParameters).to.equal(undefined);
			expect(json.parameters[0]).to.deep.equal({
				'min': 1,
				'name': 'duration',
				'unit': 'ms',
				'value': 10000
			});

			await expect(timer.setParameters([{
				name: 'duron',
				value: 1000
			}])).to.be.rejectedWith('tried to write a non-existent variable');
			await expect(timer.setParameters([{
				name: 'remainingTime',
				value: 1000
			}])).to.be.rejectedWith('tried to write a non-existent variable');

			await timer.setParameters([{name: 'duration', value: 100}, {name: 'updateRate', value: 10}]);

			let hit = 0;
			timer.eventEmitter.on('parameterChanged', (parameterChange) => {
				if (parameterChange.parameter.name === 'remainingTime') {
					hit = hit + 1;
				}
			});
			await timer.start();
			expect(timer.state).to.equal(ServiceState.EXECUTE);
			expect(hit).to.equal(1);
			expect(timer.json().procedures[0].processValuesOut.find((p) => p.name === 'remainingTime'))
				.to.have.property('value')
				.to.equal(100);

			await delay(45);
			expect(hit).to.equal(5);
			expect(timer.json().procedures[0].processValuesOut.find((p) => p.name === 'remainingTime'))
				.to.have.property('value')
				.to.closeTo(55, 5);

			// do not count further on pause
			await timer.pause();
			expect(hit).to.equal(6);
			await delay(25);
			expect(hit).to.equal(6);
			expect(timer.json().procedures[0].processValuesOut.find((p) => p.name === 'remainingTime'))
				.to.have.property('value')
				.to.closeTo(55, 5);

			await timer.resume();
			expect(hit).to.equal(6);
			await delay(12);
			expect(hit).to.equal(7);
			expect(timer.json().procedures[0].processValuesOut.find((p) => p.name === 'remainingTime'))
				.to.have.property('value')
				.to.closeTo(43, 5);

			await delay(20);
			expect(hit).to.equal(9);
			expect(timer.json().procedures[0].processValuesOut.find((p) => p.name === 'remainingTime'))
				.to.have.property('value')
				.to.closeTo(23, 5);

			await timer.reset();
		});

		it('should restart', async () => {
			const timer = new Timer('t1');
			expect(timer.state).to.equal(ServiceState.IDLE);

			timer.start();
			await timer.waitForStateChangeWithTimeout('EXECUTE');
			expect(timer.state).to.equal(ServiceState.EXECUTE);

			timer.restart();
			await timer.waitForStateChangeWithTimeout('EXECUTE');
			expect(timer.state).to.equal(ServiceState.EXECUTE);

			timer.abort();
			await timer.waitForStateChangeWithTimeout('ABORTED');
			expect(timer.state).to.equal(ServiceState.ABORTED);

			expect(timer.commandEnable).to.deep.equal({
				abort: false,
				complete: false,
				hold: false,
				pause: false,
				reset: true,
				restart: false,
				resume: false,
				start: false,
				stop: false,
				unhold: false
			});

			timer.reset();
			await timer.waitForStateChangeWithTimeout('IDLE');
			expect(timer.state).to.equal(ServiceState.IDLE);
		});
	});

	describe('FunctionGenerator', () => {
		it('should run', async () => {
			const f1 = new FunctionGenerator('f1');
			expect(f1.state).to.equal(ServiceState.IDLE);

			let params = f1.json().procedures[0].parameters;
			expect(params).to.have.lengthOf(2);
			expect(f1.json().procedures[0].processValuesOut).to.have.lengthOf(1);

			await f1.setParameters([{name: 'function', value: 'sin(5*t)'}, {name: 'updateRate', value: 100}]);
			await f1.start();
			expect(f1.state).to.equal(ServiceState.EXECUTE);

			await delay(110);
			params = f1.json().procedures[0].processValuesOut;
			let value = params.find((p) => p.name === 'output');
			expect(value).to.have.property('value').to.be.closeTo(0.5, 0.03);
			await f1.pause();
			await delay(100);

			params = f1.json().procedures[0].processValuesOut;
			value = params.find((p) => p.name === 'output');
			expect(value).to.have.property('value').to.be.closeTo(0.841, 0.03);
			await f1.resume();
			await delay(100);

			await f1.stop();

			await f1.reset();
		});
	});

	describe('Storage', () => {
		it('should work', async () => {
			const s1 = new Storage('s1');
			let params = s1.json().procedures[0].parameters;
			expect(params).to.have.lengthOf(1);
			expect(params[0]).to.have.property('name', 'storage');
			expect(params[0]).to.have.property('value', undefined);

			s1.setParameters([{name: 'storage', value: 2}]);
			params = s1.json().procedures[0].parameters;
			expect(params).to.have.lengthOf(1);
			expect(params[0]).to.have.property('name', 'storage');
			expect(params[0]).to.have.property('value', 2);

			s1.setParameters([{name: 'storage', value: 'teststring'}]);
			params = s1.json().procedures[0].parameters;
			expect(params).to.have.lengthOf(1);
			expect(params[0]).to.have.property('name', 'storage');
			expect(params[0]).to.have.property('value', 'teststring');

			await s1.start();
			await s1.complete();
			await s1.reset();
			params = s1.json().procedures[0].parameters;
			expect(params).to.have.lengthOf(1);
		});
	});

	describe('FunctionGenerator', () => {
		it('should work', async () => {
			const f1 = new FunctionGenerator('s1');
			let params = f1.json().procedures[0].parameters;
			expect(params).to.have.lengthOf(2);
			expect(params[0]).to.have.property('name', 'function');
			expect(params[0]).to.have.property('value', 'sin(t)');

			f1.setParameters([{name: 'function', value: '2*t'}]);
			params = f1.json().procedures[0].parameters;
			expect(params[0]).to.have.property('name', 'function');
			expect(params[0]).to.have.property('value', '2*t');

			await f1.start();
			await new Promise((resolve) => {
				f1.eventEmitter.once('parameterChanged', () => {
					resolve();
				});
			});
			params = f1.json().procedures[0].processValuesOut;
			expect(params[0]).to.have.property('name', 'output');
			expect(params[0]).to.have.property('value').to.closeTo(2, 0.5);

			await f1.complete();
			await f1.reset();
		});
	});
});
