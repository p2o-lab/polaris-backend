/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import { series } from 'async';
import { post } from 'request';
import {AttributeIds, ClientSession, ClientSubscription, NodeId, OPCUAClient, resolveNodeId} from 'node-opcua';
import { catOpc } from '../config/logging';
import {manager} from '../model/Manager';

export class ExternalTrigger {
    private endpoint: string;
    private nodeId: NodeId;
    private client: OPCUAClient;
    private session: ClientSession;

    /**
     * Construct external trigger.
     *
     * @param endpoint  url of OPC UA endpoint (e.g. 'opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer')
     * @param nodeId    nodeId of node to be monitored as external trigger (e.g. 'ns=3;s=BooleanDataItem')
     */
    constructor(endpoint: string, nodeId: string) {
        if (!endpoint)
            throw new Error('No Endpoint given');
        if (!nodeId)
            throw new Error('No nodeId given');
        this.endpoint = endpoint;
        this.nodeId = resolveNodeId(nodeId);
        this.client = new OPCUAClient({
            endpoint_must_exist: false,
            connectionStrategy: {
                maxRetry: 5
            }
        });
    }

    public async getValue(): Promise<boolean> {
        const dataValue = await this.session.readVariableValue(this.nodeId);
        console.log(dataValue.value.value);
        return dataValue.value.value;
    }

    public async startMonitoring() {
        catOpc.info('Connect to ' + this.endpoint);
        await this.client.connect(this.endpoint);

        this.session = await this.client.createSession();
        const subscription = new ClientSubscription(this.session, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 10,
            requestedMaxKeepAliveCount: 2,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });

        // install monitored item
        const monitoredItem = await subscription.monitor({
                nodeId: this.nodeId,
                attributeId: AttributeIds.Value
            },
            {
                samplingInterval: 100,
                discardOldest: true,
                queueSize: 10
            });

        monitoredItem.on('changed', (dataValue) => {
            catOpc.info(`flag is ${dataValue.value.value}`);
            if (dataValue.value.value) {
                manager.player.start();
            }
        });
    }
}
