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
import {DataValue} from 'node-opcua';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {IDProvider} from '../../_utils';

import {OpcUaConnectionInfo, OpcUaConnectionSettings} from '@p2olab/polaris-interface';
import {OpcUaAdapter} from './connectionAdapter';
import {CIData} from '@p2olab/pimad-interface';
import {catConnection} from '../../../logging';


/**
 * Events emitted by {@link ConnectionHandler}
 */
interface ConnectionEvents {
	/**
	 * on successfully established connection
	 * @event connected
	 */
	connected: void;
	/**
	 * on disconnected connection
	 * @event disconnected
	 */
	disconnected: void;
	/**
	 * when monitored DataItem changes
	 * @event monitoredItemChanged
	 */
	monitoredDataItemChanged: {
		monitoredDataItemId: string;
		value: string | number | boolean;
		dataType: string;
		timestamp: Date;
	};
}

type ConnectionEmitter = StrictEventEmitter<EventEmitter, ConnectionEvents>;

export class ConnectionHandler extends (EventEmitter as new() => ConnectionEmitter) {

	public readonly id: string = IDProvider.generateIdentifier();
	private readonly logger: Category = catConnection;

	public connectionEstablished = false;
	private _connectionAdapter: OpcUaAdapter | undefined;

	private monitoredDataItems: Map<string, CIData> = new Map<string, CIData>();

	constructor() {
		super();
	}


	public setupConnectionAdapter(adapterSettings: OpcUaConnectionSettings): void {
		if (this.connectionEstablished) {
			this.logger.warn('Connection is active.');
			throw new Error('Connection is active.');
		}
		this._connectionAdapter = new OpcUaAdapter(adapterSettings);
	}


	public get connectionAdapterInfo(): OpcUaConnectionInfo | undefined {
		return this._connectionAdapter?.settingsInfo;
	}

	/**
	 * Connect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async connect(): Promise<void> {
		if(!this._connectionAdapter) throw new Error('No Connection Adapter available!');
		await this._connectionAdapter.connect();
		return Promise.resolve();
	}

	/**
	 * Disconnect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async disconnect(): Promise<void> {
		if(!this._connectionAdapter) throw new Error('No Connection Adapter available!');
		await this._connectionAdapter.disconnect();
		return Promise.resolve();
	}

	/**
	 * Indicator if this Connection Adapter has an active connection
	 * @returns {boolean}
	 */
	public connectionIsEstablished(): boolean {
		return this._connectionAdapter? this._connectionAdapter.isConnected() : false;
	}

	/**
	 * read the value of provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async readDataItemValue(ciData: CIData):  Promise<DataValue | undefined> {
		return this._connectionAdapter?.readNode(ciData);
	}

	/**
	 * Write the provided value to provided ciData address
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async writeDataItemValue(ciData: CIData, value: number | string | boolean): Promise<void> {
		return this._connectionAdapter?.writeNode(ciData, value);
	}

	/**
	 * Add Node to the connectionHandler and subscription groups
	 * @param {CIData} ciData ciData of DataItem
	 * @param {string} identifier optional specify a specific identifier of the DataItem
	 * @returns {string} key which is emitted on changes related to this DataItem
	 */
	public addDataItemToMonitoring(ciData: CIData, identifier?: string): string {
		const monitoredDataItemIdentifier = identifier || IDProvider.generateIdentifier();
		this.monitoredDataItems.set(monitoredDataItemIdentifier, ciData);
		return monitoredDataItemIdentifier;
	}

	/**
	 * Remove Node from monitoring
	 * @param {string} monitoredDataItemIdentifier
	 */
	public removeDataItemFromMonitoring(monitoredDataItemIdentifier: string): void {
		this.monitoredDataItems.delete(monitoredDataItemIdentifier);
	}


	public monitoredDataItemsCount(): number {
		return this.monitoredDataItems.size;
	}

	public clearMonitoredDataItems(): void{
		this.removeAllListeners();
		this.monitoredDataItems.clear();
	}

}
