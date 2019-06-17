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

import {OperationOptions, StepInterface} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catRecipe} from '../../config/logging';
import {Module} from '../core/Module';
import {Operation} from './Operation';
import {Transition, TransitionOptions} from './Transition';

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
     * @event completed
     */
    completed: Transition;

    /**
     * when operation inside step has changed (completed or aborted)
     * @event operationChanged
     */
    operationChanged: Operation;
}

/**
 * Executable [[Step]] from [[Recipe]]
 */
export class Step {
    public name: string;
    public operations: Operation[];
    public transitions: Transition[];
    public readonly eventEmitter: StrictEventEmitter<EventEmitter, StepEvents>;

    constructor(options: StepOptions, modules: Module[]) {
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error(`"name" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.operations) {
            this.operations = options.operations.map(
                (operationOptions) => new Operation(operationOptions, modules)
            );
        } else {
            throw new Error(`"operations" array is missing in ${JSON.stringify(options)}`);
        }
        if (options.transitions) {
            this.transitions = options.transitions.map(
                (transitionOptions) => new Transition(transitionOptions, modules)
            );
        } else {
            throw new Error(`"transitions" array is missing in ${JSON.stringify(options)}`);
        }
        this.eventEmitter = new EventEmitter();
    }

    public getUsedModules(): Set<Module> {
        let set = new Set<Module>(this.operations.map((op) => op.module));
        this.transitions.forEach((tr) => {
            set = new Set([...set, ...tr.getUsedModules()]);
        });
        return set;
    }

    public execute() {
        // execute operations for step
        this.operations.forEach((operation) => {
            catRecipe.info(`Start operation ${operation.module.id} ${operation.service.name} ` +
                `${JSON.stringify(operation.command)}`);
            operation.execute();
            operation.emitter.on('changed', (state) => {
                if (state === 'completed' || state === 'aborted') {
                    operation.emitter.removeAllListeners('changed');
                }
                this.eventEmitter.emit('operationChanged', operation);
            });
        });

        // TODO: check if operation all have successfully executed

        // start listening to transitions of step
        this.transitions.forEach((transition) => {
            catRecipe.info(`Start listening for transition ${JSON.stringify(transition.json())}`);
            transition.condition.listen()
                .on('stateChanged', (status) => {
                    catRecipe.info(`Status of step ${this.name} ` +
                        `for transition to ${transition.nextStepName}: ${status}`);
                    if (status) {
                        this.enterTransition(transition);
                    }
            });
        });
    }

    /**
     * enter transition (clear conditions and emit 'completed')
     * @param {Transition} nextTransition
     */
    public enterTransition(nextTransition: Transition) {
        // clear up all conditions
        this.transitions.forEach((transition) => {
            transition.condition.clear();
        });
        this.eventEmitter.emit('completed', nextTransition);
    }

    public json(): StepInterface {
        return {
            name: this.name,
            transitions: this.transitions.map((transition) => transition.json()),
            operations: this.operations.map((operation) => operation.json())
        };
    }
}
