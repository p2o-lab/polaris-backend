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

import {DataAssembly, DataAssemblyOptions} from '../dataAssembly/DataAssembly';
import {Module} from './Module';
import {EventEmitter} from 'events';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import StrictEventEmitter from 'strict-event-emitter-types';
import {OpcUaNodeOptions} from './Interfaces';

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

export class Strategy extends (EventEmitter as { new(): StrategyEmitter }) {
    id: string;
    // name of strategy
    name: string;
    // default strategy
    default: boolean;
    // self-completing strategy
    sc: boolean;
    // strategyParameters of strategy
    parameters: DataAssembly[] = [];
    // process values of strategy
    processValues: DataAssembly[] = [];

    constructor(options: StrategyOptions, module: Module) {
        super();
        this.id = options.id;
        this.name = options.name;
        this.default = options.default;
        this.sc = options.sc;
        this.parameters = options.parameters.map((options) => DataAssemblyFactory.create(options, module));
        if (options.processValues) {
            this.processValues = options.processValues
                .map((options) => DataAssemblyFactory.create(options, module));
        }
    }

    subscribe() {
        this.parameters.map(param => param.subscribe()
            .on('VOut', (data: OpcUaNodeOptions) => {
                this.emit('parameterChanged', {parameter: param, value: data.value, timestamp: data.timestamp})
            })
        );
        this.processValues.map(pv => pv.subscribe()
            .on('V', (data: OpcUaNodeOptions) => {
                this.emit('processValueChanged', {processValue: pv, value: data.value, timestamp: data.timestamp})
            })
        );
    return this;
    }
}