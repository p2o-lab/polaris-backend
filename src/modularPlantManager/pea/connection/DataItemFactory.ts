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

import {BaseStaticDataItem, DataItem, OpcUaConnection, OpcUaDataItem} from '../connection';
import {catDataItem} from '../../../logging';


export interface DataItemOptions {
	type: 'number' | 'string' | 'boolean';
	defaultValue?: number | string | boolean;
}

export interface DynamicDataItemOptions extends DataItemOptions{
	dynamicDataItemOptions: OpcUaNodeOptions;
}

export interface OpcUaNodeOptions {
	dataType: string;
	writable: boolean;
	namespaceIndex: string;
	nodeId: string;
}


export interface DataItemFactory {
	create<T extends string | number | boolean>(options: DataItemOptions): DataItem<T>;
}


export class DataItemFactory implements DataItemFactory{
	

	connection: OpcUaConnection | undefined;

	constructor(connection: OpcUaConnection) {
		this.connection = connection;
	}
	
	public create<T extends string | number | boolean>(options: DataItemOptions | DynamicDataItemOptions): DataItem<T> {
		let result: DataItem<T>;

		catDataItem.debug('Create DataItem');
		
		if ( 'dynamicDataItemOptions' in options && this.connection) {
			result = new OpcUaDataItem(options, this.connection);
		} else {
			result = new BaseStaticDataItem(options);

		}
		if(!result){
			throw new Error('Creation of DataItem failed.');
		}
		return result;
	}
}
