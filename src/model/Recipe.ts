import {Step, StepOptions} from './Step';
import {Module} from './Module';
import {catRecipe} from '../config/logging';
import {RecipeState} from './enum';
import {EventEmitter} from "events";

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
    recipe_status: RecipeState;
    eventEmitter: EventEmitter;

    constructor(options: RecipeOptions, modules: Module[]) {
        this.version = options.version;
        this.name = options.name;
        this.author = options.author;

        this.steps = options.steps.map(stepOptions => new Step(stepOptions, modules, this));

        // Resolve next steps to appropriate objects
        this.steps.forEach((step: Step) => {
            step.transitions.forEach((transition) => {
                transition.next_step = this.steps.find(step => step.name === transition.next_step_name);
            });
        });
        this.initial_step = this.steps.find(step => step.name === options.initial_step);

        this.initRecipe();
        this.eventEmitter = new EventEmitter();

        catRecipe.info('Recipe parsing finished');
    }

    reset() {
        this.initRecipe();
    }

    start(): EventEmitter {
        this.current_step = this.initial_step;
        this.recipe_status = RecipeState.running;
        this.executeStep(() => {
            this.recipe_status = RecipeState.completed;
            catRecipe.info(`Recipe completed ${this.modules}`);
            this.eventEmitter.emit('completed', 'succesful');
        });
        return this.eventEmitter;
    }

    private initRecipe() {
        this.current_step = undefined;
        this.recipe_status = RecipeState.idle;
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

}
