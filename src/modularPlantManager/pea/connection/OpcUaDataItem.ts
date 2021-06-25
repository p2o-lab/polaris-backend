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

import {OpcUaNodeOptions} from '@p2olab/polaris-interface';
import {OpcUaConnection} from './OpcUaConnection';

import {DataType} from 'node-opcua-client';
import {DataItem} from './DataItem';
import {catDataItem} from '../../../logging';

export class OpcUaDataItem<T> extends DataItem<T> {

	// this variable contains the *namespace url* of the node
	public namespaceIndex = '';
	// node id of the node as string (e.g. 's=myNode2' or 'i=12')
	public nodeId = '';
	private connection!: OpcUaConnection;

	public static fromOptions<type extends number | string | boolean>(
		options: OpcUaNodeOptions, connection: OpcUaConnection, // attention! before-> type: ... = 'number'
		access: 'read' | 'write', type: 'number' | 'string' | 'boolean' = 'string'): OpcUaDataItem<type> {
		const item = new OpcUaDataItem<type>();

		if (options) {
			if (options.value !== undefined) {
				if (type === 'number' && (typeof options.value === 'string')) {
					item.value = parseFloat(options.value) as type;
				} else if (type === 'string') {
					item.value = options.value.toString() as type;
				} else if (type === 'boolean') {
					item.value = !!options.value as type;
				} else {
					item.value = options.value as type;
				}
			}
			item.dataType = options.dataType;

			item.namespaceIndex = options.namespaceIndex;
			item.nodeId = options.nodeId;
			if ((!item.nodeId || !item.namespaceIndex) && !item.value) {
				catDataItem.warn(`At least node id or value have to be specified during parsing of DataItem: ${JSON.stringify(options)}`);
			}
		}
		item.access = access;
		item.connection = connection;
		return item;
	}

	public async subscribe(): Promise<OpcUaDataItem<T>> {
		const eventName = this.connection.addOpcUaNode(this.nodeId, this.namespaceIndex);
		this.connection.eventEmitter.on(eventName,
			(dataValue) => {
				this.logger.info(`[${this.connection.id}] Variable Changed (${this.nodeId}) ` +
					`= ${dataValue.value.value.toString()}`);
				this.value = dataValue.value.value;
				this.dataType = DataType[dataValue.value.dataType];
				this.timestamp = dataValue.serverTimestamp;
				this.emit('changed', {value: this.value, timestamp: this.timestamp, nodeId: this.nodeId});
			});
		await new Promise((resolve) => this.on('changed', resolve));
		this.logger.info(`subscribed to Data Item ${this.nodeId}`);
		return this;
	}

	public async write(value: number | string | boolean): Promise<void> {
		this.logger.info(`write: ${value} to ${this.nodeId}`);
		return this.connection.writeOpcUaNode(this.nodeId, this.namespaceIndex, value, this.dataType);
	}

	/**
	 * Reads the OpcUA DataItem of the DataItem and use the results for initializing the DataItem
	 */
	public async read(): Promise<T | undefined> {
		const result = await this.connection.readOpcUaNode(this.nodeId, this.namespaceIndex);
		if (!result) {
			throw new Error(`Could not read ${this.nodeId.toString()}`);
		}
		this.logger.debug(`[${this.connection.id}] Read Variable: ${this.nodeId.toString()} = ${result}`);
		if (result.statusCode.value !== 0) {
			throw new Error(`Could not read ${this.nodeId.toString()}: ${result.statusCode.description}`);
		}
		this.value = result.value.value;
		// readVariableValue does not provide serverTimestamp in node-opcua library
		this.timestamp = new Date();
		this.dataType = DataType[result.value.dataType];
		this.logger.debug(`[${this.connection.id}] initialized Variable: ${this.nodeId.toString()} - ${this.value}`);
		return this.value;
	}
}