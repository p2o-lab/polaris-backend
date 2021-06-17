/* tslint:disable:max-classes-per-file */
/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catDataItem} from '../../../logging';



/**
 * Events emitted by [[DataItem]]
 */
export interface DataItemEvents {
	/**
	 * when OpcUaNodeOptions changes its value
	 * @event changed
	 */
	changed: { value: any; timestamp: Date; nodeId: string };
}

export type DataItemEmitter = StrictEventEmitter<EventEmitter, DataItemEvents>;
//change name
export abstract class DataItem<T> extends (EventEmitter as new() => DataItemEmitter) {
	// data type of data item
	public dataType!: string;
	// recent value
	public value: T | undefined = undefined;
	// timestamp of last update of value
	public timestamp!: Date;
	// can DataItem be accessed
	public access: 'read' | 'write' = 'read';

	protected logger: Category = catDataItem;

	public abstract async subscribe(samplingInterval: number): Promise<any>;

	public abstract write(value: string | number): Promise<void>;
}
