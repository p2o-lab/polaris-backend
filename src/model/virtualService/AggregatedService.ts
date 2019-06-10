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

import {VirtualService} from './VirtualService';
import {ConditionOptions, OperationOptions} from '@p2olab/polaris-interface';
import {Module} from '../core/Module';
import {ServiceState} from '../core/enum';
import v4 = require('uuid/v4');


export interface VirtualServiceOptions {
    name: string;
    description: string;
    version: string;
    stateMachine: StateMachineOptions;
    commandEnable: CommandEnableOptions;
}

// CommandEnableOptions defines the conditions as expressions for the commands to be triggered externally
export interface CommandEnableOptions {
    // only in IDLE
    start: string;
    // only in EXECUTE; if omitted, use same as *start* condition
    restart: string;
    // only in STARTING, EXECUTE, COMPLETING, COMPLETED, PAUSED, PAUSING, RESUMING, HOLDING, HELD, UNHOLDING
    stop: string;
    // only in EXECUTE
    pause: string;
    // only in PAUSED
    resume: string;
    // only in EXECUTE
    complete: string;
    //only in HELD
    unhold: string;
    // defines the condition when virtual service automatically goes into HOLDING (without any user interaction)
    hold: string;
    // for the following commands there should not exist further condition except the current state
    // abort (all the time except in ABORTED)
    // reset (in ABORTED, STOPPED and COMPLETED)

    // all state-change transitions are automatically triggered when the underlying petri net
    // of the appropriate step is finished

}

/**
 * default is empty Petrinet which just jumps to the next state in the state machine
 */
export interface StateMachineOptions{
    starting: PetrinetOptions,
    execute: PetrinetOptions,
    pausing: PetrinetOptions,
    resuming: PetrinetOptions,
    completing: PetrinetOptions,
    aborting: PetrinetOptions,
    stopping: PetrinetOptions,
    holding: PetrinetOptions,
    unholding: PetrinetOptions,
    // following states should not perform any actions which can be defined by the user
    //idle
    //paused
    //completed
    //resetting
}

export interface PetrinetOptions {
    states: PetrinetState[];
    transitions: PetrinetTransition[]
    // name of the id of the first transition
    initialTransition: string;
}

export interface PetrinetState {
    id: string;
    // operations
    operations: OperationOptions[];
    // id of succeeding transitions
    nextTransitions: string[];
}

export interface PetrinetTransition {
    id: string;
    condition: ConditionOptions;
    // name of the succeeding states or 'finished' or 'hold'
    nextStates: string[];
}


/** Virtual Service which can be started.
 * It is parsed from RecipeOptions
 *
 * A Recipe has the following states and emits following events
 * @startuml
 * [*] --> idle
 * idle --> running : start() -> started
 * running --> paused : pause()
 * running --> running : -> stepFinished
 * paused --> running : resume()
 * running --> idle : -> completed
 * @enduml
 *
 */
export class AggregatedService extends VirtualService {

    static type = 'virtualService';

    id: string;
    name: string;
    options: VirtualServiceOptions;

    // necessary modules
    modules: Set<Module> = new Set<Module>();

    // dynamic properties
    currentState: ServiceState;
    _lastStatusChange: Date;
    private commandEnableExpression: CommandEnableOptions;

    constructor(options: VirtualServiceOptions) {
        super(options.name);
        this.id = v4();
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error('Version property of virtual service is missing');
        }

        this.options = options;
        this._lastStatusChange = new Date();

        if (options.commandEnable) {
            this.commandEnableExpression = options.commandEnable
        }

    }

    initParameter() {
        this.parameters = [];
    }

}
