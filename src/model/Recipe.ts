import {Step, StepOptions} from './Step';
import {Module, ModuleOptions} from './Module';
import {catRecipe} from '../config/logging';
import {RECIPE_STATE} from './enum';
import {EventEmitter} from "events";

export interface RecipeOptions {
    version: string;
    name: string;
    author: string;
    modules: Map<string, ModuleOptions>;
    initial_step: string;
    steps: Map<string, StepOptions>;
}

export class Recipe {

    version: string;
    name: string;
    author: string;
    modules: Map<string, Module>;
    initial_step: Step;
    steps: Map<string, Step>;

    current_step: Step;
    recipe_status: RECIPE_STATE;
    eventEmitter: EventEmitter;

    constructor(options: RecipeOptions) {
        this.version = options.version;
        this.name = options.name;
        this.author = options.author;

        this.modules = new Map<string, Module>();
        Object.keys(options.modules).forEach((key) => {
            const option_module: Module = options.modules[key];

            this.modules.set(key, new Module(option_module));

        });

        this.steps = new Map<string, Step>();
        Object.keys(options.steps).forEach((key) => {
            const stepOptions: StepOptions = options.steps[key];

            this.steps.set(key, new Step(stepOptions, this.modules));

        });

        // Resolve next steps to appropriate objects
        this.steps.forEach((step: Step) => {
            step.transitions.forEach((transition) => {
                transition.next_step = this.steps.get(transition.next_step_name);
            });
        });

        this.initial_step = this.steps.get(options.initial_step);
        this.recipe_status = RECIPE_STATE.IDLE;
        this.eventEmitter = new EventEmitter();

        catRecipe.info('Recipe parsing finished');
    }

    start(): EventEmitter {
        this.current_step = this.initial_step;
        this.connectModules();
        this.recipe_status = RECIPE_STATE.RUNNING;
        this.executeStep(() => {
            catRecipe.info(`Recipe completed ${this.modules}`);
            this.eventEmitter.emit('completed', 'succesful');
            this.disconnectModules();
        });

        return this.eventEmitter;
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
                this.recipe_status = RECIPE_STATE.COMPLETED;
                callback_recipe_completed();
            }
        });
    }

    private connectModules(): void {
        this.modules.forEach((module) => {
            module.connect();
        });
    }

    private disconnectModules(): void {
        this.modules.forEach((module) => {
            module.disconnect();
        });
    }

}
