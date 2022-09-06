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
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {IDProvider} from '../../../_utils';
import {catConnectionAdapter} from '../../../../logging';
import {CIData} from '@p2olab/pimad-interface';
import {AdapterConnectOptions, AdapterInfo, AdapterOptions} from '@p2olab/polaris-interface';

/**
 * Events emitted by {@link ConnectionAdapter}
 */
export interface ConnectionAdapterEvents {
	/**
	 * when target successfully connects to POL
	 * @event connected
	 */
	connected: void;
	/**
	 * when target is disconnected from POL
	 * @event disconnected
	 */
	disconnected: void;

	/**
	 * when configuration or options change
	 * @event disconnected
	 */
	configChanged: {
		info: AdapterInfo
	};

	/**
	 * when monitored item changes
	 * @event monitoredItemChanged
	 */
	monitoredNodeChanged: {
		monitoredNodeId: string;
		value: string | number | boolean;
		dataType: string;
		timestamp: Date;
	};
}

type ConnectionAdapterEmitter = StrictEventEmitter<EventEmitter, ConnectionAdapterEvents>;

export abstract class ConnectionAdapter extends (EventEmitter as new() => ConnectionAdapterEmitter) {

	public readonly id = IDProvider.generateIdentifier();
	public readonly name: string = 'GenericConnectionAdapter';
	protected readonly logger: Category = catConnectionAdapter;
	protected _initialized = false;

	/**
	 * Indicator if this client is currently connected to endpoint
	 * @returns {boolean}
	 */
	abstract get connected(): boolean;

	constructor(options?: AdapterOptions) {
		super();
			if (options && options.name) {
				this.name = options.name;
		}
	}


	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async initialize(options?: AdapterOptions): Promise<void>{
		this.logger.warn(`[${this.id}] Not implemented yet`);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async update(options: AdapterOptions){
		this.logger.warn(`[${this.id}] Not implemented yet`);
	}



	/**
	 * Open connection
	 * @returns {Promise<void>}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async connect(connectOptions?: AdapterConnectOptions): Promise<void> {
		this.logger.warn(`[${this.id}] Not implemented yet`);
		return Promise.reject();
	}

	/**
	 * Disconnect
	 * @returns {Promise<void>}
	 */
	public async disconnect(): Promise<void> {
		this.logger.warn(`[${this.id}] Not implemented yet`);
		return Promise.reject();
	}

	/**
	 * read the value of provided ciData
	 * @returns {Promise<any | undefined>}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async read(ciData: CIData): Promise<any | undefined> {
		this.logger.warn(`[${this.id}] Not implemented yet`);
		return Promise.reject();
	}


	/**
	 * Write the provided value to provided NodeID information
	 * @returns {Promise<any | undefined>}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async write(ciData: CIData, value: number | string | boolean): Promise<void> {
		this.logger.warn(`[${this.id}] Not implemented yet`);
		return Promise.reject();
	}

	/**
	 * Add DataItem to monitoring
	 * @returns {string}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public addDataItemToMonitoring(ciData: CIData, identifier?: string): string {
		throw new Error('Not implemented yet!');
	}

	/**
	 * Remove Node from monitoring
	 * @returns {string}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public removeNodeFromMonitoring(identifier: string): void {
		throw new Error('Not implemented yet!');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async startMonitoring(samplingInterval = 100): Promise<void> {
		this.logger.warn(`[${this.id}] Not implemented yet`);
		return Promise.reject();
	}

	public async stopMonitoring(): Promise<void>{
		throw new Error('Not implemented yet!');
	}

	public monitoredDataItemCount(): number {
		throw new Error('Not implemented yet!');
	}

	public clearMonitoredDataItems(): void{
		throw new Error('Not implemented yet!');
	}

	public getConnectionAdapterInfo(): AdapterInfo{
		return {
			type: 'OpcUa',
			connected: this.connected,
			initialized: this._initialized,
			id: this.id,
			monitoredItemsCount: this.monitoredDataItemCount(),
			monitoringActive: false,
			name: this.name
		};
	}
}
