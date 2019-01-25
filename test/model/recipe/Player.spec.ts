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
import {Recipe} from '../../../src/model/recipe/Recipe';
import {expect} from 'chai';
import {Manager} from '../../../src/model/Manager';
import {later} from '../../helper';
import {RecipeState} from '@plt/pfe-ree-interface';
import {Module} from '../../../src/model/core/Module';

describe('Player', function () {

    describe('local', () => {
        let recipeWait5s: Recipe;
        let recipeWaitLocal: Recipe;
        before(() => {
            recipeWait5s = new Recipe(
                JSON.parse(fs.readFileSync('assets/recipes/test/recipe_wait_0.5s.json').toString()),
                [], false);
            recipeWaitLocal = new Recipe(
                JSON.parse(fs.readFileSync('assets/recipes/test/recipe_time_local.json').toString()),
                [], false);
        });

        it('should load run Player with three local waiting recipes', function(done) {
            this.timeout(5000);
            let player = new Player();

            player.enqueue(recipeWait5s);
            expect(player.playlist).to.have.length(1);
            player.enqueue(recipeWaitLocal);
            player.enqueue(recipeWait5s);
            expect(player.playlist).to.have.length(3);

            player.remove(0);
            expect(player.playlist).to.have.length(2);
            expect(player.playlist[0].id).to.equal(recipeWaitLocal.id)

            player.enqueue(recipeWaitLocal);

            let completedRecipes = [];

            expect(player.status).to.equal(RecipeState.idle);
            player.start()
                .on('recipeFinished', (recipe) => {
                    expect(recipe).to.have.property('status', 'completed');
                    completedRecipes.push(recipe);
                })
                .on('completed', () => {
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

        it('should force a transition');
    });

    describe('CIF', () => {

        let recipeCif;
        const manager = new Manager();

        before(async () => {
            const module = manager.loadModule(JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString()))[0];
            recipeCif = manager.loadRecipe(JSON.parse(fs.readFileSync('assets/recipes/recipe_cif_test.json').toString()));

            // bring required services to idle
            await module.connect();
            const service = module.services.find(s => s.name === "Test_Service.Vorlegen");

            await service.abort();
            await later(500);

            await service.reset();
            await later(500);

            await module.disconnect();
        });

        it('should run Player with CIF test recipes', async function() {
            this.timeout(5000);
            let player = new Player();

            player.enqueue(recipeCif);
            return await new Promise((resolve) => {
                player.start()
                    .on('recipeFinished', (recipe) => {
                        expect(recipe).to.have.property('status', 'completed');
                    })
                    .on('completed', async () => {
                        await Promise.all(manager.modules.map(module => module.disconnect()));
                        resolve();
                    });
            });
        });

    });

});
