/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Player} from '../../src/model/Player';
import * as fs from 'fs';
import {Recipe} from '../../src/model/Recipe';
import {expect} from 'chai';
import {Module} from '../../src/model/Module';
import {manager} from '../../src/model/Manager';

describe('Player', function () {

    this.timeout(10000);


    describe('local', () => {
        let recipeWait5s;
        let recipeWaitLocal;
        before(() => {
            recipeWait5s = new Recipe(
                JSON.parse(fs.readFileSync('assets/recipes/test/recipe_wait_0.5s.json').toString()),
                [], false);
            recipeWaitLocal = new Recipe(
                JSON.parse(fs.readFileSync('assets/recipes/test/recipe_time_local.json').toString()),
                [], false);
        });

        it('should load run Player with three local recipes', (done) => {
            let player = new Player();

            player.enqueue(recipeWait5s);
            expect(player.playlist).to.has.length(1);
            player.enqueue(recipeWaitLocal);
            player.enqueue(recipeWait5s);
            expect(player.playlist).to.has.length(3);

            let completedRecipes = [];
            player.start();
            player.on('recipe_finished', (recipe) => {
                expect(recipe).to.have.property('status', 'completed');
                completedRecipes.push(recipe);
            });
            player.on('completed', () => {
                expect(completedRecipes).to.has.length(3);
                done();
            });
        });
    });

    describe('CIF', () => {

        let modules;
        let recipeCif;
        before(() => {
            modules = manager.loadModule(JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString()));
            recipeCif = new Recipe(JSON.parse(fs.readFileSync('assets/recipes/recipe_cif_test.json').toString()),
                modules);
        });

        it('should run Player with CIF test recipes', (done) => {
            let player = new Player();

            player.enqueue(recipeCif);
            player.start();
            player.on('recipe_finished', (recipe) => {
                expect(recipe).to.have.property('status', 'completed');
            });
            player.on('completed', () => {
                done();
            });
        });

    });

});
