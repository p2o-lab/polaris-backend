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

import {RecipeState, StepInterface} from 'pfe-ree-interface';
import { Step } from './Step';
import { Recipe } from './Recipe';
import { v4 } from 'uuid';
import { EventEmitter } from 'events';
import { Transition } from './Transition';
import { catRecipe } from '../config/logging';

export class RecipeRun {

    id: string;
    startTime: Date;
    endTime: Date;
    recipe: Recipe;

    current_step: Step;
    status: RecipeState = RecipeState.idle;
    eventEmitter: EventEmitter;

    constructor(recipe: Recipe) {
        this.id = v4();
        this.recipe = recipe;
        this.eventEmitter = new EventEmitter();
        this.initRecipe();
    }

    public json(): { id: string; status: RecipeState; startTime: Date; endTime: Date; currentStep: StepInterface } {
        return {
            id: this.id,
            status: this.status,
            startTime: this.startTime,
            endTime: this.endTime,
            currentStep: this.current_step.json()
        };
    }

    private initRecipe() {
        this.current_step = undefined;
        this.status = RecipeState.idle;
    }

    public start(): EventEmitter {
        this.startTime = new Date();
        this.recipe.connectModules()
            .catch((reason) => {
                throw new Error(`Could not connect to all modules for recipe ${this.recipe.name}. ` +
                    `Start of recipe not possible: ${reason.toString()}`);
            })
            .then(() => {
                this.eventEmitter.emit('started');
                this.current_step = this.recipe.initial_step;
                this.status = RecipeState.running;
                this.executeStep();
            });
        return this.eventEmitter;
    }

    private executeStep() {
        catRecipe.debug(`Start step: ${this.current_step.name}`);
        //manager.eventEmitter.emit('refresh', 'recipe', 'stepStarted');
        this.current_step.execute()
            .on('completed', (finishedStep: Step, transition: Transition) => {
                if (finishedStep !== this.current_step) {
                    catRecipe.warn(`Not correct step. Current Step: ${this.current_step.name}. ` +
                        `Reported step: ${finishedStep.name}`);
                } else {
                    this.eventEmitter.emit('step_finished', this.current_step, transition.next_step);
                    if (transition.next_step) {
                        catRecipe.info(`Step ${finishedStep.name} finished. New step is ${transition.next_step_name}`);
                        this.current_step = transition.next_step;
                        this.executeStep();
                    } else {
                        this.endTime = new Date();
                        catRecipe.info(`Recipe completed: ${this.recipe.name}`);
                        this.current_step = undefined;
                        this.status = RecipeState.completed;
                        this.eventEmitter.emit('recipe_finished', this);
                    }
                }
            });
    }
}
