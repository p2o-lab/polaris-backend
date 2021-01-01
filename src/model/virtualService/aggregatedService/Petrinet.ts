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

import {EventEmitter} from 'events';
import {catRecipe} from '../../../logging/logging';
import {PEA} from 'src/model/core/PEA';
import {PetrinetState, PetrinetStateOptions} from './PetrinetState';
import {PetrinetTransition, PetrinetTransitionOptions} from './PetrinetTransition';

export interface PetrinetOptions {
    states: PetrinetStateOptions[];
    transitions: PetrinetTransitionOptions[];
    // name of the id of the initial transition
    initialTransition: string;
}

export class Petrinet {

    public readonly eventEmitter: EventEmitter;

    public readonly options: PetrinetOptions;
    public readonly states: PetrinetState[];
    public readonly transitions: PetrinetTransition[];
    public readonly initialTransition: PetrinetTransition;
    public readonly activeStates: PetrinetState[];

    constructor(options: PetrinetOptions, modules: PEA[]) {
        this.options = options;
        this.activeStates = [];
        this.eventEmitter = new EventEmitter();

        if (options) {
            this.states = options.states.map((opt) => new PetrinetState(opt, modules));
            this.transitions = options.transitions.map((opt) => new PetrinetTransition(opt, modules));

            // Resolve transitions and state strings to appropriate objects
            this.initialTransition =
                this.transitions.find((tr: PetrinetTransition) => tr.id === options.initialTransition);
            this.transitions.forEach((tr: PetrinetTransition) => {
                tr.nextStates =
                    this.states.filter((state) => tr.options.nextStates.includes(state.id));
            });
            this.states.forEach((state: PetrinetState) => {
                state.nextTransitions =
                    this.transitions.filter((transition) => state.options.nextTransitions.includes(transition.id));
            });
            this.transitions.forEach((tr: PetrinetTransition) => {
                tr.priorStates =
                    this.states.filter((state) => state.nextTransitions.find((tr1) => tr1.id === tr.id));
            });
        }
    }

    public async run() {
        if (this.initialTransition) {
            this.listenToTransition(this.initialTransition);
            await new Promise((resolve) => this.eventEmitter.once('completed', () => resolve()));
        }
    }

    private listenToTransition(transition: PetrinetTransition) {
        this.eventEmitter.emit('transition', transition);
        catRecipe.debug(`Start listening to transition ${transition.id}: ` +
            `${JSON.stringify(transition.condition.json())}`);
        transition.condition
            .on('stateChanged', (status) => {
                if (status) {
                    catRecipe.debug(`transition completed ${transition.id}`);
                    this.useTransition(transition);
                }
            });
        transition.condition.listen();
    }

    /**
     * activate state
     *
     * after executing the state the listening of successor transitions will be started as long
     * as all of the previous states of this transition are active
     * @param {PetrinetState} state
     */
    private activateState(state: PetrinetState) {
        this.activeStates.push(state);
        this.eventEmitter.emit('state', state);
        state.execute()
            .then(() => {
                state.nextTransitions.forEach((tr) => {
                    if (tr.priorStates.every((priorState) =>
                            this.activeStates.includes(priorState) && priorState.operationCompleted)) {
                        this.listenToTransition(tr);
                    }
                });
            })
            .catch(() => {
                catRecipe.warn(`Petrinet has some aborted operations`);
            });
    }

    /**
     * enter transition (clear conditions and emit 'completed')
     * @param {PetrinetTransition} currentTransition
     */
    private useTransition(currentTransition: PetrinetTransition) {
        // stop listening
        currentTransition.condition.clear();

        // remove marks from all previous states
        currentTransition.priorStates.forEach((state) => {
            const indexState = this.activeStates.indexOf(state);
            this.activeStates.splice(indexState, 1);
        });

        // put marks on all next states or complete petrinet
        if (currentTransition.nextStates.length > 0) {
            currentTransition.nextStates.forEach((state) => this.activateState(state));
        } else {
            // clear all transition conditions
            this.transitions.forEach((transition) => transition.condition.clear());
            this.eventEmitter.emit('completed');
        }
    }

}
