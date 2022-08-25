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
import {
	AttributeIds,
	ClientMonitoredItemBase,
	ClientSession,
	ClientSubscription,
	coerceNodeId,
	DataValue,
	MonitoringMode,
	NodeId,
	OPCUAClient,
	TimestampsToReturn,
	UserTokenType,
	Variant,
	VariantArrayType
} from 'node-opcua';
import {timeout} from 'promise-timeout';
import {ClientMonitoredItemGroup} from 'node-opcua-client/source/client_monitored_item_group';
import {Category} from 'typescript-logging';
import {DataType} from 'node-opcua-client';
import {IDProvider} from '../../../../_utils';
import {CIData} from '@p2olab/pimad-interface';
import {AdapterConnectOptions, OpcUaAdapterInfo, OpcUaAdapterOptions, OpcUaEndpointInfo, OpcUaEndpointOption, OpcUaUserCredentials} from '@p2olab/polaris-interface';
import {ConnectionAdapter} from '../ConnectionAdapter';

interface EndpointInfo {
	endpointUrl: string;
	securityMode?: string;
	securityPolicy?: string;
}

export class OpcUaAdapter extends ConnectionAdapter {

	public readonly name: string = 'OpcUaConnectionAdapter';

	// Endpoint related topics
	private _endpoint: string | undefined;
	private currentEndpointId: string | undefined;
	private availableEndpoints: Map<string, EndpointInfo> = new Map<string, EndpointInfo>();

	// OpcUa connection related topics
	private namespaceArray: string[] = [];
	private session: ClientSession | undefined;
	private client: OPCUAClient | undefined;
	private subscription: ClientSubscription | undefined;
	private monitoringActive = false;

	private readonly nodes: Map<string, CIData> = new Map<string, CIData>();
	private dataItemNodeMapping: Map<string, NodeId> = new Map<string, NodeId>();
	private nodeDataTypeMapping: Map<NodeId, DataType> = new Map<NodeId, DataType>();

	/**
	 * Indicator if this client is currently connected to endpoint
	 * @returns {boolean}
	 */
	get connected(): boolean {
		return !!this.client && !!this.session;
	}

	get endpoint(): string | undefined {
		return this._endpoint;
	}

	set endpoint(value: string | undefined) {
		if (value && this.validEndPointUrl(value)) {
			this._endpoint = value;
		} else {
			this._endpoint = undefined;
		}

	}

	constructor(options?: OpcUaAdapterOptions) {
		super(options);
		if (options) {
			this.endpoint = options.endpoint;
		}
	}


	public async initialize(options?: OpcUaAdapterOptions): Promise<void> {
		if (options) {
			this.endpoint = options.endpoint;
		}
		await this.updateAvailableEndpoints();
		this.emit('configChanged', {info: this.getConnectionAdapterInfo()});
	}

	async update(options: OpcUaAdapterOptions) {
		await this.disconnect();
		await this.initialize(options);
	}

	private async updateAvailableEndpoints(): Promise<void> {
		const endpointUrl = this.endpoint;
		if (!endpointUrl) throw new Error('Can not resolve endpoints without initial endpoint!');
		const client = OPCUAClient.create({});
		await client.connect(endpointUrl).catch((e)=>console.log(e));
		const endpoints = await client.getEndpoints();
		const reducedEndpoints: EndpointInfo[] = endpoints.map(endpoint => ({
			endpointUrl: (endpoint.endpointUrl || '').toString(),
			securityMode: endpoint.securityMode.toString(),
			securityPolicy: endpoint.securityPolicyUri?.toString(),
		}));
		await client.disconnect();
		this.availableEndpoints.clear();
		reducedEndpoints.forEach((eP) => {
			this.availableEndpoints.set(IDProvider.generateIdentifier(), eP);
		});
	}


	private getSecurityMode(): string | undefined {
		if (this.currentEndpointId) {
			const endpointInfo = this.availableEndpoints.get(this.currentEndpointId);
			if (!endpointInfo) return undefined;
			return endpointInfo.securityMode;
		}
		return undefined;
	}

	private getSecurityPolicy(): string | undefined {
		if (this.currentEndpointId) {
			const endpointInfo = this.availableEndpoints.get(this.currentEndpointId);
			if (!endpointInfo) return undefined;
			return endpointInfo.securityPolicy;
		}
		return undefined;
	}


	/**
	 * Open connection to server and establish session
	 * @returns {Promise<void>}
	 */
	public async connect(connectOptions?: OpcUaEndpointOption): Promise<void> {
		if (this.availableEndpoints.size === 0) {
			await this.initialize();
		}
		if (this.connected) {
			this.logger.debug(`[${this.id}] Already connected`);
		} else if (connectOptions) {
			this.currentEndpointId = connectOptions.requestedEndpointId;
			this.createClient();
			await this.connectClient();
			await this.createSession(connectOptions.userCredentials);
			await this.readNameSpaceArray();
			this.logger.info(`[${this.id}] Successfully connected`);
			this.emit('connected');

		} else {
			const [firstKey] = this.availableEndpoints.keys(); //TODO: Develop Connect Strategy in case none was set
			this.currentEndpointId = firstKey;
			this.createClient();
			await this.connectClient();
			await this.createSession();
			await this.readNameSpaceArray();
			this.logger.info(`[${this.id}] Successfully connected`);
			this.emit('connected');
		}
		return Promise.resolve();
	}

	/**
	 * Disconnect client
	 * @returns {Promise<void>}
	 */
	public async disconnect(): Promise<void> {
		await this.stopMonitoring();
		await this.stopSubscription();
		await this.closeSession();
		await this.disconnectClient();
		this.logger.info(`[${this.id}] OPC UA connection disconnected`);
		this.emit('disconnected');
		return Promise.resolve();
	}

	/**
	 * read the value of provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async read(ciData: CIData): Promise<DataValue | undefined> {
		if (!this.connected) {
			return undefined;
		}
		const resolvedID = this.resolveNodeId(ciData);
		const result = await this.session?.read({nodeId: resolvedID});
		return result;
	}

	private async getBuiltInDataType(nodeId: NodeId): Promise<undefined | DataType> {
		if (!this.connected) {
			return undefined;
		}
		if (!this.session) {
			return undefined;
		}
		return this.session.getBuiltInDataType(nodeId);
	}

	/**
	 * Write the provided value to provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async write(ciData: CIData, value: number | string | boolean): Promise<void> {
		if (!this.connected) {
			throw new Error('Can not write node since OPC UA connection is not established');
		}
		if (!this.session) {
			throw new Error('Session is undefined');
		}
		const resolvedNodeId = this.resolveNodeId(ciData);

		const resolvedDataType = await this.resolveNodeIdDataType(resolvedNodeId);
		if (!resolvedDataType) {
			throw new Error('Can not write node since DataType can not be resolved');
		}

		const variant = Variant.coerce({
			value: value,
			dataType: resolvedDataType,
			arrayType: VariantArrayType.Scalar
		});

		const nodeToWrite = {
			nodeId: resolvedNodeId.toString(),
			attributeId: AttributeIds.Value,
			value: {
				value: variant
			}
		};

		this.logger.debug(`[${this.id}] Write ${ciData.nodeId.identifier} - ${JSON.stringify(variant)}`);
		const statusCode = await this.session.write(nodeToWrite);

		if (statusCode.value !== 0) {
			this.logger.warn(`Error while writing to OpcUA ${ciData.nodeId.identifier}=${value}: ${statusCode.description}`);
			throw new Error(statusCode.description);
		}
		return Promise.resolve();
	}

	/**
	 * Add Node to the connection and subscription groups
	 * @returns {string}
	 */
	public addDataItemToMonitoring(ciData: CIData, identifier?: string): string {
		let monitoredItemKey = '';
		const existingMonitoredItemKey: undefined | string = this.findAlreadyMonitoredDataItem(ciData);
		if (!existingMonitoredItemKey) {
			monitoredItemKey = identifier || IDProvider.generateIdentifier();
			this.nodes.set(monitoredItemKey, ciData);
		} else {
			monitoredItemKey = existingMonitoredItemKey;
			this.nodes.set(monitoredItemKey, ciData);
		}
		return monitoredItemKey;
	}

	private findAlreadyMonitoredDataItem(ciData: CIData): string | undefined {
		let monitoredNodeKey: string | undefined = undefined;
		for (const [key, value] of this.nodes) {
			if (value.nodeId.identifier === ciData.nodeId.identifier && value.nodeId.namespaceIndex === ciData.nodeId.namespaceIndex) {
				monitoredNodeKey = key;
			}
		}
		return monitoredNodeKey;
	}

	/**
	 * Remove Node from connection and subscription groups
	 * @returns {string}
	 */
	public removeNodeFromMonitoring(identifier: string): void {
		this.nodes.delete(identifier);
	}

	public async startMonitoring(samplingInterval = 100): Promise<void> {
		const options: {nodeId: NodeId, attributeId: AttributeIds}[] = [];
		this.nodes.forEach((value, key) =>
			options.push({
				nodeId: this.resolveNodeId(value, key),
				attributeId: AttributeIds.Value
			}));
		if (!this.subscription){
			await this.createSubscription();
		}
		if (this.subscription) {
			const monitoredItemGroup: ClientMonitoredItemGroup = await this.subscription.monitorItems(
				options,
				{
					samplingInterval: 100,
					discardOldest: true,
					queueSize: 10
				}, TimestampsToReturn.Both);

			monitoredItemGroup.on('changed', (monitoredItem: ClientMonitoredItemBase, dataValue: DataValue) => {
				this.logger.trace(`[Adapter ${this.id}] ${monitoredItem.itemToMonitor.nodeId.toString()} changed to ${dataValue}`);
				let dataItemOrigin = monitoredItem.itemToMonitor.nodeId.toString();
				for (const [key, value] of this.dataItemNodeMapping.entries()) {
					if (value.toString() == dataItemOrigin) {
						dataItemOrigin = key;
						break;
					}
				}
				this.emit('monitoredNodeChanged',
					{
						monitoredNodeId: dataItemOrigin || '',
						value: dataValue.value.value,
						dataType: DataType[dataValue.value.dataType],
						timestamp: dataValue.value.value.serverTimestamp || new Date()
					});
			});
			await monitoredItemGroup.setMonitoringMode(MonitoringMode.Reporting);
			this.monitoringActive = true;
		}
	}

	public async stopMonitoring(): Promise<void>{
		if (this.client) {
			this.client.removeAllListeners('close')
				.removeAllListeners('connection_lost');
		}
		this.monitoringActive = false;
	}

	public monitoredDataItemCount(): number {
		return this.nodes.size;
	}

	public clearMonitoredDataItems(): void{
		this.nodes.clear();
	}

	private createClient(): void {
		const connectionStrategy = {
			initialDelay: 50,
			maxRetry: 0
		};

		this.client = OPCUAClient.create({
				applicationName: 'NodeOPCUA-Client',
				endpointMustExist: false,
				securityMode: this.getSecurityMode(),
				securityPolicy: this.getSecurityPolicy(),
				connectionStrategy: connectionStrategy,
			})
			.on('close', async () => {
				this.logger.info(`[${this.id}] Connection closed to OPC UA server`);
				await this.disconnect();
			})
			.on('connection_lost', async () => {
				this.logger.info(`[${this.id}] Connection lost to OPC UA server`);
				await this.disconnect();
			})
			.on('timed_out_request', () => {
				this.logger.warn(`[${this.id}] timed out request - retrying connection`);
			});
	}

	private async connectClient(): Promise<void> {
		this.logger.info(`[${this.id}] start connecting`);
		if (!this.client) {
			throw new Error('Client must exist');
		}
		if (!this.currentEndpointId) {
			throw new Error('No endpoint specified');
		}
		const endpoint = this.availableEndpoints.get(this.currentEndpointId);
		if (!endpoint) {
			throw new Error('No endpoint found!');
		}
		await this.client.connect(endpoint.endpointUrl);
		this.logger.info(`[${this.id}] connected via endpoint: ${endpoint.endpointUrl}`);
	}

	private async disconnectClient(): Promise<void> {
		if (this.client) {
			await timeout(this.client.disconnect(), 1000);
			this.emit('disconnected');
		}
	}

	private async createSession(userIdentityOptions?: OpcUaUserCredentials): Promise<void> {
		if (!this.client) {
			throw new Error('Client should exist');
		}
		if (userIdentityOptions) {
			this.session = await this.client.createSession({
				type: UserTokenType.UserName,
				userName: userIdentityOptions.user,
				password: userIdentityOptions.password
			});
		} else {
			this.session = await this.client.createSession({type: UserTokenType.Anonymous});
		}

		this.logger.debug(`session created (#${this.session.sessionId})`);
	}


	private async closeSession(): Promise<void> {
		if (this.session) {
			await timeout(this.session.close(), 1000);
			this.session = undefined;
		}
	}


	public async createSubscription(): Promise<void> {
		if (!this.session) {
			throw new Error('Session should exist');
		}
		const subscriptionItem = ClientSubscription.create(this.session, {
			requestedPublishingInterval: 100,
			requestedLifetimeCount: 1000,
			requestedMaxKeepAliveCount: 12,
			maxNotificationsPerPublish: 10,
			publishingEnabled: true,
			priority: 10
		});

		await new Promise<void>((resolve) =>
			subscriptionItem
				.on('started', () => {
					this.logger.info(`[${this.id}] subscription started - ` +
						`subscriptionId=${subscriptionItem.subscriptionId}`);
					resolve();
				})
				.on('terminated', () => {
					this.logger.info(`[${this.id}] subscription terminated`);
				})
				.on('internal_error', (err: Error) => this.logger.debug(`[${this.id}] internal error: ${err}`))
				.on('error', (err: Error) => this.logger.warn(`[${this.id}] error: ${err}`))
				.on('status_changed', (data) => this.logger.debug(`[${this.id}] status changed: ${data}`))
				.on('item_added', (data) => this.logger.debug(`[${this.id}] item added: ${data}`))
				.on('raw_notification', (data) => this.logger.trace(`[${this.id}] raw_notification: ${data}`))
		);
		this.subscription = subscriptionItem;
	}

	private async stopSubscription(): Promise<void> {
		if (this.subscription) {
			await timeout(this.subscription.terminate(), 1000);
			this.subscription = undefined;
		}
	}

	/**
	 * Resolves a node-id datatype from nodeId
	 */
	private async resolveNodeIdDataType(nodeId: NodeId): Promise<DataType> {
		let result = this.nodeDataTypeMapping.get(nodeId);
		if (!result){
			result = await this.getBuiltInDataType(nodeId);
			if(!result) throw new Error('DataType resolution failed!');
			this.nodeDataTypeMapping.set(nodeId, result);
		}
		return result;
	}


	/**
	 * Resolves a node-id from identifier and namespace using the namespace array
	 */
	private resolveNodeId(ciData: CIData, identifier?: string): NodeId {
		if (identifier){
			const resolvedNodeId = this.dataItemNodeMapping.get(identifier);
			if(resolvedNodeId) return resolvedNodeId;
		}
		const nsIndex = this.resolveNamespaceIndex(ciData.nodeId.namespaceIndex);
		const nodeIdString = `ns=${nsIndex};s=${ciData.nodeId.identifier}`;
		this.logger.trace(`[${this.id}] resolveNodeId ${identifier} -> ${nodeIdString}`);
		const resolvedNodeId = coerceNodeId(nodeIdString);
		if (identifier) this.dataItemNodeMapping.set(identifier, resolvedNodeId);
		return resolvedNodeId;
	}

	private resolveNamespaceIndex(namespace: string): number {
		let result = -1;
		if (!this.namespaceArray) {
			throw new Error('NamespaceArray is undefined!');
		}
		const isURL = isNaN(+namespace);
		if (isURL) {
			result = this.findNamespaceIndex(namespace);
		} else {
			// check if provided namespace is a known namespace index
			const namespaceIndex = Number(namespace);
			const namespaceIndexExists = this.checkNamespaceIndexExists(namespaceIndex);
			if (namespaceIndexExists) {
				result = namespaceIndex;
			}
		}
		if (result === -1) {
			throw new Error(`Failed to resolve namespace ${namespace}!`);
		}
		return result;
	}

	private checkNamespaceIndexExists(namespaceIndex: number): boolean {
		return !!this.namespaceArray[namespaceIndex];
	}

	private findNamespaceIndex(namespace: string): number {
		return this.namespaceArray.indexOf(namespace);
	}

	private async readNameSpaceArray(): Promise<void> {
		let namespaceArray: string[] = [];
		const result: DataValue | undefined = await this.session?.read({nodeId: 'ns=0;i=2255'});
		if (result) {
			this.logger.info(`[${this.id}] Got namespace array: ${JSON.stringify(namespaceArray)}`);
			namespaceArray = result.value.value;
		} else {
			throw new Error('Could not read NamespaceArray at Node \'ns=0;i=2255\'');
		}
		this.namespaceArray = namespaceArray;
	}

	private validEndPointUrl(endpointUrl: string): boolean {
		if(endpointUrl.length === 0) return false;
		const url = new URL(endpointUrl);
		return parseInt(url.port) <= 65535;
	}

	public getConnectionAdapterInfo(): OpcUaAdapterInfo{
		const endpoints: OpcUaEndpointInfo[] = [];
		this.availableEndpoints.forEach((value, key) => {
			endpoints.push({
				id: key,
				securityMode: UserTokenType[value.securityMode as keyof typeof UserTokenType].toString(),
				securityPolicy: value.securityPolicy?.split('#').pop()
			});
		});
		return {
			type: 'opcua',
			connected: this.connected,
			currentEndpointId: this.currentEndpointId,
			endpoints: endpoints,
			endpointUrl: this.endpoint || '',
			id: this.id,
			monitoredItemsCount: this.monitoredDataItemCount(),
			monitoringActive: this.monitoringActive,
			name: this.name
		};
	}
}
