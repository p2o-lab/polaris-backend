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
import {DataItem} from './dataItem/DataItem';

import {EventEmitter} from 'events';
import {catDataAssembly} from '../../../logging';
import {DataItemFactory, getDataItemModel} from './dataItem/DataItemFactory';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {keys} from 'ts-transformer-keys';
import {ConnectionHandler} from '../connectionHandler/ConnectionHandler';


export interface DataAssemblyDataItems {
	TagName: DataItem<string>;
	TagDescription: DataItem<string>;
}

export class DataAssembly extends EventEmitter {

	public readonly name: string;
	public readonly metaModelRef: string;
	public readonly connectionHandler: ConnectionHandler;

	public subscriptionActive: boolean;
	public options: DataAssemblyModel;

	public defaultReadDataItem: DataItem<any> | undefined;
	public defaultReadDataItemType: any;
	public defaultWriteDataItem: DataItem<any> | undefined;
	public defaultWriteDataItemType: any;

	public dataItems!: DataAssemblyDataItems;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super();

		this.options = options;
		this.name = options.name;
		this.metaModelRef = options.metaModelRef;
		this.subscriptionActive = false;
		this.connectionHandler = connectionHandler;

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}	
	}

	protected initializeDataItems(options:DataAssemblyModel, keyList: string[]){
		this.dataItems = <typeof this.dataItems>{};
		keyList.forEach(k => {
			const resolvedOptions = getDataItemModel(options, k);
			this.dataItems[k as keyof typeof this.dataItems] = DataItemFactory.create(resolvedOptions, this.connectionHandler);
		});
	}

	protected initializeBaseFunctions() {
		catDataAssembly.debug('Initializing DataItems');
	}

	/**
	 * subscribe to all changes in any of the DataItems of a DataAssembly
	 *
	 * The appropriate dataAssemblies are detected via the type of the DataAssembly
	 */
	public async subscribe(): Promise<void> {
		if (!this.subscriptionActive) {
			catDataAssembly.info(`Subscribe to ${this.name} ` +
				`with variables ${Object.keys(this.dataItems)}`);
			await Promise.all(
				Object.entries(this.dataItems).map(([key, dataItem]: [string, DataItem<any>]) => {
					dataItem.on('changed', () => {
						catDataAssembly.trace(`Emit ${this.name}.${key} = ${dataItem.value}`);
						this.emit(key, dataItem);
						this.emit('changed');
					});
				}));
		}
			this.subscriptionActive = true;
			catDataAssembly.info(`successfully subscribed to all variables from ${this.name}`);
	}

	/**
	 * unsubscribe to all changes in any of the dataAssemblies of a DataAssembly
	 *
	 */
	public unsubscribe(): void {
		this.subscriptionActive = false;
		Object.values(this.dataItems)
			.filter((dataItem) => dataItem !== undefined)
			.forEach((dataItem) => {
				dataItem.removeAllListeners('changed');
			});
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
		return this.defaultReadDataItem?.lastChange;
	}

	/**
	 * Getter of the default WriteDataItem
	 */
	public getDefaultWriteValue(): any | undefined {
		return this.defaultWriteDataItem?.value;
	}

	/**
	 * Getter of the timestamp from last change of the default WriteDataItem
	 */
	public getLastDefaultWriteValueUpdate(): Date | undefined {
		return this.defaultWriteDataItem?.lastChange;
	}

	public toDataAssemblyOptionsJson(): DataAssemblyOptions {
		return <DataAssemblyOptions>{
			dataItems: {},
			metaModelRef: this.metaModelRef,
			name: this.name
		};
	}

	public toJson(): ParameterInterface {
		return {
			name: this.name
		};
	}
}
