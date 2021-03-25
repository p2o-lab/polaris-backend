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
	DataValue, MonitoringMode, NodeId,
	OPCUAClient,
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

/**
 * Events emitted by {@link OpcUaConnection}
 */
interface OpcUaConnectionEvents {
	/**
	 * when target e.g. PEA successfully connects to POL
	 * @event connected
	 */
	connected: void;
	/**
	 * when target e.g. PEA is disconnected from POL
	 * @event disconnected
	 */
	disconnected: void;
}

type OpcUaConnectionEmitter = StrictEventEmitter<EventEmitter, OpcUaConnectionEvents>;

export class OpcUaConnection extends (EventEmitter as new() => OpcUaConnectionEmitter) {

	public readonly endpoint: string;
	public readonly id: string;
	public readonly eventEmitter: EventEmitter;
	private session: ClientSession | undefined;
	private client: OPCUAClient | undefined;
	private subscription: ClientSubscription | undefined;
	private readonly items: Map<string, string>;
	private namespaceArray!: string[];
	private readonly logger: Category;
	private readonly username: string | undefined;
	private readonly password: string | undefined;

	constructor(targetId: string, endpoint: string, username?: string, password?: string) {
		super();
		this.id = targetId;
		this.endpoint = endpoint;
		this.logger = catOpcUA;
		this.username = username;
		this.password = password;
		this.eventEmitter = new EventEmitter();
		this.items = new Map<string, string>();
	}

	/**
	 * Opens connection to server and establish session
	 */
	public async connect(): Promise<void> {
		if (this.isConnected()) {
			this.logger.debug(`[${this.id}] Already connected`);
			return Promise.resolve();
		} else {
			if (this.endpoint === undefined) {
				this.logger.warn('Error while connecting to OPC UA. Endpoint undefined.');
				throw new Error('cannot be established');
			}
			this.client = await this.createAndConnectClient();
			this.session = await this.createSession();
			this.namespaceArray = await this.readNameSpaceArray();
			this.subscription = await this.createSubscription();

			this.logger.info(`[${this.id}] Successfully connected`);
			this.emit('connected');
		}
	}

	public async disconnect(): Promise<void> {
		if (this.client) {
			this.client.removeAllListeners('close')
				.removeAllListeners('connection_lost');
		}
		if (this.subscription) {
			await timeout(this.subscription.terminate(), 1000);
			this.subscription = undefined;
		}
		if (this.session) {
			await timeout(this.session.close(), 1000);
			this.session = undefined;
		}
		if (this.client) {
			await timeout(this.client.disconnect(), 1000);
			this.client = undefined;
		}
		this.items.clear();
		this.logger.info(`[${this.id}] OPC UA connection disconnected`);
	}

	/**
	 * is pea connected to physical PEA
	 * @returns {boolean}
	 */
	public isConnected(): boolean {
		return !!this.client && !!this.session;
	}

	public async readOpcUaNode(nodeId: string, namespaceUrl: string):  Promise<DataValue | undefined> {
		return await this.session?.read({nodeId: this.resolveNodeId(nodeId, namespaceUrl)});

	}

	public addOpcUaNode(nodeId: string, namespaceUrl?: string): string {
		let nodeIdResolved;
		if (namespaceUrl) {
			nodeIdResolved = this.resolveNodeId(nodeId, namespaceUrl);
		} else {
			nodeIdResolved = nodeId;
		}

		const monitoredItemKey = nodeIdResolved.toString();
		this.items.set(nodeId, monitoredItemKey);
		return monitoredItemKey;
	}

	public async startListening(samplingInterval = 100): Promise<EventEmitter> {
		const options = Array.from(this.items.values()).map((item) => {
			return {
				nodeId: item,
				attributeId: AttributeIds.Value
			};
		});
		if (!this.subscription){throw new Error('Subscription is undefined');}
		const monitoredItemGroup: ClientMonitoredItemGroup = await this.subscription.monitorItems(
			options,
			{
				samplingInterval,
				discardOldest: true,
				queueSize: 10
			}, TimestampsToReturn.Both)
		;
		monitoredItemGroup.on('changed', (monitoredItem: ClientMonitoredItemBase, dataValue: DataValue) => {
				this.logger.trace(`[${this.id}] ${monitoredItem.itemToMonitor.nodeId.toString()} changed to ${dataValue}`);
				this.eventEmitter.emit(monitoredItem.itemToMonitor.nodeId.toString(), dataValue);
			});
		await monitoredItemGroup.setMonitoringMode(MonitoringMode.Reporting);
		return this.eventEmitter;
	}

	public async writeOpcUaNode(nodeId: string, namespaceUrl: string, value: number | string | boolean,
								dataType: string): Promise<void> {
		if (!this.isConnected()) {
			throw new Error(`Can not write node since OPC UA connection to PEA ${this.id} is not established`);
		} else {
			const variant = Variant.coerce({
				value: value,
				dataType: dataType,
				arrayType: VariantArrayType.Scalar
			});
			this.logger.debug(`[${this.id}] Write ${nodeId} - ${JSON.stringify(variant)}`);
			if (!this.session) {
				throw new Error('Session is undefined');
			}
			const statusCode = await this.session.write(
				{nodeId: this.resolveNodeId(nodeId, namespaceUrl), value: variant});
			if (statusCode.value !== 0) {
				this.logger.warn(`Error while writing to OpcUA ${nodeId}=${value}: ${statusCode.description}`);
				throw new Error(statusCode.description);
			}
		}
	}

	public monitoredItemSize(): number {
		return this.items.size;
	}

	/**
	 * Resolves a node-id from node-id and namespace url using the namespace array
	 */
	private resolveNodeId(nodeId: string, namespaceUrl: string): NodeId {
		if (!this.namespaceArray) {
			throw new Error(`No namespace array read for PEA ${this.id}`);
		} else if (!namespaceUrl) {
			throw new Error(`namespace index is null in PEA ${this.id}`);
		} else if (!nodeId) {
			throw new Error('node-id is null');
		}
		const nsIndex = this.namespaceArray.indexOf(namespaceUrl);
		if (nsIndex === -1) {
			throw new Error(`Could not resolve namespace ${namespaceUrl}`);
		}
		const nodeIdString = `ns=${nsIndex};s=${nodeId}`;

		this.logger.debug(`[${this.id}] resolveNodeId ${nodeId} -> ${nodeIdString}`);
		return coerceNodeId(nodeIdString);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async readNameSpaceArray(): Promise<any> {
		const result: DataValue | undefined = await this.session?.read({nodeId: 'ns=0;i=2255'});
		if (!result) {
			throw new Error('Could not read Node ns=0;i=2255');
		}
		const namespaceArray = result.value.value;
		this.logger.info(`[${this.id}] Got namespace array: ${JSON.stringify(namespaceArray)}`);
		return namespaceArray;
	}

	private async createAndConnectClient(): Promise<OPCUAClient> {
		const client = OPCUAClient.create({
				// eslint-disable-next-line @typescript-eslint/camelcase
				endpoint_must_exist: false,
				connectionStrategy: {
					maxRetry: 0
				}
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
		this.logger.info(`[${this.id}] connect PEA via ${this.endpoint}`);

		await timeout(client.connect(this.endpoint), 2000)
			.catch((err) => {
				client.disconnect();
				throw err;
			});
		this.logger.info(`[${this.id}] opc ua server connected via ${this.endpoint}`);
		return client;
	}

	private async createSession(): Promise<ClientSession> {
		let userIdentityInfo: UserIdentityInfo = {type: UserTokenType.Anonymous};
		if (this.username && this.password) {
			userIdentityInfo =
				{
					type: UserTokenType.UserName,
					userName: this.username,
					password: this.password
				} as UserIdentityInfoUserName;
		}
		if (!this.client) {
			throw new Error('Client is undefined');
		}
		const session = await this.client.createSession(userIdentityInfo);
		this.logger.debug(`session created (#${session.sessionId})`);
		return session;
	}

	private async createSubscription(): Promise<ClientSubscription> {
		if (!this.session) {
			throw new Error('Session is undefined');
		}
		const subscription = ClientSubscription.create(this.session, {
			requestedPublishingInterval: 100,
			requestedLifetimeCount: 1000,
			requestedMaxKeepAliveCount: 12,
			maxNotificationsPerPublish: 10,
			publishingEnabled: true,
			priority: 10
		});

		await new Promise((resolve) =>
			subscription
				.on('started', () => {
					this.logger.info(`[${this.id}] subscription started - ` +
						`subscriptionId=${subscription.subscriptionId}`);
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
		return subscription;
	}

}
