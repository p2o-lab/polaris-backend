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
import StrictEventEmitter from 'strict-event-emitter-types';

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

export class DataItem<T> {
    // data type of OPC UA node
    public dataType: string;
    // recent value
    public value: T;
    // timestamp of last update of value
    public timestamp: Date;
    // can DataItem be accessed
    public access: 'read' | 'write';
}

export class OpcUaDataItem<T> extends DataItem<T> {

    public static fromOptions<type extends number | string | boolean>(
        options: OpcUaNodeOptions,
        access: 'read' | 'write', type = 'number'): OpcUaDataItem<type> {
        const item = new OpcUaDataItem<type>();

        if (options) {
            if (options.value !== undefined) {
                if (type === 'number' && (typeof options.value === 'string')) {
                    item.value = parseFloat(options.value) as type;
                } else if (type === 'string') {
                    item.value = options.value.toString() as type;
                } else {
                    item.value = options.value as type;
                }
            }
            item.dataType = options.data_type;

            item.namespaceIndex = options.namespace_index;
            item.nodeId = options.node_id;
        }
        item.access = access;
        return item;
    }

    // this variable contains the *namespace url* of the node
    public namespaceIndex: string;
    // node id of the node as string (e.g. 's=myNode2' or 'i=12')
    public nodeId: string;
}
