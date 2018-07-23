import {Recipe, RecipeOptions} from "./Recipe";
import * as fs from "fs";
import {Step} from "./Step";
import {RECIPE_STATE} from "./enum";
import {catRecipe} from "../config/logging";

export class RecipeManager {

    recipe: Recipe;

    current_step: Step;

    recipe_status: RECIPE_STATE;

    public loadRecipeFromPath(recipe_path) {
        if (this.recipe_status == RECIPE_STATE.RUNNING) {
            return new Error("Another Recipe is currenly running");
        }
        let recipe_buffer = fs.readFileSync(recipe_path);
        let json: RecipeOptions = JSON.parse(recipe_buffer.toString());
        this.recipe = new Recipe(json);

        this.recipe_status = RECIPE_STATE.IDLE;
    }

    public loadRecipe(options: RecipeOptions) {
        if (this.recipe_status == RECIPE_STATE.RUNNING) {
            return new Error("Another Recipe is currenly running");
        }
        this.recipe = new Recipe(options);
        this.recipe_status = RECIPE_STATE.IDLE;
    }

    start() {
        this.current_step = this.recipe.initial_step;
        this.recipe_status = RECIPE_STATE.RUNNING;
        this.executeStep(() => {
            catRecipe.info("Recipe completed");
        });
    }

    stop() {

    }

    pause() {

    }

    complete() {

    }

    public getState() {
        return {
            name: this.recipe.name,
            current_step: this.current_step,
            status: this.recipe_status
        }
    }

    private executeStep(callback_recipe) {
        catRecipe.info(`Start step: ${this.current_step.name}`);
        this.current_step.execute((step: Step) => {
            if (step) {
                catRecipe.info(`Step finished. New step is ${step.name}`);
                this.current_step = step;
                this.executeStep(callback_recipe);
            } else {
                catRecipe.info("Last step finished.");
                this.recipe_status = RECIPE_STATE.COMPLETED;
                callback_recipe();
            }
        });
    }
}