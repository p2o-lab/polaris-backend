import {Step, StepOptions} from './Step';
import {Module} from './Module';
import {catRecipe} from '../config/logging';
import {RecipeState} from './enum';
import {EventEmitter} from "events";
import {RecipeInterface} from "pfe-ree-interface";

export interface RecipeOptions {
    version: string;
    name: string;
    author: string;
    initial_step: string;
    steps: StepOptions[];
}

export class Recipe {

    version: string;
    name: string;
    author: string;
    // necessary modules
    modules: Set<Module> = new Set<Module>();
    initial_step: Step;
    steps: Step[];

    current_step: Step;
    status: RecipeState;
    eventEmitter: EventEmitter;

    options: RecipeOptions;

    constructor(options: RecipeOptions, modules: Module[]) {
        if (options.version) {
            this.version = options.version;
        } else {
            throw new Error('Version property of recipe is missing');
        }
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error('Version property of recipe is missing');
        }
        this.author = options.author;

        if (options.steps) {
            this.steps = options.steps.map(stepOptions => new Step(stepOptions, modules, this));

            // Resolve next steps to appropriate objects
            this.steps.forEach((step: Step) => {
                step.transitions.forEach((transition) => {
                    transition.next_step = this.steps.find(step => step.name === transition.next_step_name);
                });
            });
        } else {
            throw new Error('steps array is missing in recipe');
        }
        if (options.initial_step) {
            this.initial_step = this.steps.find(step => step.name === options.initial_step);
        } else {
            throw new Error('"initial_step" property is missing in recipe');
        }

        this.options = options;
        this.initRecipe();
        this.eventEmitter = new EventEmitter();

        catRecipe.info('Recipe parsing finished');
    }

    reset() {
        this.initRecipe();
    }

    start(): EventEmitter {
        this.current_step = this.initial_step;
        this.status = RecipeState.running;
        this.executeStep(() => {
            this.status = RecipeState.completed;
            catRecipe.info(`Recipe completed ${this.modules}`);
            this.eventEmitter.emit('completed', 'succesful');
        });
        return this.eventEmitter;
    }

    private initRecipe() {
        this.current_step = undefined;
        this.status = RecipeState.idle;
    }

    public connectModules(): Promise<any[]> {
        const tasks = Array.from(this.modules).map(module => module.connect());
        return Promise.all(tasks);
    }

    public disconnectModules(): Promise<any[]> {
        const tasks = Array.from(this.modules).map(module => module.disconnect());
        return Promise.all(tasks);
    }

    private executeStep(callback_recipe_completed): void {
        catRecipe.info(`Start step: ${this.current_step.name}`);
        this.current_step.execute((step: Step) => {
            if (step) {
                catRecipe.info(`Step finished. New step is ${step.name}`);
                this.eventEmitter.emit('step_finished', this.current_step, step);
                this.current_step = step;
                this.executeStep(callback_recipe_completed);
            } else {
                catRecipe.info('Last step finished.');
                callback_recipe_completed();
            }
        });
    }

    public stepJson(): any {
        if (this.current_step) {
            return {
                name: this.current_step.name,
                transitions: this.current_step.transitions.map(transition => transition.json()),
                operations: this.current_step.operations.map(operation => operation.json())
            }
        }
        else {
            return {
                name: 'not started yet'
            }
        }
    }

    public async getServiceStates() {
        let tasks = [];
        this.modules.forEach(async (module) => {
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

    public async json(): Promise<RecipeInterface> {
        return {
            modules: await this.getServiceStates(),
            status: RecipeState[this.status],
            currentStep: this.stepJson(),
            options: this.options
        }
    }

}
