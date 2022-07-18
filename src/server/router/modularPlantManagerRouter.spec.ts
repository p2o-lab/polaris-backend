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

import {ModularPlantManager} from '../../modularPlantManager';
import {Server} from '../server';

import {Application} from 'express';
import {PEAProvider} from '../../peaProvider/PEAProvider';

describe('ModularPlantMangerRoutes', () => {
	const request = require('supertest');
	let app: Application;
	let appServer: Server;

	before(() => {
		appServer = new Server(new ModularPlantManager(),new PEAProvider());
		appServer.startHttpServer(3000);
		appServer.initSocketServer();
		app = appServer.app;
	});

	after(async () => {
		await appServer.stop();
	});

	context('ModularPlantManger', () => {

		it('should allow interacting with all peas within MP', async () => {
			await request(app).post('/api/abortAllServices')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect({status: 'aborted all services from all PEAs'});
			await request(app).post('/api/stopAllServices')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect({status: 'stopped all services from all PEAs'});
			await request(app).post('/api/resetAllServices')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect({status: 'reset all services from all PEAs'});
		});

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

		context('version', () => {

			it('should provide version', (done) => {
				request(app).get('/api/version')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

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

			it('should provide dataAssemblies logs', (done) => {
				request(app).get('/api/logs/dataAssemblies')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

			it('should provide service logs 2', (done) => {
				request(app).get('/api/logs/dataAssemblies.json')
					.expect('Content-Type', /json/)
					.expect(200, done);
			});

		});
	});

});
