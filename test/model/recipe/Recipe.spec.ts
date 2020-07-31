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

import {ConditionType, RecipeInterface, RecipeOptions} from '@p2olab/polaris-interface';
import * as assert from 'assert';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import * as delay from 'timeout-as-promise';
import {Module} from '../../../src/model/core/Module';
import {Recipe} from '../../../src/model/recipe/Recipe';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Recipe', () => {

    it('should fail with missing name', () => {
        expect(() => new Recipe({
            name: null, author: null, description: null,
            initial_step: null, version: null, steps: null
        }, [])).to.throw('missing');
    });

    it('should fail with missing steps', () => {
        expect(() => new Recipe({
            name: 'test', author: null, description: null,
            initial_step: null, version: null, steps: null
        }, [])).to.throw('missing');
    });

    it('should fail with missing initial step', () => {
        expect(() => new Recipe({
            name: 'test', author: null, description: null,
            initial_step: null, version: null, steps: []
        }, [])).to.throw('not found');
    });

    it('should fail with wrong initial step', () => {
        expect(() => new Recipe({
            name: 'test', author: null, description: null,
            initial_step: 'initial', version: null, steps: []
        }, [])).to.throw('not found');
    });

    it('should fail with wrong next step', () => {
        expect(() => new Recipe({
                name: 'test', author: null, description: null,
                initial_step: 'initial', version: null,
                steps: [{
                    name: 'initial', operations: [], transitions: [{
                        next_step: 'notexisting',
                        condition: {type: ConditionType.time, duration: 1}
                    }]
                }]
            }
            , [])).to.throw('not found');
    });

    it('should work', () => {
        expect(new Recipe({
            name: 'test', author: null, description: null,
            initial_step: 'initial', version: null, steps: [{name: 'initial', operations: [], transitions: []}]
        }, []))
            .to.have.property('id');
    });

    describe('with module test server', () => {

        let moduleServer: ModuleTestServer;
        let module: Module;

        beforeEach(async function() {
            this.timeout(5000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            module = new Module(moduleJson);
            await module.connect();
        });

        afterEach(async () => {
            await module.disconnect();
            await moduleServer.shutdown();
        });

        it('runs test recipe successfully', async () => {
            const recipeJson = JSON.parse(
                fs.readFileSync('assets/recipes/test/recipe_testserver_2services_1.0.0.json').toString());
            const recipe = new Recipe(recipeJson, [module]);

            await recipe.start();

            await new Promise((resolve) => {
                recipe.on('completed', resolve);
            });
        }).timeout(5000);

        it('should only run one recipe at a time', async () => {
            // now test recipe
            const recipeJson = JSON.parse(
                fs.readFileSync('assets/recipes/test/recipe_testserver_2services_1.0.0.json').toString());
            const recipe = new Recipe(recipeJson, [module]);

            await recipe.start();
            await expect(recipe.start()).to.be.rejectedWith(/already running/);
            await new Promise((resolve) => {
                recipe.on('completed', resolve);
            });
        }).timeout(5000);

        it('should only allow to stop running recipe', async () => {
            const recipeJson = JSON.parse(
                fs.readFileSync('assets/recipes/test/recipe_testserver_2services_1.0.0.json').toString());
            const recipe = new Recipe(recipeJson, [module]);

            await expect(recipe.stop()).to.be.rejectedWith('Can only stop running recipe');
            await recipe.start();
            await delay(50);
            await recipe.stop();
            await expect(recipe.stop()).to.be.rejectedWith('Can only stop running recipe');
        });

    });

    describe('valid recipes', () => {

        const modules = [];

        before(() => {
            let file = fs.readFileSync('assets/modules/achema_demonstrator/modules_achema.json');
            let options = JSON.parse(file.toString());
            modules.push(new Module(options.modules[0]));
            modules.push(new Module(options.modules[1]));
            modules.push(new Module(options.modules[2]));

            file = fs.readFileSync('assets/modules/module_cif.json');
            options = JSON.parse(file.toString());
            modules.push(new Module(options.modules[0]));
        });

        it('should load the achema json', (done) => {
            fs.readFile('assets/recipes/recipe_achema_v0.2.0.json', async (err, file) => {
                const options = JSON.parse(file.toString());
                const recipe = new Recipe(options, modules);
                expect(modules).to.have.length(4);
                expect(recipe.modules).to.have.length(3);

                const json: RecipeInterface = await recipe.json();
                expect(json).to.have.property('protected', false);
                expect(json).to.have.property('modules')
                    .to.deep.equal(['Temper', 'React', 'Dose']);
                expect(json).to.have.property('options')
                    .to.have.property('initial_step', 'Startup.Init');
                expect(json).to.have.property('status', 'idle');

                const step = recipe.steps[0];
                expect(step.json()).to.have.property('name', 'Startup.Init');

                done();
            });
        });

        describe('should load all recipes', () => {
            const path = 'assets/recipes/';
            fs.readdirSync(path).forEach((filename) => {
                const completePath = path + filename;
                if (fs.statSync(completePath).isFile()) {
                    it(`should load recipe ${completePath}`, () => {
                        const file = fs.readFileSync(completePath);
                        const options: RecipeOptions = JSON.parse(file.toString());
                        const recipe = new Recipe(options, modules);
                        expect(recipe.name).to.equal(options.name);
                    });
                }
            });
        });

        it('should load the huber recipe json', (done) => {
            fs.readFile('assets/recipes/recipe_huber_only.json', (err, file) => {
                const options = JSON.parse(file.toString());
                const recipe = new Recipe(options, modules);
                assert.equal(recipe.modules.size, 1);
                done();
            });
        });
    });

});
