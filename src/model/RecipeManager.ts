import {Recipe, RecipeOptions} from "./Recipe";
import * as fs from "fs";
import {Step} from "./Step";
import {RecipeState} from "./enum";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";

export class RecipeManager {

    recipe: Recipe;
    recipe_options: RecipeOptions;

    public loadRecipeFromPath(recipe_path) {
        if (this.recipe && this.recipe.recipe_status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        }
        let recipe_buffer = fs.readFileSync(recipe_path);
        let recipeOptions: RecipeOptions = JSON.parse(recipe_buffer.toString());
        this.recipe = new Recipe(recipeOptions);
        this.recipe_options = recipeOptions;
    }

    public loadRecipe(options: RecipeOptions) {
        if (this.recipe && this.recipe.recipe_status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        }
        this.recipe = new Recipe(options);
        this.recipe_options = options;
    }

    public async getState() {
        let tasks = [];
        this.recipe.modules.forEach((module) => {
            tasks.push(module.getServiceStates()
                .then(data => Promise.resolve({module: module.name, services: data})));
        });
        const states = await Promise.all(tasks);
        return states;
    }

    connect(): Promise<any> {
        catRM.info("Start connecting to all modules ...");
        return new Promise((resolve, reject) => {
            this.recipe.connectModules()
                .then(() => {
                    catRM.info("Successful connected to all modules.");
                    resolve("Successful connected to all modules");
                })
                .catch((err) => {
                    catRM.error(`Could not connect to all modules in recipe`, err);
                    reject(err);
                });
        });
    }

    close() {
        catRM.info("Close RecipeManager ...");
        return this.recipe.disconnectModules();
    }


    start(): EventEmitter {
        if (this.recipe.recipe_status === RecipeState.idle) {
            catRM.info("Start recipe");
            return this.recipe.start()
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
