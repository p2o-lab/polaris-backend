import {expect} from 'chai';
import {suite, test} from "mocha-typescript";
import {Recipe} from "../src/model/Recipe";
import * as fs from "fs";
import * as assert from "assert";


@suite
class RecipeTest {
    @test create() {

        fs.readFile('test/recipes/recipe_huber_only.json', (err, file) => {
            let json = JSON.parse(file.toString());
            let recipe = new Recipe(json);

            assert.equal(recipe.modules.size, 1);

        });
    }

}