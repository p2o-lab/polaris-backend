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

import {ParameterInterface, ParameterOptions} from '@plt/pfe-ree-interface';
import {FunctionBlock} from './FunctionBlock';
import {catTimer} from '../../config/logging';

export class Timer extends FunctionBlock {

    static type = 'timer';

    private durationMs: number;
    private timestampStart: Date;
    private elapsedTime: number;
    private timerId;

    constructor(name: string) {
        super(name);
    }

    initParameter() {
        this.parameters = [{name: 'duration', value: 1000, min: 1, unit: "ms"}];
    }

    async onStarting(): Promise<void> {
        clearTimeout(this.timerId);
        this.durationMs = <number> this.parameters.find(p => p.name === 'duration').value;
        this.timestampStart = new Date();
        this.elapsedTime = 0;
        this.timerId = setTimeout(() => {
            super.complete();
        }, this.durationMs);
        await catTimer.info(`timer on starting`);
    }

    async onPausing(): Promise<void> {
        this.elapsedTime = this.elapsedTime + new Date().valueOf() - this.timestampStart.valueOf();
        clearTimeout(this.timerId);
        await catTimer.info(`timer on pausing (already elapsed ${this.elapsedTime})`);
    }

    async onResuming(): Promise<void> {
        this.timestampStart = new Date();
        const openDuration = this.durationMs - this.elapsedTime;
        this.timerId = setTimeout(() => {
            super.complete();
        }, openDuration);
        await catTimer.info(`timer on resuming (${openDuration})`);
    }

}