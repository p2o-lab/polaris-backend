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

import {Service, ServiceOptions} from './Service';
import {ProcessValue} from './ProcessValue';
import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    DataValue,
    OPCUAClient
} from 'node-opcua-client';
import {catModule, catOpc, catRecipe} from '../config/logging';
import {EventEmitter} from 'events';
import {OpcUaNode} from './Interfaces';
import {manager} from './Manager';
import {ServiceState} from './enum';
import {ModuleInterface, ServiceInterface} from 'pfe-ree-interface';
import {promiseTimeout} from '../timeout-promise';

export interface ModuleOptions {
    id: string;
    opcua_server_url: string;
    services: ServiceOptions[];
    process_values: object[];
}

export class Module {
    id: string;
    endpoint: string;
    services: Service[];
    variables: ProcessValue[];

    session: ClientSession;
    private client: OPCUAClient;
    subscription: ClientSubscription;
    private monitoredItems: Map<string, ClientMonitoredItem> = new Map<string, ClientMonitoredItem>();
    private namespaceArray: string[];

    constructor(options: ModuleOptions) {
        this.id = options.id;
        this.endpoint = options.opcua_server_url;

        if (options.services) {
            this.services = options.services.map(serviceOption => new Service(serviceOption, this));
        }
        if (options.process_values) {
            this.variables = options.process_values.map(variableOptions => new ProcessValue(variableOptions));
        }
        this.connect();
    }

    /**
     * Opens connection to server and establish session
     * @returns {Promise<ClientSession>}
     */
    async connect(): Promise<ClientSession> {
        if (this.session) {
            catOpc.debug(`Already connected to module ${this.id}`);
            return this.session;
        } else {
            try {
                catOpc.info(`connect module ${this.id} ${this.endpoint}`);
                const client = new OPCUAClient({
                    endpoint_must_exist: false,
                    connectionStrategy: {
                        maxRetry: 10
                    }
                });

                client.on('backoff', () => catOpc.debug('retrying connection'));

                await promiseTimeout(5000, client.connect(this.endpoint));
                catOpc.debug(`module connected ${this.id} ${this.endpoint}`);

                const session = await client.createSession();
                session.on('session_closed', (statusCode) => {
                    catOpc.warn(`Session of ${this.id} closed by server (statusCode: ${statusCode})`);
                    //this.disconnect();
                });
                catOpc.debug(`session established ${this.id} ${this.endpoint}`);

                const subscription = new ClientSubscription(session, {
                    requestedPublishingInterval: 1000,
                    requestedLifetimeCount: 10,
                    requestedMaxKeepAliveCount: 2,
                    maxNotificationsPerPublish: 10,
                    publishingEnabled: true,
                    priority: 10
                });

                subscription
                    .on('started', () => {
                        catOpc.trace(`subscription started - subscriptionId=${subscription.subscriptionId}`);
                    })
                    // .on("keepalive", () => catOpc.trace("keepalive"))
                    .on('terminated', () => catOpc.trace('subscription (Id=${subscription.subscriptionId}) terminated'));

                // read namespace array
                const result: DataValue = await session.readVariableValue('ns=0;i=2255');
                this.namespaceArray = result.value.value;
                catModule.debug(`Got namespace array for ${this.id}: ${JSON.stringify(this.namespaceArray)}`);

                // store everything
                this.client = client;
                this.session = session;
                this.subscription = subscription;

                // subscribe to all services
                this.subscribeToAllServices();
                manager.eventEmitter.emit('refresh', 'module');

                return this.session;
            } catch (err) {
                catModule.warn(`Could not connect to module ${this.id} on ${this.endpoint}`);
                throw new Error(`Could not connect to module ${this.id} on ${this.endpoint}`);
            }
        }
    }

    async getServiceStates(): Promise<ServiceInterface[]> {
        catRecipe.trace('check services');
        const tasks = this.services.map(service => service.getOverview());
        return Promise.all(tasks);
    }

    /**
     * Close session and disconnect from server
     *
     */
    async disconnect(): Promise<any> {
        if (this.session) {
            catRecipe.info(`Disconnect module ${this.id}`);
            await this.session.close();
            this.session = undefined;
            await this.client.disconnect();
            this.client = undefined;
            manager.eventEmitter.emit('refresh', 'module');
            return 'Disconnected';
        } else {
            return Promise.resolve('Already disconnected');
        }
    }

    /**
     * Listen to OPC UA node and return event listener which is triggered by any value change
     * @param {OpcUaNode} node
     * @returns {"events".internal.EventEmitter} "changed" event
     */
    listenToOpcUaNode(node: OpcUaNode): EventEmitter {
        const nodeId = this.resolveNodeId(node);
        if (!this.monitoredItems.has(nodeId)) {
            const monitoredItem: ClientMonitoredItem = this.subscription.monitor({
                    nodeId,
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval: 1000,
                    discardOldest: true,
                    queueSize: 10
                });

            monitoredItem.emitter = new EventEmitter();
            monitoredItem.on('changed', (dataValue) => {
                catOpc.debug(`Variable Changed (${this.resolveNodeId(node)}) = ${dataValue.value.value.toString()}`);
                monitoredItem.emitter.emit('changed', dataValue.value.value);
            });
            this.monitoredItems.set(nodeId, monitoredItem);
        }
        return this.monitoredItems.get(nodeId).emitter;
    }

    listenToVariable(dataStructureName: string, variableName: string): EventEmitter {
        const dataStructure: ProcessValue = this.variables.find(variable => variable.name === dataStructureName);
        if (!dataStructure) {
            throw new Error(`ProcessValue ${dataStructureName} is not specified for module ${this.id}`);
        } else {
            const variable: OpcUaNode = dataStructure.communication[variableName];
            return this.listenToOpcUaNode(variable);
        }

    }

    clearListener(node: OpcUaNode) {
        const nodeId = this.resolveNodeId(node);
        const monitoredItem = this.monitoredItems.get(nodeId);

        if (monitoredItem) {
            monitoredItem.terminate(() => catOpc.trace(`Listener ${nodeId} terminated`));
        }
    }

    public readVariable(dataStructureName: string, variableName: string) {
        const dataStructure = this.variables.find(variable => variable.name === dataStructureName);
        if (dataStructure) {
            const variable = dataStructure.communication[variableName];
            return this.readVariableNode(variable);
        } else {
            throw new Error(`Datastructure ${dataStructureName} not found in module ${this.id}`);
        }
    }

    private subscribeToAllServices() {
        this.services.forEach((service) => {
            if (service.status === undefined) {
                throw new Error(`OPC UA variable for status of service ${service.name} not defined`);
            }
            this.listenToOpcUaNode(service.status)
                .on('changed', (data) => {
                    catModule.debug(`state changed: ${service.name} = ${ServiceState[data]}`);
                    manager.eventEmitter.emit('refresh', 'module');
                    if (data === ServiceState.COMPLETED || data) {
                        manager.eventEmitter.emit('serviceCompleted', service);
                    }
                });
        });
    }

    public readVariableNode(node: OpcUaNode) {
        const nodeId = this.resolveNodeId(node);
        const result = this.session.readVariableValue(nodeId);
        catOpc.debug(`Read Variable: ${JSON.stringify(node)} -> ${nodeId} = ${result}`);
        return result;
    }

    public writeNode(node: OpcUaNode, value: object) {
        return this.session.writeSingleNode(this.resolveNodeId(node), value);
    }

    /**
     *
     * @returns {Promise<ModuleInterface>}
     */
    async json(): Promise<ModuleInterface> {
        if (this.isConnected()) {
            const serviceStates = await this.getServiceStates();
            console.log('service state', serviceStates);
            return {
                id: this.id,
                endpoint: this.endpoint,
                connected: true,
                services: serviceStates
            };
        } else {
            return {
                id: this.id,
                endpoint: this.endpoint,
                connected: false
            };
        }
    }

    isConnected(): boolean {
        return this.session;
    }

    /**
     * Resolves nodeId of variable from module JSON using the namespace array
     * @param {OpcUaNode} variable
     * @returns {any}
     */
    private resolveNodeId(variable: OpcUaNode) {
        if (this.namespaceArray) {
            const nodeIdString = `ns=${this.namespaceArray.indexOf(variable.namespace_index)};s=${variable.node_id}`;
            catOpc.debug(`nodeIdString ${nodeIdString}`);
            return coerceNodeId(nodeIdString);
        } else {
            throw new Error(`No namespace array read for module ${this.id}`);
        }
    }

    /**
     * Abort all services in module
     */
    abort() {
        const tasks = this.services.map(service => service.abort());
        return Promise.all(tasks);
    }

    /**
     * Pause all services in module
     */
    pause() {
        const tasks = this.services.map(service => service.pause());
        return Promise.all(tasks);
    }

    /**
     * Resume all services in module
     */
    resume() {
        const tasks = this.services.map(service => service.resume());
        return Promise.all(tasks);
    }

    /**
     * Stop all services in module
     */
    stop() {
        const tasks = this.services.map(service => service.stop());
        return Promise.all(tasks);
    }

}
