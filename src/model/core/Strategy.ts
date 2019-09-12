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

import {StrategyOptions} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catStrategy} from '../../config/logging';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {OpcUaDataItem} from '../dataAssembly/DataItem';
import {OpcUaConnection} from './OpcUaConnection';

export interface StrategyEvents {
    parameterChanged: { parameter: DataAssembly, value: any, timestamp: Date };
}

type StrategyEmitter = StrictEventEmitter<EventEmitter, StrategyEvents>;

export class Strategy extends (EventEmitter as new() => StrategyEmitter) {
    public readonly id: string;
    public readonly name: string;
    public readonly defaultStrategy: boolean;
    public readonly selfCompleting: boolean;
    public readonly parameters: DataAssembly[] = [];
    private readonly logger: Category;

    constructor(options: StrategyOptions, connection: OpcUaConnection) {
        super();
        this.id = options.id;
        this.name = options.name;
        this.defaultStrategy = options.default;
        this.selfCompleting = options.sc;
        this.parameters = options.parameters.map((paramOpts) => DataAssemblyFactory.create(paramOpts, connection));
        this.logger = catStrategy;
    }

    public async subscribe(): Promise<Strategy> {
        this.logger.debug(`Subscribe to strategy ${this.name}: ${JSON.stringify(this.parameters.map((p) => p.name))}`);
        await Promise.all(
            this.parameters.map((param) => {
                param
                    .on('VRbk', (data: OpcUaDataItem<number>) => {
                        this.emit('parameterChanged', {parameter: param, value: data.value, timestamp: data.timestamp});
                    })
                    .on('Text', (data: OpcUaDataItem<string>) => {
                        this.emit('parameterChanged', {parameter: param, value: data.value, timestamp: data.timestamp});
                    });
                return param.subscribe();
            })
        );
        this.logger.debug(`Subscribed to strategy ${this.name}: ${JSON.stringify(this.parameters.map((p) => p.name))}`);
        return this;
    }

    public unsubscribe() {
        this.parameters.forEach((param) => {
            param.unsubscribe();
        });
    }
}
