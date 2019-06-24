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
import {Expression, Parser} from 'expr-eval';
import {catTimer} from '../../config/logging';
import {VirtualService} from './VirtualService';

/**
 * Function Generator
 *
 * Parameters:
 *  - function: expr-eval Expression used to generate output (Variable *t* can be used inside function to link to
 *  elapsed time since start of function in seconds
 *  - updateRate: update rate of evaluating function
 *  - output: output value of function
 */
export class FunctionGenerator extends VirtualService {

    public static type: string = 'functionGenerator';

    public startTime: Date;
    private timerUpdateId: Timeout;
    private _output: number;
    private expression: Expression;

    set output(value: number) {
        this._output = value;
        this.parameters.find((p) => p.name === 'output').value = this._output;
        this.eventEmitters['output'].emit('changed', {value: this._output, timestamp1: new Date()});
    }
    public initParameter() {
        this.parameters = [
            {name: 'function', value: 'sin(t)'},
            {name: 'updateRate', value: 1000, unit: 'ms', min: 1},
            {name: 'output', value: undefined, readonly: true}];
        this.eventEmitters['output'] = new EventEmitter();
    }

    public async onStarting(): Promise<void> {
        this.startTime = new Date();
        this.expression = new Parser().parse(this.parameters.find((p) => p.name === 'function').value.toString());

        const updateRate = this.parameters.find((p) => p.name === 'updateRate').value as number;
        this.timerUpdateId = global.setInterval(() => {
            const elapsedTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
            const value = this.expression.evaluate({t: elapsedTime });
            this.output = value;
        }, updateRate);
    }

    public async onPausing() {
        this.timerUpdateId.unref();
    }

    public async onResuming() {
        const updateRate = this.parameters.find((p) => p.name === 'updateRate').value as number;
        this.timerUpdateId = global.setInterval(() => {
            const elapsedTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
            this.output = this.expression.evaluate({t: elapsedTime });
        }, updateRate);
    }

    public async onCompleting() {
        this.onStopping();
    }
    public async onAborting() {
        this.onStopping();
    }
    public async onStopping() {
        this.timerUpdateId.unref();
    }

}
