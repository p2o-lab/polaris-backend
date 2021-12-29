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

import {RecipeState} from '@p2olab/polaris-interface';
import {PEAController} from '../pea';
import {ServiceState} from '../pea/dataAssembly';
import {Player, Recipe} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {MockupServer} from '../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Player', () => {
	const delay = require('timeout-as-promise');
	describe('OPC UA server mockup', () => {

		let mockupServer: MockupServer;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			await mockupServer.start();
		});

		afterEach(async () => {
			await mockupServer.shutdown();
		});

		it('should run a simple test recipe', async () => {
			const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEAController(peaJson);
			await pea.connectAndSubscribe();
			// now test recipe
			const recipeJson = JSON.parse(
				fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
			);
			const recipe = new Recipe(recipeJson, [pea]);
			const player = new Player();
			player.enqueue(recipe);

			player.start();
			await new Promise((resolve) => player.once('completed', resolve));

			await pea.disconnectAndUnsubscribe();
		}).timeout(10000);

		it('should run a test recipe two times', async () => {

			const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEAController(peaJson);
			const service = pea.services[0];

			await pea.connectAndSubscribe();

			// now test recipe
			const recipeJson = JSON.parse(
				fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
			);
			const recipe = new Recipe(recipeJson, [pea]);
			const player = new Player();

			// two times the same recipe
			player.enqueue(recipe);
			player.enqueue(recipe);

			expect(service.state).to.equal(ServiceState.IDLE);

			player.start();
			expect(player.status).to.equal(RecipeState.running);
			await service.waitForStateChangeWithTimeout('STARTING', 2000);
			await service.waitForStateChangeWithTimeout('EXECUTE');
			await service.waitForStateChangeWithTimeout('COMPLETING', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETED', 2000);
			await service.waitForStateChangeWithTimeout('IDLE');

			// here the second run of the recipe should automatically start, since first recipe is finished

			await service.waitForStateChangeWithTimeout('STARTING', 2000);
			await service.waitForStateChangeWithTimeout('EXECUTE', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETING', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETED', 2000);
			await service.waitForStateChangeWithTimeout('IDLE');

			await delay(50);

			expect(player.status).to.equal(RecipeState.completed);
			player.reset();

			await pea.disconnectAndUnsubscribe();
		}).timeout(10000);

		it('should run a playlist while modifying it', async () => {

			const peaJson = JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEAController(peaJson);
			const service = pea.services[0];

			await pea.connectAndSubscribe();

			// now test recipe
			const recipeJson = JSON.parse(
				fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
			);
			const recipe = new Recipe(recipeJson, [pea]);
			const player = new Player();

			// two times the same recipe
			player.enqueue(recipe);
			player.enqueue(recipe);

			player.start();
			expect(player.status).to.equal(RecipeState.running);
			await service.waitForStateChangeWithTimeout('STARTING');
			await service.waitForStateChangeWithTimeout('EXECUTE');
			await service.waitForStateChangeWithTimeout('COMPLETING', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETED', 2000);
			await service.waitForStateChangeWithTimeout('IDLE');

			// here the second run of the recipe should automatically start, since first recipe is finished

			await service.waitForStateChangeWithTimeout('STARTING', 2000);
			await service.waitForStateChangeWithTimeout('EXECUTE', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETING', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETED', 2000);
			await service.waitForStateChangeWithTimeout('IDLE');

			await delay(10);

			expect(player.status).to.equal(RecipeState.completed);
			player.reset();

			await pea.disconnectAndUnsubscribe();
		}).timeout(10000);

		it('should run the test recipe two times with several player interactions (pause, resume, stop)', async () => {

			const peaJson = JSON.parse(fs.readFileSync('src/modularPlantManager/pea/_assets/JSON/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEAController(peaJson);
			const service = pea.services[0];

			await pea.connectAndSubscribe();

			// now test recipe
			const recipeJson = JSON.parse(
				fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
			);
			const recipe = new Recipe(recipeJson, [pea]);
			const player = new Player();

			// two times the same recipe
			player.enqueue(recipe);
			player.enqueue(recipe);

			expect(service.state).to.equal(ServiceState.IDLE);

			player.start();
			expect(player.status).to.equal(RecipeState.running);
			await service.waitForStateChangeWithTimeout('STARTING', 2000);
			await service.waitForStateChangeWithTimeout('EXECUTE');

			player.pause();
			await service.waitForStateChangeWithTimeout('PAUSING');
			await service.waitForStateChangeWithTimeout('PAUSED');
			expect(player.status).to.equal(RecipeState.paused);

			player.start();
			await service.waitForStateChangeWithTimeout('RESUMING');
			await service.waitForStateChangeWithTimeout('EXECUTE');
			expect(service.state).to.equal(ServiceState.EXECUTE);
			expect(player.status).to.equal(RecipeState.running);

			await service.waitForStateChangeWithTimeout('COMPLETING', 2000);
			await service.waitForStateChangeWithTimeout('COMPLETED');

			await service.waitForStateChangeWithTimeout('IDLE');

			// here the second run of the recipe should automatically start, since first recipe is finished

			await service.waitForStateChangeWithTimeout('STARTING', 2000);
			await service.waitForStateChangeWithTimeout('EXECUTE');

			player.stop();
			await service.waitForStateChangeWithTimeout('STOPPING');
			await service.waitForStateChangeWithTimeout('STOPPED');

			expect(player.status).to.equal(RecipeState.stopped);
			player.reset();

			await pea.disconnectAndUnsubscribe();
		}).timeout(10000);

	});
	/*
	context('local', () => {
		let recipeWaitShort: Recipe;
		let recipeWaitLocal: Recipe;
		before(() => {
			recipeWaitShort = new Recipe(
				JSON.parse(fs.readFileSync('assets/recipes/test/recipe_wait_0.5s.json').toString()),
				[], false);
			recipeWaitLocal = new Recipe(
				JSON.parse(fs.readFileSync('assets/recipes/test/recipe_time_local.json').toString()),
				[], false);
		});

		it('should load run Player with three local waiting recipes', (done) => {
			const player = new Player();

			expect(player.start()).to.be.rejectedWith('No recipes in playlist');

			player.enqueue(recipeWaitShort);
			expect(player.playlist).to.have.length(1);
			player.enqueue(recipeWaitLocal);
			player.enqueue(recipeWaitShort);
			expect(player.playlist).to.have.length(3);

			const completedRecipes: string[] = [];

			expect(player.status).to.equal(RecipeState.idle);

			player.on('recipeFinished', (recipe: Recipe) => {
					expect(recipe).to.have.property('status', 'completed');
					completedRecipes.push(recipe.id);
				})
				.once('completed', async () => {
					expect(completedRecipes).to.have.length(3);
					expect(player.status).to.equal(RecipeState.completed);
					player.reset();
					expect(player.status).to.equal(RecipeState.idle);
					done();
				});
			player.start();
			expect(player.start()).to.be.rejectedWith('already running');

			expect(player.status).to.equal(RecipeState.running);
			const json = player.json();
			expect(json.currentItem).to.equal(0);
			expect(json.status).to.equal('running');
		}).timeout(5000);

		it('should load run Player with three local waiting recipes and removal', (done) => {
			const player = new Player();

			player.enqueue(recipeWaitShort);
			player.enqueue(recipeWaitLocal);
			player.enqueue(recipeWaitLocal);
			player.enqueue(recipeWaitShort);
			player.enqueue(recipeWaitLocal);
			expect(player.playlist).to.have.length(5);

			player.remove(1);
			expect(player.playlist).to.have.length(4);

			player.enqueue(recipeWaitShort);
			expect(player.playlist).to.have.length(5);

			expect(player.playlist.map((r) => r.id)).to.deep.equal([
				recipeWaitShort.id,
				recipeWaitLocal.id,
				recipeWaitShort.id,
				recipeWaitLocal.id,
				recipeWaitShort.id]);

			const completedRecipes: string[] = [];

			expect(player.status).to.equal(RecipeState.idle);
			player.on('recipeFinished', async (recipe: Recipe) => {
					expect(recipe).to.have.property('status', 'completed');
					completedRecipes.push(recipe.id);
					if (completedRecipes.length === 2) {
						await delay(10);
						expect(player.getCurrentRecipe().id).to.equal(recipeWaitShort.id);
						expect(() => player.remove(2)).to.throw('Can not remove currently running recipe');
						expect(player.getCurrentRecipe().id).to.equal(recipeWaitShort.id);
						player.remove(1);
						expect(player.getCurrentRecipe().id).to.equal(recipeWaitShort.id);
						expect(player.playlist).to.have.length(4);
						player.remove(3);
						expect(player.playlist).to.have.length(3);
					}
				})
				.once('completed', async () => {
					expect(completedRecipes).to.have.length(4);
					expect(player.status).to.equal(RecipeState.completed);
					player.reset();
					expect(player.status).to.equal(RecipeState.idle);
					expect(completedRecipes).to.deep.equal([
						recipeWaitShort.id,
						recipeWaitLocal.id,
						recipeWaitShort.id,
						recipeWaitLocal.id]);
					done();
				});
			player.start();
			expect(player.status).to.equal(RecipeState.running);
			const json = player.json();
			expect(json.currentItem).to.equal(0);
			expect(json.status).to.equal('running');
		}).timeout(5000);

		it('should  force a transition', async () => {
			const player = new Player();
			player.enqueue(recipeWaitLocal);

			timeout(new Promise((resolve) => {
				player.once('started', () => resolve());
			}), 1000);
			timeout(new Promise((resolve) => {
				player.once('recipeChanged', () => resolve());
			}), 1000);
			player.start();
			expect(player.getCurrentRecipe().currentStep?.name).to.equal('S1');

			expect(() => player.forceTransition('non-existant', 'S2')).to.throw();
			expect(() => player.forceTransition('S1', 'non-existant')).to.throw();
			expect(() => player.forceTransition('S1', 'S3')).to.throw();

			await delay(10);
			player.forceTransition('S1', 'S2');
			expect(player.getCurrentRecipe().currentStep?.name).to.equal('S2');

			player.forceTransition('S2', 'S3');
			expect(player.getCurrentRecipe().currentStep?.name).to.equal('S3');

			await timeout(new Promise((resolve) => {
				player.once('completed', () => resolve());
			}), 1000);

		}).timeout(5000);
	});
	*/
});
