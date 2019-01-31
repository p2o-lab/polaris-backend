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
import {ControlEnableInterface, ParameterOptions, ServiceCommand, ParameterInterface} from '@plt/pfe-ree-interface';
import {Parameter} from '../recipe/Parameter';
import {BaseService} from '../core/BaseService';
import {catFunctionBlock} from '../../config/logging';

/**
 * A generic function block following the service state machine
 */
export abstract class FunctionBlock implements BaseService {
    get controlEnable(): ControlEnableInterface {
        return this._controlEnable;
    }

    readonly name: string;
    protected parameters: (ParameterInterface)[];

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

    abstract initParameter();

    get state(): ServiceState {
        return this._state;
    }

    private _state: ServiceState = ServiceState.IDLE;
    private _controlEnable: ControlEnableInterface;

    // Internal
    private async onStartingInternal(): Promise<void> {
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
        this.onRunningInternal();
    }

    private async onRunningInternal(): Promise<void> {
        this._state = ServiceState.RUNNING;
        this._controlEnable = {
            start: false,
            abort: true,
            complete: true,
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

    private async onPausingInternal(): Promise<void> {
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
        this.onPausedInternal();
    }

    private async onPausedInternal(): Promise<void> {
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

    private async onResumingInternal(): Promise<void> {
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
        this.onRunningInternal();
    }

    private async onCompletingInternal(): Promise<void> {
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
        this.onCompletedInternal();
    }

    private async onCompletedInternal(): Promise<void> {
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

    private async onResettingInternal(): Promise<void> {
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
        this.parameters = [];
        this.onIdleInternal();
    }

    private async onIdleInternal(): Promise<void> {
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

    // Allow user to inject own functionality after reaching each state
    async onStarting(): Promise<void> {};
    async onRunning(): Promise<void> {};
    async onPausing(): Promise<void> {};
    async onPaused(): Promise<void> {};
    async onResuming(): Promise<void> {};
    async onCompleting(): Promise<void> {};
    async onCompleted(): Promise<void> {};
    async onResetting(): Promise<void> {};
    async onIdle(): Promise<void> {};

    async setParameters(parameters: (Parameter | ParameterOptions)[]): Promise<void> {
        parameters.forEach(pNew => {
            const pOld = this.parameters.find(pOld => pOld.name === pNew.name );
            if (pOld) {
                Object.assign(pOld, pNew);
            } else {
                throw new Error("try to write not existent variable");
            }
        } );
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
            await this.onStartingInternal();
        }
    };

    public async restart() {
        if (this._controlEnable.restart) {
            await this.onStartingInternal();
        }
    };

    public async pause() {
        if (this._controlEnable.pause) {
            await this.onPausingInternal();
        }
    };

    public async resume() {
        if (this._controlEnable.resume) {
            await this.onResumingInternal();
        }
    };

    public async complete() {
        if (this._controlEnable.complete) {
            await this.onCompletingInternal();
        }
    };

    public async stop() {
        if (this._state === ServiceState.RUNNING) {
            await this.onCompletingInternal();
        }
    };

    public async abort() {
        if (this._state === ServiceState.RUNNING) {
            await this.onCompletingInternal();
        }
    };


    public async reset() {
        if (this._state === ServiceState.COMPLETED) {
            await this.onResettingInternal();
        }
    };

}
