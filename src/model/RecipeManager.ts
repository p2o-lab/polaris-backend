import {Recipe, RecipeOptions} from "./Recipe";
import * as fs from "fs";
import {Step} from "./Step";
import {RecipeState} from "./enum";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";
import {Module} from "./Module";

export class RecipeManager {

    // loaded recipe
    recipe: Recipe;
    recipe_options: RecipeOptions;

    // loaded modules
    modules: Module[] = [];


    public loadModule(options): Module[] {
        let newModules: Module[] = [];
        if (options.subplants) {
            options.subplants.forEach((subplant) => {
                subplant.modules.forEach((module) => {
                    newModules.push(new Module(module));
                });
            });
        }
        if (options.modules) {
            options.modules.forEach((module) => {
                newModules.push(new Module(module));
            });
        }
        this.modules.push(...newModules);
        return newModules;
    }

    public loadRecipeFromPath(recipe_path) {
        if (this.recipe && this.recipe.recipe_status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        }
        let recipe_buffer = fs.readFileSync(recipe_path);
        let recipeOptions: RecipeOptions = JSON.parse(recipe_buffer.toString());
        this.recipe = new Recipe(recipeOptions, this.modules);
        this.recipe_options = recipeOptions;
    }

    public loadRecipe(options: RecipeOptions) {
        if (this.recipe && this.recipe.recipe_status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        }
        this.recipe = new Recipe(options, this.modules);
        this.recipe_options = options;
    }

    public async getServiceStates() {
        let tasks = [];
        this.recipe.modules.forEach(async (module) => {
            tasks.push(module.getServiceStates()
                .then((data) => {
                    return {module: module.id, services: data}
                })
                .catch((err) => {
                    return {module: module.id, connected: false}
                })
            );
        });
        const states = await Promise.all(tasks);
        return states;
    }

    async connect(): Promise<any> {
        catRM.info("Start connecting to all modules ...");
        const result = await this.recipe.connectModules();
        catRM.info("Connected to all modules necessary for loaded recipe");
        return result;
    }

    close() {
        catRM.info("Close RecipeManager ...");
        return this.recipe.disconnectModules();
    }


    /**
     * Start loaded recipe
     * @returns {"events".internal.EventEmitter}
     */
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

    /**
     * Abort all services from modules used in recipe
     * @returns {Promise}
     */
    abortRecipe() {
        let tasks = Array.from(this.recipe.modules).map((module) => {
            return module.services.map((service) => {
                return service.abort();
            })
        });
        return Promise.all(tasks);
    }

    /**
     * Abort all services from all loaded modules
     * @returns {Promise}
     */
    abortAllModules() {
        let tasks = this.modules.map(module =>
            module.services.map(service =>
                service.abort()
            )
        );
        return Promise.all(tasks);
    }
}

export const recipe_manager: RecipeManager = new RecipeManager();
