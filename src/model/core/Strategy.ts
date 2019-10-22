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

import {ParameterInterface, StrategyInterface, StrategyOptions} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catStrategy} from '../../config/logging';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {WritableDataAssembly} from '../dataAssembly/WritableDataAssembly';
import {OpcUaConnection} from './OpcUaConnection';

export interface StrategyEvents {
    parameterChanged: {
        parameter: ParameterInterface;
        parameterType: 'parameter' | 'processValueIn' | 'processValueOut' | 'reportValue'
    };
}

type StrategyEmitter = StrictEventEmitter<EventEmitter, StrategyEvents>;

export class Strategy extends (EventEmitter as new() => StrategyEmitter) {
    public readonly id: string;
    public readonly name: string;
    public readonly defaultStrategy: boolean;
    public readonly selfCompleting: boolean;
    public readonly processValuesIn: WritableDataAssembly[] = [];
    public readonly processValuesOut: DataAssembly[] = [];
    public readonly reportParameters: DataAssembly[] = [];
    public readonly parameters: WritableDataAssembly[] = [];
    private readonly logger: Category;

    constructor(options: StrategyOptions, connection: OpcUaConnection) {
        super();
        this.id = options.id;
        this.name = options.name;
        this.defaultStrategy = options.default;
        this.selfCompleting = options.sc;
        if (options.parameters) {
            this.parameters = options.parameters
                .map((paramOpts) => DataAssemblyFactory.create(paramOpts, connection) as WritableDataAssembly);
        }
        if (options.processValuesIn) {
            this.processValuesIn = options.processValuesIn
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, connection) as WritableDataAssembly);
        }
        if (options.processValuesOut) {
            this.processValuesOut = options.processValuesOut
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, connection));
        }
        if (options.reportParameters) {
            this.reportParameters = options.reportParameters
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, connection));
        }
        this.logger = catStrategy;
    }

    public async subscribe(): Promise<Strategy> {
        this.logger.debug(`Subscribe to strategy ${this.name}: ${JSON.stringify(this.parameters.map((p) => p.name))}`);
        await Promise.all([
            this.parameters.map((param) => {
                param.on('changed',
                    () => this.emit('parameterChanged', {parameter: param.toJson(), parameterType: 'parameter'}));
                return param.subscribe();
            }),
            this.processValuesIn.map((pv) => {
                pv.on('changed',
                    () => this.emit('parameterChanged', {parameter: pv.toJson(), parameterType: 'processValueIn'}));
                return pv.subscribe();
            }),
            this.processValuesOut.map((pv) => {
                pv.on('changed',
                    () => this.emit('parameterChanged', {parameter: pv.toJson(), parameterType: 'processValueOut'}));
                return pv.subscribe();
            }),
            this.reportParameters.map((param) => {
                param.on('changed',
                    () => this.emit('parameterChanged', {parameter: param.toJson(), parameterType: 'reportValue'}));
                return param.subscribe();
            })
        ]);
        this.logger.debug(`Subscribed to strategy ${this.name}: ${JSON.stringify(this.parameters.map((p) => p.name))}`);
        return this;
    }

    public unsubscribe() {
        this.parameters.forEach((param) => param.unsubscribe());
        this.processValuesIn.forEach((pv) => pv.unsubscribe());
        this.processValuesOut.forEach((pv) => pv.unsubscribe());
        this.reportParameters.forEach((pv) => pv.unsubscribe());
    }

    public toJson(): StrategyInterface {
        return {
            id: this.id,
            name: this.name,
            default: this.defaultStrategy,
            sc: this.selfCompleting,
            parameters: this.parameters.map((param) => param.toJson()),
            processValuesIn: this.processValuesIn.map((param) => param.toJson()),
            processValuesOut: this.processValuesOut.map((param) => param.toJson()),
            reportParameters: this.reportParameters.map((param) => param.toJson())
        };
    }
}
