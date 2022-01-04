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

import {PEAController} from './PEAController';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../_utils';
import * as peaOptions from '../peaOptions.spec.json';
import {PEAOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {AnaViewMockup} from './dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {ServiceControlMockup} from './dataAssembly/serviceControl/ServiceControl.mockup';
import {ServiceState} from './serviceSet/service/enum';
import {Service} from './serviceSet';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PEAController', () => {
	it('should instantiate PEA', () => {
		const peaController = new PEAController(peaOptions as unknown as PEAOptions);
		expect(peaController).to.have.property('id', 'test');
		expect(peaController.services).to.have.length(1);
	});

	describe('with MockupServer', () => {
		let mockupServer: MockupServer;
		let peaController: PEAController;
		let service: Service;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			peaController = new PEAController(peaOptions as unknown as PEAOptions);
			service = peaController.services[0];
			await mockupServer.initialize();
			new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Trigonometry');
			await mockupServer.start();
		});
		afterEach(async () => {
			await peaController.disconnectAndUnsubscribe();
			await mockupServer.shutdown();
		});
		context('connect, subscribe',()=>{
			it('should connect and subscribe',  async() => {
				return expect(peaController.connectAndSubscribe()).to.not.be.rejected;
			});
			it('should fail to subscribe, missing variable on mockupServer',  async() => {
				await mockupServer.shutdown();
				mockupServer = new MockupServer();
				peaController = new PEAController(peaOptions as unknown as PEAOptions);
				await mockupServer.initialize();
				new AnaViewMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Variable', false);
				new ServiceControlMockup(mockupServer.nameSpace,
					mockupServer.rootObject, 'Trigonometry');
				await mockupServer.start();
				return expect(peaController.connectAndSubscribe()).to.be.rejectedWith('Timeout: Could not subscribe to Variable.V');
			}).timeout(5000);


			it('should fail to connect, invalid endpoint URL',  async() => {
				const faultyPEAOptions = { ...peaOptions };
				faultyPEAOptions.opcuaServerUrl = 'wrongUrl';
				const peaController = new PEAController(faultyPEAOptions as unknown as PEAOptions);
				return expect(peaController.connectAndSubscribe()).to.be.rejectedWith('Invalid endpoint url wrongUrl');
			});

			it('should fail to connect, server down',  async() => {
				await mockupServer.shutdown();
				const faultyPEAOptions = { ...peaOptions };
				const peaController = new PEAController(faultyPEAOptions as unknown as PEAOptions);
				return expect(peaController.connectAndSubscribe()).to.be.rejectedWith(
					'The connection cannot be established with server opc.tcp://localhost:4334 .\n' +
					'Please check that the server is up and running or your network configuration.\n' +
					'Err = (connect ECONNREFUSED 127.0.0.1:4334)');
			});

			it('should disconnect and unsubscribe',  async() => {
				await peaController.connectAndSubscribe();
				await peaController.disconnectAndUnsubscribe();
			});

		});

		context('control Services',async ()=> {
			it('should stop()',  async() => {
				await peaController.connectAndSubscribe();
				await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
				await peaController.stop();
				expect(service.state).to.equal(ServiceState.STOPPED);
			});
			it('should fail to stop(), command not executable',async() => {
				await peaController.connectAndSubscribe();
				await peaController.abort();
				return expect(peaController.stop()).to.be.rejectedWith('Command is not executable');
			});

			it('should abort()',  async() => {
				await peaController.connectAndSubscribe();
				await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
				await peaController.abort();
				expect(service.state).to.equal(ServiceState.ABORTED);
			});

			it('should pause()',  async() => {
				await peaController.connectAndSubscribe();
				await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
				await peaController.pause();
				expect(service.state).to.equal(ServiceState.PAUSED);
			});
			it('should fail to pause(), command not executable',  async() => {
				await peaController.connectAndSubscribe();
				return expect(peaController.pause()).to.be.rejectedWith('Command is not executable');
			});

			it('should resume()', async() => {
				await peaController.connectAndSubscribe();
				await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
				await service.executeCommandAndWaitForStateChange(ServiceCommand.pause);
				await peaController.resume();
				expect(service.state).to.equal(ServiceState.EXECUTE);
			}).timeout(10000);
			it('should fail to resume(), command not executable',  async() => {
				await peaController.connectAndSubscribe();
				return expect(peaController.resume()).to.be.rejectedWith('Command is not executable');
			});
		});
	});
});
