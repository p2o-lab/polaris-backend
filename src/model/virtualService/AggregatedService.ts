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

import {ParameterInterface} from '@p2olab/polaris-interface';
import {catTimer} from '../../config/logging';
import {ServiceState} from '../core/enum';
import {Module} from '../core/Module';
import {Petrinet, PetrinetOptions} from './aggregatedService/Petrinet';
import {VirtualService} from './VirtualService';
import {VirtualServiceOptions} from './VirtualServiceFactory';

export interface AggregatedServiceOptions extends VirtualServiceOptions {
    type: 'aggregatedService';
    description: string;
    version: string;
    parameters: ParameterInterface[];
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
    // only in HELD
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
export interface StateMachineOptions {
    starting: PetrinetOptions;
    execute: PetrinetOptions;
    pausing: PetrinetOptions;
    resuming: PetrinetOptions;
    completing: PetrinetOptions;
    aborting: PetrinetOptions;
    stopping: PetrinetOptions;
    holding: PetrinetOptions;
    unholding: PetrinetOptions;
    // following states should not perform any actions which can be defined by the user
    // idle
    // paused
    // completed
    // resetting
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

    public static type: string = 'aggregatedService';

    // necessary modules
    public modules: Set<Module> = new Set<Module>();

    // dynamic properties
    public currentState: ServiceState;
    public _lastStatusChange: Date;
    private commandEnableExpression: CommandEnableOptions;
    private options: AggregatedServiceOptions;
    private starting: Petrinet;
    private execute: Petrinet;
    private completing: Petrinet;
    private stopping: Petrinet;

    constructor(options: AggregatedServiceOptions, modules: Module[]) {
        super(options.name);
        this.options = options;
        this._lastStatusChange = new Date();

        if (options.commandEnable) {
            this.commandEnableExpression = options.commandEnable;
        }

        if (options.stateMachine.starting) {
            this.starting = new Petrinet(options.stateMachine.starting, modules);
        }
        if (options.stateMachine.execute) {
            this.execute = new Petrinet(options.stateMachine.execute, modules);
        }
        if (options.stateMachine.completing) {
            this.completing = new Petrinet(options.stateMachine.completing, modules);
        }
        if (options.stateMachine.stopping) {
            this.stopping = new Petrinet(options.stateMachine.stopping, modules);
        }

        this.initParameter();
    }

    protected initParameter() {
        this.parameters = this.options.parameters;
        this.selfCompleting = true;
    }

    protected async onStarting(): Promise<void> {
        await catTimer.info(`starting aggregatedservice`);
        this.starting.start();
    }

}
