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

import {BaseDataItem, OpcUaDataItem, StaticDataItem} from './DataItem';
import {catDataItem} from '../../../../logging';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';
import {MTPDataTypes} from '@p2olab/pimad-types';


export function getCollectionProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key];
}

export interface DataItemFactory {
	create<T extends string | number | boolean, K extends MTPDataTypes>(options: DataItemModel, connectionHandler?: ConnectionHandler): BaseDataItem<T>;
}

export interface DataItemFactoryOptions {
	dataItemModel: DataItemModel,
	dataType: 'string' | 'boolean' | 'number',
	connectionHandler?: ConnectionHandler
}


export class DataItemFactory implements DataItemFactory{

	
	static create<T extends string | number | boolean>(options: DataItemFactoryOptions): BaseDataItem<T> {
		let result: BaseDataItem<T>;

		catDataItem.trace('Create DataItem');
		
		if (options.dataItemModel.cIData && options.connectionHandler) {
			result = new OpcUaDataItem<T>(options.dataItemModel, options.dataType, options.connectionHandler);
		} else {
			result = new StaticDataItem<T>(options.dataItemModel, options.dataType);

		}
		if(!result){
			throw new Error('Creation of DataItem failed.');
		}
		return result;
	}
}

export function getDataItemModel(options: DataAssemblyModel, dataItemModelName: string): DataItemModel {
	const result = options.dataItems.find(item => item.name === dataItemModelName);
	if(!result) throw new Error(`DataAssemblyModel does not contain DataItemModel named ${dataItemModelName}!`);
	return result;
}
