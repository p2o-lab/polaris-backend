/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {RecipeInterface, RecipeOptions, RecipeState, StepInterface} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {v4} from 'uuid';
import {catRecipe} from '../../config/logging';
import {Module} from '../core/Module';
import {Step} from './Step';
import {Transition} from './Transition';

/**
 * Events emitted by [[Recipe]]
 */
interface RecipeEvents {
    /**
     * when recipe has successfully started
     * @event
     */
    started: void;
    /**
     * when recipe has been stopped, returns recent step
     * @event
     */
    stopped: Step;
    /**
     * when a step is finished in the recipe
     * @event
     */
    stepFinished: Step;
    /**
     * when recipe completes
     * @event
     */
    completed: void;
}

type RecipeEmitter = StrictEventEmitter<EventEmitter, RecipeEvents>;

/** Recipe which can be started.
 * It is parsed from RecipeOptions
 *
 */
export class Recipe extends (EventEmitter as new() => RecipeEmitter) {

    public readonly id: string;
    public readonly name: string;
    public readonly options: RecipeOptions;
    public readonly protected: boolean;

    // necessary modules
    public modules: Set<Module> = new Set<Module>();
    public readonly initialStep: Step;
    public readonly steps: Step[];

    // dynamic properties
    public currentStep: Step;
    public status: RecipeState;
    public lastChange: Date;
    private stepListener: EventEmitter;

    constructor(options: RecipeOptions, modules: Module[], protectedRecipe: boolean = false) {
        super();
        this.id = v4();
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error('Version property of recipe is missing');
        }

        if (options.steps) {
            this.steps = options.steps.map((stepOptions) => new Step(stepOptions, modules));

            // Resolve next steps to appropriate objects
            this.steps.forEach((step: Step) => {
                this.modules = new Set([...this.modules, ...step.getUsedModules()]);
                step.transitions.forEach((transition) => {
                    transition.next_step = this.steps.find((step) => step.name === transition.next_step_name);
                    if (!transition.next_step && !['completed', 'finished'].find((v) => v === transition.next_step_name)) {
                        throw new Error(`Recipe load error ${this.name}: Next step "${transition.next_step_name}" not found in "${step.name}" for condition "${JSON.stringify(transition.condition.json())}"`);
                    }
                });
            });
        } else {
            throw new Error('steps array is missing in activeRecipe');
        }
        if (options.initial_step) {
            this.initialStep = this.steps.find((step) => step.name === options.initial_step);
        }
        if (!this.initialStep) {
            throw new Error(`"initial_step" property '${options.initial_step}' is missing in activeRecipe`);
        }

        this.options = options;
        this.protected = protectedRecipe;
        this.lastChange = new Date();

        catRecipe.info(`Recipe ${this.name} (${this.options.version}) successfully parsed`);
    }

    public stepJson(): StepInterface {
        let result;
        if (this.currentStep) {
            result = this.currentStep.json();
        }
        return result;
    }

    /** Get JSON description of recipe
     *
     * @returns {RecipeInterface}
     */
    public json(): RecipeInterface {
        return {
            id: this.id,
            modules: Array.from(this.modules).map((module) => module.id),
            status: this.status,
            currentStep: this.currentStep ? this.currentStep.name : undefined,
            options: this.options,
            protected: this.protected,
            lastChange: (new Date().getTime() - this.lastChange.getTime()) / 1000
        };
    }

    /** Connect to all modules necessary for this recipe
     *
     * @returns {Promise<void[]>}
     */
    public connectModules(): Promise<void[]> {
        let promise;
        const tasks = Array.from(this.modules).map((module) => module.connect());
        if (tasks.length > 0) {
            promise = Promise.all(tasks);
        } else {
            promise = Promise.resolve();
        }
        return promise;
    }

    /**
     * Starts recipe
     */
    public start(): Recipe {
        this.currentStep = this.initialStep;
        this.status = RecipeState.idle;
        this.connectModules()
            .catch((reason) => {
                throw new Error(`Could not connect to all modules for recipe ${this.name}. ` +
                    `Start of recipe not possible: ${reason.toString()}`);
            })
            .then(() => {
                this.currentStep = this.initialStep;
                this.status = RecipeState.running;
                this.executeStep();
                this.emit('started');
            });
        return this;
    }

    /**
     * Stops recipe
     *
     * Clear monitoring of all conditions. Services won't be touched.
     */
    public async stop() {
        catRecipe.info(`Stop recipe ${this.name}`);
        await Promise.all(Array.from(this.modules).map((module: Module) => module.stop()));
        this.status = RecipeState.stopped;
        this.stepListener.removeAllListeners('completed');
        this.currentStep.transitions.forEach((trans) => trans.condition.clear());
        this.emit('stopped', this.currentStep);
        this.currentStep = undefined;
    }

    private executeStep() {
        catRecipe.debug(`Execute step: ${this.currentStep.name}`);
        this.lastChange = new Date();
        this.stepListener = this.currentStep.execute()
            .once('completed', (transition: Transition) => {
                if (transition.next_step) {
                    catRecipe.info(`Step ${this.currentStep.name} finished. New step is ${transition.next_step_name}`);
                    this.currentStep = transition.next_step;
                    this.executeStep();
                } else {
                    catRecipe.info(`Recipe completed: ${this.name}`);
                    this.currentStep = undefined;
                    this.status = RecipeState.completed;
                    this.emit('completed');
                }
                this.emit('stepFinished', this.currentStep);
            });
    }

}
