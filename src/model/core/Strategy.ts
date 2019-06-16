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

import {OpcUaNodeOptions} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {DataAssembly, DataAssemblyOptions} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {Module} from './Module';

export interface StrategyOptions {
    id: string;
    // name of strategy
    name: string;
    // default strategy
    default: boolean;
    // self-completing strategy
    sc: boolean;
    // strategyParameters of strategy
    parameters: DataAssemblyOptions[];
    // process values of strategy
    processValues: DataAssemblyOptions[];
}

export interface StrategyEvents {
    processValueChanged: { processValue: DataAssembly, value: any, timestamp: Date };

    parameterChanged: { parameter: DataAssembly, value: any, timestamp: Date };
}

type StrategyEmitter = StrictEventEmitter<EventEmitter, StrategyEvents>;

export class Strategy extends (EventEmitter as new() => StrategyEmitter) {
    public id: string;
    // name of strategy
    public name: string;
    // default strategy
    public default: boolean;
    // self-completing strategy
    public sc: boolean;
    // strategyParameters of strategy
    public parameters: DataAssembly[] = [];
    // process values of strategy
    public processValues: DataAssembly[] = [];

    constructor(options: StrategyOptions, module: Module) {
        super();
        this.id = options.id;
        this.name = options.name;
        this.default = options.default;
        this.sc = options.sc;
        this.parameters = options.parameters.map((paramOptions) => DataAssemblyFactory.create(paramOptions, module));
        if (options.processValues) {
            this.processValues = options.processValues
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, module));
        }
    }

    public subscribe() {
        this.parameters.map((param) => param.subscribe()
            .on('VRbk', (data: OpcUaNodeOptions) => {
                this.emit('parameterChanged', {parameter: param, value: data.value, timestamp: data.timestamp});
            })
            .on('Text', (data: OpcUaNodeOptions) => {
                this.emit('parameterChanged', {parameter: param, value: data.value, timestamp: data.timestamp});
            })
        );
        this.processValues.map((pv) => pv.subscribe()
            .on('V', (data: OpcUaNodeOptions) => {
                this.emit('processValueChanged', {processValue: pv, value: data.value, timestamp: data.timestamp});
            })
        );
        return this;
    }
}
