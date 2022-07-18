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
	MessageSecurityMode,
	MonitoringMode,
	NodeId,
	OPCUAClient,
	SecurityPolicy,
	TimestampsToReturn,
	UserIdentityInfo,
	UserIdentityInfoUserName,
	UserTokenType,
	Variant,
	VariantArrayType
} from 'node-opcua';
import {timeout} from 'promise-timeout';
import {ClientMonitoredItemGroup} from 'node-opcua-client/source/client_monitored_item_group';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {OpcUaAuthenticationSettings, OpcUaAuthenticationType, OpcUaConnectionInfo, OpcUaConnectionSettings, OpcUaMessageSecurityModes, OpcUaSecurityPolicies, OpcUaSecuritySettings} from '@p2olab/polaris-interface';
import {DataType} from 'node-opcua-client';
import {IDProvider} from '../../../_utils';
import {catOpcUA} from '../../../../logging';
import {CIData} from '@p2olab/pimad-interface';


/**
 * Events emitted by {@link OpcUaAdapter}
 */
interface OpcUaConnectionAdapterEvents {
	/**
	 * when target e.g. PEAController successfully connects to POL
	 * @event connected
	 */
	connected: void;
	/**
	 * when target e.g. PEAController is disconnected from POL
	 * @event disconnected
	 */
	disconnected: void;
	/**
	 * when monitored Node changes
	 * @event monitoredItemChanged
	 */
	monitoredNodeChanged: {
		monitoredNodeId: string;
		value: string | number | boolean;
		dataType: string;
		timestamp: Date;
	};
}

type OpcUaConnectionAdapterEmitter = StrictEventEmitter<EventEmitter, OpcUaConnectionAdapterEvents>;

export class OpcUaAdapter extends (EventEmitter as new() => OpcUaConnectionAdapterEmitter) {

	public readonly id: string = IDProvider.generateIdentifier();
	private readonly logger: Category = catOpcUA;

	private _adapterConfig: OpcUaConnectionSettings;

	private readonly endpoint: string;
	private userIdentitySetting!: UserIdentityInfo;
	private securityMode: OpcUaMessageSecurityModes = OpcUaMessageSecurityModes.None;
	private securityPolicy: OpcUaSecurityPolicies = OpcUaSecurityPolicies.None;

	private namespaceArray: string[] = [];
	private session: ClientSession | undefined;
	private client: OPCUAClient | undefined;
	private subscription: ClientSubscription | undefined;

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

	constructor(adapterConfig: OpcUaConnectionSettings) {
		super();
		this._adapterConfig = adapterConfig;
		if(this.validEndPointUrl(adapterConfig.endpointUrl)){
			this.endpoint = adapterConfig.endpointUrl;
		} else {
			throw new Error('Found invalid endpoint configuration.');
		}

		adapterConfig.authenticationSettings? this.setAuthenticationSettings(adapterConfig.authenticationSettings) : this.setAuthenticationSettingAnonymous();

		const securitySettings = adapterConfig.securitySettings;
		if (securitySettings) {
			this.setSecuritySettings(securitySettings);
		}

	}

	public get settingsInfo(): OpcUaConnectionInfo {
		return {
			endpointUrl: this._adapterConfig.endpointUrl,
			connected: this.connected,
			monitoredItemsCount: this.monitoredNodesCount(),
			securitySettings: {
				securityPolicy: OpcUaSecurityPolicies[this.securityPolicy],
				securityMode: OpcUaMessageSecurityModes[this.securityMode],
			},
			authenticationSettings: this.authenticationSettingsInfo,
		};
	}

	private get authenticationSettingsInfo(): OpcUaAuthenticationType {
		let info;
		switch (this.userIdentitySetting.type) {
			case UserTokenType.Certificate:
				info = OpcUaAuthenticationType.Certificate;
				break;
			case UserTokenType.UserName:
				info = OpcUaAuthenticationType.UserName;
				break;
			case UserTokenType.Anonymous:
				info = OpcUaAuthenticationType.Anonymous;
				break;
			default:
				info = OpcUaAuthenticationType.Anonymous;
				break;
		}
		return info;
	}

	/**
	 * Set SecuritySettings of connection
	 */
	public setSecuritySettings(newSettings: OpcUaSecuritySettings): void {
		this.securityMode = newSettings.securityMode;
		this.securityPolicy = newSettings.securityPolicy;
	}


	/**
	 * Set AuthenticationSettings of connection
	 */
	private setAuthenticationSettings(newSettings: OpcUaAuthenticationSettings): void {
		const userCredentials = newSettings.userCredentials;
		if (userCredentials) {
			this.setAuthenticationSettingUserName(userCredentials.userName, userCredentials.password);
		} else{
			this.setAuthenticationSettingAnonymous();
		}
	}

	/**
	 * Set UserIdentity to Anonymous
	 */
	private setAuthenticationSettingAnonymous(): void {
		this.userIdentitySetting = {type: UserTokenType.Anonymous};
	}


	/**
	 * Applies the current session UserIdentity
	 * @returns {Promise<void>}
	 */
	private setAuthenticationSettingUserName(username: string, password: string): void {
		this.userIdentitySetting =
			{
				type: UserTokenType.UserName,
				userName: username,
				password: password
			} as UserIdentityInfoUserName;
	}

	/**
	 * Open connection to server and establish session
	 * @returns {Promise<void>}
	 */
	public async connect(): Promise<void> {
		if (this.connected) {
			this.logger.debug(`[${this.id}] Already connected`);
		} else {
			this.createClient();
			await this.connectClient();
			await this.createSession();
			await this.readNameSpaceArray();
			this.logger.info(`[${this.id}] Successfully connected`);
			this.emit('connected');
		}
		return Promise.resolve();
	}

	public async reconnect(): Promise<void> {
		if(this.connected)await this.disconnect();
		await this.connect();
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
	public async readNode(ciData: CIData):  Promise<DataValue | undefined> {
		if (!this.connected){
			return undefined;
		}
		const resolvedID = this.resolveNodeId(ciData);
		return this.session?.read({nodeId: resolvedID });
	}

	private async getBuiltInDataType(nodeId: NodeId): Promise<undefined | DataType> {
		if (!this.connected){
			return undefined;
		}
		if (!this.session){
			return undefined;
		}
		return this.session.getBuiltInDataType(nodeId);
	}

	/**
	 * Write the provided value to provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async writeNode(ciData: CIData, value: number | string | boolean): Promise<void> {
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
		const existingMonitoredItemKey: undefined | string = this.findAlreadyMonitoredNode(ciData);
		if(!existingMonitoredItemKey){
			monitoredItemKey = identifier || IDProvider.generateIdentifier();
			this.nodes.set(monitoredItemKey, ciData);
		} else {
			monitoredItemKey = existingMonitoredItemKey;
		}
		return monitoredItemKey;
	}

	private findAlreadyMonitoredNode(ciData: CIData): string | undefined {
		let monitoredNodeKey: string | undefined = undefined;
		for (const [key, value] of this.nodes) {
			if (value.nodeId.identifier === ciData.nodeId.identifier && value.nodeId.namespaceIndex === ciData.nodeId.namespaceIndex){
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
		const options = Array.from(this.nodes.values()).map((ciData: CIData) => {
			return {
				nodeId: this.resolveNodeId(ciData),
				attributeId: AttributeIds.Value
			};
		});
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
				this.logger.trace(`[${this.id}] ${monitoredItem.itemToMonitor.nodeId.toString()} changed to ${dataValue}`);
				this.emit('monitoredNodeChanged',
					{
						monitoredNodeId: monitoredItem.itemToMonitor.nodeId.toString(),
						value: dataValue.value.value,
						dataType: DataType[dataValue.value.dataType],
						timestamp: dataValue.value.value.serverTimestamp || new Date()
					});
			});

			await monitoredItemGroup.setMonitoringMode(MonitoringMode.Reporting);
		}
	}

	public async stopMonitoring(): Promise<void>{
		if (this.client) {
			this.client.removeAllListeners('close')
				.removeAllListeners('connection_lost');
		}
	}


	public monitoredNodesCount(): number {
		return this.nodes.size;
	}

	public clearMonitoredNodes(): void{
		this.nodes.clear();
	}

	private getNodeOpcUaMessageSecurityMode(): MessageSecurityMode{
		return MessageSecurityMode[OpcUaMessageSecurityModes[this.securityMode] as keyof typeof MessageSecurityMode];
	}

	private getNodeOpcUaSecurityPolicy(): SecurityPolicy{
		return SecurityPolicy[OpcUaSecurityPolicies[this.securityPolicy] as keyof typeof SecurityPolicy];
	}

	private createClient(): void {
		const connectionStrategy = {
			initialDelay: 50,
			maxRetry: 0
		};

		this.client = OPCUAClient.create({
				applicationName: 'NodeOPCUA-Client',
				endpointMustExist: false,
				securityMode: this.getNodeOpcUaMessageSecurityMode(),
				securityPolicy: this.getNodeOpcUaSecurityPolicy(),
				connectionStrategy: connectionStrategy,
			})
			.on('close', async () => {
				this.logger.info(`[${this.id}] Connection closed to OPC UA server`);
				await this.disconnect();
				this.emit('disconnected');
			})
			.on('connection_lost', async () => {
				this.logger.info(`[${this.id}] Connection lost to OPC UA server`);
				await this.disconnect();
				this.emit('disconnected');
			})
			.on('timed_out_request', () => {
				this.logger.warn(`[${this.id}] timed out request - retrying connection`);
			});
	}

	private async connectClient(): Promise<void> {
		if (!this.client) {
			throw new Error('Client must exist');
		}
		this.logger.info(`[${this.id}] start connect via endpoint: ${this.endpoint}`);
		await timeout(this.client.connect(this.endpoint!), 2000);
		this.logger.info(`[${this.id}] connected via endpoint: ${this.endpoint}`);
	}

	private async disconnectClient(): Promise<void> {
		if (this.client) {
			await timeout(this.client.disconnect(), 1000);
		}
	}

	private async createSession(): Promise<void> {
		if (!this.client) {
			throw new Error('Client should exist');
		}
		this.session = await this.client.createSession(this.userIdentitySetting);
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
		if(parseInt(url.port) > 65535) return false;
		return true;
	}
}
