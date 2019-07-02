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
import {catRecipe} from '../../../config/logging';
import {Module} from '../../core/Module';
import {Transition} from '../../recipe/Transition';
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
    public readonly activeTransitions: PetrinetTransition[];

    constructor(options: PetrinetOptions, modules: Module[]) {
        this.options = options;
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
                this.states.filter((state) => state.nextTransitions.find((tr1) => tr1.id === tr.id ));
        });

        this.activeStates = null;
        this.activeTransitions = null;
        this.eventEmitter = new EventEmitter();
    }

    public start() {
        this.activateTransition(this.initialTransition);
    }

    public activateTransition(transition: PetrinetTransition) {
        this.activeTransitions.push(transition);
        catRecipe.info(`Start listening for transition ${JSON.stringify(transition.json())}`);
        transition.condition
            .on('stateChanged', (status) => {
                catRecipe.info(`Status: ${status}`);
                if (status) {
                    this.enterTransition(transition);
                }
            });
        transition.condition.listen();
    }

    /**
     * activate state
     * @param {PetrinetState} state
     */
    public activateState(state: PetrinetState) {
        this.activeStates.push(state);
        state.eventEmitter.on('operationChanged', (operationState) => {
            console.log('state', operationState);
            if (operationState === 'completed') {
                state.nextTransitions.forEach((tr) => this.activateTransition(tr));
            }
        });
        state.execute();
    }

    /**
     * enter transition (clear conditions and emit 'completed')
     * @param {PetrinetTransition} currentTransition
     */
    public enterTransition(currentTransition: PetrinetTransition) {
        // remove current element from activeTransitions
        const index = this.activeTransitions.indexOf(currentTransition);
        this.activeTransitions.splice(index, 1);

        // stop listening
        currentTransition.condition.clear();

        // put marks on all next states
        currentTransition.nextStates.forEach((state) => this.activateState(state));
        this.eventEmitter.emit('completed', currentTransition);
    }

}
