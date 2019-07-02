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

import {ControlEnableInterface, ParameterOptions, VirtualServiceInterface} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catVirtualService} from '../../config/logging';
import {BaseService} from '../core/BaseService';
import {ServiceState} from '../core/enum';
import {OpcUaNodeEvents} from '../core/Module';
import {Parameter} from '../recipe/Parameter';
import {VirtualServiceOptions} from './VirtualServiceFactory';

/**
 * A generic function block following the service state machine
 */
export abstract class VirtualService extends BaseService {

    public static type: string;

    protected eventEmitters: Array<StrictEventEmitter<EventEmitter, OpcUaNodeEvents>> = [];

    constructor(name: string) {
        super();
        this._name = name;
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
    }

    // Public methods

    public async json(): Promise<VirtualServiceInterface> {
        return {
            name: this.name,
            type: this.constructor.name,
            parameters: await this.getCurrentParameters(),
            status: ServiceState[this.state],
            controlEnable: this.controlEnable,
            lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000,
            sc: this.selfCompleting
        };
    }

    public async setParameters(parameters: Array<Parameter | ParameterOptions>): Promise<void> {
        catVirtualService.info(`Set parameter: ${JSON.stringify(parameters)}`);
        parameters.forEach((pNew) => {
            const pOld = this.parameters.find((param) => param.name === pNew.name);
            if (!pOld) {
                throw new Error('try to write not existent variable');
            }
            if (pOld.readonly) {
                throw new Error('try to write to readonly variable');
            }
            Object.assign(pOld, pNew);
        });
    }

    public listenToVariable(variableName: string): StrictEventEmitter<EventEmitter, OpcUaNodeEvents> {
        return this.eventEmitters[variableName];
    }

    public async start() {
        if (this._controlEnable.start) {
            await this.gotoStarting();
        }
    }
    public async restart() {
        if (this._controlEnable.restart) {
            await this.gotoStarting();
        }
    }
    public async pause() {
        if (this._controlEnable.pause) {
            await this.gotoPausing();
        }
    }
    public async resume() {
        if (this._controlEnable.resume) {
            await this.gotoResuming();
        }
    }
    public async complete() {
        if (this._controlEnable.complete) {
            await this.gotoCompleting();
        } else {
            catVirtualService.warn(`Can not complete, ${JSON.stringify(this._controlEnable)}`);
        }
    }
    public async stop() {
        if (this._controlEnable.stop) {
            await this.gotoStopping();
        }
    }
    public async abort() {
        if (this._controlEnable.abort) {
            await this.gotoAborting();
        }
    }
    public async reset() {
        if (this._controlEnable.reset) {
            await this.gotoResetting();
        }
    }
    public async unhold() {
        if (this._controlEnable.unhold) {
            await this.gotoUnholding();
        }
    }

    // Allow user to inject own functionality after reaching each state
    protected abstract initParameter();
    protected async onStarting(): Promise<void> {
    }
    protected async onRunning(): Promise<void> {
    }
    protected async onPausing(): Promise<void> {
    }
    protected async onPaused(): Promise<void> {
    }
    protected async onResuming(): Promise<void> {
    }
    protected async onCompleting(): Promise<void> {
    }
    protected async onCompleted(): Promise<void> {
    }
    protected async onResetting(): Promise<void> {
    }
    protected async onAborting(): Promise<void> {
    }
    protected async onAborted(): Promise<void> {
    }
    protected async onStopping(): Promise<void> {
    }
    protected async onStopped(): Promise<void> {
    }
    protected async onIdle(): Promise<void> {
    }
    protected async onUnholding(): Promise<void> {
    }

    // Internal
    private setState(newState: ServiceState) {
        this.eventEmitter.emit('state', {state: newState, timestamp: new Date() });
        this._state = newState;
    }

    private setControlEnable(controlEnable: ControlEnableInterface) {
        this.eventEmitter.emit('controlEnable', controlEnable);
        this._controlEnable = controlEnable;
    }

    private async gotoStarting(): Promise<void> {
        this.setState(ServiceState.STARTING);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('starting');
        await this.onStarting();
        this.gotoRunning();
    }

    private async gotoRunning(): Promise<void> {
        this.setState(ServiceState.EXECUTE);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: this.selfCompleting || true,
            pause: true,
            reset: false,
            restart: true,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('running');
        await this.onRunning();
    }

    private async gotoPausing(): Promise<void> {
        this.setState(ServiceState.PAUSING);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('pausing');
        await this.onPausing();
        this.gotoPaused();
    }

    private async gotoPaused(): Promise<void> {
        this.setState(ServiceState.PAUSED);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: true,
            stop: true,
            unhold: false
        });
        catVirtualService.info('paused');
        await this.onPaused();
    }

    private async gotoResuming(): Promise<void> {
        this.setState(ServiceState.RESUMING);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('resuming');
        await this.onResuming();
        this.gotoRunning();
    }

    private async gotoCompleting(): Promise<void> {
        this.setState(ServiceState.COMPLETING);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('completing');
        await this.onCompleting();
        this.gotoCompleted();
    }

    private async gotoCompleted(): Promise<void> {
        this.setState(ServiceState.COMPLETED);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('completed');
        await this.onCompleted();
    }

    private async gotoStopping(): Promise<void> {
        this.setState(ServiceState.STOPPING);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        });
        catVirtualService.info('stopping');
        await this.onStopping();
        this.gotoStopped();
    }

    private async gotoStopped(): Promise<void> {
        this.setState(ServiceState.STOPPED);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        });
        catVirtualService.info('stopped');
        await this.onStopped();
    }

    private async gotoAborting(): Promise<void> {
        this.setState(ServiceState.ABORTING);
        this.setControlEnable({
            start: false,
            abort: false,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        });
        catVirtualService.info('completed');
        await this.onAborting();
        this.gotoAborted();
    }

    private async gotoAborted(): Promise<void> {
        this.setState(ServiceState.COMPLETED);
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        catVirtualService.info('completed');
        await this.onAborted();
        this.gotoIdle();
    }

    private async gotoResetting(): Promise<void> {
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        this.setState(ServiceState.RESETTING);
        catVirtualService.info('resetting');
        await this.onResetting();
        this.initParameter();
        this.gotoIdle();
    }

    private async gotoIdle(): Promise<void> {
        this.setControlEnable({
            start: true,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        this.setState(ServiceState.IDLE);
        catVirtualService.info('idle');
        await this.onIdle();
    }

    private async gotoUnholding(): Promise<void> {
        this.setControlEnable({
            start: false,
            abort: true,
            complete: false,
            pause: false,
            reset: false,
            restart: false,
            resume: false,
            stop: true,
            unhold: false
        });
        this.setState(ServiceState.UNHOLDING);
        catVirtualService.info('unholding');
        await this.onUnholding();
        this.gotoRunning();
    }
}
