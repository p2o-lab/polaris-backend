/* tslint:disable:max-classes-per-file */
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
import {DataType} from 'node-opcua-client';
import {timeout} from 'promise-timeout';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {OpcUaConnection} from '../core/OpcUaConnection';

const catDataItem = new Category('DataItem');

/**
 * Events emitted by [[DataItem]]
 */
export interface DataItemEvents {
    /**
     * when OpcUaNodeOptions changes its value
     * @event changed
     */
    changed: { value: any, timestamp: Date };
}

export type DataItemEmitter = StrictEventEmitter<EventEmitter, DataItemEvents>;

export abstract class DataItem<T> extends (EventEmitter as new() => DataItemEmitter) {
    // data type of OPC UA node
    public dataType: string;
    // recent value
    public value: T;
    // timestamp of last update of value
    public timestamp: Date;
    // can DataItem be accessed
    public access: 'read' | 'write';

    protected logger: Category = catDataItem;

    public abstract async subscribe(samplingInterval);

    public abstract write(value: string|number);
}

export class OpcUaDataItem<T> extends DataItem<T> {

    public static fromOptions<type extends number | string | boolean>(
        options: OpcUaNodeOptions, connection: OpcUaConnection,
        access: 'read' | 'write', type: 'number' | 'string' | 'boolean' = 'number'): OpcUaDataItem<type> {
        const item = new OpcUaDataItem<type>();

        if (options) {
            if (options.value !== undefined) {
                if (type === 'number' && (typeof options.value === 'string')) {
                    item.value = parseFloat(options.value) as type;
                } else if (type === 'string') {
                    item.value = options.value.toString() as type;
                } else if (type === 'boolean') {
                    item.value = !!options.value as type;
                } else {
                    item.value = options.value as type;
                }
            }
            item.dataType = options.data_type;

            item.namespaceIndex = options.namespace_index;
            item.nodeId = options.node_id;
            if ((item.nodeId == null || item.namespaceIndex == null) && item.value == null) {
                catDataItem.warn('At least node id or value have to be specified during parsing of DataItem');
            }
        }
        item.access = access;
        item.connection = connection;
        return item;
    }

    // this variable contains the *namespace url* of the node
    public namespaceIndex: string;
    // node id of the node as string (e.g. 's=myNode2' or 'i=12')
    public nodeId: string;

    private connection: OpcUaConnection;

    public async subscribe(samplingInterval = 1000): Promise<OpcUaDataItem<T>> {
        if (this.value === undefined) {
            await this.read();
        }
        const monitoredItem = await timeout(
            this.connection.listenToOpcUaNode(this.nodeId, this.namespaceIndex, samplingInterval), 1000);
        monitoredItem.on('changed', (dataValue) => {
            this.logger.debug(`[${this.connection.id}] Variable Changed (${this.nodeId}) ` +
                `= ${dataValue.value.value.toString()}`);
            this.value = dataValue.value.value;
            this.timestamp = dataValue.serverTimestamp;
            this.emit('changed', {value: this.value, timestamp: this.timestamp});
        });
        this.logger.debug(`subscribed to Data Item ${this.nodeId}`);
        return this;
    }

    public write(value: number | string | boolean) {
        this.logger.debug(`write: ${value} to ${this.nodeId}`);
        return this.connection.writeOpcUaNode(this.nodeId, this.namespaceIndex, value, this.dataType);
    }

    /**
     * Reads the opc ua data item of the data item and use the results for initializing the data item
     */
    public async read() {
        const result = await this.connection.readOpcUaNode(this.nodeId, this.namespaceIndex);
        this.logger.debug(`[${this.connection.id}] Read Variable: ${this.nodeId.toString()} = ${result}`);
        if (result.statusCode.value !== 0) {
            throw new Error(`Could not read ${this.nodeId.toString()}: ${result.statusCode.description}`);
        }
        this.value = result.value.value;
        // readVariableValue does not provide serverTimestamp in node-opcua library
        this.timestamp = new Date();
        this.dataType = DataType[result.value.dataType];
        this.logger.debug(`[${this.connection.id}] initialized Variable: ${this.nodeId.toString()} - ${this.value}`);
        return this.value;
    }
}
