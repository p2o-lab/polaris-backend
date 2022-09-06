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
import {IDProvider} from '../../_utils';

import {CIData} from '@p2olab/pimad-interface';
import {AdapterConnectOptions, AdapterOptions, ConnectionInfo} from '@p2olab/polaris-interface';
import {ConnectionAdapterFactory} from './connectionAdapter/ConnectionAdapterFactory';
import {ConnectionAdapter} from './connectionAdapter/ConnectionAdapter';


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
	 * when change occurs
	 * @event changed
	 */
	changed: void;
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
	private _connectionAdapters: ConnectionAdapter[] = [];
	private monitoredDataItems: Map<string, CIData> = new Map<string, CIData>();

	constructor() {
		super();
		process.setMaxListeners(0);
	}


	public addConnectionAdapter(options: AdapterOptions): string {
		const newAdapter = ConnectionAdapterFactory.create(options);
		newAdapter.on('configChanged', () => {
			this.emit('changed');
		});
		this._connectionAdapters.push(newAdapter);
		return newAdapter.id;
	}


	public get connectionInfo(): ConnectionInfo {
		return {
			adapterInfo: this._connectionAdapters.map(adapter => adapter.getConnectionAdapterInfo()),
			id: this.id,
			everyAdapterConnected: this.connected(),
			name: 'GenericConnectionHandler'
		};
	}

	/**
	 * Connect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async connectAdapter(adapterId: string, options?: AdapterConnectOptions): Promise<void> {
		const adapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
		if (adapter) {
			await adapter.connect(options);
			this.emit('connected');
			return Promise.resolve();
		}
		return Promise.reject();
	}

	/**
	 * Connect all known adapters
	 * @returns {Promise<void>}
	 */
	public async connectAllConnectionAdapters(): Promise<void> {
		for (const a of this._connectionAdapters) {
			await a.connect();
		}
		this.emit('connected');
		return Promise.resolve();
	}

	/**
	 * Connect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async startMonitoring(adapterId?: string): Promise<void> {
		if (adapterId) {
			const adapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
			if (adapter && adapter.connected) {
				adapter.on('monitoredNodeChanged', (data) => {
					console.log(`[${this.id}] ${data.monitoredNodeId} changed to ${data.value}`);
					this.emit('monitoredDataItemChanged', {
						monitoredDataItemId: data.monitoredNodeId,
						value: data.value,
						dataType: data.dataType,
						timestamp: data.timestamp,
					});
				});
				this.monitoredDataItems.forEach((value, key) => adapter.addDataItemToMonitoring(value, key));
				await adapter.startMonitoring();
			} else {
				return Promise.reject('Not connected!');
			}
		} else {
			for (const adapter of this._connectionAdapters) {
				if (adapter.connected) {
					adapter.on('monitoredNodeChanged', (data: any) => {
						console.log(`[${this.id}] ${data.monitoredNodeId} changed to ${data.value}`);
						this.emit('monitoredDataItemChanged', {
							monitoredDataItemId: data.monitoredNodeId,
							value: data.value,
							dataType: data.dataType,
							timestamp: data.timestamp,
						});
					});
					this.monitoredDataItems.forEach((value, key) => adapter.addDataItemToMonitoring(value, key));
					await adapter.startMonitoring();
				}
			}
		}
		return Promise.resolve();
	}

	public async stopMonitoring(adapterId?: string): Promise<void> {
		if (adapterId) {
			const adapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
			if (adapter) {
				adapter.removeAllListeners();
				await adapter.stopMonitoring();
			}
		} else {
			for (const adapter of this._connectionAdapters) {
				adapter.removeAllListeners();
				await adapter.stopMonitoring();
			}
		}
		return Promise.resolve();
	}

	/**
	 * Disconnect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async disconnect(adapterId?: string): Promise<void> {
		if (adapterId) {
			const adapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
			if (adapter) {
				await adapter.disconnect();
				this.emit('disconnected');
			} else {
				throw new Error('Connection Adapter not found!');
			}
		} else {
			await this._connectionAdapters.forEach(a => a.disconnect());
			this.emit('disconnected');
		}
		return Promise.resolve();
	}

	/**
	 * Indicator if this Connection Adapter has an active connection
	 * @returns {boolean}
	 */
	public connected(): boolean {
		return this._connectionAdapters.some(a => a.connected);
	}

	/**
	 * read the value of provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async readDataItemValue(ciData: CIData): Promise<DataValue | undefined> {
		// TODO: extend ciData with Endpoint identifier
		return this._connectionAdapters[0].read(ciData);
	}

	/**
	 * Write the provided value to provided ciData address
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async writeDataItemValue(ciData: CIData, value: number | string | boolean): Promise<void> {
		return this._connectionAdapters[0].write(ciData, value);
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

	public clearMonitoredDataItems(): void {
		this.removeAllListeners();
		this.monitoredDataItems.clear();
	}

	public async updateAdapter(adapterId: string, options: AdapterOptions): Promise<void> {
		const resolvedAdapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
		if (!resolvedAdapter) throw new Error('Specified adapter can not be found');
		await resolvedAdapter.initialize(options); // TODO: change the method
	}

	async initializeConnectionAdapter(adapterId: string) {
		const resolvedAdapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
		if (!resolvedAdapter) throw new Error('Specified adapter can not be found');
		await resolvedAdapter.initialize();
	}
}
