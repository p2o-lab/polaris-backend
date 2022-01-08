/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {PEAOptions} from '@p2olab/polaris-interface';
import {ModularPlantManager, OpcUaConnectionSettings, PEAController} from '../../../modularPlantManager';
import {Server} from '../../server';

import {Application} from 'express';
import {MockupServer} from '../../../modularPlantManager/_utils';
import {AnaViewMockup} from '../../../modularPlantManager/pea/dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import * as peaOptions from '../../../modularPlantManager/peaOptions.spec.json';
import {ServiceControlMockup} from '../../../modularPlantManager/pea/dataAssembly/serviceControl/ServiceControl.mockup';
import {expect} from 'chai';
import {AnaServParamMockup} from '../../../modularPlantManager/pea/dataAssembly/operationElement/servParam/anaServParam/AnaServParam.mockup';
import * as peaOptionsServices from '../../../modularPlantManager/peaOptions_testservice.spec.json';


describe('PEARoutes', () => {
	const request = require('supertest');
	let app: Application;
	let appServer: Server;
	let manager: ModularPlantManager;
	let mockupServer: MockupServer;

	const peaOptionsDummy = {
			name:'test',
			id: 'test',
			pimadIdentifier: 'test',
			username: 'admin',
			password: '1234',
			opcuaServerUrl:'localhost',
			services:[],
			dataAssemblies:[]
	};
	beforeEach(() => {
		manager = new ModularPlantManager();
		appServer = new Server(manager);
		appServer.startHttpServer(3000);
		appServer.initSocketServer();
		app = appServer.app;
	});

	afterEach(async () => {
		await appServer.stop();
		//if (mockupServer) await mockupServer.shutdown();
	});

	context('/api/pea/allPEAs', () => {
		it('should provide empty array of PEAs', async () => {
			await request(app).get('/api/pea/allPEAs')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect([]);
		});
		it('should provide pea array containing one PEA', async () => {
			const peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get('/api/pea/allPEAs')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect([{
					name: 'test', id: 'test', pimadIdentifier: 'test', description: '', endpoint: 'localhost',
					hmiUrl: '', connected: false, services: [], processValues: [], protected: false
				}]);
		});
	});

	context('/api/pea/{peaId}', () => {
		it('should get pea', async () => {
			const peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}`)
				.expect(200)
				.expect({
					name: 'test', id: 'test', pimadIdentifier: 'test', description: '', endpoint: 'localhost',
					hmiUrl: '', connected: false, services: [], processValues: [], protected: false
				});
		});
		it('should throw 404 when get not existing pea', async () => {
			await request(app).get('/api/pea/abc1234')
				.expect(404)
				.expect('Error: PEA with id abc1234 not found');
		});
	});

	context('/api/pea/{peaId}/download', () => {
		it('should provide download for existing pea', async () => {
			const peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}/download`)
				.expect(200)
				.expect(peaController.options);
		});
		it('should provide download for not existing pea', async () => {
			await request(app).get('/api/pea/abc1234/download')
				.expect(500);
		});
	});


	context('/api/pea/loadPEA', () => {
		it('should fail while loading pea without content', async () => {
			await request(app).post('/api/pea/loadPEA')
				.send(null)
				.expect(500)
				.expect('Error: No valid PiMAd Identifier');
		});
		it('should load PEAController', async () => {
			const peaModel = await manager.peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
			const identifier = peaModel.pimadIdentifier;
			await request(app).post('/api/pea/loadPEA')
				.send({id: identifier})
				.expect(200);
		});
	});

	context('Connection Settings', () => {
		it('should get connection settings', async () => {
			const peaController: PEAController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}/getConnectionSettings`)
				.expect(200)
				.expect({endpointUrl: 'localhost', securityPolicy: 'None', securityMode: 'None', userIdentityInfo: 'Anonymous'});
		});

		it('getConnectionSettings should fail with invalid peaId', async () => {
			await request(app).get('/api/pea/xyz/getConnectionSettings')
				.expect(500)
				.expect(/Error: PEA with id xyz not found/);
		});

		it('should update connection settings', async () => {
			const peaController: PEAController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}/getConnectionSettings`)
				.expect(200)
				.expect({endpointUrl: 'localhost', securityPolicy: 'None', securityMode: 'None', userIdentityInfo: 'Anonymous'});

			const options: OpcUaConnectionSettings = {endpoint: 'localhost:4334'};
			await request(app).post(`/api/pea/${peaController.id}/updateConnectionSettings`)
				.send(options)
				.expect(200)
				.expect(/Successfully updated the connection settings!/);

			await request(app).get(`/api/pea/${peaController.id}/getConnectionSettings`)
				.expect(200)
				.expect({endpointUrl: 'localhost:4334', securityPolicy: 'None', securityMode: 'None', userIdentityInfo: 'Anonymous'});
		});

		it('updateServerSettings should fail with invalid peaId', async () => {
			const options: OpcUaConnectionSettings = {endpoint: 'localhost:4334'};
			await request(app).post('/api/pea/xyz/updateConnectionSettings')
				.send(options)
				.expect(500)
				.expect(/Error: PEA with id xyz not found/);
		});
	});

	describe('with Mockup', () => {

		before(async () => {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new AnaViewMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Trigonometry');
			await mockupServer.start();
		});

		after(async () => {
			await mockupServer.shutdown();
		});

		context('connect', ()=>{
			it('should connect and disconnect, AnaView & Service', async() => {
				const peaController = new PEAController(peaOptions as unknown as PEAOptions);
				manager.peas.push(peaController);
				await request(app).post(`/api/pea/${peaController.id}/connect`).send().expect(200)
					.expect({peaId:'test',status:'Successfully connected'});
				await request(app).post(`/api/pea/${peaController.id}/disconnect`).send().expect(200)
					.expect({peaId:'test',status:'Successfully disconnected'});
			}).timeout(4000);

			it('should fail to connect, wrong peaId', async() => {
				await request(app).post('/api/pea/abc1234/connect').send().expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});

			it('should fail to disconnect, wrong peaId', async() => {
				await request(app).post('/api/pea/abc1234/disconnect').send().expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});
		});

		context('delete PEA', ()=>{
			it('delete', async() => {
			const peaController = new PEAController(peaOptions as unknown as PEAOptions);
			manager.peas.push(peaController);
			await request(app).delete(`/api/pea/${peaController.id}`)
				.expect(200)
				.expect({peaId:'test',status:'Successfully deleted'});
			expect(manager.peas.length).to.equal(0);
			});

			it('delete to fail, wrong peaId', async() => {
				await request(app).delete('/api/pea/abc1234')
					.expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});
		});

		context('/:peaId/service/:serviceName', ()=> {
			it('should get service', async() => {
				//connect first
				const peaController = new PEAController(peaOptions as unknown as PEAOptions);
				manager.peas.push(peaController);
				await request(app).get(`/api/pea/${peaController.id}/service/Trigonometry`).send().expect(200);
			});
			it('should fail to get service, wrong pea id', async() => {
				await request(app).get('/api/pea/abc1234/service/Trigonometry')
					.send()
					.expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});
			it('should fail to get service, wrong pea id', async() => {
				const peaController = new PEAController(peaOptionsDummy);
				manager.peas.push(peaController);
				await request(app).get(`/api/pea/${peaController.id}/service/Trigonometry`)
					.send()
					.expect(500)
					.expect(`Error: [${peaController.id}] Could not find service with name Trigonometry`);
			});
		});

		context('/:peaId/service/:serviceName/:command', ()=> {
			it('should send command', async () => {
				//connect first
				const peaController = new PEAController(peaOptions as unknown as PEAOptions);
				manager.peas.push(peaController);
				await request(app).post(`/api/pea/${peaController.id}/connect`).send().expect(200)
					.expect({peaId: 'test', status: 'Successfully connected'});
				await request(app).post(`/api/pea/${peaController.id}/service/Trigonometry/start`).send().expect(200);

				await request(app).post(`/api/pea/${peaController.id}/disconnect`).send().expect(200)
					.expect({peaId:'test',status:'Successfully disconnected'});
			});

			it('should fail to send command, wrong peaId', async () => {
				await request(app).post('/api/pea/abc1234/service/Trigonometry/start').send().expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});

			it('should fail to send command, service not found', async () => {
				const peaController = new PEAController(peaOptionsDummy);
				manager.peas.push(peaController);
				await request(app).post(`/api/pea/${peaController.id}/service/Trigonometry/start`).send().expect(500)
					.expect(`"Error: [${peaController.id}] Could not find service with name Trigonometry"`);
			});
		});
	});

	context('/:peaId/service/:serviceName', ()=> {

		it('should fail with unknown PEA identifier', async () => {
			await request(app).post('/api/pea/abc1234/service/Trigonometry').send().expect(500)
				.expect(/Error: PEA with id abc1234 not found/);
		});

		it('should fail , service not found', async () => {
			const peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).post(`/api/pea/${peaController.id}/service/Trigonometry`).send().expect(500)
				.expect(`"Error: [${peaController.id}] Could not find service with name Trigonometry"`);
		});

		it('should fail, could not find procedure', async () => {
			const peaController = new PEAController(peaOptions as unknown as PEAOptions);
			manager.peas.push(peaController);
			await request(app).post(`/api/pea/${peaController.id}/service/Trigonometry`).send().expect(500)
				.send({procedure:'test'})
				.expect('"Error: Could not find Procedure by Name or Default."');
		});

		it('should set parameter', async () => {
			const mockupServer = new MockupServer();
			await mockupServer.initialize();
			new AnaServParamMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService.AnaProcParam_TestService_factor');
			new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, 'TestService');
			await mockupServer.start();
			const pea = new PEAController(peaOptionsServices as unknown as PEAOptions);
			manager.peas.push(pea);
			await pea.connectAndSubscribe();

			await request(app).post(`/api/pea/${pea.id}/service/TestService/start`).send().expect(200);

			await request(app).post(`/api/pea/${pea.id}/service/TestService`).send().expect(200)
				.send({procedure:'TestService_default', parameters: [{name: 'AnaProcParam_TestService_factor', value: 5}]});

			await pea.disconnectAndUnsubscribe();
			await mockupServer.shutdown();
		}).timeout(1500000);
	});
});
