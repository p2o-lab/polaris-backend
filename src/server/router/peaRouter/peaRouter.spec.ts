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

import {OpcUaConnectionSettings} from '@p2olab/polaris-interface';
import {ModularPlantManager, PEA} from '../../../modularPlantManager';
import {Server} from '../../server';

import {Application} from 'express';
import {MockupServer} from '../../../modularPlantManager/_utils';
import {AnaViewMockup} from '../../../modularPlantManager/pea/dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {ServiceControlMockup} from '../../../modularPlantManager/pea/dataAssembly/serviceControl/ServiceControl.mockup';
import {expect} from 'chai';
import {Endpoint, PEAModel} from '@p2olab/pimad-interface';
import * as peaModelFileContent from 'src/modularPlantManager/peaModel.spec.json';
import {getEmptyPEAModel} from '../../../modularPlantManager/pea/PEA.mockup';
import {PEAProvider} from '../../../peaProvider/PEAProvider';

const peaModel = peaModelFileContent as unknown as PEAModel;

describe('PEARoutes', () => {
	const request = require('supertest');
	let app: Application;
	let appServer: Server;
	let manager: ModularPlantManager;
	let peaProvider: PEAProvider;
	let mockupServer: MockupServer;

	const peaModelDummy: PEAModel = getEmptyPEAModel();
	peaModelDummy.name = 'test';
	peaModelDummy.pimadIdentifier = 'test';
	peaModelDummy.pimadIdentifier = 'PEATestServer';


	beforeEach(() => {
		manager = new ModularPlantManager();
		peaProvider = new PEAProvider();
		appServer = new Server(manager, peaProvider);
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
			const peaController = new PEA(peaModelDummy);
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
			const peaController = new PEA(peaModelDummy);
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
			const peaController = new PEA(peaModelDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}/download`)
				.expect(200)
				.expect(peaController.options);
		});
		it('should throw 404 for not existing pea', async () => {
			await request(app).get('/api/pea/abc1234/download')
				.expect(404);
		});
	});


	context('/api/pea/loadPEA', () => {
		it('should fail while loading pea without content', async () => {
			await request(app).post('/api/pea/loadPEA')
				.send(null)
				.expect(400)
				.expect('Error: No id provided in request');
		});

		it('should load PEAController', async () => {
			const peaModel = await manager.peaProvider.getPEAFromPiMAd('test');
			const identifier = peaModel.pimadIdentifier;
			await request(app).post('/api/pea/loadPEA')
				.send({id: identifier})
				.expect(200);
		});
	});

	context('Connection Settings', () => {
		it('should get connection settings', async () => {
			const peaController: PEA = new PEA(peaModelDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}/getConnectionSettings`)
				.expect(200)
				.expect({
					endpointUrl: 'localhost',
					connected: false,
					monitoredItemsCount: 0,
					securitySettings: { securityPolicy: 'None', securityMode: 'None' },
					authenticationSettings: 'Anonymous'});
		});

		it('getConnectionSettings should fail with invalid peaId', async () => {
			await request(app).get('/api/pea/xyz/getConnectionSettings')
				.expect(404)
				.expect(/Error: PEA with id xyz not found/);
		});

		it('should update connection settings', async () => {
			const peaController: PEA = new PEA(peaModelDummy);
			manager.peas.push(peaController);
			await request(app).get(`/api/pea/${peaController.id}/getConnectionSettings`)
				.expect(200)
				.expect({
					endpointUrl: 'localhost',
					connected: false,
					monitoredItemsCount: 0,
					securitySettings: { securityPolicy: 'None', securityMode: 'None' },
					authenticationSettings: 'Anonymous'
				});

			const options: OpcUaConnectionSettings = {endpointUrl: 'localhost:4334'};
			await request(app).post(`/api/pea/${peaController.id}/updateConnectionSettings`)
				.send(options)
				.expect(200)
				.expect(/Successfully updated the connection settings!/);

			await request(app).get(`/api/pea/${peaController.id}/getConnectionSettings`)
				.expect(200)
				.expect({
					endpointUrl: 'localhost:4334',
					connected: false,
					monitoredItemsCount: 0,
					securitySettings: { securityPolicy: 'None', securityMode: 'None' },
					authenticationSettings: 'Anonymous'
				});
		});

		it('updateServerSettings should fail with invalid peaId', async () => {
			const options: OpcUaConnectionSettings = {endpointUrl: 'localhost:4334'};
			await request(app).post('/api/pea/xyz/updateConnectionSettings')
				.send(options)
				.expect(404)
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
				const peaController = new PEA(peaModel as unknown as PEAModel);
				manager.peas.push(peaController);
				await request(app).post(`/api/pea/${peaController.id}/connect`).send().expect(200)
					.expect({peaId: peaController.id ,status:'Successfully connected'});
				await request(app).post(`/api/pea/${peaController.id}/disconnect`).send().expect(200)
					.expect({peaId: peaController.id,status:'Successfully disconnected'});
			}).timeout(4000);

			it('should fail to connect, wrong peaId', async() => {
				await request(app).post('/api/pea/abc1234/connect').send().expect(404)
					.expect('Error: PEA with id abc1234 not found');
			});

			it('should fail to disconnect, wrong peaId', async() => {
				await request(app).post('/api/pea/abc1234/disconnect').send().expect(404)
					.expect('Error: PEA with id abc1234 not found');
			});
		});

		context('delete PEA', ()=>{
			it('delete', async() => {
			const peaController = new PEA(peaModel as unknown as PEAModel);
			manager.peas.push(peaController);
			await request(app).delete(`/api/pea/${peaController.id}`)
				.expect(200)
				.expect({peaId: peaController.id,status:'Successfully deleted'});
			expect(manager.peas.length).to.equal(0);
			});

			it('delete to fail, wrong peaId', async() => {
				await request(app).delete('/api/pea/abc1234')
					.expect(404)
					.expect('Error: PEA with id abc1234 not found');
			});
		});

		context('/:peaId/service/:serviceId', ()=> {
			it('should get service', async() => {
				//connect first
				const peaController = new PEA(peaModel as unknown as PEAModel);
				manager.peas.push(peaController);
				const serviceId = peaController.findServiceId('Trigonometry');
				await request(app).get(`/api/pea/${peaController.id}/service/${serviceId}`).send().expect(200);
			});
			it('should fail to get service, wrong pea id', async() => {
				await request(app).get('/api/pea/abc1234/service/Trigonometry')
					.send()
					.expect(404)
					.expect('Service not found.');
			});
			it('should fail to get service, wrong service id', async() => {
				const peaController = new PEA(peaModelDummy);
				manager.peas.push(peaController);
				await request(app).get(`/api/pea/${peaController.id}/service/Trigonometry`)
					.send()
					.expect(404)
					.expect('Service not found.');
			});
		});

		context('Service start sequence', ()=> {
			it('should send command', async () => {
				//connect first
				const peaController = new PEA(peaModel as unknown as PEAModel);
				manager.peas.push(peaController);
				const serviceId = peaController.findServiceId('Trigonometry');
				await request(app).post(`/api/pea/${peaController.id}/connect`).send().expect(200);
				await request(app).post(`/api/pea/${peaController.id}/service/${serviceId}/osLevel/1`).send().expect(200);
				await request(app).post(`/api/pea/${peaController.id}/service/${serviceId}/serviceSourceMode/extern`).send().expect(200);
				await request(app).post(`/api/pea/${peaController.id}/service/${serviceId}/procedureRequest/1`).send().expect(200);

				await request(app).post(`/api/pea/${peaController.id}/service/${serviceId}/start`).send().expect(200);

				await request(app).post(`/api/pea/${peaController.id}/disconnect`).send().expect(200)
					.expect({peaId: peaController.id,status:'Successfully disconnected'});
			}).timeout(8000);

			it('should fail to send command, wrong peaId', async () => {
				await request(app).post('/api/pea/abc1234/service/Trigonometry/start').send().expect(404)
					.expect('Service not found');
			});

			it('should fail to send command, service not found', async () => {
				const peaController = new PEA(peaModelDummy);
				manager.peas.push(peaController);
				await request(app).post(`/api/pea/${peaController.id}/service/Trigonometry/start`).send().expect(404)
					.expect('Service not found');
			});
		});
	});
});
