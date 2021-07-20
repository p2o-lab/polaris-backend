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

import {
	OperationMode,
	ServiceCommand,
	ServiceControlOptions,
	ServiceOptions, ServiceSourceMode,
	SourceMode
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../../connection';
import {PEAController, Service} from '../../index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {ServiceState} from './enum';
import {PEAMockup} from '../../PEA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Service', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const parseJson = require('json-parse-better-errors');
	const opcUAConnection = new OpcUaConnection('', '');

	// eslint-disable-next-line no-undef
	context('constructor', () => {
		it('should fail with missing options', () => {
			expect(() => new Service({} as ServiceOptions, opcUAConnection, '')).to.throw();
		});

		it('should fail with missing name', () => {
			expect(() => new Service(
				{name: '', parameters: [], communication: {} as ServiceControlOptions, procedures: []},
				opcUAConnection, '')
			).to.throw('No service name');
		});

		it('should fail with missing PEAController', () => {
			expect(() => new Service(
				{name: 'test', parameters: [], communication: {} as ServiceControlOptions, procedures: []},
				opcUAConnection, '')
			).to.throw('creteDataItem Failed');
		});

	});

	it('should reject command if not connected', async () => {
		const peaJson =
			parseJson(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'), null, 60)
				.peas[0];
		const pea = new PEAController(peaJson);
		const service = pea.services[0];
		await expect(service.executeCommand(ServiceCommand.start)).to.be.rejectedWith('PEAController is not connected');
	});

	it('should create service from PEATestServer json', () => {
		const json =
			parseJson(fs.readFileSync('src/modularPlantManager/pea/_assets/JSON/pea_testserver_1.0.0_2.json', 'utf8'), null, 60)
				.peas[0].services[0];
		const service = new Service(json, opcUAConnection, 'root');
		expect(service.name).to.equal('Service1');
	});

	// eslint-disable-next-line no-undef
	context('with PEATestServer', () => {
		let pea: PEAController;
		let service: Service;

		// eslint-disable-next-line no-undef
		before(() => {
			const peaJson =
				parseJson(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'), null, 60)
					.peas[0];
			pea = new PEAController(peaJson);
			service = pea.services[0];
		});

		it('should get default procedure', () => {
			const procedure = service.getDefaultProcedure();
			expect(procedure?.name).to.equal('Procedure 1');
		});

		it('should find procedure', () => {
			const procedure = service.getProcedureByNameOrDefault('Procedure 1');
			expect(procedure?.name).to.equal('Procedure 1');
		});

		it('should find procedure 2', () => {
			const procedure = service.getProcedureByNameOrDefault('ProcedureNotThere');
			expect(procedure).to.equal(undefined);
		});

		it('should get undefined when getting current procedure when not connected', () => {
			expect(service.getCurrentProcedure()).to.equal(undefined);
		});
	});

	// eslint-disable-next-line no-undef
	context('dynamic test', () => {
		let peaServer: PEAMockup;
		let service: Service;
		//let testService: TestServerService;
		let pea: PEAController;

		beforeEach(async function () {
			this.timeout(5000);
			peaServer = new PEAMockup();
			//await peaServer.start();
			peaServer.startSimulation();
			//testService = peaServer.services[0];

			const peaJson =
				parseJson(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'), null, 60)
					.peas[0];
			pea = new PEAController(peaJson);
			service = pea.services[0];
			await pea.connectAndSubscribe();
		});

		afterEach(async () => {
			await pea.disconnectAndUnsubscribe();
			peaServer.stopSimulation();
		});

		it('should get default procedure for default procedure', () => {
			expect(service.getCurrentProcedure()).to.equal(service.getDefaultProcedure());
		});

		it('should find parameter', () => {
			const param = service.findInputParameter('Offset');
			expect(param?.name).to.equal('Offset');
		});

		it('should provide correct JSON', () => {
			expect(ServiceState[service.state]).to.equal('IDLE');
			const result = service.json();
			expect(result).to.have.property('status', 'IDLE');
		});

		it('should reject command if not command enabled', async () => {
			expect(service.name).to.equal('Service1');
			expect(ServiceState[service.state]).to.equal('IDLE');
			expect(service.commandEnable).to.deep.equal({
				abort: true,
				complete: false,
				pause: false,
				reset: false,
				restart: false,
				resume: false,
				start: true,
				stop: true,
				hold: false,
				unhold: false
			});

			await service.executeCommand(ServiceCommand.start);
			await service.waitForStateChangeWithTimeout('STARTING');
			expect(service.commandEnable).to.deep.equal({
				abort: true,
				complete: false,
				pause: false,
				reset: false,
				restart: false,
				resume: false,
				start: false,
				stop: true,
				hold: false,
				unhold: false
			});

			await expect(service.executeCommand(ServiceCommand.resume)).to.be.rejectedWith('ControlOp');
			expect(service.commandEnable).to.deep.equal({
				abort: true,
				complete: false,
				pause: false,
				reset: false,
				restart: false,
				resume: false,
				start: false,
				stop: true,
				hold: false,
				unhold: false
			});
		});

		it('waitForOpModeSpecificTest', async () => {
			//testService.opMode.opMode = OperationMode.Offline;
			await service.serviceControl.opMode.waitForOpModeToPassSpecificTest(OperationMode.Offline);
			expect(service.serviceControl.opMode.getOperationMode()).to.equal(OperationMode.Offline);

			service.setOperationMode();

			await service.serviceControl.opMode.waitForOpModeToPassSpecificTest(OperationMode.Automatic);
			expect(service.serviceControl.opMode.getOperationMode()).to.equal(OperationMode.Automatic);

			await service.serviceControl.serviceSourceMode.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
			expect(service.serviceControl.serviceSourceMode.getServiceSourceMode()).to.equal(ServiceSourceMode.Extern);
		});

		it('full service state cycle', async () => {
			let result = service.json();
			expect(result).to.have.property('status', 'IDLE');
			expect(result).to.have.property('controlEnable')
				.to.deep.equal({
				abort: true,
				complete: false,
				pause: false,
				reset: false,
				restart: false,
				resume: false,
				start: true,
				stop: true,
				hold: false,
				unhold: false
			});

			expect(result).to.have.property('currentProcedure', 'Procedure 1');
			expect(result).to.have.property('name', 'Service1');
			expect(result).to.have.property('operationMode').to.equal('offline');
			expect(result).to.have.property('sourceMode').to.equal('manual');

			await service.setOperationMode();

			result = service.json();
			expect(result).to.have.property('status', 'IDLE');
			expect(result).to.have.property('controlEnable')
				.to.deep.equal({
				abort: true,
				complete: false,
				pause: false,
				reset: false,
				restart: false,
				resume: false,
				start: true,
				stop: true,
				hold: false,
				unhold: false
			});

			expect(result).to.have.property('currentProcedure', 'Procedure 1');
			expect(result).to.have.property('name', 'Service1');
			expect(result).to.have.property('operationMode').to.equal('automatic');
			expect(result).to.have.property('sourceMode').to.equal('manual');

			expect(result.procedures[0].processValuesIn).to.have.length(1);
			expect(result.procedures[0].processValuesIn[0].value).to.equal(1);
			expect(result.procedures[0].processValuesOut).to.have.length(3);
			expect(result.procedures[0].reportParameters).to.have.length(3);

			let stateChangeCount = 0;
			service.eventEmitter.on('state', () => {
				stateChangeCount++;
			});

			service.executeCommand(ServiceCommand.start);
			await service.waitForStateChangeWithTimeout('STARTING');
			await service.waitForStateChangeWithTimeout('EXECUTE');

			service.executeCommand(ServiceCommand.restart);
			await service.waitForStateChangeWithTimeout('STARTING');
			await service.waitForStateChangeWithTimeout('EXECUTE');

			service.executeCommand(ServiceCommand.stop);
			await service.waitForStateChangeWithTimeout('STOPPING');
			await service.waitForStateChangeWithTimeout('STOPPED');

			service.executeCommand(ServiceCommand.reset);
			await service.waitForStateChangeWithTimeout('IDLE');

			service.executeCommand(ServiceCommand.start);
			await service.waitForStateChangeWithTimeout('STARTING');
			await service.waitForStateChangeWithTimeout('EXECUTE');

			service.executeCommand(ServiceCommand.pause);
			await service.waitForStateChangeWithTimeout('PAUSING');
			await service.waitForStateChangeWithTimeout('PAUSED');

			service.executeCommand(ServiceCommand.resume);
			await service.waitForStateChangeWithTimeout('RESUMING');
			await service.waitForStateChangeWithTimeout('EXECUTE');

			service.executeCommand(ServiceCommand.hold);
			await service.waitForStateChangeWithTimeout('HOLDING');
			await service.waitForStateChangeWithTimeout('HELD');

			service.executeCommand(ServiceCommand.unhold);
			await service.waitForStateChangeWithTimeout('UNHOLDING');
			await service.waitForStateChangeWithTimeout('EXECUTE');

			service.executeCommand(ServiceCommand.complete);
			await service.waitForStateChangeWithTimeout('COMPLETING');
			await service.waitForStateChangeWithTimeout('COMPLETED');

			service.executeCommand(ServiceCommand.abort);
			await service.waitForStateChangeWithTimeout('ABORTING');
			await service.waitForStateChangeWithTimeout('ABORTED');

			service.executeCommand(ServiceCommand.reset);
			await service.waitForStateChangeWithTimeout('IDLE');

			service.executeCommand(ServiceCommand.start);
			await service.waitForStateChangeWithTimeout('STARTING');
			await service.waitForStateChangeWithTimeout('EXECUTE');

			service.executeCommand(ServiceCommand.complete);
			await service.waitForStateChangeWithTimeout('COMPLETING');
			await service.waitForStateChangeWithTimeout('COMPLETED');

			expect(stateChangeCount).to.equal(22);
		}).timeout(6000).slow(4000);
	});
});
