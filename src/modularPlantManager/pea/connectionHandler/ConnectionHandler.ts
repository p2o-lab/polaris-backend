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

import {OpcUaAdapter, OpcUaConnectionAdapterOptions} from './connectionAdapter';
import {CIData, Endpoint} from '@p2olab/pimad-interface';
import {ConnectionHandlerInfo, OpcUaAdapterInfo, OpcUaEndpointSetting} from '@p2olab/polaris-interface';


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

	public connectionEstablished = false;
	private _connectionAdapters: OpcUaAdapter[] = [];

	private monitoredDataItems: Map<string, CIData> = new Map<string, CIData>();


	constructor() {
		super();
		process.setMaxListeners(0);
	}


	public addConnectionAdapter(endpoint: Endpoint): string {
			const newAdapter = new OpcUaAdapter({endpoint: endpoint.value});
			this._connectionAdapters.push(newAdapter) ;
			return newAdapter.id;
	}


	public get connectionAdapterInfo(): ConnectionHandlerInfo {
		return {
			adapterInfo: this._connectionAdapters.map(adapter => adapter.getAdapterInfo()),
			id: this.id,
			name: 'GenericConnectionHandler'
		};
	}

	/**
	 * Connect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async connect(adapterId?: string, endpointConfig?: OpcUaEndpointSetting): Promise<void> {
		if (adapterId){
			const adapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
			if (adapter){
				if (endpointConfig) {
					await adapter.connect(endpointConfig);
				} else {
					let adapterInfo = adapter.getAdapterInfo();
					if (adapterInfo.endpoints.length === 0) {
						await this.initializeAdapter(adapterId);
					}
					adapterInfo = adapter.getAdapterInfo();
					if (adapterInfo.endpoints.length === 0) {
						throw new Error('Connection Adapter not found!');
					}
					const endpointInfo = (adapterInfo as OpcUaAdapterInfo).endpoints[0];
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
					await adapter.connect({endpointId: endpointInfo.id});
					this.emit('connected');
					await adapter.startMonitoring();
				}
			} else {
				throw new Error('Connection Adapter not found!');
			}
		} else {
			for (const a of this._connectionAdapters) {
				let adapterInfo = a.getAdapterInfo();
				if (adapterInfo.endpoints.length === 0) {
					await this.initializeAdapter(a.id);
				}
				adapterInfo = a.getAdapterInfo();
				if (adapterInfo.endpoints.length === 0) {
					throw new Error('Connection Adapter not found!');
				}
				const endpointInfo = (adapterInfo as OpcUaAdapterInfo).endpoints[0];
				a.on('monitoredNodeChanged', (data: any) => {
					this.emit('monitoredDataItemChanged', {
						monitoredDataItemId: data.monitoredNodeId,
						value: data.value,
						dataType: data.dataType,
						timestamp: data.timestamp,
					});
				});
				this.monitoredDataItems.forEach((value, key) => a.addDataItemToMonitoring(value, key));
				await a.connect({endpointId: endpointInfo.id});
				this.emit('connected');
				await a.startMonitoring();
			}
		}
		return Promise.resolve();
	}

	/**
	 * Disconnect Connection Adapter
	 * @returns {Promise<void>}
	 */
	public async disconnect(adapterId?:string): Promise<void> {
		if (adapterId){
			const adapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
			if (adapter){
				await adapter.disconnect();
				this.emit('disconnected');
			} else {
				throw new Error('Connection Adapter not found!');
			}
		} else {
			await this._connectionAdapters.forEach( a => a.disconnect());
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
	public async readDataItemValue(ciData: CIData):  Promise<DataValue | undefined> {
		// TODO: extend ciData with Endpoint identifier
		return this._connectionAdapters[0].readNode(ciData);
	}

	/**
	 * Write the provided value to provided ciData address
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async writeDataItemValue(ciData: CIData, value: number | string | boolean): Promise<void> {
		return this._connectionAdapters[0].writeNode(ciData, value);
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

	public async initializeAdapter(adapterId?: string, options?: OpcUaConnectionAdapterOptions): Promise<void> {
		if (adapterId) {
			const resolvedAdapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
			if (!resolvedAdapter) throw new Error('Specified adapter can not be found');
			await resolvedAdapter.initialize(options);
		} else {
			for (const a of this._connectionAdapters) {
				await a.initialize();
			}
		}
	}

	public async updateConnectionAdapter(adapterId: string, options: OpcUaEndpointSetting) {
		const resolvedAdapter = this._connectionAdapters.find(adapter => adapter.id === adapterId);
		if (resolvedAdapter) {
			await resolvedAdapter.disconnect();
			await resolvedAdapter.connect(options);
		}
	}
}
