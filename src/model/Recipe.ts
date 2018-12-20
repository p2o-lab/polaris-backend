/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import { Step } from './Step';
import { Module } from './Module';
import { catRecipe } from '../config/logging';
import { EventEmitter } from 'events';
import { v4 } from 'uuid';
import { Transition } from './Transition';
import { manager } from './Manager';
import { RecipeInterface, ModuleInterface, RecipeOptions, RecipeState, StepInterface } from 'pfe-ree-interface';

/** Static description of recipe
 *
 */
export class Recipe {

    id: string;
    name: string;

    // necessary modules
    modules: Set<Module> = new Set<Module>();
    initial_step: Step;
    steps: Step[];

    // dynamic properties (should be moved to RecipeRun)
    current_step: Step;
    status: RecipeState;
    eventEmitter: EventEmitter;

    options: RecipeOptions;
    protected: boolean;

    constructor(options: RecipeOptions, modules: Module[], protectedRecipe: boolean = false) {

        this.id = v4();
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error('Version property of recipe is missing');
        }

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
        }
        if (!this.initial_step) {
            throw new Error(`"initial_step" property '${options.initial_step}' is missing in activeRecipe`);
        }

        this.options = options;
        this.protected = protectedRecipe;
        this.eventEmitter = new EventEmitter();

        catRecipe.info(`Recipe ${this.name} successfully parsed`);
    }

    public stepJson(): StepInterface {
        let result = undefined;
        if (this.current_step) {
            result = this.current_step.json();
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
            modules: this.getModulesInRecipe(),
            status: this.status,
            currentStep: this.current_step ? this.current_step.name : undefined,
            options: this.options,
            protected: this.protected
        };
    }

    public disconnectModules(): Promise<any[]> {
        const tasks = Array.from(this.modules).map(module => module.disconnect());
        return Promise.all(tasks);
    }

    public connectModules(): Promise<any[]> {
        let promise;
        const tasks = Array.from(this.modules).map(module => module.connect());
        if (tasks.length > 0) {
            promise = Promise.all(tasks);
        } else {
            promise = Promise.resolve();
        }
        return promise;
    }

    private getModulesInRecipe(): string[] {
        return Array.from(this.modules).map(module => module.id);
    }

}
