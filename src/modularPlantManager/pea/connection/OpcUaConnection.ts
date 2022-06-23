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
import {catOpcUA} from '../../../logging';
import {IDProvider} from '../../_utils/idProvider/IDProvider';
import {OpcUaAuthenticationSettings, OpcUaAuthenticationType, OpcUaConnectionInfo, OpcUaConnectionSettings, OpcUaMessageSecurityModes, OpcUaSecurityPolicies, OpcUaSecuritySettings} from '@p2olab/polaris-interface';
import {DataType} from 'node-opcua-client';

/**
 * Events emitted by {@link OpcUaConnection}
 */
interface OpcUaConnectionEvents {
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
	 * when monitored item changes
	 * @event monitoredItemChanged
	 */
	monitoredItemChanged: {
		monitoredItemId: string;
		value: string | number | boolean;
		dataType: string;
		timestamp: Date;
	};
}

type OpcUaConnectionEmitter = StrictEventEmitter<EventEmitter, OpcUaConnectionEvents>;

export class OpcUaConnection extends (EventEmitter as new() => OpcUaConnectionEmitter) {

	public readonly id: string = IDProvider.generateIdentifier();
	private readonly logger: Category = catOpcUA;

	private initialized = false;

	private endpoint!: string;
	private userIdentitySetting!: UserIdentityInfo;
	private securityMode: OpcUaMessageSecurityModes = OpcUaMessageSecurityModes.None;
	private securityPolicy: OpcUaSecurityPolicies = OpcUaSecurityPolicies.None;

	private namespaceArray: string[] = [];
	private session: ClientSession | undefined;
	private client: OPCUAClient | undefined;
	private subscription: ClientSubscription | undefined;

	private readonly nodes: Map<string, string> = new Map<string, string>();

	constructor() {
		super();
	}

	public initialize(connectionSettings: OpcUaConnectionSettings): void {
		if (!this.initialized){
			this.endpoint = connectionSettings.endpointUrl;
			this.setAuthenticationSettings(connectionSettings.authenticationSettings || {});

			const securitySettings = connectionSettings.securitySettings;
			if (securitySettings) {
				this.setSecuritySettings(securitySettings);
			}
			this.initialized = true;
		}
		this.logger.debug('Already initialized.');
	}

	public update(connectionSettings: OpcUaConnectionSettings): void {
		if (!this.initialized) {
			this.logger.warn('Connection is not initialized.');
			throw new Error('Connection is not initialized.');
		}
		if (this.isConnected()) {
			this.logger.warn('Connection is active.');
			throw new Error('Connection is active.');
		}
		this.endpoint = connectionSettings.endpointUrl;
		this.setAuthenticationSettings(connectionSettings.authenticationSettings || {});

		const securitySettings = connectionSettings.securitySettings;
		if (securitySettings) {
			this.setSecuritySettings(securitySettings);
		} else {
			this.setSecuritySettings({securityMode: OpcUaMessageSecurityModes.None, securityPolicy: OpcUaSecurityPolicies.None});
		}
	}

	public async reconnect(newConnectionSettings?: OpcUaConnectionSettings): Promise<void> {
		await this.disconnect();
		if (newConnectionSettings) {
			this.logger.debug('Updating settings during reconnect.');
			this.update(newConnectionSettings);
		}
		await this.connect();
	}

	public get endpointUrl(): string{
		return this.endpoint;
	}

	public get settingsInfo(): OpcUaConnectionInfo {
		return {
			endpointUrl: this.endpointUrl,
			connected: this.isConnected(),
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
		this.setAuthenticationSettingAnonymous();
		const userCredentials = newSettings.userCredentials;
		if (userCredentials) {
			this.setAuthenticationSettingUserName(userCredentials.userName, userCredentials.password);
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
	 * Applies the current session UserIdentity to current session on the fly
	 * @returns {Promise<void>}
	 */
	private async applySessionUserIdentity(): Promise<void> {
		if (this.isConnected() && this.session) {
			await this.client?.changeSessionIdentity(this.session, this.userIdentitySetting);
		}
		return Promise.resolve();
	}

	/**
	 * Open connection to server and establish session
	 * @returns {Promise<void>}
	 */
	public async connect(): Promise<void> {
		if (!this.initialized) {
			this.logger.warn('Connection is not initialized.');
			throw new Error('Connection is not initialized.');
		}
		if (this.isConnected()) {
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
	 * Indicator if this client is currently connected to endpoint
	 * @returns {boolean}
	 */
	public isConnected(): boolean {
		return !!this.client && !!this.session;
	}

	/**
	 * read the value of provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async readNode(identifier: string, namespace: string):  Promise<DataValue | undefined> {
		const resolvedID = this.resolveNodeId(identifier, namespace);
		return this.session?.read({nodeId: resolvedID });
	}

	/**
	 * Write the provided value to provided NodeID information
	 * @returns {Promise<DataValue | undefined>}
	 */
	public async writeNode(nodeId: string, namespaceUri: string, value: number | string | boolean, dataType: string): Promise<void> {
		if (!this.isConnected()) {
			throw new Error('Can not write node since OPC UA connection is not established');
		}
		const variant = Variant.coerce({
			value: value,
			dataType: dataType,
			arrayType: VariantArrayType.Scalar
		});

		const nodeToWrite = {
			nodeId: this.resolveNodeId(nodeId, namespaceUri).toString(),
			attributeId: AttributeIds.Value,
			value: {
				value: variant
			}
		};

		this.logger.debug(`[${this.id}] Write ${nodeId} - ${JSON.stringify(variant)}`);
		if (!this.session) {
			throw new Error('Session is undefined');
		}
		const statusCode = await this.session.write(nodeToWrite);

		if (statusCode.value !== 0) {
			this.logger.warn(`Error while writing to OpcUA ${nodeId}=${value}: ${statusCode.description}`);
			throw new Error(statusCode.description);
		}
		return Promise.resolve();
	}

	/**
	 * Add Node to the connection and subscription groups
	 * @returns {string}
	 */
	public addNodeToMonitoring(identifier: string, namespace: string): string {

		const nodeIdResolved = this.resolveNodeId(identifier, namespace);

		const monitoredItemKey = nodeIdResolved.toString();
		// TODO: in case of same identifier in different namespaces identifier as Map key might be a problem
		this.nodes.set(identifier, monitoredItemKey);

		return monitoredItemKey;
	}

	/**
	 * Add Node to the connection and subscription groups
	 * @returns {string}
	 */
	public removeNodeFromMonitoring(identifier: string): void {
		this.nodes.delete(identifier);
	}

	public async startMonitoring(samplingInterval = 100): Promise<void> {
		const options = Array.from(this.nodes.values()).map((item) => {
			return {
				nodeId: item,
				attributeId: AttributeIds.Value
			};
		});
		if (!this.subscription){
			await this.createSubscription();
		}
		const monitoredItemGroup: ClientMonitoredItemGroup = await this.subscription!.monitorItems(
			options,
			{
				samplingInterval,
				discardOldest: true,
				queueSize: 10
			}, TimestampsToReturn.Both);

		monitoredItemGroup.on('changed', (monitoredItem: ClientMonitoredItemBase, dataValue: DataValue) => {
				this.logger.trace(`[${this.id}] ${monitoredItem.itemToMonitor.nodeId.toString()} changed to ${dataValue}`);
				this.emit('monitoredItemChanged',
					{monitoredItemId : monitoredItem.itemToMonitor.nodeId.toString(),
						value: dataValue.value.value,
						dataType: DataType[dataValue.value.dataType],
						timestamp: dataValue.value.value.serverTimestamp || new Date()
					});
			});

		await monitoredItemGroup.setMonitoringMode(MonitoringMode.Reporting);
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

	private async updateClient(): Promise<void> {
		await this.createClient();
		return Promise.resolve();
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
	 * Resolves a node-id from identifier and namespace using the namespace array
	 */
	private resolveNodeId(identifier: string, namespace: string): NodeId {

		const nsIndex = this.resolveNamespaceIndex(namespace);
		const nodeIdString = `ns=${nsIndex};s=${identifier}`;
		this.logger.debug(`[${this.id}] resolveNodeId ${identifier} -> ${nodeIdString}`);
		return coerceNodeId(nodeIdString);
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
}
