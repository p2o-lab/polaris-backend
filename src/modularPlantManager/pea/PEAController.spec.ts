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
import * as peaOptions from '../../../tests/peaOptions.json';
import {namespaceUrl} from '../../../tests/namespaceUrl';
import {PEAOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {AnaViewMockup} from './dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {Namespace, UAObject} from 'node-opcua';
import {ServiceControlMockup} from './dataAssembly/ServiceControl/ServiceControl.mockup';
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
		//set namespaceUrl in peaOptions
		for (const key in peaOptions.dataAssemblies[0].dataItems as any) {
			//skip static values
			if((typeof(peaOptions.dataAssemblies[0].dataItems as any)[key] != 'string')){
				(peaOptions.dataAssemblies[0].dataItems as any)[key].namespaceIndex = namespaceUrl;
			}
		}
		for (const key in peaOptions.services[0].communication as any) {
			//skip static values
			if((typeof(peaOptions.services[0].communication as any)[key] != 'string')){
				(peaOptions.services[0].communication as any)[key].namespaceIndex = namespaceUrl;
			}
		}
		beforeEach(async () => {
			mockupServer = new MockupServer();
			peaController = new PEAController(peaOptions as unknown as PEAOptions);
			service = peaController.services[0];
			await mockupServer.initialize();
			const mockup = new AnaViewMockup(mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject, 'Variable');
			const mockupService = new ServiceControlMockup(mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject, 'Trigonometry');
			await mockupServer.start();
		});
		afterEach(async () => {
			await peaController.disconnectAndUnsubscribe();
			await mockupServer.shutdown();
		});
		context('connect, subscribe',()=>{
			it('should fail to subscribe, missing variable on mockupServer',  async() => {
				await mockupServer.shutdown();
				mockupServer = new MockupServer();
				peaController = new PEAController(peaOptions as unknown as PEAOptions);
				await mockupServer.initialize();
				const mockup = new AnaViewMockup(mockupServer.namespace as Namespace,
					mockupServer.rootComponent as UAObject, 'Variable', false);
				const mockupService = new ServiceControlMockup(mockupServer.namespace as Namespace,
					mockupServer.rootComponent as UAObject, 'Trigonometry');
				await mockupServer.start();
				return expect(peaController.connectAndSubscribe()).to.be.rejectedWith('Timeout: Could not subscribe to Variable.V');
			}).timeout(3000);

			it('should connect and subscribe',  async() => {
				return expect(peaController.connectAndSubscribe()).to.not.be.rejected;
			});


			it('should fail to connect / subscribe',  async() => {
				//TODO more cases
			});

			it('should disconnect and unsubscribe',  async() => {
				await peaController.connectAndSubscribe();
				await peaController.disconnectAndUnsubscribe();
			});

			it('should fail to disconnect and unsubscribe',  async() => {
				//TODO
			});
		});

		context('control Services',async ()=> {
			//TODO: test with multiple services
			it('should stop()',  async() => {
				await peaController.connectAndSubscribe();
				await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
				await peaController.stop();
				expect(service.state).to.equal(ServiceState.STOPPED);
			});
			it('should fail to stop(), command not executable',  async() => {
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
			it('should resume()',  async() => {
				await peaController.connectAndSubscribe();
				await service.executeCommandAndWaitForStateChange(ServiceCommand.start);
				await service.executeCommandAndWaitForStateChange(ServiceCommand.pause);
				await peaController.resume();
				expect(service.state).to.equal(ServiceState.EXECUTE);
			});
			it('should fail to resume(), command not executable',  async() => {
				await peaController.connectAndSubscribe();
				return expect(peaController.resume()).to.be.rejectedWith('Command is not executable');
			});

		});


	});

	/*context('with PEAController server', () => {
		let peaMockup: PEAMockup;
		let mockupServer: MockupServer;

		before(async function() {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.start();
		});

		after(async () => {
			await mockupServer.shutdown();
		});

		it('should connect to PEAController, provide correct json output and disconnect', async () => {
			const peaJson =
				JSON.parse(fs.readFileSync('src/modularPlantManager/pea/_assets/JSON/pea_testserver_1.0.0_2.json', 'utf8')).peas[0];
			const pea = new PEAController(peaJson);
			await pea.connectAndSubscribe();

			await Promise.all([
				new Promise((resolve) => pea.on('parameterChanged', resolve)),
				new Promise((resolve) => pea.on('variableChanged', resolve)),
				new Promise((resolve) => pea.on('stateChanged', resolve))
			]);

			const json = pea.json();
			expect(json).to.have.property('id', 'PEATestServer');
			expect(json).to.have.property('endpoint', 'opc.tcp://127.0.0.1:4334/PEATestServer');
			expect(json).to.have.property('protected', false);
			expect(json).to.have.property('services')
				.to.have.lengthOf(2);

			expect(pea.services[0].eventEmitter.listenerCount('state')).to.equal(1);
			expect(pea.services[0].serviceControl.listenerCount('State')).to.equal(1);
			expect(pea.variables[0].listenerCount('V')).to.equal(1);
			expect(pea.services[0].eventEmitter.listenerCount('parameterChanged')).to.equal(1);

			const errorMsg = pea.services[0].procedures[0].processValuesOut[0] as StringView;
			expect(errorMsg.communication.WQC.listenerCount('changed')).to.equal(2);
			expect(errorMsg.communication.Text?.listenerCount('changed')).to.equal(2);

			await pea.disconnectAndUnsubscribe();
		});

		it('should work after reconnect', async () => {
			const peaJson =
				JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8')).peas[0];
			const pea = new PEAController(peaJson);

			await pea.connectAndSubscribe();
			await Promise.all([
				new Promise((resolve) => pea.on('parameterChanged', resolve)),
				new Promise((resolve) => pea.on('variableChanged', resolve)),
				new Promise((resolve) => pea.on('stateChanged', resolve))
			]);
			expect(pea.connection.monitoredItemSize()).to.be.greaterThan(80);
			await pea.disconnectAndUnsubscribe();
			expect(pea.connection.monitoredItemSize()).to.equal(0);

			await pea.connectAndSubscribe();
			await Promise.all([
				new Promise((resolve) => pea.on('parameterChanged', resolve)),
				new Promise((resolve) => pea.on('variableChanged', resolve)),
				new Promise((resolve) => pea.on('stateChanged', resolve))
			]);
			expect(pea.connection.monitoredItemSize()).to.be.greaterThan(80);
		});

	});*/

});
