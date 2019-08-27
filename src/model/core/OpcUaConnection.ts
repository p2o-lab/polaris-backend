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
    DataType,
    DataValue,
    OPCUAClient,
    TimestampsToReturn,
    Variant,
    VariantArrayType
} from 'node-opcua-client';
import {timeout} from 'promise-timeout';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {fixReactor} from '../../achema/ReactorFix';
import {catOpc} from '../../config/logging';
import {DataItemEmitter, OpcUaDataItem} from '../dataAssembly/DataItem';

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
    private session: ClientSession;
    private client: OPCUAClient;
    private subscription: ClientSubscription;
    private readonly monitoredItems: Map<string, DataItemEmitter>;
    private namespaceArray: string[];
    private readonly logger: Category;
    private readonly id: string;

    constructor(moduleId: string, endpoint: string) {
        super();
        this.id = moduleId;
        this.endpoint = endpoint;
        this.logger = catOpc;
        this.monitoredItems = new Map<string, EventEmitter>();
    }

    /**
     * Opens connection to server and establish session
     *
     * Subscribe to all important variables
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        this.client = this.createClient();
        if (this.session) {
            this.logger.debug(`[${this.id}] Already connected`);
            return Promise.resolve();
        } else {
            this.logger.info(`[${this.id}] connect module via ${this.endpoint}`);

            await timeout(this.client.connect(this.endpoint), 2000)
                .catch((err) => {
                    this.client.disconnect();
                    throw err;
                });
            this.logger.info(`[${this.id}] opc ua server connected via ${this.endpoint}`);

            this.session = await this.client.createSession();
            this.subscription = this.createSubscription();
            this.namespaceArray = await this.readNameSpaceArray();

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
        this.logger.info(`[${this.id}] OPC UA connection disconnected`);
    }

    /**
     * is module connected to physical PEA
     * @returns {boolean}
     */
    public isConnected(): boolean {
        return !!this.client && !!this.session;
    }

    /**
     * Listen to OPC UA data item and return event listener which is triggered by any value change
     */
    public async listenToOpcUaDataItem(node: OpcUaDataItem<any>, samplingInterval = 100): Promise<DataItemEmitter> {
        const nodeId = this.resolveNodeId(node);
        const monitoredItemKey = nodeId.toString();
        if (this.monitoredItems.has(monitoredItemKey)) {
            return this.monitoredItems.get(monitoredItemKey);
        } else {
            await this.initializeOpcUaDataItem(node);
            const emitter: DataItemEmitter = new EventEmitter();
            const monitoredItem: ClientMonitoredItemBase = await this.subscription.monitor({
                    nodeId,
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval,
                    discardOldest: true,
                    queueSize: 1
                }, TimestampsToReturn.Both);
            this.logger.debug(`[${this.id}] subscribed to opc ua Variable ${nodeId} `);
            monitoredItem.on('changed', (dataValue) => {
                this.logger.debug(`[${this.id}] Variable Changed (${nodeId}) ` +
                    `= ${dataValue.value.value.toString()}`);
                node.value = dataValue.value.value;
                node.timestamp = dataValue.serverTimestamp;
                emitter.emit('changed', {value: node.value, timestamp: node.timestamp});
            });
            this.monitoredItems.set(monitoredItemKey, emitter);
            return emitter;
        }
    }

    /** writes value to opc ua node
     *
     * @param {OpcUaNodeOptions} node
     * @param {} value
     * @returns {Promise<any>}
     */
    public async writeOpcUaDataItem(node: OpcUaDataItem<any>, value: number | string) {
        if (!this.isConnected()) {
            throw new Error(`Can not write node since OPC UA connection to module ${this.id} is not established`);
        } else {
            const variant = Variant.coerce({
                value,
                dataType: node.dataType,
                arrayType: VariantArrayType.Scalar
            });
            this.logger.info(`[${this.id}] Write ${node.nodeId} - ${JSON.stringify(variant)}`);
            const result = await this.session.writeSingleNode(this.resolveNodeId(node), variant);
            this.logger.info(`[${this.id}] Write result for ${node.nodeId}=${value} -> ${result.name}`);
            return result;
        }
    }

    public monitoredItemSize(): number {
        return this.monitoredItems.size;
    }

    /**
     * Resolves nodeId of dataItem from module JSON using the namespace array
     * @param {OpcUaNodeOptions} dataItem
     * @returns {any}
     */
    private resolveNodeId(dataItem: OpcUaDataItem<any>) {
        if (!dataItem) {
            throw new Error('No dataItem specified to resolve nodeid');
        } else if (!this.namespaceArray) {
            throw new Error(`No namespace array read for module ${this.id}`);
        } else if (!dataItem.namespaceIndex) {
            throw new Error(`namespace index is null in module ${this.id}`);
        }
        const nsIndex = this.namespaceArray.indexOf(dataItem.namespaceIndex);
        if (nsIndex === -1) {
            throw new Error(`Could not resolve namespace ${dataItem.namespaceIndex}`);
        }
        const nodeIdString = `ns=${nsIndex};s=${dataItem.nodeId}`;

        this.logger.debug(`[${this.id}] resolveNodeId ${JSON.stringify(dataItem)} -> ${nodeIdString}`);
        return coerceNodeId(nodeIdString);
    }

    /**
     * Reads the opc ua data item of the data item and use the results for initializing the data item
     */
    private async initializeOpcUaDataItem(opcUaDataItem: OpcUaDataItem<any>) {
        const nodeId = this.resolveNodeId(opcUaDataItem);
        const result = await this.session.readVariableValue(nodeId);
        this.logger.debug(`[${this.id}] Read Variable: ${JSON.stringify(opcUaDataItem)} -> ${nodeId} = ${result}`);
        if (result.statusCode.value !== 0) {
            throw new Error(`Could not read ${nodeId.toString()}: ${result.statusCode.description}`);
        }
        opcUaDataItem.value = result.value.value;
        // readVariableValue does not provide serverTimestamp
        opcUaDataItem.timestamp = new Date();
        if (!opcUaDataItem.dataType) {
            opcUaDataItem.dataType = DataType[result.value.dataType];
        }
        this.logger.debug(`[${this.id}] initialized Variable: ${opcUaDataItem.nodeId.toString()} - ${JSON.stringify(opcUaDataItem)}`);
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

    private createSubscription() {
        const subscription = ClientSubscription.create(this.session, {
            requestedPublishingInterval: 100,
            requestedLifetimeCount: 1000,
            requestedMaxKeepAliveCount: 12,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });

        subscription
            .on('started', () => {
                this.logger.info(`[${this.id}] subscription started - ` +
                    `subscriptionId=${subscription.subscriptionId}`);
            })
            .on('terminated', () => {
                this.logger.debug(`[${this.id}] subscription terminated`);
            });
        return subscription;
    }

}
