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

import {ServiceState} from './enum';
import {ControlEnableInterface, ParameterInterface, ParameterOptions, ServiceCommand} from '@plt/pfe-ree-interface';
import {Parameter} from '../recipe/Parameter';
import {EventEmitter} from "events";
import {Strategy} from './Interfaces';
import StrictEventEmitter from 'strict-event-emitter-types';

/**
 * Events emitted by [[BaseService]]
 */
interface BaseServiceEvents {
    /**
     * Notify when the [[Service] changes its state
     * @event state
     */
    state: {state: ServiceState, timestamp: Date};
    /**
     * Notify when controlEnableNode changes
     * @event controlEnable
     */
    controlEnable: ControlEnableInterface;
    /**
     * whenever a commandNode is executed from the PFE
     * @event commandExecuted
     */
    commandExecuted: {
        timestamp: Date,
        strategy: Strategy,
        command: ServiceCommand,
        parameter: ParameterInterface[],
        scope?: any[]
    };
}

type BaseServiceEmitter = StrictEventEmitter<EventEmitter, BaseServiceEvents>;

export abstract class BaseService extends (EventEmitter as { new(): BaseServiceEmitter }) {

    // name of the base service
    protected _name: string;

    // is base service self completing
    protected _selfCompleting = false;

    protected _state: ServiceState = ServiceState.IDLE;
    protected _controlEnable: ControlEnableInterface;
    protected parameters: ParameterInterface[];

    protected _lastStatusChange = new Date();

    protected set selfCompleting(value: boolean) {
        this._selfCompleting = value;
    }

    get name(): string {
        return this._name;
    }

    get state(): ServiceState {
        return this._state;
    }

    get lastStatusChange(): Date {
        return this._lastStatusChange;
    }

    get controlEnable(): ControlEnableInterface {
        return this._controlEnable;
    }

    getCurrentParameters(strategy?: Strategy): Promise<ParameterInterface[]> {
        return Promise.resolve(this.parameters);
    }

    abstract setParameters(parameters: (Parameter|ParameterOptions)[]): Promise<void>;


    /**
     * Execute commandNode
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

    protected abstract async start();
    protected abstract async stop();
    protected abstract async reset();
    protected abstract async complete();
    protected abstract async abort();
    protected abstract async unhold();
    protected abstract async pause();
    protected abstract async resume();
    protected abstract async restart();
}