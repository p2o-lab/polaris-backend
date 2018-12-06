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

import { Recipe } from '../src/model/Recipe';
import * as fs from 'fs';
import * as assert from 'assert';
import { Module } from '../src/model/Module';
import { RecipeInterface } from 'pfe-ree-interface';

describe('Recipe', () => {

    const modules_achema = [];
    let module_biofeed;

    before((done) => {
        fs.readFile('assets/modules/module_biofeed_1.4.2.json', (err, file) => {
            module_biofeed = new Module(JSON.parse(file.toString()).modules[0]);
        });
        fs.readFile('assets/modules/modules_achema.json', (err, file) => {
            const options = JSON.parse(file.toString()).subplants[0];
            modules_achema.push(new Module(options.modules[0]));
            modules_achema.push(new Module(options.modules[1]));
            modules_achema.push(new Module(options.modules[2]));
            done();
        });
    });

    it('should load the huber recipe json', (done) => {
        fs.readFile('assets/recipes/recipe_huber_only.json', (err, file) => {
            const options = JSON.parse(file.toString());
            const recipe = new Recipe(options, modules_achema);
            assert.equal(recipe.modules.size, 1);
            done();
        });
    });

    it('should load the biofeed recipe json', (done) => {
        fs.readFile('assets/recipes/biofeed/recipe_biofeed_88370C_0.3.1.json', async (err, file) => {
            const options = JSON.parse(file.toString());
            const recipe = new Recipe(options, [module_biofeed]);
            assert.equal(recipe.modules.size, 1);

            const json: RecipeInterface = await recipe.json();
            assert.equal(json.protected, false);
            assert.deepEqual(json.modules, [{ id:'BioFeed', endpoint:'opc.tcp://10.6.51.42:4840', connected:false, protected:false, services: undefined }]);
            assert.equal(json.options.initial_step, 'S1.AddWater');
            assert.equal(json.status, 'idle');

            done();
        });
    });

    it('should load the biofeed standby recipe json', (done) => {
        fs.readFile('assets/recipes/biofeed/recipe_biofeed_standby_0.1.0.json', (err, file) => {
            const options = JSON.parse(file.toString());
            const recipe = new Recipe(options, [module_biofeed]);
            assert.equal(recipe.modules.size, 1);
            done();
        });
    });
});
