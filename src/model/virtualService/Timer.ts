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
import {catTimer} from '../../config/logging';
import {VirtualService} from './VirtualService';

export class Timer extends VirtualService {

    public static type: string = 'timer';

    private durationMs: number;
    private timestampStart: Date;
    private elapsedTime: number;
    private timerId: Timeout;
    private timerUpdateId: Timeout;

    private set remainingTime(value: number) {
        const remainingTime = this.processValuesOut.find((p) => p.name === 'remainingTime');
        remainingTime.value = value;
        this.eventEmitter.emit('parameterChanged', {parameter: remainingTime, parameterType: 'processValueOut'});
    }

    constructor(options) {
        super(options);
        this.initParameter();
    }

    protected initParameter() {
        this.parameters = [
            {name: 'duration', value: 10000, min: 1, unit: 'ms'},
            {name: 'updateRate', value: 1000, min: 100, unit: 'ms'}
        ];
        this.processValuesOut = [
            {name: 'remainingTime', value: 10000, unit: 'ms', readonly: true},
        ];
        this.selfCompleting = true;
    }

    protected async onStarting(): Promise<void> {
        this.durationMs = this.parameters.find((p) => p.name === 'duration').value as number;
        this.timestampStart = new Date();
        this.elapsedTime = 0;
        this.remainingTime = this.durationMs;

        await catTimer.info(`timer on starting: ${this.remainingTime}`);
    }

    protected async onExecute() {
        this.timerId = global.setTimeout(() => {
            super.complete();
            this.timerUpdateId.unref();
        }, this.remainingTime);

        const updateRate = this.parameters.find((p) => p.name === 'updateRate').value as number;
        this.timerUpdateId = global.setInterval(() => {
            this.remainingTime = this.remainingTime - updateRate;
        }, updateRate);

    }

    protected async onPausing(): Promise<void> {
        this.elapsedTime = this.elapsedTime + new Date().getTime() - this.timestampStart.getTime();
        this.remainingTime = this.durationMs - this.elapsedTime;
        global.clearTimeout(this.timerId);
        global.clearInterval(this.timerUpdateId);
        await catTimer.info(`timer on pausing (${this.remainingTime})`);
    }

    protected async onResuming(): Promise<void> {
        this.timestampStart = new Date();
        await catTimer.info(`timer on resuming (${this.remainingTime})`);
    }

    protected async onCompleting() {
        this.onStopping();
    }

    protected async onAborting() {
        this.onStopping();
    }

    protected async onStopping() {
        global.clearTimeout(this.timerId);
        global.clearInterval(this.timerUpdateId);
    }

}
