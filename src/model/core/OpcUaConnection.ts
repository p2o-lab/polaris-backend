/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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
    OPCUAClient,
    TimestampsToReturn,
    Variant,
    VariantArrayType
} from 'node-opcua';
import {timeout} from 'promise-timeout';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {fixReactor} from '../../achema/ReactorFix';
import {catOpc} from '../../config/logging';

/**
 * Events emitted by [[OpcUaConnection]]
 */
interface OpcUaConnectionEvents {
    /**
     * when module successfully connects to PEA
     * @event connected
     */
    connected: void;
    /**
     * when module is disconnected from PEA
     * @event disconnected
     */
    disconnected: void;
}

type OpcUaConnectionEmitter = StrictEventEmitter<EventEmitter, OpcUaConnectionEvents>;

export class  OpcUaConnection extends (EventEmitter as new() => OpcUaConnectionEmitter) {

    public readonly endpoint: string;
    public readonly id: string;
    private session: ClientSession;
    private client: OPCUAClient;
    private subscription: ClientSubscription;
    private readonly monitoredItems: Map<string, ClientMonitoredItemBase>;
    private namespaceArray: string[];
    private readonly logger: Category;

    constructor(moduleId: string, endpoint: string) {
        super();
        this.id = moduleId;
        this.endpoint = endpoint;
        this.logger = catOpc;
        this.monitoredItems = new Map<string, ClientMonitoredItemBase>();
    }

    /**
     * Opens connection to server and establish session
     */
    public async connect(): Promise<void> {
        if (this.isConnected()) {
            this.logger.debug(`[${this.id}] Already connected`);
            return Promise.resolve();
        } else {
            this.client = this.createClient();
            this.logger.info(`[${this.id}] connect module via ${this.endpoint}`);

            await timeout(this.client.connect(this.endpoint), 2000)
                .catch((err) => {
                    this.client.disconnect();
                    throw err;
                });
            this.logger.info(`[${this.id}] opc ua server connected via ${this.endpoint}`);

            this.session = await this.client.createSession();
            this.logger.info(`session created`);
            this.namespaceArray = await this.readNameSpaceArray();
            this.subscription = await this.createSubscription();

            if (this.endpoint === 'opc.tcp://10.6.51.22:4840') {
                await fixReactor(this.session);
            }

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
        this.monitoredItems.clear();
        this.logger.info(`[${this.id}] OPC UA connection disconnected`);
    }

    /**
     * is module connected to physical PEA
     * @returns {boolean}
     */
    public isConnected(): boolean {
        return !!this.client && !!this.session;
    }

    public async readOpcUaNode(nodeId: string, namespaceUrl: string) {
        const nodeIdResolved = this.resolveNodeId(nodeId, namespaceUrl);
        return await this.session.readVariableValue(nodeIdResolved);
    }

    public async listenToOpcUaNode(nodeId: string,
                                   namespaceUrl: string,
                                   samplingInterval = 100): Promise<ClientMonitoredItemBase> {
        const nodeIdResolved = this.resolveNodeId(nodeId, namespaceUrl);
        const monitoredItemKey = nodeIdResolved.toString();
        if (this.monitoredItems.has(monitoredItemKey)) {
            return this.monitoredItems.get(monitoredItemKey);
        } else {
            const monitoredItem = await this.subscription.monitor({
                    nodeId: nodeIdResolved,
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval,
                    discardOldest: true,
                    queueSize: 1
                }, TimestampsToReturn.Both);

            if (monitoredItem.statusCode.value !== 0) {
                throw new Error(monitoredItem.statusCode.description);
            }
            this.logger.debug(`[${this.id}] subscribed to opc ua Variable ${monitoredItemKey} `);
            this.monitoredItems.set(monitoredItemKey, monitoredItem);
            return monitoredItem;
        }
    }

    public async writeOpcUaNode(nodeId: string, namespaceUrl: string, value: number | string, dataType) {
        if (!this.isConnected()) {
            throw new Error(`Can not write node since OPC UA connection to module ${this.id} is not established`);
        } else {
            const variant = Variant.coerce({
                value: value,
                dataType: dataType,
                arrayType: VariantArrayType.Scalar
            });
            this.logger.info(`[${this.id}] Write ${nodeId} - ${JSON.stringify(variant)}`);
            const statusCode = await this.session.writeSingleNode(this.resolveNodeId(nodeId, namespaceUrl), variant);
            if (statusCode.value !== 0) {
                this.logger.warn(`Error while writing to opcua: ${statusCode.description}`);
                throw new Error(statusCode.description);
            }
        }
    }

    public monitoredItemSize(): number {
        return this.monitoredItems.size;
    }

    /**
     * Resolves nodeId of dataItem from module using the namespace array
     */
    private resolveNodeId(nodeId: string, namespaceUrl: string) {
        if (!this.namespaceArray) {
            throw new Error(`No namespace array read for module ${this.id}`);
        } else if (!namespaceUrl) {
            throw new Error(`namespace index is null in module ${this.id}`);
        } else if (!nodeId) {
            throw new Error('nodeid is null');
        }
        const nsIndex = this.namespaceArray.indexOf(namespaceUrl);
        if (nsIndex === -1) {
            throw new Error(`Could not resolve namespace ${namespaceUrl}`);
        }
        const nodeIdString = `ns=${nsIndex};s=${nodeId}`;

        this.logger.debug(`[${this.id}] resolveNodeId ${nodeId} -> ${nodeIdString}`);
        return coerceNodeId(nodeIdString);
    }

    private async readNameSpaceArray() {
        const result: DataValue = await this.session.readVariableValue('ns=0;i=2255');
        const namespaceArray = result.value.value;
        this.logger.debug(`[${this.id}] Got namespace array: ${JSON.stringify(namespaceArray)}`);
        return namespaceArray;
    }

    private createClient() {
        return OPCUAClient.create({
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
    }

    private async createSubscription() {
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
            .on('internal_error', (err: Error) => this.logger.info(`[${this.id}] internal error: ${err}`))
            .on('error', (err: Error) => this.logger.info(`[${this.id}] error: ${err}`))
            .on('status_changed', (data) => this.logger.info(`[${this.id}] status changed: ${data}`))
            .on('item_added', (data) => this.logger.debug(`[${this.id}] item added: ${data}`))
            .on('raw_notification', (data) => this.logger.trace(`[${this.id}] raw_notification: ${data}`))

        );
        return subscription;
    }

}
