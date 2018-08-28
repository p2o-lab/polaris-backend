import {Step, StepOptions} from './Step';
import {Module} from './Module';
import {catRecipe} from '../config/logging';
import {RecipeState} from './enum';
import {EventEmitter} from "events";
import {RecipeInterface} from "pfe-ree-interface";
import {v4} from 'uuid';
import {Transition} from "./Transition";
import {manager} from "./Manager";

export interface RecipeOptions {
    version: string;
    name: string;
    author: string;
    initial_step: string;
    steps: StepOptions[];
}

export class Recipe {

    id: string;
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

        this.id = v4();
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
            throw new Error('steps array is missing in activeRecipe');
        }
        if (options.initial_step) {
            this.initial_step = this.steps.find(step => step.name === options.initial_step);
        } else {
            throw new Error('"initial_step" property is missing in activeRecipe');
        }

        this.options = options;
        this.initRecipe();
        this.eventEmitter = new EventEmitter();

        catRecipe.info('Recipe parsing finished');
    }

    reset() {
        this.initRecipe();
    }

    public async start(): Promise<EventEmitter> {
        await this.connectModules();
        this.current_step = this.initial_step;
        this.status = RecipeState.running;
        return this.executeStep()
            .on('recipe_finished', () => {
                this.status = RecipeState.completed;
                catRecipe.info(`Recipe completed ${this.name}`);
            });
    }

    private initRecipe() {
        this.current_step = undefined;
        this.status = RecipeState.idle;
    }

    public async json(): Promise<RecipeInterface> {
        return {
            id: this.id,
            modules: await this.getServiceStates(),
            status: RecipeState[this.status],
            currentStep: this.stepJson(),
            options: this.options
        }
    }

    public disconnectModules(): Promise<any[]> {
        const tasks = Array.from(this.modules).map(module => module.disconnect());
        return Promise.all(tasks);
    }

    private connectModules(): Promise<any[]> {
        const tasks = Array.from(this.modules).map(module => module.connect());
        return Promise.all(tasks);
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

    private executeStep(): EventEmitter {
        catRecipe.info(`Start step: ${this.current_step.name}`);
        this.current_step.execute()
            .on('completed', (step: Step, transition: Transition) => {
                if (step !== this.current_step) {
                    catRecipe.warn(`not correct step. Current Step: ${this.current_step.name}. Reported step: ${step.name}`);
                }
                catRecipe.info(`Step ${step.name} finished. New step is ${transition.next_step_name}`);
                this.eventEmitter.emit('step_finished', this.current_step, transition.next_step);
                manager.eventEmitter.emit('refresh', 'recipe', 'stepFinished');
                if (transition.next_step) {
                    this.current_step = transition.next_step;
                    this.executeStep();
                } else {
                    catRecipe.info('Last step finished.');
                    this.eventEmitter.emit('recipe_finished', this);
                    manager.eventEmitter.emit('refresh', 'recipe', 'completed');
                }
            });
        return this.eventEmitter;
    }

}
