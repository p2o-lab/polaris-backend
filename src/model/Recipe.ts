import {Step} from './Step';
import {Module} from './Module';
import {catRecipe} from '../config/logging';
import {EventEmitter} from "events";
import {v4} from 'uuid';
import {Transition} from "./Transition";
import {manager} from "./Manager";
import {RecipeInterface, RecipeOptions, RecipeState, StepInterface} from "pfe-ree-interface";

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

    public start(): EventEmitter {
        this.connectModules()
            .then(() => {
                this.current_step = this.initial_step;
                this.status = RecipeState.running;
                this.executeStep();
            })
            .catch(() => {
                catRecipe.warn('Could not connect to all modules. Thus start of recipe not possible.');
                throw new Error('Could not connect to all modules. Thus start of recipe not possible.')
            });
        return this.eventEmitter;
    }

    public stepJson(): StepInterface {
        let result = undefined;
        if (this.current_step) {
            result = this.current_step.json();
        }
        return result;
    }

    private initRecipe() {
        this.current_step = undefined;
        this.status = RecipeState.idle;
    }

    public async json(): Promise<RecipeInterface> {
        return {
            id: this.id,
            modules: await this.getServiceStates(),
            status: this.status,
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

    public async getServiceStates() {
        const tasks = [];
        this.modules.forEach(async (module) => {
            tasks.push(module.getServiceStates()
                .then((data) => {
                    return {module: module.id, connected: true, services: data}
                })
                .catch(() => {
                    return {module: module.id, connected: false}
                })
            );
        });
        return await Promise.all(tasks);
    }

    private executeStep(): EventEmitter {
        catRecipe.debug(`Start step: ${this.current_step.name}`);
        this.current_step.execute()
            .on('completed', (finishedStep: Step, transition: Transition) => {
                if (finishedStep !== this.current_step) {
                    catRecipe.warn(`not correct step. Current Step: ${this.current_step.name}. Reported step: ${finishedStep.name}`);
                } else {
                    this.eventEmitter.emit('step_finished', this.current_step, transition.next_step);
                    manager.eventEmitter.emit('refresh', 'recipe', 'stepFinished');
                    if (transition.next_step) {
                        catRecipe.info(`Step ${finishedStep.name} finished. New step is ${transition.next_step_name}`);
                        this.current_step = transition.next_step;
                        this.executeStep();
                    } else {
                        catRecipe.info(`Recipe completed: ${this.name}`);
                        this.current_step = this.initial_step;
                        this.status = RecipeState.completed;
                        this.eventEmitter.emit('recipe_finished', this);
                        manager.eventEmitter.emit('refresh', 'recipe', 'completed');
                        this.eventEmitter.removeAllListeners();
                    }
                }
            });
        return this.eventEmitter;
    }

}
