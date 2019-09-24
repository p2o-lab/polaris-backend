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
import {ServiceState} from '../core/enum';
import {Module} from '../core/Module';
import {Service} from '../core/Service';
import {Petrinet, PetrinetOptions} from './aggregatedService/Petrinet';
import {VirtualService} from './VirtualService';
import {VirtualServiceOptions} from './VirtualServiceFactory';
import {catAggregatedService} from '../../config/logging';

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
    public readonly services: Service[];

    // dynamic properties
    public currentState: ServiceState;
    public _lastStatusChange: Date;
    private readonly commandEnableExpression: CommandEnableOptions;
    private readonly options: AggregatedServiceOptions;

    private readonly starting: Petrinet;
    private readonly execute: Petrinet;
    private readonly completing: Petrinet;
    private readonly stopping: Petrinet;
    private readonly pausing: Petrinet;
    private readonly resuming: Petrinet;
    private readonly aborting: Petrinet;
    private readonly holding: Petrinet;
    private readonly unholding: Petrinet;
    private readonly resetting: Petrinet;

    private logger: Category;

    constructor(options: AggregatedServiceOptions, modules: Module[]) {
        super(options.name);
        this.options = options;
        this._lastStatusChange = new Date();
        this.logger = catAggregatedService;

        if (options.commandEnable) {
            this.commandEnableExpression = options.commandEnable;
        }

        this.services = options.necessaryServices.map((opts) => {
            const module = modules.find((m) => m.id === opts.module);
            return module.getService(opts.service);
        });

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
        if (options.stateMachine.pausing) {
            this.pausing = new Petrinet(options.stateMachine.pausing, modules);
        }
        if (options.stateMachine.resuming) {
            this.resuming = new Petrinet(options.stateMachine.resuming, modules);
        }
        if (options.stateMachine.aborting) {
            this.aborting = new Petrinet(options.stateMachine.aborting, modules);
        }
        if (options.stateMachine.holding) {
            this.holding = new Petrinet(options.stateMachine.holding, modules);
        }
        if (options.stateMachine.unholding) {
            this.unholding = new Petrinet(options.stateMachine.unholding, modules);
        }
        if (options.stateMachine.resetting) {
            this.resetting = new Petrinet(options.stateMachine.resetting, modules);
        }

        this.initParameter();
    }

    protected initParameter() {
        this.procedureParameters = this.options.parameters;
        this.selfCompleting = true;
    }

    protected async onStarting(): Promise<void> {
        if (this.starting) {
            await this.starting.run();
        } else {
            this.logger.info('use default behaviour for starting');
            await Promise.all(this.services.map((service) => service.start()));
        }
    }

    protected async onExecute(): Promise<void> {
        if (this.execute) {
            await this.execute.run();
        }
    }

    protected async onPausing(): Promise<void> {
        if (this.pausing) {
            await this.pausing.run();
        } else {
            this.logger.info('use default behaviour for pausing');
            await Promise.all(this.services.map((service) => service.pause()));
        }
    }

    protected async onCompleting(): Promise<void> {
        if (this.completing) {
            await this.completing.run();
        } else {
            this.logger.info('use default behaviour for completing');
            await Promise.all(this.services.map((service) => service.complete()));
        }
    }

    protected async onResuming(): Promise<void> {
        if (this.resuming) {
            await this.resuming.run();
        } else {
            this.logger.info('use default behaviour for resuming');
            await Promise.all(this.services.map((service) => service.resume()));
        }
    }

    protected async onAborting(): Promise<void> {
        if (this.aborting) {
            await this.aborting.run();
        } else {
            this.logger.info('use default behaviour for aborting');
            await Promise.all(this.services.map((service) => service.abort()));
        }
    }

    protected async onStopping(): Promise<void> {
        if (this.stopping) {
            await this.stopping.run();
        } else {
            this.logger.info('use default behaviour for stopping');
            await Promise.all(this.services.map((service) => service.stop()));
        }
    }

    protected async onUnholding(): Promise<void> {
        if (this.unholding) {
            await this.unholding.run();
        } else {
            this.logger.info('use default behaviour for unholding');
            await Promise.all(this.services.map((service) => service.unhold()));
        }
    }

    protected async onHolding(): Promise<void> {
        await this.holding.run();
    }

    protected async onResetting(): Promise<void> {
        if (this.resetting) {
            await this.resetting.run();
        } else {
            this.logger.info('use default behaviour for resetting');
            await Promise.all(this.services.map((service) => service.reset()));
        }
    }
}
