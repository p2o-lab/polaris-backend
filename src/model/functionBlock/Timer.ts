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

import {FunctionBlock} from './FunctionBlock';
import {catTimer} from '../../config/logging';
import Timeout = NodeJS.Timeout;
import {EventEmitter} from 'events';
import {OpcUaNodeEvents} from '../core/Module';
import StrictEventEmitter from 'strict-event-emitter-types';

export class Timer extends FunctionBlock {
    get remainingTime(): number {
        return this._remainingTime;
    }

    static type = 'timer';

    private durationMs: number;
    private timestampStart: Date;
    private _remainingTime: number;
    private elapsedTime: number;
    private timerId: Timeout;
    private timerUpdateId: Timeout;

    set remainingTime(value: number) {
        this._remainingTime = value;
        this.parameters.find(p => p.name === 'remainingTime').value = this._remainingTime;
        this.eventEmitters['remainingTime'].emit('changed', {value: this._remainingTime, timestamp: new Date()});
    }

    constructor(name: string) {
        super(name);
    }

    initParameter() {
        this.parameters = [
            {name: 'duration', value: 10000, min: 1, unit: 'ms'},
            {name: 'updateRate', value: 1000, min: 100, unit: 'ms'},
            {name: 'remainingTime', value: 10000, unit: 'ms', readonly: true},
        ];
        this.selfCompleting = true;
        this.eventEmitters['remainingTime'] = new EventEmitter();
    }

    async onStarting(): Promise<void> {
        this.durationMs = <number> this.parameters.find(p => p.name === 'duration').value;
        this.timestampStart = new Date();
        this.elapsedTime = 0;
        this.remainingTime = this.durationMs;

        await catTimer.info(`timer on starting: ${this.remainingTime}`);
    }

    async onRunning () {
        this.timerId = setTimeout(() => {
            super.complete();
            this.timerUpdateId.unref();
        }, this.remainingTime);

        const updateRate = <number> this.parameters.find(p => p.name === 'updateRate').value;
        this.timerUpdateId = setInterval(() => {
            this.remainingTime = this.remainingTime - updateRate;
        }, updateRate);

    }

    async onPausing(): Promise<void> {
        this.elapsedTime = this.elapsedTime + new Date().getTime() - this.timestampStart.getTime();
        this.remainingTime = this.durationMs - this.elapsedTime;
        clearTimeout(this.timerId);
        clearInterval(this.timerUpdateId);
        await catTimer.info(`timer on pausing (${this.remainingTime})`);
    }

    async onResuming(): Promise<void> {
        this.timestampStart = new Date();
        await catTimer.info(`timer on resuming (${this.remainingTime})`);
    }

    async onCompleting () {
        this.onStopping();
    }
    async onAborting() {
        this.onStopping();
    }
    async onStopping() {
        clearTimeout(this.timerId);
        clearInterval(this.timerUpdateId);
    }

}