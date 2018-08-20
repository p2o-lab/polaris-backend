import {expect} from 'chai';
import {suite, test} from "mocha-typescript";
import {Recipe} from "../src/model/Recipe";
import * as fs from "fs";
import * as assert from "assert";


@suite
class RecipeTest {
    @test create() {

        fs.readFile('assets/recipes/recipe_huber_only.json', (err, file) => {
            let options = JSON.parse(file.toString());
            let recipe = new Recipe(options, undefined);

            assert.equal(recipe.modules.size, 1);

        });
    }

}