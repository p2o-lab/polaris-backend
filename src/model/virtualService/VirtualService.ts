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

import {
    ControlEnableInterface,
    ParameterInterface,
    ParameterOptions,
    VirtualServiceInterface
} from '@p2olab/polaris-interface';
import {catVirtualService} from '../../config/logging';
import {BaseService} from '../core/BaseService';
import {ServiceState} from '../core/enum';
import {Parameter} from '../recipe/Parameter';

/**
 * A generic function block following the service state machine
 */
export abstract class VirtualService extends BaseService {

    public get controlEnable(): ControlEnableInterface {
        return this._controlEnable;
    }

    public get state(): ServiceState {
        return this._state;
    }

    public static type: string;

    protected procedureParameters: ParameterInterface[];
    protected processValuesIn: ParameterInterface[];
    protected processValuesOut: ParameterInterface[];
    protected reportParameters: ParameterInterface[];

    protected _controlEnable: ControlEnableInterface;
    protected _state: ServiceState = ServiceState.IDLE;

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

    public json(): VirtualServiceInterface {
        return {
            name: this.name,
            type: this.constructor.name,
            strategies: [{
                id: 'default',
                name: 'default',
                default: true,
                sc: this.selfCompleting,
                parameters: this.procedureParameters,
                processValuesIn: this.processValuesIn,
                processValuesOut: this.processValuesOut,
                reportParameters: this.reportParameters
            }],
            parameters: [],
            status: ServiceState[this.state],
            controlEnable: this.controlEnable,
            lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000
        };
    }

    public async setParameters(parameters: Array<Parameter | ParameterOptions>): Promise<void> {
        catVirtualService.info(`Set parameter: ${JSON.stringify(parameters)}`);
        parameters.forEach((pNew) => {
            const pOld = [].concat(this.procedureParameters, this.processValuesIn)
                .find((param) => param.name === pNew.name);
            if (!pOld) {
                throw new Error('try to write not existing variable');
            }
            if (pOld.readonly) {
                throw new Error('try to write to readonly variable');
            }
            Object.assign(pOld, pNew);
        });
    }

    public async start() {
        if (this._controlEnable.start) {
            await this.gotoStarting();
        }
    }

    public async restart() {
        if (this._controlEnable.restart) {
            await this.gotoRestarting();
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

    /**
     * initialize parameters during construction and when resetting
     */
    protected abstract initParameter();

    protected async onStarting(): Promise<void> {
        catVirtualService.info(`[${this.name}] onStarting`);
    }

    protected async onRestarting(): Promise<void> {
        catVirtualService.info(`[${this.name}] onRestarting`);
    }

    protected async onExecute(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onExecute`);
    }

    protected async onPausing(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onPausing`);
    }

    protected async onPaused(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onPaused`);
    }

    protected async onResuming(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onResuming`);
    }

    protected async onCompleting(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onCompleting`);
    }

    protected async onCompleted(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onCompleted`);
    }

    protected async onResetting(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onResetting`);
    }

    protected async onAborting(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onAborting`);
    }

    protected async onAborted(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onAborted`);
    }

    protected async onStopping(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onStopping`);
    }

    protected async onStopped(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onStopped`);
    }

    protected async onIdle(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onIdle`);
    }

    protected async onUnholding(): Promise<void> {
        catVirtualService.debug(`[${this.name}] onUnholding`);
    }

    // Internal
    private setState(newState: ServiceState) {
        catVirtualService.info(`[${this.name}] state changed to ${ServiceState[newState]}`);
        this.eventEmitter.emit('state', newState);
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
        await this.onStarting();
        this.gotoExecute();
    }

    private async gotoRestarting(): Promise<void> {
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
        await this.onRestarting();
        this.gotoExecute();
    }

    private async gotoExecute(): Promise<void> {
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
        await this.onExecute();
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
        await this.onResuming();
        this.gotoExecute();
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
        await this.onAborting();
        this.gotoAborted();
    }

    private async gotoAborted(): Promise<void> {
        this.setState(ServiceState.ABORTED);
        this.setControlEnable({
            start: false,
            abort: false,
            complete: false,
            pause: false,
            reset: true,
            restart: false,
            resume: false,
            stop: false,
            unhold: false
        });
        await this.onAborted();
    }

    private async gotoResetting(): Promise<void> {
        this.setState(ServiceState.RESETTING);
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
        await this.onResetting();
        this.initParameter();
        this.gotoIdle();
    }

    private async gotoIdle(): Promise<void> {
        this.setState(ServiceState.IDLE);
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
        await this.onIdle();
    }

    private async gotoUnholding(): Promise<void> {
        this.setState(ServiceState.UNHOLDING);
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
        await this.onUnholding();
        this.gotoExecute();
    }
}
