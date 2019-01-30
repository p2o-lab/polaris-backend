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
import {ControlEnableInterface, ParameterOptions, ServiceCommand} from '@plt/pfe-ree-interface';
import {Parameter} from '../recipe/Parameter';
import * as StateMachine from 'javascript-state-machine';

/**
 * A generic function block following the service state machine
 */
export abstract class FunctionBlock implements BaseService {

    fsm = new StateMachine({
        init: 'idle',
        transitions: [
            {name: 'start', from: 'idle', to: 'starting'},
            {name: 'complete_starting', from: 'starting', to: 'running'},
            {name: 'complete', from: 'running', to: 'completed'},
            {name: 'reset', from: 'completed', to: 'resetting'},
            {name: 'complete_resetting', from: 'resetting', to: 'idle'}
        ],
        methods: {
            onStart: this.onStart,
            onComplete_Starting: this.onCompleteStarting,
            onComplete: this.onComplete,
            onReset: this.onReset,
            onComplete_Resetting: this.onCompleteResetting
        }
    });


    private onStart() {
        console.log('OnStart');
        this.fsm.complete_starting();
    }

    private onCompleteStarting() {
        console.log('OnCompleteStarting - in Running');
    }

    private onComplete() {
        console.log('OnComplete');
    }

    private onReset() {
        console.log('OnReset');
        this.fsm.complete_resetting();
    }

    private onCompleteResetting() {
            console.log('OnCompleteResetting');
        }

    setParameters( parameters: (Parameter | ParameterOptions)[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    private state: ServiceState;
    private controlEnable: ControlEnableInterface;

    getServiceState(): Promise<ServiceState> {
        return Promise.resolve(this.fsm.state);
    }

    getControlEnable(): Promise<ControlEnableInterface> {
        return Promise.resolve(this.controlEnable);
    }

    executeCommand(command: ServiceCommand): Promise<boolean> {
        throw new Error('Method not implemented.');
    }


    abstract start();
    abstract stop();
    abstract complete();
    abstract reset();
    abstract pause();
    abstract resume();
    abstract abort();

}

export class Timer extends FunctionBlock {
    start() {
    }

    stop() {
    }

    complete() {
    }

    reset() {
    }

    pause() {
    }

    resume() {
    }

    abort() {
    }

}

export interface BaseService {

    getServiceState(): Promise<ServiceState>;

    getControlEnable(): Promise<ControlEnableInterface>;

    executeCommand(command: ServiceCommand): Promise<boolean>;

    setParameters(parameters: (Parameter|ParameterOptions)[]): Promise<void>;

}