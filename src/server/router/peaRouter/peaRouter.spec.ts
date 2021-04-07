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
import {ModularPlantManager} from '../../../modularPlantManager';
import {Server} from '../../server';

import {Application} from 'express';
import * as fs from 'fs';
import * as WebSocket from 'ws';
import {MockupServer} from '../../../modularPlantManager/_utils';

describe('PEARoutes', () => {
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

		context('loading PEA by Options', () => {
			it('should fail while loading pea with empty content', async () => {
				await request(app).put('/api/pea/addByOptions')
					.send({})
					.expect('Content-Type', /json/)
					.expect(500);
			});

			it('should fail while loading pea without content', async () => {
				await request(app).put('/api/pea/addByOptions')
					.send(null)
					.expect('Content-Type', /json/)
					.expect(500);
			});
		});

		context('loading PEA via PiMAd', () => {
			it('should work with dummy implementation', async () => {
				await request(app).put('/api/pea/addByPiMAd')
					.send({})
					.expect(200)
					.expect('Content-Type', /json/)
					.expect(/PiMAd-Hello-World/);
			});
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

});
