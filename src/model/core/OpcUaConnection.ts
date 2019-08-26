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
    NodeId,
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
    private readonly monitoredItems: Map<NodeId, DataItemEmitter>;
    private namespaceArray: string[];
    private readonly logger: Category;
    private readonly id: string;

    constructor(moduleId: string, endpoint: string) {
        super();
        this.id = moduleId;
        this.endpoint = endpoint;
        this.logger = catOpc;
        this.monitoredItems = new Map<NodeId, EventEmitter>();
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
            this.logger.debug(`[${this.id}] session established`);
            this.subscription = this.createSubscription();
            this.namespaceArray = await this.readNameSpaceArray();

            if (this.endpoint === 'opc.tcp://10.6.51.22:4840') {
                await fixReactor(this.session);
            }

            this.logger.info(`[${this.id}] Successfully connected with ${this.monitoredItems.size} active assemblies`);
            this.emit('connected');
        }
    }

    public async disconnect(): Promise<void> {
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
        this.logger.info(`[${this.id}] Module disconnected`);
        this.emit('disconnected');
    }

    /**
     * is module connected to physical PEA
     * @returns {boolean}
     */
    public isConnected(): boolean {
        return !!this.session;
    }

    /**
     * Listen to OPC UA data item and return event listener which is triggered by any value change
     */
    public async listenToOpcUaDataItem(node: OpcUaDataItem<any>, samplingInterval = 100): Promise<DataItemEmitter> {
        const nodeId = this.resolveNodeId(node);
        if (!this.monitoredItems.has(nodeId)) {
            const emitter: DataItemEmitter = new EventEmitter();
            this.monitoredItems.set(nodeId, emitter);
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
                emitter.emit('changed', {value: dataValue.value.value, timestamp: dataValue.serverTimestamp});
            });
            await this.initializeOpcUaDataItem(node);
        }
        return this.monitoredItems.get(nodeId);
    }

    /** writes value to opc ua node
     *
     * @param {OpcUaNodeOptions} node
     * @param {} value
     * @returns {Promise<any>}
     */
    public async writeOpcUaDataItem(node: OpcUaDataItem<any>, value: number | string) {
        if (!this.session) {
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

    /**
     * Resolves nodeId of variable from module JSON using the namespace array
     * @param {OpcUaNodeOptions} variable
     * @returns {any}
     */
    private resolveNodeId(variable: OpcUaDataItem<any>) {
        if (!variable) {
            throw new Error('No variable specified to resolve nodeid');
        } else if (!this.namespaceArray) {
            throw new Error(`No namespace array read for module ${this.id}`);
        } else if (!variable.namespaceIndex) {
            throw new Error(`namespace index is null in module ${this.id}`);
        }
        this.logger.debug(`[${this.id}] resolveNodeId ${JSON.stringify(variable)}`);
        const nodeIdString = `ns=${this.namespaceArray.indexOf(variable.namespaceIndex)};s=${variable.nodeId}`;
        this.logger.debug(`[${this.id}] resolveNodeId ${JSON.stringify(variable)} -> ${nodeIdString}`);
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
        opcUaDataItem.timestamp = result.serverTimestamp;
        if (!opcUaDataItem.dataType) {
            opcUaDataItem.dataType = DataType[result.value.dataType];
        }
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
                maxRetry: 3
            }
        })
            .on('close', async () => {
                this.logger.info(`[${this.id}] Connection closed by OPC UA server`);
                this.session = null;
                this.emit('disconnected');
            })
            .on('connection_lost', async () => {
                this.logger.info(`[${this.id}] Connection lost to OPC UA server`);
                if (this.subscription) {
                    await this.subscription.terminate();
                }
                if (this.session) {
                    await this.session.close();
                    this.session = null;
                }
                if (this.client) {
                    await this.client.disconnect();
                }
                this.emit('disconnected');
            })
            .on('timed_out_request', () => this.logger.warn(`[${this.id}] timed out request - retrying connection`));
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
