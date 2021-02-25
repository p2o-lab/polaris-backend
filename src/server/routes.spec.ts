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
import {ModularPlantManager} from '../modularPlantManager';
import {Server} from './server';

import {Application} from 'express';
import * as fs from 'fs';
import * as WebSocket from 'ws';
import {MockupServer} from '../modularPlantManager/_utils';

describe('Routes', () => {
	const request = require('supertest');
	let app: Application;
	let appServer: Server;

	before(() => {
		appServer = new Server(new ModularPlantManager());
		appServer.startHttpServer(3000);
		appServer.initSocketServer();
		app = appServer.app;
	});

	after(async () => {
		await appServer.stop();
	});

	it('should give code 404 for not existing routes', (done) => {
		request(app).get('/api/notExisting')
			.expect(404, done);
	});

	context('#coreRoutes', () => {

		context('autoReset', () => {

			it('should provide autoreset', (done) => {
				request(app).get('/api/autoReset')
					.expect('Content-Type', /json/)
					.expect('Content-Length', '18')
					.expect('{"autoReset":true}')
					.expect(200, done);
			});

			it('should modify autoreset', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: 'false'})
					.expect('{"autoReset":false}')
					.expect(200, done);
			});

			it('should modify autoreset 2', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: 0})
					.expect('{"autoReset":false}')
					.expect(200, done);
			});

			it('should modify autoreset 3', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: 'blub'})
					.expect('{"autoReset":false}')
					.expect(200, done);
			});

			it('should modify autoreset 4', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: 'true'})
					.expect('{"autoReset":true}')
					.expect(200, done);
			});

			it('should modify autoreset 5', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: '1'})
					.expect('{"autoReset":true}')
					.expect(200, done);
			});

			it('should modify autoreset 6', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: true})
					.expect('{"autoReset":true}')
					.expect(200, done);
			});

			it('should modify autoreset 7', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: 1})
					.expect('{"autoReset":true}')
					.expect(200, done);
			});

			it('should modify autoreset 8', (done) => {
				request(app).post('/api/autoReset')
					.send({autoReset: 'TRUE'})
					.expect('{"autoReset":true}')
					.expect(200, done);
			});

		});

		it('should provide version', (done) => {
			request(app).get('/api/version')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		context('logs', () => {

			it('should provide logs', (done) => {
				request(app).get('/api/logs')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

			it('should provide logs 2', (done) => {
				request(app).get('/api/logs.json')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

			it('should provide service logs', (done) => {
				request(app).get('/api/logs/services')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

			it('should provide service logs 2', (done) => {
				request(app).get('/api/logs/services.json')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

			it('should provide variables logs', (done) => {
				request(app).get('/api/logs/variables')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

			it('should provide service logs 2', (done) => {
				request(app).get('/api/logs/variables.json')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

		});
	});

	context('#peaRoutes', () => {
		it('should provide peas', async () => {
			await request(app).get('/api/pea')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect([]);
		});

		it('should throw 404 when get not existing pea', async () => {
			await request(app).get('/api/pea/abc1234')
				.expect(404)
				.expect('Error: PEA with id abc1234 not found');
		});

		it('should provide download for not existing peas', async () => {
			await request(app).get('/api/pea/abc1234/download')
				.expect(500);
		});

		it('should allow interacting with all peas', async () => {
			await request(app).post('/api/pea/abort')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect({status: 'aborted all services from all PEAs'});
			await request(app).post('/api/pea/stop')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect({status: 'stopped all services from all PEAs'});
			await request(app).post('/api/pea/reset')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect({status: 'reset all services from all PEAs'});
		});

		it('should fail wile loading pea with empty content', async () => {
			await request(app).put('/api/pea')
				.send({})
				.expect('Content-Type', /json/)
				.expect(500);
		});

		it('should fail while loading pea without content', async () => {
			await request(app).put('/api/pea')
				.send(null)
				.expect('Content-Type', /json/)
				.expect(500);
		});

		it('should fail while connecting a not existing pea', async () => {
			await request(app).post('/api/pea/test/connect')
				.send(null)
				.expect(500)
				.expect('Content-Type', /json/)
				.expect(/Error: PEA with id test not found/);
		});

		it('should fail while disconnecting from a not existing pea', async () => {
			await request(app).post('/api/pea/test/disconnect')
				.send(null)
				.expect(500)
				.expect('Content-Type', /json/)
				.expect(/Error: PEA with id test not found/);
		});

		describe('with test pea', () => {
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
				await request(app).put('/api/pea')
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

				await request(app).get('/api/pea/PEATestServer')
					.expect(200)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(/"connected":true/)
					.expect(/"status":"IDLE"/);

				await request(app).post('/api/pea/PEATestServer/service/Service1')
					.send({name: 'Parameter001', value: 2})
					.expect(200)
					.expect('Content-Type', /json/)
					.expect(/"status":"IDLE"/);

				await request(app).post('/api/pea/PEATestServer/disconnect')
					.expect(200)
					.expect('Content-Type', /json/)
					.expect(/"status":"Succesfully disconnected"/);

				await request(app).delete('/api/pea/PEATestServer')
					.expect(200)
					.expect('Content-Type', /json/)
					.expect({status: 'Successful deleted', id: 'PEATestServer'});
			});
		});
	});

	context('#playerRoutes', () => {
		it('should provide player', (done) => {
			request(app).get('/api/player')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	context('#recipeRoutes', () => {
		it('should provide recipes', async () => {
			await request(app).get('/api/recipe')
				.expect('Content-Type', /json/)
				.expect(200);
		});

		it('should provide specific recipe', async () => {
			await request(app).get('/api/recipe/abc123')
				.expect(400);
		});

		it('should delete not existing recipe', async () => {
			await request(app).delete('/api/recipe/abc123')
				.expect(400);
		});
	});
});
