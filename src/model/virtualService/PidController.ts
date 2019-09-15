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

import {ParameterOptions} from '@p2olab/polaris-interface';
import * as Controller from 'node-pid-controller';
import {ServiceState} from '../core/enum';
import {Parameter} from '../recipe/Parameter';
import {VirtualService} from './VirtualService';

export class PidController extends VirtualService {
    set output(value: number) {
        this._output = value;
        this.parameters.find((p) => p.name === 'output').value = this._output;
    }

    public static type: string = 'pidController';
    private ctr: Controller;
    private _output: number;

    constructor(name: string) {
        super(name);
        this.initParameter();
    }

    public async setParameters(parameters: Array<Parameter | ParameterOptions>): Promise<void> {
        super.setParameters(parameters);
        const setpoint = parameters.find((param) => param.name === 'setpoint');
        if (setpoint) {
            this.ctr.setTarget(setpoint.value as number);
        }
        const input = parameters.find((param) => param.name === 'input');
        if (input && this.state === ServiceState.EXECUTE) {
            this._output = this.ctr.update(input.value as number);
        }
    }

    public async onStarting() {
        this.ctr = new Controller({
            k_p: this.parameters.find((param) => param.name === 'p').value as number,
            k_i: this.parameters.find((param) => param.name === 'i').value as number,
            k_d: this.parameters.find((param) => param.name === 'd').value as number
        });
    }

    protected initParameter() {
        this.parameters = [
            {name: 'p', value: 0.25},
            {name: 'i', value: 0.01},
            {name: 'd', value: 0.01}
        ];
        this.processValuesIn = [
            {name: 'setpoint', value: undefined},
            {name: 'input', value: undefined}
        ];
        this.processValuesOut = [
            {name: 'output', value: undefined, readonly: true},
        ];
    }

}
