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
import {DataItemOptions, DynamicDataItemOptions} from './DataItemFactory';

export interface DataItem<T extends string | number | boolean> {
	defaultValue: T;
	value: T;
}

export interface DynamicDataItem<T extends string | number | boolean> extends DataItem<T>{
	dataType: string;
	timestamp: Date | undefined;
	writable: boolean;
	lastWritten: Date | undefined;
}

/**
 * Events emitted by [[DataItem]]
 */
export interface DataItemEvents<T> {
	/**
	 * value changed
	 * @event changed
	 */
	changed: {value: T; timestamp: Date};
}

export type DataItemEmitter = StrictEventEmitter<EventEmitter, DataItemEvents<any>>;

type FalseY = undefined | null;
const parseBoolean = (val: string | boolean | number | FalseY): boolean => {
	const s = val && val.toString().toLowerCase().trim();
	return s == 'true' || s == '1';
};

export abstract class DataItem<T extends string | number | boolean> extends (EventEmitter as new() => DataItemEmitter) implements DataItem<T>{
	
	public defaultValue!: T;
	public value!: T;

	protected logger: Category = catDataItem;

	constructor(options: DataItemOptions) {
		super();

		let parsedValue: T;

		switch (options.type) {
			case 'number':
				parsedValue = +(options.defaultValue || 0) as T;
				break;
			case 'string':
				if (!options.defaultValue) {
					parsedValue = '' as T;
				} else {
					parsedValue = String(options.defaultValue) as T;
				}
				break;
			case 'boolean':
				// parsedValue = !!(options.defaultValue || false) as T;
				parsedValue = parseBoolean(options.defaultValue) as T;
				break;
		}
		this.defaultValue = parsedValue;
		this.value = parsedValue;
	}
}



export abstract class StaticDataItem<T extends string | number | boolean> extends DataItem<T>{

	protected constructor(options: DataItemOptions) {
		super(options);

	}
}

export class BaseStaticDataItem<T extends string | number | boolean> extends StaticDataItem<T>{
	constructor(options: DataItemOptions) {
		super(options);
	}
}

export abstract class DynamicDataItem<T extends string | number | boolean> extends DataItem<T> {
	
	// data type of data item
	public dataType: string;
	public writable = false;
	public timestamp: Date | undefined = undefined;
	public lastWritten: Date | undefined = undefined;

	protected constructor(options: DynamicDataItemOptions) {
		super(options);
		this.dataType = options.dynamicDataItemOptions.dataType;
		this.writable = options.dynamicDataItemOptions.writable;
	}

	public abstract read(): Promise<T>;
	public abstract write<T extends number | string | boolean>(value: T): Promise<void>;
	public abstract subscribe(): Promise<any>;
	public abstract unsubscribe(): Promise<void>;
}



