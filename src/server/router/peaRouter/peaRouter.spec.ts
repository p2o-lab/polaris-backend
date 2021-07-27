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

import {BackendNotification, DataAssemblyOptions, PEAOptions} from '@p2olab/polaris-interface';
import {ModularPlantManager, PEAController} from '../../../modularPlantManager';
import {Server} from '../../server';
import {Application} from 'express';
import * as fs from 'fs';
import * as WebSocket from 'ws';
import {MockupServer} from '../../../modularPlantManager/_utils';
import path = require('path');
import {AnaViewMockup} from '../../../modularPlantManager/pea/dataAssembly/indicatorElement/AnaView/AnaView.mockup';
import {Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../tests/namespaceUrl';
import * as baseDataAssemblyOptions from '../../../../tests/anaview.json';
import * as peaOptions from '../../../../tests/peaOptions.json';
import {ServiceControlMockup} from '../../../modularPlantManager/pea/dataAssembly/ServiceControl/ServiceControl.mockup';
import {expect} from 'chai';


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
	});

	context('/api/pea', () => {
		it('should provide empty peas array', async () => {
			await request(app).get('/api/pea')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect([]);
		});
		it('should provide not empty peas array', async () => {
			const peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get('/api/pea')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect([{
					name: 'test', id: 'test', pimadIdentifier: 'test', description: '', endpoint: 'localhost',
					hmiUrl: '', connected: false, services: [], processValues: [], protected: false
				}]);
		});
		it('should fail to get peas, wrong id', async () => {
			//TODO how to make it fail

		/*		await request(app).get('/api/pea/')
				.expect(500)
				.expect('Error: PEA with id abc1234 not found');*/
		});
	});

	context('/api/pea/{peaId}', () => {
		it('should get pea', async () => {
			const peaController = new PEAController(peaOptionsDummy);
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

	context('/api/pea/{peaId}/download', () => {
		it('should provide download for existing pea', async () => {
			const peaController = new PEAController(peaOptionsDummy);
			manager.peas.push(peaController);
			await request(app).get('/api/pea/test/download')
				.expect(200)
				.expect(peaController.options);
		});
		it('should provide download for not existing pea', async () => {
			await request(app).get('/api/pea/abc1234/download')
				.expect(500);
		});
	});

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
			await manager.addPEAToPimadPool({source: 'tests/testpea.zip'});
			await request(app).get('/api/pea/PiMAdPEAs')
				.expect(200);
		});
		it('should fail', async () => {
			const pimadpool =(manager.pimadPool as any) = null;
			await request(app).get('/api/pea/PiMAdPEAs').expect(500);
		});
	});

	context('delete, /PiMAd/:pimadId', () => {
		it('should work', async () => {
			const pimadPEA= await manager.addPEAToPimadPool({source: 'tests/testpea.zip'}); //TODO maybe use a lighter file
			await request(app).delete('/api/pea/PiMAd/'+pimadPEA.pimadIdentifier)
				.expect(200)
				.expect(/Successfully deleted PiMAd-PEA/);
		});
		it('should fail', async () => {
			await request(app).delete('/api/pea/PiMAd/abc1234')
				.expect(500)
				.expect(/Error: PEA not found/);
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
			const peaModel = await manager.addPEAToPimadPool({source: 'tests/testpea.zip'});
			const pimadIdentifier = peaModel.pimadIdentifier;
			await request(app).post('/api/pea/loadPEA')
				.send({id: pimadIdentifier})
				.expect(200);
		});
	});

	describe('with Mockup', () => {
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
		before(async () => {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new AnaViewMockup(mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject, 'Variable');
			const mockupService = new ServiceControlMockup(mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject, 'Trigonometry');
			await mockupServer.start();
		});

		context('connect', ()=>{
			it('should connect and disconnect, AnaView & Service', async() => {
				const peaController = new PEAController(peaOptions as unknown as PEAOptions, false);
				manager.peas.push(peaController);
				await request(app).post('/api/pea/test/connect').send().expect(200)
					.expect({peaId:'test',status:'Successfully connected'});
				await request(app).post('/api/pea/test/disconnect').send().expect(200)
					.expect({peaId:'test',status:'Successfully disconnected'});
				/*	// wait until first update of state via websocket
                    const ws = new WebSocket('ws:/localhost:3000');
                    await new Promise((resolve) => ws.on('message', function incoming(msg) {
                        const data: BackendNotification = JSON.parse(msg.toString());
                        if (data.message === 'service' && data.service.status) {
                            ws.removeListener('message', incoming);
                            resolve();
                        }
                    }));*/
			});
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
			const peaController = new PEAController(peaOptions as unknown as PEAOptions, false);
			manager.peas.push(peaController);
			await request(app).post('/api/pea/test/connect').send().expect(200)
				.expect({peaId:'test',status:'Successfully connected'});

			await request(app).delete('/api/pea/test')
				.expect(200)
				.expect({peaId:'test',status:'Successfully deleted'});
			expect(manager.peas.length).to.equal(0);
			});
			it('delete to fail, wrong id', async() => {
				await request(app).delete('/api/pea/abc1234')
					.expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});
		});

		context('/:peaId/service/:serviceName', ()=> {
			it('should get service', async() => {
				//connect first
				const peaController = new PEAController(peaOptions as unknown as PEAOptions, false);
				manager.peas.push(peaController);
				await request(app).post('/api/pea/test/connect').send().expect(200)
					.expect({peaId: 'test', status: 'Successfully connected'});
				await request(app).get('/api/pea/test/service/Trigonometry').send().expect(200);
			});
			it('should fail to get service, wrong pea id', async() => {
				await request(app).get('/api/pea/abc1234/service/Trigonometry')
					.send()
					.expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});
			it('should fail to get service, wrong pea id', async() => {
				const peaController = new PEAController(peaOptionsDummy, false);
				manager.peas.push(peaController);
				await request(app).get('/api/pea/test/service/Trigonometry')
					.send()
					.expect(500)
					.expect('Error: [test] Could not find service with name Trigonometry');
			});
		});

		context('/:peaId/service/:serviceName/:command', ()=> {
			it('should send command', async () => {
				//TODO ... need to implement state change in mockup
				/*
				//connect first
				const peaController = new PEAController(peaOptions as unknown as PEAOptions, false);
				manager.peas.push(peaController);
				await request(app).post('/api/pea/test/connect').send().expect(200)
					.expect({peaId: 'test', status: 'Successfully connected'});

				await request(app).post('/api/pea/test/service/Trigonometry/start').send().expect(200)*/
			});
			it('should fail to send command, wrong peaId', async () => {
				await request(app).post('/api/pea/abc1234/service/Trigonometry/start').send().expect(500)
					.expect('Error: PEA with id abc1234 not found');
			});
			it('should fail to send command, service not found', async () => {
				const peaController = new PEAController(peaOptionsDummy, false);
				manager.peas.push(peaController);
				await request(app).post('/api/pea/test/service/Trigonometry/start').send().expect(500)
					.expect('Error: [test] Could not find service with name Trigonometry');
			});
		});

	});
});
