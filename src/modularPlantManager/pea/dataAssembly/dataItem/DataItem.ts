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
import {catDataItem} from '../../../../logging';
import {CIData, DataItemModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {IDProvider} from '../../../_utils';
import {Access, DataItem, MTPDataTypes} from '@p2olab/pimad-types';


export interface BaseDataItem<T extends string | number | boolean> extends DataItemEmitter, DataItem<T>{
	changedAfterCreation: boolean;
	readonly createdTimestamp: Date;
	defaultValue: T;
	lastChange: Date;
	value: T;
	read():Promise<T>;
	write(value: T): Promise<void>;
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

export abstract class ADataItem<T extends string | number | boolean> extends (EventEmitter as new() => DataItemEmitter) implements BaseDataItem<T>{

	public readonly id = IDProvider.generateIdentifier();
	protected _defaultValue: T;
	protected _value: T;
	protected _lastChange: Date = new Date();
	readonly createdTimestamp = new Date();
	public readonly access: Access = Access.NoAccess;
	protected _dataType: 'string' | 'number' | 'boolean';

	protected logger: Category = catDataItem;

	get defaultValue(): T {
		return this._defaultValue;
	}

	get lastChange(): Date {
		return this._lastChange;
	}

	get changedAfterCreation(): boolean {
		return this._lastChange != this.createdTimestamp;
	}

	get value(): T {
		return this._value;
	}

	constructor(options: DataItemModel, dataType: 'string' | 'number' | 'boolean') {
		super();

		this._dataType = dataType;
		this._defaultValue = this.getInitialValue(options.defaultValue);
		this._value = this.getInitialValue(options.value || options.defaultValue);
	}

	/**
	 * Get the data type for the value
	 * @returns string The TypeOf the value
	 */
	get Type(): string {
		return (typeof this.value).toString();
	}

	public abstract read(): Promise<T>;
	public abstract write(value: T): Promise<void>;

	private getInitialValue(defaultValue?: string): T {
		let parsedValue: T;
		switch (this._dataType) {
			case 'number':
				parsedValue = +(defaultValue || 0) as T;
				break;
			case 'string':
				if (!defaultValue) {
					parsedValue = '' as T;
				} else {
					parsedValue = String(defaultValue) as T;
				}
				break;
			case 'boolean':
				// parsedValue = !!(options.defaultValue || false) as T;
				parsedValue = parseBoolean(defaultValue) as T;
				break;
			default:
				parsedValue = '' as T;
		}
		return parsedValue;
	}
}


export class StaticDataItem<T extends string | number | boolean> extends ADataItem<T>{

	constructor(options: DataItemModel, dataType: 'string' | 'number' | 'boolean') {
		super(options, dataType);
	}

	read(): Promise<T> {
		return Promise.resolve(this.value);
	}

	write<T>(value: T): Promise<void> {
		return Promise.reject('Can not write to static DataItem!');
	}
}

export abstract class DynamicDataItem<T extends string | number | boolean> extends ADataItem<T> {

	protected readonly ciData: CIData;
	protected readonly connectionHandler: ConnectionHandler;
	protected eventReference = '';

	protected constructor(options: DataItemModel, dataType: 'string' | 'number' | 'boolean', connectionHandler: ConnectionHandler) {
		super(options, dataType);

		if (!options.cIData) throw new Error('DynamicDataItem creation failed. Please provide CIData.');

		this.ciData = options.cIData;
		this.connectionHandler = connectionHandler;
		this.addToMonitoring();
	}

	private addToMonitoring(): void {
		this.eventReference = this.connectionHandler.addDataItemToMonitoring(this.ciData);
		this.connectionHandler.on('monitoredDataItemChanged',
			(data) => {
				if (this.eventReference === data.monitoredDataItemId){
					this._value = data.value as T;
					this._lastChange = data.timestamp;
					this.emit('changed', {value: this.value, timestamp: this.lastChange});
				}
			});
	}

	protected stopMonitoring(): void {
		this.connectionHandler.removeDataItemFromMonitoring(this.eventReference);
	}
}

export class OpcUaDataItem<T extends string | number | boolean> extends DynamicDataItem<T> {

	private readonly dataType: string;
	public readonly access: Access;

	constructor(options: DataItemModel, dataType: 'string' | 'number' | 'boolean', connectionHandler: ConnectionHandler) {
		super(options, dataType, connectionHandler);

		this.access = options.cIData?.nodeId.access || Access.ReadWriteAccess;
		this.dataType = options.dataType;
	}

	public async write<T extends number | string | boolean>(value: T): Promise<void> {
		this.logger.trace(`OpcUaDataItem [${this.id}] write: ${value}`);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.connectionHandler.writeDataItemValue(this.ciData, value);
	}

	/**
	 * Reads the OpcUA DataItem of the DataItem
	 */
	public async read(): Promise<T> {
		const result = await this.connectionHandler.readDataItemValue(this.ciData);
		if (!result) {
			throw new Error(`Could not read ${this.id}`);
		}
		if (result.statusCode.value !== 0) {
			throw new Error(`Could not read value of ${this.id.toString()}: ${result.statusCode.description}`);
		}
		this._value = result.value.value;
		this._lastChange = result.serverTimestamp || new Date();
		this.emit('changed', {value: this.value, timestamp: this.lastChange});
		this.logger.trace(`OpcUaDataItem [${this.connectionHandler.id}] red variable: ${this.ciData.nodeId.identifier} - ${this.value}`);
		return this.value;
	}
}
