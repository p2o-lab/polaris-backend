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

import {OperationMode, ParameterOptions, ServiceCommand, ServiceControlOptions, ServiceSourceMode,} from '@p2olab/polaris-interface';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {ServiceState} from './enum';
import * as peaModelFileContent from '../../../peaModel.spec.json';
import * as peaModelServices from '../../../peaModel_testservice.spec.json';

import {MockupServer} from '../../../_utils';
import {AnaViewMockup} from '../../dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {ServiceControlMockup} from '../../dataAssembly/serviceControl/ServiceControl.mockup';
import {AnaServParamMockup} from '../../dataAssembly/operationElement/servParam/anaServParam/AnaServParam.mockup';
import {AnaServParam} from '../../dataAssembly';
import {AnaProcessValueInMockup} from '../../dataAssembly/inputElement/processValueIn/AnaProcessValueIn/AnaProcessValueIn.mockup';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {Service} from './Service';
import {PEA} from '../../PEA';
import {DataAssemblyModel, PEAModel, ServiceModel} from '@p2olab/pimad-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;

const peaModel = peaModelFileContent as unknown as PEAModel;

describe('Service', () => {
	const connectionHandler = new ConnectionHandler();

	context('constructor', () => {
		it('should fail with missing options', () => {
			expect(() => new Service({} as ServiceModel, connectionHandler, '')).to.throw('No service options provided.');
		});

		it('should fail with missing name', () => {
			expect(() => new Service(
				{name: '', parameters: [], dataAssembly: {} as DataAssemblyModel, attributes: [], dataSourceIdentifier: '', metaModelRef: '', pimadIdentifier: '', procedures: []},
				connectionHandler, '')
			).to.throw('No service name provided');
		});

		it('should fail with missing PEAController', () => {
			expect(() => new Service(
				{name: '', parameters: [], dataAssembly: {} as DataAssemblyModel, attributes: [], dataSourceIdentifier: '', metaModelRef: '', pimadIdentifier: '', procedures: []},
				connectionHandler, '')
			).to.throw('Creating DataAssembly Error: No Communication dataAssemblies found in DataAssemblyModel');
		});

	});

	it('should reject command if not connected', async () => {
		const pea = new PEA(peaModel as unknown as PEAModel);
		const service = pea.services[0];
		await expect(service.executeCommand(ServiceCommand.start)).to.be.rejectedWith('Can not write node since OPC UA connectionHandleris not established');
	});

	it('should create service from PEATestServer json', () => {
		const serviceModel = peaModel.services[0];
		const service = new Service(serviceModel, connectionHandler, 'root');
		expect(service.name).to.equal('Trigonometry');
	});

	context('get procedure', () => {
		let pea: PEA;
		let service: Service;

		before(() => {
			pea = new PEA(peaModel as unknown as PEAModel);
			service = pea.services[0];
		});

		it('should find procedure', () => {
			const procedure = service.findProcedure(1);
			expect(procedure?.name).to.equal('Trigonometry_default');
		});

		it('should not find non existent procedure', () => {
			const procedure = service.findProcedure(100);
			expect(procedure).to.throw;
		});

		it('should get undefined when getting current procedure when not connected', () => {
			expect(service.currentProcedure).to.equal(undefined);
		});
	});

	context('dynamic test', () => {

		let service: Service;
		let pea: PEA;
		let mockupServer: MockupServer;

		beforeEach(async function () {
			this.timeout(5000);
			//set up mockup
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Trigonometry');
			await mockupServer.start();

			pea = new PEA(peaModel as unknown as PEAModel);
			service = pea.services[0];
			await pea.connect();
		});

		afterEach(async () => {
			await pea.disconnect();
			if(mockupServer) await mockupServer.shutdown();
		});

		it('should get current procedure which is undefined', () => {
			expect(service.currentProcedure).to.equal(undefined);
		});

		it('should not find parameter of indicator element type', () => {
			const param = service.findInputParameter('Trigonometry_default');
			expect(param?.name).to.equal(undefined);
		});

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
			await service.serviceControl.opMode.waitForServiceOpModeToPassSpecificTest(OperationMode.Offline);
			expect(service.serviceControl.opMode.getServiceOperationMode()).to.equal(OperationMode.Offline);

			await service.requestOpMode(OperationMode.Automatic);
			expect(service.serviceControl.opMode.getServiceOperationMode()).to.equal(OperationMode.Automatic);

			await service.requestServiceSourceMode(ServiceSourceMode.Extern);
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

			await service.requestOpMode(OperationMode.Automatic);
			await service.requestServiceSourceMode(ServiceSourceMode.Extern);

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
			service.on('state', () => {
				stateChangeCount++;
			});

			await service.executeCommand(ServiceCommand.start);
			await service.executeCommand(ServiceCommand.restart);
			await service.executeCommand(ServiceCommand.stop);
			await service.executeCommand(ServiceCommand.reset);
			await service.executeCommand(ServiceCommand.start);
			await service.executeCommand(ServiceCommand.pause);
			await service.executeCommand(ServiceCommand.resume);

			await service.executeCommand(ServiceCommand.complete);
			await service.executeCommand(ServiceCommand.abort);
			await service.executeCommand(ServiceCommand.reset);
			await service.executeCommand(ServiceCommand.start);
			await service.executeCommand(ServiceCommand.complete);
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
			const pea = new PEA(peaModelServices as unknown as PEAModel);
			await pea.connect();

			const serviceId = pea.findServiceId('TestService');
			if (!serviceId) {
				throw new Error('ServiceId for service not found.');
			}
			const service = pea.findService(serviceId);
			if (!service) {
				throw new Error('Service not found.');
			}
			const procedure = service.findProcedure(1);
			if (procedure) {
				await service.requestProcedureOperator(procedure.procedureId);
			}
			let curProcedure = service.currentProcedure;
			expect(curProcedure).to.be.undefined;

			await service.start();

			await new Promise((resolve => service.on('state', resolve)));

			curProcedure = service.currentProcedure;
			expect(curProcedure).to.not.be.undefined;
			const paramOptions: ParameterOptions = {value: 5, name: 'AnaProcParam_TestService_factor'};
			expect((procedure?.procedureParameters[0] as AnaServParam).dataItems.VExt.value).to.equal(0);

			await service.setParameters([paramOptions], [pea]);

			await new Promise((resolve => service.on('parameterChanged', resolve)));

			expect((procedure?.procedureParameters[0] as AnaServParam).dataItems.VExt.value).to.equal(5);
			await pea.disconnect();
			await mockupServer.shutdown();
		}).timeout(10000);
	});
});
