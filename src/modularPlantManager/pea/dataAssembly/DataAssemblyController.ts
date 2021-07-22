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
import {catDataAssembly} from '../../../logging';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseDataAssemblyRuntime {

}

export class DataAssemblyController extends EventEmitter {

	public readonly name: string;
	public readonly metaModelRef: string;
	public readonly communication!: BaseDataAssemblyRuntime;
	public subscriptionActive: boolean;
	public readonly connection: OpcUaConnection;
	public parsingErrors: string[] = [];
	public options: DataAssemblyOptions;

	public defaultReadDataItem: DataItem<any> | undefined;
	public defaultReadDataItemType: any;
	public defaultWriteDataItem: DataItem<any> | undefined;
	public defaultWriteDataItemType: any;
	public readonly tagName: string;
	public readonly tagDescription: string;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super();
		this.options = options;
		if (!options.dataItems || Object.keys(options.dataItems).length == 0) {
			throw new Error('Creating DataAssemblyController Error: No Communication variables found in DataAssemblyOptions');
		}
		this.connection = connection;
		if (!this.connection) {
			throw new Error('Creating DataAssemblyController Error: No OpcUaConnection provided');
		}
		this.name = options.name;
		this.metaModelRef = options.metaModelRef;
		this.subscriptionActive = false;

		// initialize communication
		this.communication = {};
		this.tagName = options.dataItems.TagName;
		this.tagDescription = options.dataItems.TagDescription;


	}

	/**
	 * subscribe to all changes in any of the variables of a DataAssemblyController
	 *
	 * The appropriate variables are detected via the type of the DataAssemblyController
	 * @param samplingInterval
	 */
	public async subscribe(): Promise<DataAssemblyController> {
		if (!this.subscriptionActive) {
			catDataAssembly.info(`Subscribe to ${this.name} ` +
				`with variables ${Object.keys(this.communication)}`);
			await Promise.all(
				Object.entries(this.communication)
					.filter(([key, dataItem]: [string, OpcUaDataItem<any>]) =>
						dataItem &&
						dataItem.nodeId &&
						dataItem.namespaceIndex)
					.map(([key, dataItem]: [string, OpcUaDataItem<any>]) => {
						dataItem.on('changed', (info) => {
							catDataAssembly.trace(`Emit ${this.name}.${key} = ${dataItem.value}`);
							this.emit(key, dataItem);
							this.emit('changed');
							if(info.nodeId.includes('StateCur')) this.emit('State');
						});
						return dataItem.subscribe();
					})
			);
			this.subscriptionActive = true;
			catDataAssembly.info(`successfully subscribed to all variables from ${this.name}`);
		}
		return this;
	}

	/**
	 * unsubscribe to all changes in any of the variables of a DataAssemblyController
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

/*	/!**
	 * Creates a data item from provided options of DataAssemblyController by
	 * finding first name to match one of the communication options
	 *!/
	public populateDataItems(silent = false): OpcUaDataItem<any> {
		for (const communicationKey of Object.keys(this.communication)) {
			try {
				this.communication[communicationKey as keyof BaseDataAssemblyRuntime] =
					OpcUaDataItem.fromOptions(this.getDataAssemblyProperty(
						this.options.dataItems, communicationKey as keyof BaseDataAssemblyRuntime),
						this.connection, 'write'); // TODO: do generic AccessTyping
			} catch (e) {
				this.parsingErrors.push(communicationKey);
			}
		}
		if (!silent) {
			this.logParsingErrors();
		}
		throw new Error('Cant create DataItem');
	}*/

	/**
	 * Creates a data item from provided options of DataAssemblyController by
	 * finding first name to match one of the communication options
	 *
	 * TODO: Maybe rework this function, because it's hard to understand.
	 */
	public createDataItem(name: string | string[], access: 'read' | 'write', type?: 'number' | 'string' | 'boolean', silent = false): OpcUaDataItem<any> {
		const names = typeof name === 'string' ? [name] : name;
		for (const [key, value] of names.entries()) {
			if (this.options.dataItems[value as keyof BaseDataAssemblyRuntime]) {
				return OpcUaDataItem.fromOptions(this.getDataAssemblyProperty(
					this.options.dataItems, value as keyof BaseDataAssemblyRuntime),
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
