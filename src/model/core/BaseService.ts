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

import {ControlEnableInterface, ParameterInterface, ParameterOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {timeout} from 'promise-timeout';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catService} from '../../config/logging';
import {Parameter} from '../recipe/Parameter';
import {ServiceState} from './enum';
import {Strategy} from './Strategy';

/**
 * Events emitted by [[BaseService]]
 */
export interface BaseServiceEvents {
    /**
     * Notify when the [[Service] changes its state
     * @event state
     */
    state: ServiceState;
    /**
     * Notify when controlEnableNode changes
     * @event controlEnable
     */
    controlEnable: ControlEnableInterface;
    /**
     * whenever a commandNode is executed from the POL
     * @event commandExecuted
     */
    commandExecuted: {
        strategy: Strategy,
        command: ServiceCommand,
        parameter: ParameterInterface[],
        scope?: any[]
    };

    parameterChanged: {
        strategy?: Strategy;
        parameter: ParameterInterface;
        parameterType: 'parameter' | 'processValueIn' | 'processValueOut' | 'reportValue'
    };
}

type BaseServiceEmitter = StrictEventEmitter<EventEmitter, BaseServiceEvents>;

export abstract class BaseService {

    protected set selfCompleting(value: boolean) {
        this._selfCompleting = value;
    }

    public get qualifiedName() {
        return `${this.name}`;
    }

    public get name(): string {
        return this._name;
    }

    public get lastStatusChange(): Date {
        return this._lastStatusChange;
    }

    public abstract get state(): ServiceState;
    public abstract get controlEnable(): ControlEnableInterface

    public readonly eventEmitter: BaseServiceEmitter;

    // name of the base service
    protected _name: string;

    // is base service self completing
    protected _selfCompleting: boolean = false;

    protected _lastStatusChange: Date = new Date();

    protected constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public abstract setParameters(parameters: Array<Parameter|ParameterOptions>): Promise<void>;

    /**
     * allow controlEnable to execute specified command
     * @param {ServiceCommand} command
     * @returns {Promise<boolean>}
     */
    public isCommandExecutable(command: ServiceCommand): boolean {
        const controlEnable: ControlEnableInterface = this.controlEnable;
        catService.debug(`[${this.qualifiedName}] ControlEnable: ${JSON.stringify(controlEnable)}`);
        return controlEnable[command];
    }

    /**
     * Execute commandNode
     *
     * @param {ServiceCommand} command
     * @returns {Promise<boolean>}
     */
    public async executeCommand(command: ServiceCommand) {
        if (!this.isCommandExecutable(command)) {
            catService.info(`[${this.qualifiedName}] ControlOp does not allow command ${command}`);
            throw new Error(`[${this.qualifiedName}] ControlOp does not allow command ${command}`);
        }
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
        } else if (command === ServiceCommand.unhold) {
            result = this.unhold();
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

    /**
     * resolve when service changes to expectedState
     * @param {string} expectedState
     * @returns {Promise<void>}
     */
    public waitForStateChange(expectedState: string): Promise<void> {
        return new Promise((resolve) => {
            const service = this;
            service.eventEmitter.on('state', function test(state) {
                if (ServiceState[state] === expectedState) {
                    service.eventEmitter.removeListener('state', test);
                    resolve();
                }
            });
        });
    }

    /**
     * resolve when service changes to expectedState
     * rejects after ms milliseconds
     * @param {string} expectedState
     * @param {number} ms           max time before promise is rejected
     * @returns {Promise<void>}
     */
    public async waitForStateChangeWithTimeout(expectedState: string, ms = 1000): Promise<void> {
        return await timeout(await this.waitForStateChange(expectedState), ms);
    }

    public abstract async start();
    public abstract async stop();
    public abstract async reset();
    public abstract async complete();
    public abstract async abort();
    public abstract async unhold();
    public abstract async pause();
    public abstract async resume();
    public abstract async restart();
}
