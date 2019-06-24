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

import Timeout = NodeJS.Timeout;
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catTimer} from '../../config/logging';
import {OpcUaNodeEvents} from '../core/Module';
import {VirtualService} from './VirtualService';

export class Timer extends VirtualService {
    get remainingTime(): number {
        return this._remainingTime;
    }

    public static type: string = 'timer';

    private durationMs: number;
    private timestampStart: Date;
    private _remainingTime: number;
    private elapsedTime: number;
    private timerId: Timeout;
    private timerUpdateId: Timeout;

    set remainingTime(value: number) {
        this._remainingTime = value;
        this.parameters.find((p) => p.name === 'remainingTime').value = this._remainingTime;
        this.eventEmitters['remainingTime'].emit('changed', {value: this._remainingTime, timestamp: new Date()});
    }

    constructor(name: string) {
        super(name);
    }

    public initParameter() {
        this.parameters = [
            {name: 'duration', value: 10000, min: 1, unit: 'ms'},
            {name: 'updateRate', value: 1000, min: 100, unit: 'ms'},
            {name: 'remainingTime', value: 10000, unit: 'ms', readonly: true},
        ];
        this.selfCompleting = true;
        this.eventEmitters['remainingTime'] = new EventEmitter();
    }

    public async onStarting(): Promise<void> {
        this.durationMs = this.parameters.find((p) => p.name === 'duration').value as number;
        this.timestampStart = new Date();
        this.elapsedTime = 0;
        this.remainingTime = this.durationMs;

        await catTimer.info(`timer on starting: ${this.remainingTime}`);
    }

    public async onRunning() {
        this.timerId = global.setTimeout(() => {
            super.complete();
            this.timerUpdateId.unref();
        }, this.remainingTime);

        const updateRate = this.parameters.find((p) => p.name === 'updateRate').value as number;
        this.timerUpdateId = global.setInterval(() => {
            this.remainingTime = this.remainingTime - updateRate;
        }, updateRate);

    }

    public async onPausing(): Promise<void> {
        this.elapsedTime = this.elapsedTime + new Date().getTime() - this.timestampStart.getTime();
        this.remainingTime = this.durationMs - this.elapsedTime;
        global.clearTimeout(this.timerId);
        global.clearInterval(this.timerUpdateId);
        await catTimer.info(`timer on pausing (${this.remainingTime})`);
    }

    public async onResuming(): Promise<void> {
        this.timestampStart = new Date();
        await catTimer.info(`timer on resuming (${this.remainingTime})`);
    }

    public async onCompleting() {
        this.onStopping();
    }
    public async onAborting() {
        this.onStopping();
    }
    public async onStopping() {
        clearTimeout(this.timerId);
        clearInterval(this.timerUpdateId);
    }

}
