import {Recipe, RecipeOptions} from "./Recipe";
import * as fs from "fs";
import {Step} from "./Step";
import {RecipeState} from "./enum";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";
import {Module, ModuleOptions} from "./Module";
import {RecipeManagerInterface} from "./Interfaces";

export class RecipeManager {

    // loaded recipe
    recipe: Recipe;
    recipe_options: RecipeOptions;

    // loaded modules
    modules: Module[] = [];

    eventEmitter: EventEmitter = new EventEmitter();

    /**
     * Load modules from JSON according to TopologyGenerator output or to simplified JSON
     * Skip module if already a module with same id is registered
     * @param options
     * @returns {Module[]}
     */
    public loadModule(options): Module[] {
        let newModules: Module[] = [];
        if (options.subplants) {
            options.subplants.forEach((subplantOptions) => {
                subplantOptions.modules.forEach((moduleOptions: ModuleOptions) => {
                    if (this.modules.find(module => module.id === moduleOptions.id)) {
                        catRM.warn(`Module ${moduleOptions.id} already in registered modules`);
                    } else {
                        newModules.push(new Module(moduleOptions));
                    }
                });
            });
        }
        if (options.modules) {
            options.modules.forEach((moduleOptions) => {
                if (this.modules.find(module => module.id === moduleOptions.id)) {
                    catRM.warn(`Module ${moduleOptions.id} already in registered modules`);
                } else {
                    newModules.push(new Module(moduleOptions));
                }
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
                    return {module: module.id, connected: true, services: data}
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
                    catRM.info(`Recipe finished`);
                    this.eventEmitter.emit('refresh', 'recipe', 'completed');
                })
                .on('step_finished', (step: Step, next_step: Step) => {
                    catRM.info(`Step finished: ${step.name} - ${next_step.name}`)
                    this.eventEmitter.emit('refresh', 'recipe', 'stepFinished', step, next_step);
                });
        }
    }

    reset() {
        if (this.recipe.recipe_status === RecipeState.completed || this.recipe.recipe_status === RecipeState.stopped) {
            this.recipe.reset();
            this.eventEmitter.emit('refresh', 'recipe', 'reset');
        } else {
            throw new Error('Recipe not in completed or stopped');
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

    async json(): Promise<RecipeManagerInterface> {
        return {
            recipe_status: RecipeState[this.recipe.recipe_status],
            service_states: await this.getServiceStates(),
            current_step: this.recipe.stepJson(),
            options: this.recipe_options
        };
    }

}

export const recipe_manager: RecipeManager = new RecipeManager();
