import {Recipe, RecipeOptions} from "./Recipe";
import {Step} from "./Step";
import {RecipeState} from "./enum";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";
import {Module, ModuleOptions} from "./Module";
import {Service} from "./Service";
import {ManagerInterface} from "pfe-ree-interface";

export class Manager {

    // loaded activeRecipe
    activeRecipe: Recipe;
    recipes: Recipe[] = [];

    // loaded modules
    modules: Module[] = [];

    queue: Recipe;

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

    public activateRecipe(recipeId: string) {
        if (this.activeRecipe && this.activeRecipe.status === RecipeState.running) {
            return new Error("Another Recipe is currently running");
        } else {
            this.activeRecipe = this.recipes.find(recipe => recipe.id === recipeId);
        }
    }

    public loadRecipe(options: RecipeOptions): Recipe {
        const newRecipe = new Recipe(options, this.modules);
        this.recipes.push(newRecipe);
        manager.eventEmitter.emit('refresh', 'recipes');
        return newRecipe;
    }


    /**
     * Start loaded activeRecipe
     * @returns {EventEmitter}
     */
    async start() {
        if (this.activeRecipe.status === RecipeState.idle) {
            catRM.info("Start activeRecipe");
            (await this.activeRecipe.start())
                .on('recipe_completed', () => {
                    catRM.info(`Recipe finished`);
                })
                .on('step_finished', (step: Step, next_step: Step) => {
                    catRM.info(`Step finished: ${step.name} -> ${next_step ? next_step.name : 'none'}`);
                });
        }
    }

    reset() {
        if (this.activeRecipe.status === RecipeState.completed || this.activeRecipe.status === RecipeState.stopped) {
            this.activeRecipe.reset();
            this.eventEmitter.emit('refresh', 'recipe', 'reset');
        } else {
            throw new Error('Recipe not in completed or stopped');
        }
    }

    /**
     * Abort all services from modules used in activeRecipe
     * @returns {Promise}
     */
    abortRecipe() {
        let tasks = Array.from(this.activeRecipe.modules).map((module) => {
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
        let recipe = this.activeRecipe ? {
            status: RecipeState[this.activeRecipe.status],
            name: this.activeRecipe.name
        } : undefined;
        return {
            activeRecipe: recipe,
            modules: this.modules.map(module => module.id),
            autoReset: this.autoreset
        };
    }



}

export const manager: Manager = new Manager();
