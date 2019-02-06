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

import {ServiceState} from '../core/enum';
import {ControlEnableInterface, ParameterInterface, ParameterOptions, ServiceCommand, FunctionBlockInterface} from '@plt/pfe-ree-interface';
import {Parameter} from '../recipe/Parameter';
import {BaseService} from '../core/BaseService';
import {catFunctionBlock} from '../../config/logging';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from "events";
import {OpcUaNodeEvents} from '../core/Module';

/**
 * A generic function block following the service state machine
 */
export abstract class FunctionBlock implements BaseService {

    static type: string;

    protected _selfCompleting = false;
    readonly name: string;
    protected parameters: ParameterInterface[];
    private _state: ServiceState = ServiceState.IDLE;
    private _controlEnable: ControlEnableInterface;
    private lastChange = new Date();
    protected eventEmitters: StrictEventEmitter<EventEmitter, OpcUaNodeEvents>[] = [];

    protected set selfCompleting(value: boolean) {
        this._selfCompleting = value;
    }
    get controlEnable(): ControlEnableInterface {
        return this._controlEnable;
    }

    get state(): ServiceState {
        return this._state;
    }

    constructor(name: string) {
        this.name = name;
        this._controlEnable = {
            start: true,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        this.initParameter();
    }

    // Allow user to inject own functionality after reaching each state
    abstract initParameter();
    async onStarting(): Promise<void> {
    };

    async onRunning(): Promise<void> {
    };

    async onPausing(): Promise<void> {
    };

    async onPaused(): Promise<void> {
    };

    async onResuming(): Promise<void> {
    };

    async onCompleting(): Promise<void> {
    };

    async onCompleted(): Promise<void> {
    };

    async onResetting(): Promise<void> {
    };

    async onAborting(): Promise<void> {
    };

    async onAborted(): Promise<void> {
    };

    async onStopping(): Promise<void> {
    };

    async onStopped(): Promise<void> {
    };

    async onIdle(): Promise<void> {
    };

    // Internal
    private async gotoStarting(): Promise<void> {
        this._state = ServiceState.STARTING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('starting');
        await this.onStarting();
        this.gotoRunning();
    }

    private async gotoRunning(): Promise<void> {
        this._state = ServiceState.RUNNING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: this.selfCompleting || true,
            pause: true,
            reset: false,
            restart: true,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('running');
        await this.onRunning();
    }

    private async gotoPausing(): Promise<void> {
        this._state = ServiceState.PAUSING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('pausing');
        await this.onPausing();
        this.gotoPaused();
    }

    private async gotoPaused(): Promise<void> {
        this._state = ServiceState.PAUSED;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: true,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('paused');
        await this.onPaused();
    }

    private async gotoResuming(): Promise<void> {
        this._state = ServiceState.RESUMING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('resuming');
        await this.onResuming();
        this.gotoRunning();
    }

    private async gotoCompleting(): Promise<void> {
        this._state = ServiceState.COMPLETING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('completing');
        await this.onCompleting();
        this.gotoCompleted();
    }

    private async gotoCompleted(): Promise<void> {
        this._state = ServiceState.COMPLETED;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('completed');
        await this.onCompleted();
    }

    private async gotoStopping(): Promise<void> {
        this._state = ServiceState.STOPPING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        };
        catFunctionBlock.info('stopping');
        await this.onStopping();
        this.gotoStopped();
    }

    private async gotoStopped(): Promise<void> {
        this._state = ServiceState.STOPPED;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        };
        catFunctionBlock.info('stopped');
        await this.onStopped();
    }

    private async gotoAborting(): Promise<void> {
        this._state = ServiceState.ABORTING;
        this._controlEnable = {
            start: false,
            abort: false,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        };
        catFunctionBlock.info('completed');
        await this.onAborting();
        this.gotoAborted();
    }

    private async gotoAborted(): Promise<void> {
        this._state = ServiceState.COMPLETED;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        catFunctionBlock.info('completed');
        await this.onAborted();
        this.gotoIdle();
    }

    private async gotoResetting(): Promise<void> {
        this._controlEnable = {
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        this._state = ServiceState.RESETTING;
        catFunctionBlock.info('resetting');
        await this.onResetting();
        this.initParameter();
        this.gotoIdle();
    }

    private async gotoIdle(): Promise<void> {
        this._controlEnable = {
            start: true,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        };
        this._state = ServiceState.IDLE;
        catFunctionBlock.info('idle');
        await this.onIdle();
    }

    // Public methods

    async json(): Promise<FunctionBlockInterface> {
        return {
            name: this.name,
            type: this.constructor.name,
            parameters: await this.getCurrentParameters(),
            status: ServiceState[await this.getServiceState()],
            controlEnable: await this.getControlEnable(),
            lastChange: (new Date().getTime() - this.lastChange.getTime()) / 1000,
            sc: this.selfCompleting
        }
    }

    async setParameters(parameters: (Parameter | ParameterOptions)[]): Promise<void> {
        catFunctionBlock.info(`Set parameter: ${JSON.stringify(parameters)}`);
        parameters.forEach(pNew => {
            const pOld = this.parameters.find(pOld => pOld.name === pNew.name);
            if (!pOld) {
                throw new Error('try to write not existent variable');
            }
            if (pOld.readonly) {
                throw new Error('try to write to readonly variable');
            }
            Object.assign(pOld, pNew);
        });
    }

    listenToVariable(variableName: string): StrictEventEmitter<EventEmitter, OpcUaNodeEvents> {
        return this.eventEmitters[variableName];
    }

    async getCurrentParameters(): Promise<ParameterInterface[]> {
        return this.parameters;
    }

    async getServiceState(): Promise<ServiceState> {
        return this._state;
    }

    async getControlEnable(): Promise<ControlEnableInterface> {
        return this._controlEnable;
    }

    /**
     * Execute command
     *
     * @param {ServiceCommand} command
     * @returns {Promise<boolean>}
     */
    public async executeCommand(command: ServiceCommand): Promise<boolean> {
        this.lastChange = new Date();
        let result;
        if (command === ServiceCommand.start) {
            result = this.start();
        } else if (command === ServiceCommand.stop) {
            result = this.stop();
        } else if (command === ServiceCommand.reset) {
            result = this.reset();
        } else if (command === ServiceCommand.complete) {
            result = this.complete();
        } else if (command === ServiceCommand.abort) {
            result = this.abort();
        } else if (command === ServiceCommand.pause) {
            result = this.pause();
        } else if (command === ServiceCommand.resume) {
            result = this.resume();
        } else if (command === ServiceCommand.restart) {
            result = this.restart();
        } else {
            throw new Error(`Command ${command} can not be interpreted`);
        }
        return result;
    }


    public async start() {
        if (this._controlEnable.start) {
            await this.gotoStarting();
        }
    };

    public async restart() {
        if (this._controlEnable.restart) {
            await this.gotoStarting();
        }
    };

    public async pause() {
        if (this._controlEnable.pause) {
            await this.gotoPausing();
        }
    };

    public async resume() {
        if (this._controlEnable.resume) {
            await this.gotoResuming();
        }
    };

    public async complete() {
        if (this._controlEnable.complete) {
            await this.gotoCompleting();
        } else {
            catFunctionBlock.warn(`Can not complete, ${JSON.stringify(this._controlEnable)}`);
        }
    };

    public async stop() {
        if (this._controlEnable.stop) {
            await this.gotoStopping();
        }
    };

    public async abort() {
        if (this._controlEnable.abort) {
            await this.gotoAborting();
        }
    };


    public async reset() {
        if (this._controlEnable.reset) {
            await this.gotoResetting();
        }
    };
}
