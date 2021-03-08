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

import {DataAssemblyOptions, ParameterInterface} from '@p2olab/polaris-interface';
import {DataItem, OpcUaConnection, OpcUaDataItem} from '../connection';

import {EventEmitter} from 'events';
import {Category} from 'typescript-logging';
import {catPEA} from '../PEA';

export const catDataAssembly = new Category('dataAssembly', catPEA);

export interface BaseDataAssemblyRuntime {
	TagName: OpcUaDataItem<string>;
	TagDescription: OpcUaDataItem<string>;
}

export class DataAssembly extends EventEmitter {

	public readonly name: string;
	public readonly interfaceClass: string;
	public readonly communication!: BaseDataAssemblyRuntime;
	public subscriptionActive: boolean;
	public readonly connection: OpcUaConnection;
	public parsingErrors: string[] = [];
	public options: DataAssemblyOptions;

	public defaultReadDataItem: DataItem<any> | undefined;
	public defaultReadDataItemType: any;
	public defaultWriteDataItem: DataItem<any> | undefined;
	public defaultWriteDataItemType: any;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super();
		this.options = options;
		this.name = options.name;
		this.interfaceClass = options.interfaceClass;
		this.subscriptionActive = false;

		this.connection = connection;
		if (!this.connection) {
			throw new Error('Creating DataAssembly Error: No OpcUaConnection provided');
		}

		if (!options.communication) {
			throw new Error('Creating DataAssembly Error: No Communication variables found in DataAssemblyOptions');
		}
		this.communication.TagName = this.createDataItem('TagName', 'read', 'string');
		this.communication.TagDescription = this.createDataItem('TagDescription', 'read', 'string');

	}

	/**
	 * subscribe to all changes in any of the variables of a DataAssembly
	 *
	 * The appropriate variables are detected via the type of the DataAssembly
	 * @param samplingInterval
	 */
	public async subscribe(samplingInterval = 1000): Promise<DataAssembly> {
		if (!this.subscriptionActive) {
			catDataAssembly.debug(`Subscribe to ${this.name} ` +
				`with variables ${Object.keys(this.communication)}`);
			await Promise.all(
				Object.entries(this.communication)
					.filter(([key, dataItem]: [string, OpcUaDataItem<any>]) =>
						dataItem &&
						dataItem.nodeId &&
						dataItem.namespaceIndex)
					.map(([key, dataItem]: [string, OpcUaDataItem<any>]) => {
						dataItem.on('changed', () => {
							catDataAssembly.trace(`Emit ${this.name}.${key} = ${dataItem.value}`);
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

	/**
	 * unsubscribe to all changes in any of the variables of a DataAssembly
	 *
	 */
	public unsubscribe(): void {
		this.subscriptionActive = false;
		Object.values(this.communication)
			.filter((dataItem) => dataItem !== undefined)
			.forEach((dataItem) => {
				dataItem.removeAllListeners('changed');
			});
	}

	public getDataAssemblyProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
		return obj[key];
	}

	/**
	 * Creates a data item from provided options of DataAssembly by
	 * finding first name to match one of the communication options
	 */
	public populateDataItems(silent = false): OpcUaDataItem<any> {
		for (const communicationKey of Object.keys(this.communication)) {
			try {
				this.communication[communicationKey as keyof BaseDataAssemblyRuntime] =
					OpcUaDataItem.fromOptions(this.getDataAssemblyProperty(
						this.options.communication, communicationKey as keyof BaseDataAssemblyRuntime),
						this.connection, 'write'); // TODO: do generic AccessTyping
			} catch (e) {
				this.parsingErrors.push(communicationKey);
			}
		}
		if (!silent) {
			this.logParsingErrors();
		}
		throw new Error('Cant create DataItem');
	}

	/**
	 * Creates a data item from provided options of DataAssembly by
	 * finding first name to match one of the communication options
	 */
	public createDataItem(name: string | string[], access: 'read' | 'write', type?: 'number' | 'string' | 'boolean', silent = false): OpcUaDataItem<any> {
		const names = typeof name === 'string' ? [name] : name;
		for (const [key, value] of names.entries()) {
			if (this.options.communication[value as keyof BaseDataAssemblyRuntime]) {
				return OpcUaDataItem.fromOptions(this.getDataAssemblyProperty(
					this.options.communication, value as keyof BaseDataAssemblyRuntime),
					this.connection, access);
			}
		}
		this.parsingErrors.push(names[0]);
		if (!silent) {
			this.logParsingErrors();
		}
		throw new Error('createDataItem Failed ');
	}

	/**
	 * Getter of the default ReadDataItem
	 */
	public getDefaultReadValue(): any | undefined {
		return this.defaultReadDataItem ? this.defaultReadDataItem.value : undefined;
	}

	/**
	 * Getter of the timestamp from last change of the default ReadDataItem
	 */
	public getLastDefaultReadValueUpdate(): Date | undefined {
		return this.defaultReadDataItem ? this.defaultReadDataItem.timestamp : undefined;
	}

	/**
	 * Getter of the default WriteDataItem
	 */
	public getDefaultWriteValue(): any | undefined {
		return this.defaultWriteDataItem ? this.defaultWriteDataItem.value : undefined;
	}

	/**
	 * Getter of the timestamp from last change of the default WriteDataItem
	 */
	public getLastDefaultWriteValueUpdate(): Date | undefined {
		return this.defaultWriteDataItem ? this.defaultWriteDataItem.timestamp : undefined;
	}

	/**
	 * Getter of the default ReadDataItem
	 */
	public logParsingErrors(): void {
		catDataAssembly.warn(`${this.parsingErrors.length} variables have not been found during parsing variable ` +
			`"${this.name}" of type "${this.constructor.name}": ${JSON.stringify(this.parsingErrors)}`);
	}

	public toJson(): ParameterInterface {
		return {
			name: this.name
		};
	}
}
