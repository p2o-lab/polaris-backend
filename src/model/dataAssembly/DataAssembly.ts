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

import {DataAssemblyOptions, ParameterInterface, ParameterOptions} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {catDataAssembly} from '../../config/logging';
import {OpcUaConnection} from '../core/OpcUaConnection';
import {Parameter} from '../recipe/Parameter';
import {DataItem, OpcUaDataItem} from './DataItem';

export interface BaseDataAssemblyRuntime {
    TagName: OpcUaDataItem<string>;
    TagDescription: OpcUaDataItem<string>;
    OSLevel: OpcUaDataItem<number>;
    WQC: OpcUaDataItem<number>;
}

export class DataAssembly extends EventEmitter {

    get OSLevel() {
        return this.communication.OSLevel;
    }

    get WQC() {
        return this.communication.WQC;
    }

    public readonly name: string;
    public readonly interfaceClass: string;
    public readonly communication: BaseDataAssemblyRuntime;
    public subscriptionActive: boolean;
    public readonly connection: OpcUaConnection;
    public isReadOnly: boolean = false;
    public type: string = 'number';
    public writeDataItem: DataItem<any> = null;
    public readDataItem: DataItem<any>;
    public requestedValue: string;
    public parameterRequest: Parameter;

    constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
        super();
        this.name = options.name;
        this.interfaceClass = options.interface_class;
        this.communication = {} as BaseDataAssemblyRuntime;
        this.subscriptionActive = false;

        this.connection = connection;
        if (!this.connection) {
            throw new Error(`No module for data assembly: ${JSON.stringify(options)}`);
        }

        if (!options.communication) {
            throw new Error('Communication variables missing while creating DataAssembly');
        }
        this.createDataItem(options, 'TagName', 'read', 'string');
        this.createDataItem(options, 'TagDescription', 'read');
        this.createDataItem(options, 'OSLevel', 'write');
        this.createDataItem(options, 'WQC', 'read');
    }

    /**
     * subscribe to changes in any of the variables of this data assembly (V, VUnit, etc.)
     *
     * The appropriate variables are detected via the type of the data assembly
     * @param samplingInterval
     */
    public async subscribe(samplingInterval = 1000): Promise<DataAssembly> {
        if (!this.subscriptionActive) {
            catDataAssembly.debug(`subscribe to ${this.name} ` +
                `with variables ${Object.keys(this.communication)}`);
            await Promise.all(
                Object.entries(this.communication)
                    .filter(([key, dataItem]: [string, OpcUaDataItem<any>]) =>
                        dataItem &&
                        dataItem.nodeId &&
                        dataItem.namespaceIndex)
                    .map(([key, dataItem]: [string, OpcUaDataItem<any>]) => {
                        dataItem.on('changed', () => {
                            catDataAssembly.debug(`Emit ${this.name}.${key} = ${dataItem.value}`);
                            this.emit(key, dataItem);
                            this.emit('changed');
                        });
                        return dataItem.subscribe(samplingInterval);
                    })
            );
            this.subscriptionActive = true;
            catDataAssembly.debug(`successfully subscribed to all variables from ${this.name}`);
        }
        return this;
    }

    public unsubscribe() {
        this.subscriptionActive = false;
        Object.values(this.communication)
            .filter((dataItem) => dataItem !== undefined)
            .forEach((dataItem: OpcUaDataItem<any>) => {
                dataItem.removeAllListeners('changed');
            });
    }

    /**
     * Set parameter on module
     * @param paramValue
     * @param {string} variable
     * @returns {Promise<any>}
     */
    public async setParameter(paramValue: any, variable?: string) {
        let dataItem: DataItem<any>;
        if (variable) {
            dataItem = this.communication[variable];
        } else {
            dataItem = this.writeDataItem;
        }
        catDataAssembly.debug(`Set Parameter: ${this.name} (${variable}) -> ${JSON.stringify(paramValue)}`);
        await dataItem.write(paramValue);
    }

    public async setValue(p: ParameterOptions, modules: any[]) {
        catDataAssembly.debug(`set value: ${JSON.stringify(p)}`);
        this.requestedValue = p.value.toString();

        if (this.parameterRequest) {
            this.parameterRequest.unlistenToScopeArray();

            if (this.parameterRequest.eventEmitter) {
                this.parameterRequest.eventEmitter.removeListener('changed', this.setParameter);
            }
        }

        this.parameterRequest = new Parameter(p, modules);

        const value = this.parameterRequest.getValue();
        catDataAssembly.trace(`calculated value: ${value}`);
        await this.setParameter(value);

        if (this.parameterRequest.options.continuous) {
            catDataAssembly.trace(`Continous parameter change`);
            this.parameterRequest.listenToScopeArray()
                .on('changed', (data) => this.setParameter(data));
        }
    }

    public getValue() {
        return this.readDataItem ? this.readDataItem.value : undefined;
    }

    public getLastUpdate(): Date {
        return this.readDataItem ? this.readDataItem.timestamp : undefined;
    }

    public getUnit(): string {
        catDataAssembly.trace(`Try to access not existing unit in ${this.name}`);
        return null;
    }

    public toJson(): ParameterInterface {
        return {
            name: this.name,
            value: this.getValue(),
            unit: this.getUnit(),
            type: this.type,
            readonly: this.writeDataItem === null,
            timestamp: this.getLastUpdate()
        };
    }

    public createDataItem(options: DataAssemblyOptions, name: string, access: 'read' | 'write', type?) {
        if (!options.communication[name]) {
            catDataAssembly.warn(`No variable "${name}" found during parsing of ` +
                `DataAssembly "${this.name}" (type ${this.constructor.name})`);
            this.communication[name] = undefined;
        } else {
            this.communication[name] =
                OpcUaDataItem.fromOptions(options.communication[name], this.connection, access, type);
        }
    }

    public checkExistenceOfAllDataItems() {
        Object.entries(this.communication).forEach(([key, entry]: [string, DataItem<any>]) => {
            if (entry === undefined) {
                throw new Error(`No ${key} variable found for generating DataAssembly ${this.name} of type ${this.interfaceClass}`);
            }
        });
    }
}
