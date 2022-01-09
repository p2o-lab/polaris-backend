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

import {AttributeIds, NodeId, resolveNodeId} from 'node-opcua';
import {
	ClientSession, ClientSubscription, OPCUAClient,
	TimestampsToReturn
} from 'node-opcua-client';
import {catServer} from '../../logging';

export class ExternalTrigger {
	private readonly endpoint: string;
	private readonly nodeId: NodeId;
	private client: OPCUAClient;
	private session!: ClientSession;
	private readonly callback: () => void;

	/**
	 * Construct external trigger.
	 *
	 * @param endpoint  url of OPC UA endpoint (e.g. 'opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer')
	 * @param nodeId    nodeId of node to be monitored as external trigger (e.g. 'ns=3;s=BooleanDataItem')
	 * @param callback  callback to be triggered when node becomes true
	 */
	constructor(endpoint: string, nodeId: string, callback: () => void) {
		if (!endpoint) {
			throw new Error('No Endpoint given');
		}
		if (!nodeId) {
			throw new Error('No NodeId given');
		}
		this.endpoint = endpoint;
		this.nodeId = resolveNodeId(nodeId);
		this.callback = callback;
		this.client = OPCUAClient.create({
			endpointMustExist: false,
			connectionStrategy: {
				maxRetry: 5
			}
		});
	}

	/**
	 * Getter for value of externalTrigger nodeId.
	 *
	 * @return value of externalTrigger nodeId
	 */
	public async getValue(): Promise<boolean> {
		const dataValue = await this.session.read({nodeId: resolveNodeId(this.nodeId)});
		return dataValue.value.value;
	}

	/**
	 * Start monitoring of externalTrigger nodeId
	 */
	public async startMonitoring(): Promise<void> {
		catServer.info('Connect to ' + this.endpoint);
		await this.client.connect(this.endpoint);

		this.session = await this.client.createSession();
		const subscription = ClientSubscription.create(this.session, {
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
			}, TimestampsToReturn.Both);

		monitoredItem.on('changed', (dataValue) => {
			catServer.debug(`External trigger is ${dataValue.value.value}`);
			if (dataValue.value.value) {
				this.callback();
			}
		});
	}

	/**
	 * Disconnect from client
	 */
	public async disconnect(): Promise<void> {
		await this.client.disconnect();
	}
}
