/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {ClientSession, OPCUAClient} from 'node-opcua-client';
import {timeout} from 'promise-timeout';
import * as delay from 'timeout-as-promise';
import {controlEnableToJson, ServiceState} from '../../../src/model/core/enum';
import {Module} from '../../../src/model/core/Module';
import {Player} from '../../../src/model/recipe/Player';
import {Recipe} from '../../../src/model/recipe/Recipe';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {waitForStateChange} from '../../helper';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Player', () => {

    describe('OPC UA server mockup', () => {

        let moduleServer: ModuleTestServer;

        beforeEach(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
        });

        afterEach(async () => {
            await moduleServer.shutdown();
        });

        it('should OPC UA server has been started', async () => {
            const client = OPCUAClient.create({
                endpoint_must_exist: false,
                connectionStrategy: {
                    maxRetry: 10
                }
            });

            await client.connect('opc.tcp://localhost:4334/ModuleTestServer');
            const session: ClientSession = await client.createSession();

            let result = await session.readVariableValue('ns=1;s=Service1.State');
            expect(result.value.value).to.equal(ServiceState.IDLE);

            moduleServer.services[0].varStatus = 8;
            result = await session.readVariableValue('ns=1;s=Service1.State');
            expect(result.value.value).to.equal(ServiceState.STARTING);

            const result2 = await session.readVariableValue('ns=1;s=Service1.CommandEnable');
            const ce = controlEnableToJson(result2.value.value);
            expect(ce).to.deep.equal({
                abort: true,
                complete: false,
                pause: false,
                reset: false,
                restart: false,
                resume: false,
                start: true,
                stop: true,
                unhold: false
            });

            const result3 = await await session.readVariableValue('ns=0;i=2255');
            expect(result3.value.value).to.deep.equal(['http://opcfoundation.org/UA/',
                'urn:NodeOPCUA-Server-default']);

            await client.disconnect();
        });

        it('should run a test recipe two times', async () => {

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            const module = new Module(moduleJson);
            const service = module.services[0];

            module.connect();
            await waitForStateChange(service, 'IDLE', 2000);

            // now test recipe
            const recipeJson = JSON.parse(
                fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
            );
            const recipe = new Recipe(recipeJson, [module]);
            const player = new Player();

            // two times the same recipe
            player.enqueue(recipe);
            player.enqueue(recipe);

            expect(service.state).to.equal(ServiceState.IDLE);

            player.start();
            expect(player.status).to.equal(RecipeState.running);
            await waitForStateChange(service, 'STARTING', 2000);
            await waitForStateChange(service, 'EXECUTE');
            await waitForStateChange(service, 'COMPLETING', 2000);
            await waitForStateChange(service, 'COMPLETED', 2000);
            await waitForStateChange(service, 'IDLE');

            // here the second run of the recipe should automatically start, since first recipe is finished

            await waitForStateChange(service, 'STARTING', 2000);
            await waitForStateChange(service, 'EXECUTE', 2000);
            await waitForStateChange(service, 'COMPLETING', 2000);
            await waitForStateChange(service, 'COMPLETED', 2000);
            await waitForStateChange(service, 'IDLE');

            await delay(50);

            expect(player.status).to.equal(RecipeState.completed);
            player.reset();

            await module.disconnect();
        }).timeout(10000);

        it('should run a playlist while modifying it', async () => {

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            const module = new Module(moduleJson);
            const service = module.services[0];

            await module.connect();

            // now test recipe
            const recipeJson = JSON.parse(
                fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
            );
            const recipe = new Recipe(recipeJson, [module]);
            const player = new Player();

            // two times the same recipe
            player.enqueue(recipe);
            player.enqueue(recipe);

            player.start();
            expect(player.status).to.equal(RecipeState.running);
            await waitForStateChange(service, 'STARTING');
            await waitForStateChange(service, 'EXECUTE');
            await waitForStateChange(service, 'COMPLETING', 2000);
            await waitForStateChange(service, 'COMPLETED', 2000);
            await waitForStateChange(service, 'IDLE');

            // here the second run of the recipe should automatically start, since first recipe is finished

            await waitForStateChange(service, 'STARTING', 2000);
            await waitForStateChange(service, 'EXECUTE', 2000);
            await waitForStateChange(service, 'COMPLETING', 2000);
            await waitForStateChange(service, 'COMPLETED', 2000);
            await waitForStateChange(service, 'IDLE');

            await delay(10);

            expect(player.status).to.equal(RecipeState.completed);
            player.reset();

            await module.disconnect();
        }).timeout(10000);

        it('should run the test recipe two times with several player interactions (pause, resume, stop)', async () => {

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            const module = new Module(moduleJson);
            const service = module.services[0];

            await module.connect();

            // now test recipe
            const recipeJson = JSON.parse(
                fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString()
            );
            const recipe = new Recipe(recipeJson, [module]);
            const player = new Player();

            // two times the same recipe
            player.enqueue(recipe);
            player.enqueue(recipe);

            expect(service.state).to.equal(ServiceState.IDLE);

            player.start();
            expect(player.status).to.equal(RecipeState.running);
            await waitForStateChange(service, 'STARTING', 2000);
            await waitForStateChange(service, 'EXECUTE');

            player.pause();
            await waitForStateChange(service, 'PAUSING');
            await waitForStateChange(service, 'PAUSED');
            expect(player.status).to.equal(RecipeState.paused);

            player.start();
            await waitForStateChange(service, 'RESUMING');
            await waitForStateChange(service, 'EXECUTE');
            expect(service.state).to.equal(ServiceState.EXECUTE);
            expect(player.status).to.equal(RecipeState.running);

            await waitForStateChange(service, 'COMPLETING', 2000);
            await waitForStateChange(service, 'COMPLETED');

            await waitForStateChange(service, 'IDLE');

            // here the second run of the recipe should automatically start, since first recipe is finished

            await waitForStateChange(service, 'STARTING', 2000);
            await waitForStateChange(service, 'EXECUTE');

            await player.stop();

            await waitForStateChange(service, 'STOPPING');
            await waitForStateChange(service, 'STOPPED');

            expect(player.status).to.equal(RecipeState.stopped);
            player.reset();

            await module.disconnect();
        }).timeout(10000);

    });

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

            const completedRecipes = [];

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

            const completedRecipes = [];

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
            expect(player.getCurrentRecipe().currentStep.name).to.equal('S1');

            expect(() => player.forceTransition('non-existant', 'S2')).to.throw();
            expect(() => player.forceTransition('S1', 'non-existant')).to.throw();
            expect(() => player.forceTransition('S1', 'S3')).to.throw();

            await delay(10);
            player.forceTransition('S1', 'S2');
            expect(player.getCurrentRecipe().currentStep.name).to.equal('S2');

            player.forceTransition('S2', 'S3');
            expect(player.getCurrentRecipe().currentStep.name).to.equal('S3');

            await timeout(new Promise((resolve) => {
                player.once('completed', () => resolve());
            }), 1000);

        }).timeout(5000);
    });

});
