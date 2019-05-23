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

import {Player} from '../../../src/model/recipe/Player';
import * as fs from 'fs';
import {expect} from 'chai';
import {Manager} from '../../../src/model/Manager';
import * as delay from 'timeout-as-promise';
import {RecipeState} from '@p2olab/polaris-interface';
import {timeout} from 'promise-timeout';
import {Recipe} from '../../../src/model/recipe/Recipe';
import {controlEnableToJson, ServiceState} from '../../../src/model/core/enum';
import {ClientSession, OPCUAClient} from 'node-opcua-client';
import {OPCUAServer} from 'node-opcua-server';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {Module} from '../../../src/model/core/Module';
import {waitForStateChange} from '../../helper';

describe('Player', function () {

    describe('OPC UA server mockup', () => {

        let moduleServer: ModuleTestServer;

        before(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
        });

        after(async () => {
            await moduleServer.shutdown();
        });

        it('should OPC UA server has been started', async () => {
            const client = new OPCUAClient({
                endpoint_must_exist: false,
                connectionStrategy: {
                    maxRetry: 10
                }
            });

            await client.connect('opc.tcp://localhost:4334/ModuleTestServer');
            let session: ClientSession = await client.createSession();

            let result = await session.readVariableValue('ns=1;s=Service1.State');
            expect(result.value.value).to.equal(ServiceState.IDLE);

            moduleServer.services[0].varStatus = 8;
            result = await session.readVariableValue('ns=1;s=Service1.State');
            expect(result.value.value).to.equal(ServiceState.STARTING);

            let result2 = await session.readVariableValue('ns=1;s=Service1.CommandEnable');
            let ce = controlEnableToJson(result2.value.value);
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

            let result3 = await await session.readVariableValue('ns=0;i=2255');
            expect(result3.value.value).to.deep.equal([ 'http://opcfoundation.org/UA/',
                'urn:NodeOPCUA-Server-default']);

            await client.disconnect();
        });

        it('should run the test recipe two times on the test module with several player interactions (pause, resume, stop)', async function () {
            this.timeout(15000);

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            const module = new Module(moduleJson);
            const service = module.services[0];

            await module.connect();
            moduleServer.services[0].varStatus = ServiceState.IDLE;
            await waitForStateChange(service, 'IDLE');

            // now test recipe
            const recipeJson = JSON.parse(fs.readFileSync('assets/recipes/test/recipe_testserver_1.0.0.json').toString());
            const recipe = new Recipe(recipeJson, [module]);
            const player = new Player();

            // two times the same recipe
            player.enqueue(recipe);
            player.enqueue(recipe);

            expect(service.status.value).to.equal(ServiceState.IDLE);

            player.start();
            expect(player.status).to.equal(RecipeState.running);
            waitForStateChange(service, 'STARTING');
            await waitForStateChange(service, 'EXECUTE');

            player.pause();
            waitForStateChange(service, 'PAUSING');
            await waitForStateChange(service, 'PAUSED');
            expect(player.status).to.equal(RecipeState.paused);

            player.start();
            waitForStateChange(service, 'RESUMING');
            await waitForStateChange(service, 'EXECUTE');
            expect(service.status.value).to.equal(ServiceState.EXECUTE);
            expect(player.status).to.equal(RecipeState.running);

            waitForStateChange(service, 'COMPLETING', 2000);
            await waitForStateChange(service, 'COMPLETED', 2000);

            await waitForStateChange(service, 'IDLE');

            // here the second run of the recipe should automatically start, since first recipe is finished

            waitForStateChange(service, 'STARTING', 1000);
            await waitForStateChange(service, 'EXECUTE', 1000);

            await player.stop();

            expect(player.status).to.equal(RecipeState.stopped);
            player.reset();

            await module.disconnect();
        });

    });

    describe('local', () => {
        let recipeWait0_5s: Recipe;
        let recipeWaitLocal: Recipe;
        before(() => {
            recipeWait0_5s = new Recipe(
                JSON.parse(fs.readFileSync('assets/recipes/test/recipe_wait_0.5s.json').toString()),
                [], false);
            recipeWaitLocal = new Recipe(
                JSON.parse(fs.readFileSync('assets/recipes/test/recipe_time_local.json').toString()),
                [], false);
        });

        it('should load run Player with three local waiting recipes', function(done) {
            this.timeout(5000);
            let player = new Player();

            expect(()=>player.start()).to.throw('No recipes in playlist');

            player.enqueue(recipeWait0_5s);
            expect(player.playlist).to.have.length(1);
            player.enqueue(recipeWaitLocal);
            player.enqueue(recipeWait0_5s);
            expect(player.playlist).to.have.length(3);

            let completedRecipes = [];

            expect(player.status).to.equal(RecipeState.idle);
            player.start()
                .on('recipeFinished', (recipe: Recipe) => {
                    expect(recipe).to.have.property('status', 'completed');
                    completedRecipes.push(recipe.id);
                })
                .on('recipeStarted', (recipe) => {
                    if (completedRecipes.length==2) {
                        expect(player.getCurrentRecipe().id).to.equal(recipe.id);
                        player.pause();
                        expect(player.status).to.equal(RecipeState.paused);
                        player.start();
                        expect(player.status).to.equal(RecipeState.running);
                        expect(player.getCurrentRecipe().id).to.equal(recipe.id);
                    }
                })
                .once('completed', async () => {
                    expect(completedRecipes).to.have.length(3);
                    expect(player.status).to.equal(RecipeState.completed);
                    player.reset();
                    expect(player.status).to.equal(RecipeState.idle);
                    done();
                });
            expect(()=>player.start()).to.throw('already running');

            expect(player.status).to.equal(RecipeState.running);
            const json = player.json();
            expect(json.currentItem).to.equal(0);
            expect(json.status).to.equal('running');


        });

        it('should load run Player with three local waiting recipes and removal', function(done) {
            this.timeout(5000);
            let player = new Player();

            player.enqueue(recipeWait0_5s);
            expect(player.playlist).to.have.length(1);
            player.enqueue(recipeWaitLocal);
            player.enqueue(recipeWait0_5s);
            expect(player.playlist).to.have.length(3);

            player.remove(0);
            expect(player.playlist).to.have.length(2);
            expect(player.playlist[0].id).to.equal(recipeWaitLocal.id);

            player.enqueue(recipeWaitLocal);

            let completedRecipes = [];

            expect(player.status).to.equal(RecipeState.idle);
            player.start()
                .on('recipeFinished', (recipe: Recipe) => {
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
            expect(player.status).to.equal(RecipeState.running);
            const json = player.json();
            expect(json.currentItem).to.equal(0);
            expect(json.status).to.equal('running');
        });

        it('should  force a transition', async () => {
            this.timeout(5000);
            let player = new Player();
            player.enqueue(recipeWaitLocal);
            player.start();

            await timeout(new Promise((resolve) => {
                player.once('recipeStarted', () => resolve());
            }), 100);

            expect(player.getCurrentRecipe().current_step.name).to.equal('S1');

            expect(() => player.forceTransition('non-existant', 'S2')).to.throw();
            expect(() => player.forceTransition('S1', 'non-existant')).to.throw();
            expect(() => player.forceTransition('S1', 'S3')).to.throw();

            // do not change in next 100ms
            await new Promise((resolve, reject) => {
                player.once('stepFinished', (step) => {
                    reject();
                });
                setTimeout(() => {resolve()}, 100);
            });

            player.forceTransition('S1', 'S2');

            expect(player.getCurrentRecipe().current_step.name).to.equal('S2');

            // do not change in next 100ms
            await new Promise((resolve, reject) => {
                player.once('stepFinished', (step) => {
                    reject();
                });
                setTimeout(() => {resolve()}, 100);
            });

            player.forceTransition('S2', 'S3');
            expect(player.getCurrentRecipe().current_step.name).to.equal('S3');

            await timeout(new Promise((resolve) => {
                player.once('completed', () => resolve());
            }), 1000);

        });
    });

    describe.skip('CIF', () => {

        let recipeCif;
        const manager = new Manager();
        let player = new Player();

        before(async () => {
            const module = manager.loadModule(JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString()))[0];
            recipeCif = manager.loadRecipe(JSON.parse(fs.readFileSync('assets/recipes/recipe_cif_test.json').toString()));

            // bring required services to idle
            await module.connect();

            try {
                await module.abort();
            } catch {}
            await delay(200);

            try {
                await module.reset();
            } catch { }
            await delay(200);

            await module.disconnect();
        });

        it('should run Player with CIF test recipes', async function() {
            this.timeout(5000);
            player.enqueue(recipeCif);
            return await timeout(new Promise((resolve) => {
                player.start()
                    .on('recipeFinished', (recipe: Recipe) => {
                        expect(recipe).to.have.property('status', 'completed');
                    })
                    .on('completed', () => resolve());
            }), 3000);
        });

        after(async () =>{
            await Promise.all(manager.modules.map(module => module.disconnect()));
        })

    });

});
