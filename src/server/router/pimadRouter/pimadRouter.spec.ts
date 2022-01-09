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

import {ModularPlantManager} from '../../../modularPlantManager';
import {Server} from '../../server';

import {Application} from 'express';
import path = require('path');


describe('PiMAdRoutes', () => {
	const request = require('supertest');
	let app: Application;
	let appServer: Server;
	let manager: ModularPlantManager;

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

	context('add PEA to pool', () => {
		it('should work with test file', async () => {
			await request(app).post('/api/pimad/addPEA')
				.attach('uploadedFile', path.resolve('tests/testpea.zip'))
				.expect(200);
		});
		it('should fail, wrong file type', async () => {
			await request(app).post('/api/pimad/addPEA')
				.attach('uploadedFile', path.resolve('tests/testpea.json'))
				.expect(500)
				.expect(/Error: Unknown source type <uploads\\testpea.json>/);
		});
	});

	context('PiMAd allPEAs', () => {

		it('should work, empty pool', async () => {
			await request(app).get('/api/pimad/allPEAs')
				.expect(200)
				.expect([]);
		});

		it('should work with not empty pool', async () => {
			await manager.peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
			await request(app).get('/api/pimad/allPEAs')
				.expect(200);
		});
	});

	context('Get PEA from PiMAd, /pimad/:peaId', () => {

		it('should work', async () => {
			const pimadPEA= await manager.peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
			await request(app).get(`/api/pimad/${pimadPEA.pimadIdentifier}`)
				.expect(200);
		});

		it('should fail', async () => {
			await request(app).get('/api/pimad/abc1234')
				.expect(500)
				.expect(/Error: PEA not found/);
		});

	});

	context('Remove PEA from PiMAd, /pimad/:peaId', () => {
		
		it('should work', async () => {
			const pimadPEA= await manager.peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
			await request(app).delete(`/api/pimad/${pimadPEA.pimadIdentifier}`)
				.expect(200)
				.expect(/Successfully deleted PiMAd-PEA/);
		});
		
		it('should fail', async () => {
			await request(app).delete('/api/pimad/abc1234')
				.expect(500)
				.expect(/Error: PEA not found/);
		});

	});

});
