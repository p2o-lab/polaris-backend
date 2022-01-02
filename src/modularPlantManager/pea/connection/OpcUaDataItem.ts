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

import {OpcUaConnection} from './OpcUaConnection';

import {DataType} from 'node-opcua-client';
import {DynamicDataItem} from './DataItem';
import {DynamicDataItemOptions} from './DataItemFactory';

export class OpcUaDataItem<T extends string | number | boolean> extends DynamicDataItem<T> {

	public namespaceIndex = '';
	public nodeId = '';
	private connection!: OpcUaConnection;


	constructor(options: DynamicDataItemOptions, opcUaConnection: OpcUaConnection) {
		super(options);

		this.namespaceIndex = options.dynamicDataItemOptions.namespaceIndex;
		this.nodeId = options.dynamicDataItemOptions.nodeId;

		this.connection = opcUaConnection;
	}


	public async subscribe(): Promise<void> {
		const dataItemKey = this.connection.addNodeToMonitoring(this.nodeId, this.namespaceIndex);
		this.connection.eventEmitter.on(dataItemKey,
			(dataValue) => {
				this.logger.info(`[${this.nodeId}] Variable Changed (${dataItemKey}) ` +
					`= ${dataValue.value.value.toString()}`);
				this.value = dataValue.value.value;
				this.dataType = DataType[dataValue.value.dataType];
				this.timestamp = dataValue.serverTimestamp;
				this.emit('changed', {value: this.value, timestamp: this.timestamp || new Date()});
			});

		this.logger.info(`subscribed to DataItem ${this.nodeId}`);
	}

	public async unsubscribe(): Promise<void> {
		this.removeAllListeners();
		this.connection.removeNodeFromMonitoring(this.nodeId);
		this.logger.info(`unsubscribed from DataItem ${this.nodeId}`);
	}

	public async write<T extends number | string | boolean>(value: T): Promise<void> {
		if (!this.writable) {
			throw new Error('DataItem not writable.');
		}
		this.logger.info(`write: ${value} to ${this.nodeId}`);
		return this.connection.writeNode(this.nodeId, this.namespaceIndex, value, this.dataType);
	}

	/**
	 * Reads the OpcUA DataItem of the DataItem
	 */
	public async read(): Promise<T> {
		const result = await this.connection.readNode(this.nodeId, this.namespaceIndex);
		if (!result) {
			throw new Error(`Could not read ${this.nodeId.toString()}`);
		}
		this.logger.debug(`[${this.connection.id}] Read Variable: ${this.nodeId.toString()} = ${result}`);
		if (result.statusCode.value !== 0) {
			throw new Error(`Could not read ${this.nodeId.toString()}: ${result.statusCode.description}`);
		}
		this.value = result.value.value;
		this.timestamp = result.serverTimestamp || new Date();
		//this.dataType = DataType[result.value.dataType];
		this.logger.debug(`[${this.connection.id}] initialized Variable: ${this.nodeId.toString()} - ${this.value}`);
		return this.value;
	}
}
