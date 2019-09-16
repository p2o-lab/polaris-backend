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
import {Expression, Parser} from 'expr-eval';
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
    private expression: Expression;

    set output(value: number) {
        const output = this.processValuesOut.find((p) => p.name === 'output');
        output.value = value;
        this.eventEmitter.emit('parameterChanged', {parameter: output, parameterType: 'processValueOut'});
    }

    constructor(name: string) {
        super(name);
        this.initParameter();
    }

    public async onStarting(): Promise<void> {
        // clear timers is important when timer is restarted
        global.clearInterval(this.timerUpdateId);

        this.startTime = new Date();
        this.expression = new Parser()
            .parse(this.procedureParameters.find((p) => p.name === 'function').value.toString());

        const updateRate = this.procedureParameters.find((p) => p.name === 'updateRate').value as number;
        this.timerUpdateId = global.setInterval(() => {
            const elapsedTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
            this.output = this.expression.evaluate({t: elapsedTime});
        }, updateRate);
    }

    public async onPausing() {
        this.timerUpdateId.unref();
    }

    public async onResuming() {
        const updateRate = this.procedureParameters.find((p) => p.name === 'updateRate').value as number;
        this.timerUpdateId = global.setInterval(() => {
            const elapsedTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
            this.output = this.expression.evaluate({t: elapsedTime});
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

    protected initParameter() {
        this.procedureParameters = [
            {name: 'function', value: 'sin(t)'},
            {name: 'updateRate', value: 1000, unit: 'ms', min: 1}
        ];
        this.processValuesOut = [
            {name: 'output', value: undefined, readonly: true}
        ];
    }
}
