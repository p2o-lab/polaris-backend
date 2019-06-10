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

import {VirtualService} from './VirtualService';
import * as Controller from 'node-pid-controller';
import {ParameterOptions} from '@p2olab/polaris-interface';
import {Parameter} from '../recipe/Parameter';
import {ServiceState} from '../core/enum';

export class PidController extends VirtualService {
    set output(value: number) {
        this._output = value;
        this.parameters.find(p => p.name === 'output').value = this._output;
    }

    static type = 'pidController';
    private ctr: Controller;
    private _output: number;

    initParameter() {
        this.parameters = [
            {name: 'setpoint', value: undefined},
            {name: 'input', value: undefined},
            {name: 'output', value: undefined, readonly: true},
            {name: 'p', value: 0.25},
            {name: 'i', value: 0.01},
            {name: 'd', value: 0.01}
        ];
    }

    async setParameters(parameters: (Parameter | ParameterOptions)[]): Promise<void> {
        super.setParameters(parameters);
        let setpoint = parameters.find(param => param.name === 'setpoint');
        if (setpoint) {
            this.ctr.setTarget(<number> setpoint.value);
        }
        let input = parameters.find(param => param.name === 'input');
        if (input && this.state === ServiceState.EXECUTE) {
            this._output = this.ctr.update(<number> input.value);
        }
    }

    async onStarting() {
        this.ctr = new Controller({
            k_p: <number> this.parameters.find(param => param.name === 'p').value,
            k_i: <number> this.parameters.find(param => param.name === 'i').value,
            k_d: <number> this.parameters.find(param => param.name === 'd').value
        });
    }

}