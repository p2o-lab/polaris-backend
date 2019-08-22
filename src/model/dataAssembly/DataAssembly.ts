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

import {
    DataAssemblyOptions,
    ParameterInterface
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {timeout} from 'promise-timeout';
import {catDataAssembly} from '../../config/logging';
import {Module} from '../core/Module';
import {OpcUaDataItem} from './DataItem';

export interface BaseDataAssemblyRuntime {
    TagName: OpcUaDataItem<string>;
    TagDescription: OpcUaDataItem<string>;
    OSLevel: OpcUaDataItem<number>;
    WQC: OpcUaDataItem<number>;
}

export class DataAssembly extends EventEmitter {

    public readonly name: string;
    public readonly interfaceClass: string;
    public readonly communication: BaseDataAssemblyRuntime;
    public readonly module: Module;
    public subscriptionActive: boolean;

    constructor(options: DataAssemblyOptions, module: Module) {
        super();
        this.name = options.name;
        this.interfaceClass = options.interface_class;
        this.communication = {} as BaseDataAssemblyRuntime;
        this.subscriptionActive = false;

        this.module = module;
        if (!this.module) {
            throw new Error(`No module for data assembly: ${JSON.stringify(options)}`);
        }

        if (!options.communication) {
            throw new Error('Communication variables missing while creating DataAssembly');
        }
        this.communication.TagName = OpcUaDataItem.fromOptions(options.communication.TagName, 'read', 'string');
        this.communication.TagDescription = OpcUaDataItem.fromOptions(options.communication.TagDescription, 'read');
        this.communication.OSLevel = OpcUaDataItem.fromOptions(options.communication.OSLevel, 'write');
        this.communication.WQC = OpcUaDataItem.fromOptions(options.communication.WQC, 'read');
    }

    get OSLevel() {
        return this.communication.OSLevel;
    }

    get WQC() {
        return this.communication.WQC;
    }

    /**
     * subscribe to changes in any of the variables of this data assembly (V, VUnit, etc.)
     *
     * The appropriate variables are detected via the type of the data assembly
     * @param samplingInterval
     */
    public async subscribe(samplingInterval = 1000): Promise<DataAssembly> {
        if (!this.subscriptionActive) {
            catDataAssembly.info(`subscribe to ${this.module.id}.${this.name} ` +
                `with variables ${Object.keys(this.communication)}`);
            await Promise.all(
                Object.entries(this.communication)
                    .filter(([key, node]) => key && node && node.nodeId && node.namespaceIndex)
                    .map(([key, node]) =>
                        timeout(
                            this.module.listenToOpcUaNode(node, samplingInterval)
                                .then((emitter) => {
                                    catDataAssembly.debug(`successfully subscribed to ${this.name}.${key}`);
                                    emitter.on('changed', () => {
                                        catDataAssembly.debug(`Emit ${this.name}.${key} = ${node.value}`);
                                        this.emit(key, node);
                                    });
                                }),
                            1000)
                            .catch((err) => {
                                throw new Error(`Could not subscribe to ${this.name}.${key} ` +
                                    `(${JSON.stringify(node)}): ${err}`);
                            })
                    )
            );
            this.subscriptionActive = true;
            catDataAssembly.info(`successfully subscribed to all variables from ${this.module.id}.${this.name}`);
        }
        return this;
    }

    /**
     * Set parameter on module
     * @param paramValue
     * @param {string} variable
     * @returns {Promise<any>}
     */
    public async setParameter(paramValue: any, variable: string = 'VExt'): Promise<any> {
        const opcUaNode = this.communication[variable];
        catDataAssembly.info(`Set Parameter: ${this.name} - ${JSON.stringify(opcUaNode)} ` +
            `-> ${JSON.stringify(paramValue)}`);
        return await this.module.writeNode(opcUaNode, paramValue);
    }

    public getUnit(): string {
        catDataAssembly.trace(`Try to access not existing unit in ${this.name}`);
        return null;
    }

    public toJson(): ParameterInterface {
        return {
            name: this.name
        };
    }
}
