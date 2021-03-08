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

import {ModularPlantManager} from '../../../modularPlantManager';
import {Server} from '../../server';

import {Application} from 'express';

describe('RecipeRoutes', () => {
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
