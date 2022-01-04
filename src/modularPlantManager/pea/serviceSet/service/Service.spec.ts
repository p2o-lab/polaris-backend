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
	OperationMode, ParameterOptions, PEAOptions,
	ServiceCommand,
	ServiceControlOptions,
	ServiceOptions, ServiceSourceMode,
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../../connection';
import {PEAController, Service} from '../../index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {ServiceState} from './enum';
import * as peaOptions from '../../../peaOptions.spec.json';
import * as peaOptionsServices from '../../../peaOptions_testservice.spec.json';

import {MockupServer} from '../../../_utils';
import {AnaViewMockup} from '../../dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {ServiceControlMockup} from '../../dataAssembly/ServiceControl/ServiceControl.mockup';
import {AnaServParamMockup} from '../../dataAssembly/operationElement/servParam/anaServParam/AnaServParam.mockup';
import {AnaServParam} from '../../dataAssembly';
import {AnaProcessValueInMockup} from '../../dataAssembly/inputElement/processValueIn/AnaProcessValueIn/AnaProcessValueIn.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Service', () => {
	const opcUAConnection = new OpcUaConnection();

	context('constructor', () => {
		it('should fail with missing options', () => {
			expect(() => new Service({} as ServiceOptions, opcUAConnection, '')).to.throw('No service options provided.');
		});

		it('should fail with missing name', () => {
			expect(() => new Service(
				{name: '', parameters: [], communication: {} as ServiceControlOptions, procedures: []},
				opcUAConnection, '')
			).to.throw('No service name provided');
		});

		it('should fail with missing PEAController', () => {
			expect(() => new Service(
				{name: 'test', parameters: [], communication: {} as ServiceControlOptions, procedures: []},
				opcUAConnection, '')
			).to.throw('Creating DataAssemblyController Error: No Communication variables found in DataAssemblyOptions');
		});

	});

	it('should reject command if not connected', async () => {
		const pea = new PEAController(peaOptions as unknown as PEAOptions);
		const service = pea.services[0];
		await expect(service.executeCommand(ServiceCommand.start)).to.be.rejectedWith('Can not write node since OPC UA connection to PEA test is not established');
	});

	it('should create service from PEATestServer json', () => {
		const serviceOptions = peaOptions.services[0];
		const service = new Service(serviceOptions as unknown as ServiceOptions, opcUAConnection, 'root');
		expect(service.name).to.equal('Trigonometry');
	});

	context('get procedure', () => {
		let pea: PEAController;
		let service: Service;

		before(() => {
			pea = new PEAController(peaOptions as unknown as PEAOptions);
			service = pea.services[0];
		});

		it('should get default procedure', () => {
			const procedure = service.getDefaultProcedure();
			expect(procedure?.name).to.equal('Trigonometry_default');
		});

		it('should find procedure', () => {
			const procedure = service.getProcedureByNameOrDefault('Trigonometry_default');
			expect(procedure?.name).to.equal('Trigonometry_default');
		});

		it('should not find non existent procedure', () => {
			const procedure = service.getProcedureByNameOrDefault('ProcedureNotThere');
			expect(procedure).to.equal(undefined);
		});

		it('should get undefined when getting current procedure when not connected', () => {
			expect(service.getCurrentProcedure()).to.equal(undefined);
		});
	});

	context('dynamic test', () => {

		let service: Service;
		let pea: PEAController;
		let mockupServer: MockupServer;

		beforeEach(async function () {
			this.timeout(5000);
			//set up mockup
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Trigonometry');
			await mockupServer.start();

			pea = new PEAController(peaOptions as unknown as PEAOptions);
			service = pea.services[0];
			await pea.connectAndSubscribe();
		});

		afterEach(async () => {
			await pea.disconnectAndUnsubscribe();
			if(mockupServer) await mockupServer.shutdown();
		});

/*		it('should get default procedure for default procedure', () => {
			expect(service.getCurrentProcedure()).to.equal(service.getDefaultProcedure());
			//TODO: fix
		});

		it('should find parameter', () => {
			const param = service.findInputParameter('Offset');
			expect(param?.name).to.equal('Offset');
			//TODO: fix
		});*/

		it('should provide correct JSON', () => {
			expect(ServiceState[service.state]).to.equal('IDLE');
			const result = service.json();
			expect(result).to.have.property('status', 'IDLE');
		});

		it('should reject command if not command enabled', async () => {
			expect(service.name).to.equal('Trigonometry');
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
			await expect(service.executeCommand(ServiceCommand.resume)).to.be.rejectedWith('One or more arguments are invalid.');
		});

		it('waitForOpModeSpecificTest', async () => {
			await service.serviceControl.opMode.waitForOpModeToPassSpecificTest(OperationMode.Offline);
			expect(service.serviceControl.opMode.getOperationMode()).to.equal(OperationMode.Offline);

			service.setOperationMode();

			await service.serviceControl.opMode.waitForOpModeToPassSpecificTest(OperationMode.Automatic);
			expect(service.serviceControl.opMode.getOperationMode()).to.equal(OperationMode.Automatic);

			await service.serviceControl.serviceSourceMode.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
			expect(service.serviceControl.serviceSourceMode.getServiceSourceMode()).to.equal(ServiceSourceMode.Extern);
		}).timeout(3000);

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

			//expect(result).to.have.property('currentProcedure', 'Procedure 1');
			expect(result).to.have.property('name', 'Trigonometry');
			expect(result).to.have.property('operationMode').to.equal('offline');
			expect(result).to.have.property('serviceSourceMode').to.equal('intern');

			await service.setOperationMode();

			result = service.json();
			expect(result).to.have.property('status', 'IDLE');
			expect(result).to.have.property('controlEnable').to.deep.equal({
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

			expect(result).to.have.property('operationMode').to.equal('automatic');
			expect(result).to.have.property('serviceSourceMode').to.equal('extern');

	/*		expect(result.procedures[0].processValuesIn).to.have.length(1);
			expect(result.procedures[0].processValuesIn[0].value).to.equal(1);
			expect(result.procedures[0].processValuesOut).to.have.length(3);
			expect(result.procedures[0].reportParameters).to.have.length(3);*/

			let stateChangeCount = 0;
			service.eventEmitter.on('state', () => {
				stateChangeCount++;
			});

			await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.restart);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.stop);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.reset);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.pause);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.resume);

			await service.executeCommandAndWaitForStateChange(ServiceCommand.complete);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.abort);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.reset);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
			await service.executeCommandAndWaitForStateChange(ServiceCommand.complete);
			expect(stateChangeCount).to.equal(11);
		}).timeout(10000);

		//TODO hold, unhold


	});
	context('parameter dynamic', () => {
		it('set Parameter', async () => {
			const mockupServer = new MockupServer();
			await mockupServer.initialize();

			new AnaServParamMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService.AnaConfParam_TestService_updateRate');
			new AnaServParamMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService.AnaProcParam_TestService_factor');
			new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService.AnaReportValue_TestService_rvTime');
			new AnaProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService.AnaProcessValueIn_TestService_pv');
			new AnaProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService.AnaProcessValueOut_TestService_pvOutIntegral');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService');

			await mockupServer.start();
			const pea = new PEAController(peaOptionsServices as unknown as PEAOptions);
			await pea.connectAndSubscribe();

			const service = pea.getService('TestService');
			const procedure = service.getProcedureByNameOrDefault('TestService_default');
			if (procedure) {
				await service.setProcedure(procedure);
			}
			let curProcedure = await service.getCurrentProcedure();
			expect(curProcedure).to.be.undefined;

			await service.start();

			await new Promise((resolve => service.serviceControl.on('state', resolve)));

			curProcedure = await service.getCurrentProcedure();
			expect(curProcedure).to.not.be.undefined;
			const paramOptions: ParameterOptions = {value: 5, name: 'AnaProcParam_TestService_factor'};
			expect((procedure?.parameters[0] as AnaServParam).communication.VExt.value).to.equal(0);

			await service.setParameters([paramOptions], [pea]);

			await new Promise((resolve => service.serviceControl.on('parameterChanged', resolve)));

			expect((procedure?.parameters[0] as AnaServParam).communication.VExt.value).to.equal(5);
			await pea.disconnectAndUnsubscribe();
			await mockupServer.shutdown();
		}).timeout(10000);
	});
});
