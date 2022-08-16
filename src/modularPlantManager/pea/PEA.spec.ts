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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../_utils';
import * as peaModelFileContent from '../peaModel.spec.json';
import {ServiceCommand} from '@p2olab/polaris-interface';
import {AnaViewMockup} from './dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {ServiceControlMockup} from './dataAssembly/serviceControl/ServiceControl.mockup';
import {ServiceState} from './serviceSet/service/enum';
import {Service} from './serviceSet';
import {PEA} from './PEA';
import {PEAModel} from '@p2olab/pimad-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;

const peaModel = peaModelFileContent as unknown as PEAModel;

describe('PEAController', () => {
	it('should instantiate PEA', () => {
		const peaController = new PEA(peaModel as unknown as PEAModel);
		expect(peaController).to.have.property('id', 'test');
		expect(peaController.services).to.have.length(1);
	});

	describe('with MockupServer', () => {

		let mockupServer: MockupServer;
		let pea: PEA;
		let service: Service;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			pea = new PEA(peaModel as unknown as PEAModel);
			service = pea.services[0];
			new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Trigonometry');
			await mockupServer.start();
		});

		afterEach(async () => {
			await pea.disconnect();
			await mockupServer.shutdown();
		});

		context('connect, subscribe',()=>{

			it('should connect and subscribe',  async() => {
				return expect(pea.connect()).to.not.be.rejected;
			});

			it('should fail to subscribe, missing variable on mockupServer',  async() => {
				await mockupServer.shutdown();
				mockupServer = new MockupServer();
				await mockupServer.initialize();
				pea = new PEA(peaModel as unknown as PEAModel);
				new AnaViewMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', true);
				new ServiceControlMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Trigonometry');
				await mockupServer.start();
				return expect(pea.connect()).to.be.rejectedWith('Timeout: Could not subscribe to Variable.V');
			}).timeout(5000);


			it('should fail to connect, invalid endpoint URL',  async() => {
				const faultyPEAModel = peaModel as unknown as PEAModel;
				faultyPEAModel.endpoints[0].value = 'wrongUrl';
				faultyPEAModel.endpoints[0].defaultValue = 'wrongUrl';
				const pea = new PEA(faultyPEAModel as unknown as PEAModel);
				return expect(pea.connect()).to.be.rejectedWith('Invalid endpoint url wrongUrl');
			});

			it('should fail to connect, server down',  async() => {
				await mockupServer.shutdown();
				const faultyPEAOptions = { ...peaModel };
				const pea = new PEA(faultyPEAOptions as unknown as PEAModel);
				return expect(pea.connect()).to.be.rejectedWith(
					'The connectionHandlercannot be established with server opc.tcp://localhost:4334 .\n' +
					'Please check that the server is up and running or your network configuration.\n' +
					'Err = (connect ECONNREFUSED 127.0.0.1:4334)');
			});

			it('should disconnect and unsubscribe',  async() => {
				await pea.connect();
				await pea.disconnect();
			});

		}).timeout(8000);

		context('control Services',async ()=> {

			it('should stopAllServices()',  async() => {
				await pea.connect();
				await service.executeCommand(ServiceCommand.start);
				await pea.stopAllServices();
				expect(service.state).to.equal(ServiceState.STOPPED);
			});

			it('should fail to stopAllServices(), command not executable',async() => {
				await pea.connect();
				await pea.stopAllServices();
				return expect(pea.stopAllServices()).to.be.rejectedWith('Command is not executable');
			});

			it('should abortAllServices()',  async() => {
				await pea.connect();
				await service.executeCommand(ServiceCommand.start);
				await pea.abortAllServices();
				expect(service.state).to.equal(ServiceState.ABORTED);
			});

			it('should pause()',  async() => {
				await pea.connect();
				await service.executeCommand(ServiceCommand.start);
				await pea.pauseAllServices();
				expect(service.state).to.equal(ServiceState.PAUSED);
			});

			it('should fail to pause(), command not executable',  async() => {
				await pea.connect();
				return expect(pea.pauseAllServices()).to.be.rejectedWith('Command is not executable');
			});

			it('should resume()', async() => {
				await pea.connect();
				await service.executeCommand(ServiceCommand.start);
				await service.executeCommand(ServiceCommand.pause);
				await pea.pauseAllServices();
				expect(service.state).to.equal(ServiceState.EXECUTE);
			}).timeout(10000);

			it('should fail to resume(), command not executable',  async() => {
				await pea.connect();
				return expect(pea.resumeAllServices()).to.be.rejectedWith('Command is not executable');
			});
		});
	});
});
