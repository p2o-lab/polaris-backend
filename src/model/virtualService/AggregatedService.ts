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
import {Category} from 'typescript-logging';
import {catAggregatedService} from '../../logging/logging';
import {BaseService} from '../core/BaseService';
import {Module} from '../core/Module';
import {Service} from '../core/Service';
import {Petrinet, PetrinetOptions} from './aggregatedService/Petrinet';
import {VirtualService} from './VirtualService';
import {VirtualServiceOptions} from './VirtualServiceFactory';

export interface AggregatedServiceOptions extends VirtualServiceOptions {
    type: 'aggregatedService';
    description: string;
    version: string;
    necessaryServices: Array<{ module: string; service: string }>;
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
    // if omitted, all necessary services are reset
    resetting: PetrinetOptions;
    // following states should not perform any actions which can be defined by the user
    // idle
    // paused
    // completed
}

/** Virtual Service which can be started.
 */
export class AggregatedService extends VirtualService {

    public static type: string = 'aggregatedService';

    // necessary modules
    public readonly modules: Set<Module> = new Set<Module>();
    public readonly services: BaseService[];

    // dynamic properties
    public _lastStatusChange: Date;
    private readonly commandEnableExpression: CommandEnableOptions;
    private readonly options: AggregatedServiceOptions;

    private readonly stateMachines: Map<string, Petrinet>;

    private logger: Category;

    constructor(options: AggregatedServiceOptions, modules: Module[], virtualServices: VirtualService[] = []) {
        super(options.name);
        this.options = options;
        this._lastStatusChange = new Date();
        this.logger = catAggregatedService;

        if (options.commandEnable) {
            this.commandEnableExpression = options.commandEnable;
        }

        this.services = options.necessaryServices.map((opts) => {
            if (opts.module) {
                const module = modules.find((m) => m.id === opts.module);
                return module.getService(opts.service);
            } else {
                return virtualServices.find((vs) => vs.name === opts.service);
            }
        });

        this.stateMachines = new Map<string, Petrinet>();
        Object.keys(options.stateMachine).forEach((stateMachineName: string) => {
            this.stateMachines.set(stateMachineName, new Petrinet(options.stateMachine[stateMachineName], modules));
        });

        this.initParameter();
    }

    protected initParameter() {
        this.procedureParameters = this.options.parameters;
        this.selfCompleting = true;
    }

    protected onStarting(): Promise<void> {
        return this.runPetriNetOrDefault('starting', (service) => service.start(), 'EXECUTE');
    }

    protected async onExecute(): Promise<void> {
        return this.runPetriNetOrDefault('execute');
    }

    protected async onPausing(): Promise<void> {
        return this.runPetriNetOrDefault('pausing', (service) => service.pause(), 'PAUSED');
    }

    protected async onCompleting(): Promise<void> {
        return this.runPetriNetOrDefault('completing', (service) => service.complete(), 'COMPLETED');
    }

    protected async onResuming(): Promise<void> {
        return this.runPetriNetOrDefault('resuming', (service) => service.resume(), 'EXECUTE');
    }

    protected async onAborting(): Promise<void> {
        return this.runPetriNetOrDefault('aborting', (service) => service.abort(), 'ABORTED');
    }

    protected async onStopping(): Promise<void> {
        return this.runPetriNetOrDefault('stopping', (service) => service.stop(), 'STOPPED');
    }

    protected async onUnholding(): Promise<void> {
        return this.runPetriNetOrDefault('unholding', (service) => service.unhold(), 'EXECUTE');
    }

    protected async onHolding(): Promise<void> {
        return this.runPetriNetOrDefault('holding');
    }

    protected async onRestarting(): Promise<void> {
        return this.runPetriNetOrDefault('restarting', (service) => service.restart(), 'EXECUTE');
    }

    protected async onResetting(): Promise<void> {
        return this.runPetriNetOrDefault('resetting', (service) => service.reset(), 'IDLE');
    }

    private async runPetriNetOrDefault(petrinetName: string,
                                       command: (service: BaseService) => Promise<void> = null,
                                       stateName: string = null) {
        const petrinet: Petrinet = this.stateMachines.get(petrinetName);
        if (petrinet) {
            await petrinet.run();
        } else if (command && stateName) {
            this.logger.info(`use default behaviour for ${petrinetName}`);
            await Promise.all(this.services.map(async (service) => {
                command(service);
                await service.waitForStateChange(stateName);
            }));
        }
    }
}
