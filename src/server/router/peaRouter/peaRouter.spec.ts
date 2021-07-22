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

import {BackendNotification} from '@p2olab/polaris-interface';
import {ModularPlantManager, PEAController} from '../../../modularPlantManager';
import {Server} from '../../server';

import {Application} from 'express';
import * as fs from 'fs';
import * as WebSocket from 'ws';
import {MockupServer} from '../../../modularPlantManager/_utils';
import path = require('path');

describe('PEARoutes', () => {
	const request = require('supertest');
	let app: Application;
	let appServer: Server;
	let manager : ModularPlantManager
	const peaOptionsDummy = {
			name:'test',
			id: 'test',
			pimadIdentifier: 'test',
			username: 'admin',
			password: '1234',
			opcuaServerUrl:'localhost',
			services:[],
			dataAssemblies:[]
		}
	beforeEach(() => {
		manager = new ModularPlantManager();
		appServer = new Server(manager);
		appServer.startHttpServer(3000);
		appServer.initSocketServer();
		app = appServer.app;
	});

	afterEach(async () => {
		await appServer.stop();
	});

	context('/api/pea', () => {
		it('should provide empty peas array', async () => {
			await request(app).get('/api/pea')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect([]);
		});
		it('should provide not empty peas array', async () => {
			let peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get('/api/pea')
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
			let peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get('/api/pea/test')
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

	context('/api/pea/{peaId}', () => {
		it('should provide download for existing pea', async () => {
			let peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get('/api/pea/test/download')
				.expect(200)
				.expect(peaController.options);
		});
		it('should provide download for not existing pea', async () => {
			await request(app).get('/api/pea/abc1234/download')
				.expect(500);
		});
	})

	context('/addByPiMAd', () => {
		it('should work with test file', async () => {
			await request(app).post('/api/pea/addByPiMAd')
				.attach('uploadedFile', path.resolve('tests/testpea.zip'))
				.expect(200);
		});
		it('should fail, wrong file type', async () => {
			await request(app).post('/api/pea/addByPiMAd')
				.attach('uploadedFile', path.resolve('tests/anamon.json'))
				.expect(500)
				.expect(/Error: Unknown source type <uploads\\anamon.json>/);
		});
		it('should fail, file does not exist', async () => {
			//TODO
		});
	});

	context('/PiMAdPEAs', () => {
		it('should work, empty pool', async () => {
			await request(app).get('/api/pea/PiMAdPEAs')
				.expect(200)
				.expect([]);
		});
		it('should work with not empty pool', async () => {
			await manager.addPEAToPimadPool({source: 'tests/testpea.zip'})
			await request(app).get('/api/pea/PiMAdPEAs')
				.expect(200)
		});
	})

	context('/api/pea/loadPEA', () => {
		it('should fail while loading pea without content', async () => {
			await request(app).post('/api/pea/loadPEA')
				.send(null)
				.expect(500)
				.expect('Error: No valid PiMAd Identifier');
		});
		it('should load PEAController', async () => {
			const peaModel = await manager.addPEAToPimadPool({source: 'tests/testpea.zip'})
			const pimadIdentifier = peaModel.pimadIdentifier;
			await request(app).post('/api/pea/loadPEA')
				.send({id: pimadIdentifier})
				.expect(200)
		});
	});


		/*
		describe('with Mockup', () => {
			let mockupServer: MockupServer;

			before(async () => {
				mockupServer = new MockupServer();
				await mockupServer.start();
			});

			after(async () => {
				await mockupServer.shutdown();
			});

			it('should load, get, disconnect and delete pea', async () => {
				const options =
					JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString()).peas[0];
				await request(app).put('/api/pea/addByOptions')
					.send({pea: options})
					.expect(200)
					.expect('Content-Type', /json/)
					.expect(/"connected":false/)
					.expect(/"protected":false/);

				// wait until first update of state via websocket
				const ws = new WebSocket('ws:/localhost:3000');
				await new Promise((resolve) => ws.on('message', function incoming(msg) {
					const data: BackendNotification = JSON.parse(msg.toString());
					if (data.message === 'service' && data.service.status) {
						ws.removeListener('message', incoming);
						resolve();
					}
				}));

				await request(app).get('/api/pea/PEAMockupServer')
					.expect(200)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(/"connected":true/)
					.expect(/"status":"IDLE"/);

				await request(app).post('/api/pea/PEAMockupServer/service/Service1')
					.send({name: 'Parameter001', value: 2})
					.expect(200)
					.expect('Content-Type', /json/)
					.expect(/"status":"IDLE"/);

				await request(app).post('/api/pea/PEAMockupServer/disconnect')
					.expect(200)
					.expect('Content-Type', /json/)
					.expect(/"status":"Succesfully disconnected"/);

				await request(app).delete('/api/pea/PEAMockupServer')
					.expect(200)
					.expect('Content-Type', /json/)
					.expect({status: 'Successful deleted', id: 'PEAMockupServer'});
			});
		});
		*/
});
