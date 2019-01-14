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

import { Operation } from './Operation';
import { Transition, TransitionOptions } from './Transition';
import { catRecipe } from '../config/logging';
import { EventEmitter } from 'events';
import { Module } from './Module';
import { Recipe } from './Recipe';
import { OperationOptions, StepInterface } from '@plt/pfe-ree-interface';
import StrictEventEmitter from 'strict-event-emitter-types';

export interface StepOptions {
    name: string;
    operations: OperationOptions[];
    transitions: TransitionOptions[];
}

/**
 * Events emitted by [[Step]]
 */
interface StepEvents {
    /**
     * when step is completed
     * @event
     */
    completed: Transition;
}

/**
 * Executable [[Step]] from [[Recipe]]
 */
export class Step {
    name: string;
    operations: Operation[];
    transitions: Transition[];
    private eventEmitter: StrictEventEmitter<EventEmitter, StepEvents> = new EventEmitter();

    constructor(options: StepOptions, modules: Module[], recipe: Recipe) {
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error(`"name" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.operations) {
            this.operations = options.operations.map(
                operationOptions => new Operation(operationOptions, modules, recipe)
            );
        } else {
            throw new Error(`"operations" array is missing in ${JSON.stringify(options)}`);
        }
        if (options.transitions) {
            this.transitions = options.transitions.map(
                transitionOptions => new Transition(transitionOptions, modules, recipe)
            );
        } else {
            throw new Error(`"transitions" array is missing in ${JSON.stringify(options)}`);
        }
    }

    execute() {
        // execute operations for step
        this.operations.forEach((operation) => {
            catRecipe.info(`Start operation ${operation.module.id} ${operation.service.name} ` +
                `${JSON.stringify(operation.command)}`);
            operation.execute();
        });

        // start listening to transitions of step
        this.transitions.forEach((transition) => {
            catRecipe.info(`Start listening for transition ${JSON.stringify(transition.json())}`);
            const events = transition.condition.listen()
                .on('stateChanged', (status) => {
                catRecipe.info(`Status of step ${this.name} for transition to ${transition.next_step_name}: ` +
                    `${status}`);
                if (status) {
                    // clear up all conditions
                    this.transitions.forEach((transition) => {
                        transition.condition.clear();
                    });

                    this.eventEmitter.emit('completed', transition);
                }
            });
        });

        return this.eventEmitter;
    }

    public json(): StepInterface {
        return {
            name: this.name,
            transitions: this.transitions.map(transition => transition.json()),
            operations: this.operations.map(operation => operation.json())
        };
    }
}
