import {Recipe, RecipeOptions} from "./Recipe";
import * as fs from "fs";
import {Step} from "./Step";
import {RecipeState} from "./enum";
import {catRecipe, catRM} from "../config/logging";
import {EventEmitter} from "events";
import {Module, ModuleOptions} from "./Module";
import {Service} from "./Service";
import {ManagerInterface} from "pfe-ree-interface";

export class Manager {

    // loaded recipe
    recipe: Recipe;

    // loaded modules
    modules: Module[] = [];

    // autoreset determines if a service is automatically reset when
    private _autoreset: boolean = true;

    // general event emitter
    eventEmitter: EventEmitter = new EventEmitter();

    constructor() {
        this.eventEmitter.on('serviceCompleted', (service: Service) => {
            catRM.debug(`Service ${service.name} completed (autoreset: ${this._autoreset})`);
            if (this._autoreset) {
                service.reset();
            }
        });
    }

    get autoreset(): boolean {
        return this._autoreset;
    }

    set autoreset(value: boolean) {
        catRM.info(`Set AutoReset to ${value}`);
        this._autoreset = value;
    }

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
        } else if (options.modules) {
            options.modules.forEach((moduleOptions) => {
                if (this.modules.find(module => module.id === moduleOptions.id)) {
                    catRM.warn(`Module ${moduleOptions.id} already in registered modules`);
                } else {
                    newModules.push(new Module(moduleOptions));
                }
            });
        } else {
            throw new Error('No modules defined in supplied options');
        }
        this.modules.push(...newModules);
        return newModules;
    }

    public loadRecipeFromPath(recipe_path) {
        if (this.recipe && this.recipe.status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        }
        let recipe_buffer = fs.readFileSync(recipe_path);
        let recipeOptions: RecipeOptions = JSON.parse(recipe_buffer.toString());
        this.recipe = new Recipe(recipeOptions, this.modules);
    }

    public loadRecipe(options: RecipeOptions) {
        if (this.recipe && this.recipe.status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        }
        this.recipe = new Recipe(options, this.modules);
        manager.eventEmitter.emit('refresh', 'recipe', 'new');
    }

    async connect(): Promise<any> {
        catRM.info("Start connecting to all modules ...");
        const result = await this.recipe.connectModules();
        catRM.info("Connected to all modules necessary for loaded recipe");
        return result;
    }

    close() {
        catRM.info("Close Manager ...");
        return this.recipe.disconnectModules();
    }


    /**
     * Start loaded recipe
     * @returns {"events".internal.EventEmitter}
     */
    start(): EventEmitter {
        if (this.recipe.status === RecipeState.idle) {
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
        if (this.recipe.status === RecipeState.completed || this.recipe.status === RecipeState.stopped) {
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

    json(): ManagerInterface {
        let recipe = this.recipe? {status: RecipeState[this.recipe.status], name: this.recipe.name } : undefined;
        return {
            recipe: recipe,
            modules: this.modules.map(module => module.id),
            autoReset: this.autoreset
        };
    }



}

export const manager: Manager = new Manager();
