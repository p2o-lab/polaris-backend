import {Recipe, RecipeOptions} from "./Recipe";
import * as fs from "fs";
import {Step} from "./Step";
import {RECIPE_STATE} from "./enum";
import {catRM} from "../config/logging";

export class RecipeManager {

    recipe: Recipe;

    public loadRecipeFromPath(recipe_path) {
        if (this.recipe && this.recipe.recipe_status === RECIPE_STATE.RUNNING) {
            return new Error("Another Recipe is currently running");
        }
        let recipe_buffer = fs.readFileSync(recipe_path);
        let json: RecipeOptions = JSON.parse(recipe_buffer.toString());
        this.recipe = new Recipe(json);
    }

    public loadRecipe(options: RecipeOptions) {
        if (this.recipe && this.recipe.recipe_status === RECIPE_STATE.RUNNING) {
            return new Error("Another Recipe is currently running");
        }
        this.recipe = new Recipe(options);
    }

    public getState() {
        return {
            version: "0.1",
            recipe: JSON.stringify(this.recipe)
        }
    }


    start() {
        if (this.recipe.recipe_status === RECIPE_STATE.IDLE) {
            this.recipe.start()
                .on('completed', () => {
                    catRM.info(`Recipe finsished`)
                })
                .on('step_finished', (step: Step, next_step: Step) => {
                    catRM.info(`Step finsished: ${step.name} - ${next_step.name}`)
                });
        }
    }
}

export const recipe_manager: RecipeManager = new RecipeManager();
