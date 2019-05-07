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

import { Service, ServiceOptions } from './Service';
import { ProcessValue } from './ProcessValue';
import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    DataValue,
    NodeId,
    OPCUAClient,
    Variant
} from 'node-opcua-client';
import {TimestampsToReturn} from 'node-opcua-service-read';
import { catModule, catOpc, catRecipe } from '../../config/logging';
import { EventEmitter } from 'events';
import { OpcUaNodeOptions} from './Interfaces';
import { ServiceState } from './enum';
import {
    ModuleInterface, ServiceInterface, ServiceCommand, ControlEnableInterface,
    ParameterInterface
} from '@p2olab/polaris-interface';
import { timeout } from 'promise-timeout';
import { VariableLogEntry } from '../../logging/archive';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Strategy} from './Strategy';
import {Category} from 'typescript-logging';
import {DataAssemblyOptions} from './DataAssembly';
import {DataType, VariantArrayType} from 'node-opcua';
import * as delay from 'timeout-as-promise';

export interface ModuleOptions {
    id: string;
    opcua_server_url: string;
    hmi_url?: string;
    services: ServiceOptions[];
    process_values: DataAssemblyOptions[];
}

/**
 * Events emitted by [[OpcUaNodeOptions]]
 */
export interface OpcUaNodeEvents {
    /**
     * when OpcUaNodeOptions changes its value
     * @event
     */
    changed: {value: any, timestamp: Date};
}

/**
 * Events emitted by [[Module]]
 */
interface ModuleEvents {
    /**
     * when module successfully connects to PEA
     * @event
     */
    connected: void;
    /**
     * when module is disconnected from PEA
     * @event
    */
    disconnected: void;
    /**
     * when controlEnable of one service changes
     * @event controlEnable
     */
    controlEnable: {service: Service, controlEnable: ControlEnableInterface};
    /**
     * Notify when a service changes its state
     * @event
     */
    stateChanged: {
        timestampPfe: Date,
        timestampModule: Date,
        service: Service,
        state: ServiceState};
    /**
     * Notify when a variable inside a module changes
     * @event
     */
    variableChanged: VariableLogEntry;
    /**
     * whenever a command is executed from the PFE
     * @event
     */
    commandExecuted: {
        service: Service,
        timestampPfe: Date,
        strategy: Strategy,
        command: ServiceCommand,
        parameter: ParameterInterface[]
    };
    /**
     * when one service goes to *completed*
     * @event
     */
    serviceCompleted: Service;
}

type ModuleEmitter = StrictEventEmitter<EventEmitter, ModuleEvents>;

/**
 * Module (PEA) with its services and variables
 *
 * in order to interact with a module, you must first [[connect]] to it
 *
 */
export class Module extends (EventEmitter as { new(): ModuleEmitter }) {

    readonly options: ModuleOptions;
    readonly id: string;
    readonly endpoint: string;
    readonly hmiUrl: string;
    readonly services: Service[];
    readonly variables: ProcessValue[];
    readonly logger: Category;

    // module is protected and can't be deleted by the user
    protected: boolean = false;

    private session: ClientSession;
    private client: OPCUAClient;
    private subscription: ClientSubscription;
    private monitoredItems: Map<NodeId, { monitoredItem: ClientMonitoredItem, emitter: StrictEventEmitter<EventEmitter, OpcUaNodeEvents> }>;
    private namespaceArray: string[];



    constructor(options: ModuleOptions, protectedModule: boolean = false) {
        super();
        this.options = options;
        this.id = options.id;
        this.endpoint = options.opcua_server_url;
        this.protected = protectedModule;

        if (options.services) {
            this.services = options.services.map(serviceOption => new Service(serviceOption, this));
        }
        if (options.process_values) {
            this.variables = options.process_values.map(variableOptions => new ProcessValue(variableOptions, this));
        }
        if (options.hmi_url){
            this.hmiUrl = options.hmi_url;
        }

        this.monitoredItems = new Map<NodeId, { monitoredItem: ClientMonitoredItem, emitter: EventEmitter }>();

        this.logger = catModule;

        this.client = new OPCUAClient({
            endpoint_must_exist: false,
            connectionStrategy: {
                maxRetry: 3
            }
        })
            .on('close', () => {
                catOpc.warn('Closing OPC UA client connection');
                this.session =  null;
                this.emit('disconnected');
            })
            .on('time_out_request', () => catOpc.warn('time out request - retrying connection'));
    }

    /**
     * Opens connection to server and establish session
     * @returns {Promise<void>}
     */
    async connect(): Promise<void> {
        if (this.session) {
            catOpc.debug(`Already connected to module ${this.id}`);
            return Promise.resolve();
        } else {
                catOpc.info(`connect module ${this.id} ${this.endpoint}`);

                await timeout(this.client.connect(this.endpoint), 2000);
                catOpc.info(`module connected ${this.id} ${this.endpoint}`);

                const session = await this.client.createSession();
                catOpc.debug(`session established ${this.id} ${this.endpoint}`);

                const subscription = new ClientSubscription(session, {
                    requestedPublishingInterval: 100,
                    requestedLifetimeCount: 1000,
                    requestedMaxKeepAliveCount: 12,
                    maxNotificationsPerPublish: 10,
                    publishingEnabled: true,
                    priority: 10
                });

                subscription
                    .on('started', () => {
                        catOpc.trace(`subscription started - subscriptionId=${subscription.subscriptionId}`);
                    })
                    .on('terminated', () => {
                        catOpc.trace(`subscription (Id=${subscription.subscriptionId}) terminated`);
                    });

                // read namespace array
                const result: DataValue = await session.readVariableValue('ns=0;i=2255');
                this.namespaceArray = result.value.value;
                this.logger.debug(`[${this.id}] Got namespace array: ${JSON.stringify(this.namespaceArray)}`);

                // store everything
                this.session = session;
                this.subscription = subscription;

                if (this.endpoint == 'opc.tcp://10.6.51.22:4840') {
                    await this.fixReactor();
                }

                // set all services to correct operation mode
                await Promise.all(this.services.map(service => service.setOperationMode()));
                // subscribe to all services
                await this.subscribeToAllServices();

                try {
                    this.subscribeToAllVariables();
                } catch (err) {
                    this.logger.warn('Could not connect to all variables:' + err);
                }
                this.emit('connected');
                return Promise.resolve();

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
    disconnect(): Promise<any> {
        this.services.forEach(s => s.removeAllSubscriptions());
        return new Promise(async (resolve, reject) => {
            if (this.session) {
                this.logger.info(`[${this.id}] Disconnect module`);
                try {
                    await timeout(this.session.close(), 1000);
                    this.session = undefined;
                    await timeout(1000, this.client.disconnect(), 1000);
                    this.client = undefined;
                    this.logger.debug(`[${this.id}] Module disconnected`);
                    this.emit('disconnected');
                    resolve(`Module ${this.id} disconnected`);
                } catch (err) {
                    reject(err);
                }
            } else {
                resolve(`Module ${this.id} already disconnected`);
            }
        });
    }


    /**
     * Listen to OPC UA node and return event listener which is triggered by any value change
     * @param {OpcUaNodeOptions} node
     * @param {number} samplingInterval     OPC UA sampling interval for this subscription in milliseconds
     * @returns {"events".internal.EventEmitter} "changed" event
     */
    listenToOpcUaNode(node: OpcUaNodeOptions, samplingInterval=100): StrictEventEmitter<EventEmitter, OpcUaNodeEvents> {
        const nodeId = this.resolveNodeId(node);
        if (!this.monitoredItems.has(nodeId)) {
            const monitoredItem: ClientMonitoredItem = this.subscription.monitor({
                nodeId,
                attributeId: AttributeIds.Value
            },
                {
                    samplingInterval: samplingInterval,
                    discardOldest: true,
                    queueSize: 10
                }, TimestampsToReturn.Both);

            const emitter: StrictEventEmitter<EventEmitter, OpcUaNodeEvents> = new EventEmitter();
            monitoredItem.on('changed', (dataValue) => {
                catOpc.debug(`Variable Changed (${this.resolveNodeId(node)}) = ${dataValue.value.value.toString()}`);
                emitter.emit('changed', {value: dataValue.value.value, timestamp: dataValue.serverTimestamp});
            });
            this.monitoredItems.set(nodeId, { monitoredItem, emitter });
        }
        return this.monitoredItems.get(nodeId).emitter;
    }

    listenToVariable(dataStructureName: string, variableName: string): StrictEventEmitter<EventEmitter, OpcUaNodeEvents> {
        const dataStructure: ProcessValue = this.variables.find(variable => variable.name === dataStructureName);
        if (!dataStructure) {
            throw new Error(`ProcessValue ${dataStructureName} is not specified for module ${this.id}`);
        } else {
            const variable: OpcUaNodeOptions = dataStructure.communication[variableName];
            return this.listenToOpcUaNode(variable);
        }
    }

    clearListener(node: OpcUaNodeOptions) {
        const nodeId = this.resolveNodeId(node);
        if (this.monitoredItems.has(nodeId)) {
            const { monitoredItem, emitter } = this.monitoredItems.get(nodeId);

            if (monitoredItem) {
                monitoredItem.terminate(() => catOpc.trace(`Listener ${JSON.stringify(nodeId)} terminated`));
            }
            if (emitter) {
                emitter.removeAllListeners();
            }
            this.monitoredItems.delete(nodeId);
        }
    }

    public readVariable(dataStructureName: string, variableName: string) {
        const dataStructure = this.variables.find(variable => variable.name === dataStructureName);
        if (!dataStructure) {
            throw new Error(`Datastructure ${dataStructureName}.${variableName} not found in module ${this.id}`);
        } else {
            const variable = dataStructure.communication[variableName];
            return this.readVariableNode(variable);
        }
    }

    private subscribeToAllVariables() {
        this.variables.forEach((variable: ProcessValue) => {
            if (variable.communication['V'] && variable.communication['V'].node_id != null) {
                this.listenToOpcUaNode(variable.communication['V'], 1000)
                    .on('changed', (data) => {
                        this.logger.debug(`[${this.id}] variable changed: ${variable.name} = ${data.value}`);
                        const entry: VariableLogEntry = {
                            timestampPfe: new Date(),
                            timestampModule: data.timestamp,
                            module: this.id,
                            variable: variable.name,
                            value: data.value
                        };
                        this.emit('variableChanged', entry);
                    });
            } else {
                this.logger.debug(`[${this.id}] OPC UA variable for variable ${variable.name} not defined`);
            }
        });
    }

    private subscribeToAllServices() {
        return Promise.all(this.services.map(async (service) => {
            return (await service.subscribeToService())
                .on('commandExecuted', (data) => {
                    this.emit('commandExecuted', {
                        service: service,
                        timestampPfe: data.timestampPfe,
                        strategy: data.strategy,
                        command: data.command,
                        parameter: data.parameter
                    });
                })
                .on('controlEnable', (controlEnable) => {
                    this.emit('controlEnable', {service, controlEnable} );
                })
                .on('state', ({state, timestamp}) => {
                    this.logger.debug(`[${this.id}] state changed: ${service.name} = ${ServiceState[state]}`);
                    const entry = {
                        timestampPfe: new Date(),
                        timestampModule: timestamp,
                        module: this.id,
                        service: service,
                        state: state
                    };
                    this.emit('stateChanged', entry);
                    if (state === ServiceState.COMPLETED) {
                        this.emit('serviceCompleted', service);
                    }
                });
        }));
    }

    public async readVariableNode(node: OpcUaNodeOptions) {
        const nodeId = this.resolveNodeId(node);
        const result = await this.session.readVariableValue(nodeId);
        catOpc.debug(`Read Variable: ${JSON.stringify(node)} -> ${nodeId} = ${result}`);
        if (result.statusCode != 0) {
            throw new Error(`Could not read ${nodeId.toString()}: ${result.statusCode.description}`);
        }
        return result;
    }

    /** writes value to opc ua node
     *
     * @param {OpcUaNodeOptions} node
     * @param {} value
     * @returns {Promise<any>}
     */
    public async writeNode(node: OpcUaNodeOptions, value: Variant) {
        if (!this.session) {
            throw new Error(`Can not write node since OPC UA connection to module ${this.id} is not established`);
        } else {
            const result = await this.session.writeSingleNode(this.resolveNodeId(node), value);
            this.logger.debug(`[${this.id}] Write result for ${node.node_id}=${value.value} -> ${result.name}`);
            return result;
        }
    }

    /**
     * Get JSON serialisation of module
     *
     * @returns {Promise<ModuleInterface>}
     */
    async json(): Promise<ModuleInterface> {
        return {
            id: this.id,
            endpoint: this.endpoint,
            hmiUrl: this.hmiUrl,
            connected: this.isConnected(),
            services: this.isConnected() ? await this.getServiceStates() : undefined,
            protected: this.protected
        };
    }

    /**
     * is module connected to physical PEA
     * @returns {boolean}
     */
    isConnected(): boolean {
        return !!this.session;
    }

    /**
     * Resolves nodeId of variable from module JSON using the namespace array
     * @param {OpcUaNodeOptions} variable
     * @returns {any}
     */
    private resolveNodeId(variable: OpcUaNodeOptions) {
        if (!variable) {
            throw new Error('No variable specified to resolve nodeid');
        } else if (!this.namespaceArray) {
            throw new Error(`No namespace array read for module ${this.id}`);
        } else if (!variable.namespace_index) {
            throw new Error(`namespace index is null in module ${this.id}`);
        } else {
            catOpc.debug(`resolveNodeId ${JSON.stringify(variable)}`);
            const nodeIdString = `ns=${this.namespaceArray.indexOf(variable.namespace_index)};s=${variable.node_id}`;
            catOpc.debug(`resolveNodeId ${JSON.stringify(variable)} -> ${nodeIdString}`);
            return coerceNodeId(nodeIdString);
        }
    }

    /**
     * Abort all services in module
     */
    abort(): Promise<void[]> {
        const tasks = this.services.map(service => service.execute(ServiceCommand.abort));
        return Promise.all(tasks);
    }

    /**
     * Pause all services in module
     */
    pause(): Promise<void[]> {
        const tasks = this.services.map(service => service.execute(ServiceCommand.pause));
        return Promise.all(tasks);
    }

    /**
     * Resume all services in module
     */
    resume(): Promise<void[]> {
        const tasks = this.services.map(service => service.execute(ServiceCommand.resume));
        return Promise.all(tasks);
    }

    /**
     * Stop all services in module
     */
    stop(): Promise<void[]> {
        const tasks = this.services.map(service => service.execute(ServiceCommand.stop));
        return Promise.all(tasks);
    }

    /**
     * Reset all services in module
     */
    reset(): Promise<void[]> {
        const tasks = this.services.map(service => service.execute(ServiceCommand.reset));
        return Promise.all(tasks);
    }

    /** Fix reactor of ACHEMA demonstrator.
     * Set all opModes from devices to automatic and set senseful default values
     */
    private async fixReactor(){
        const nodeIdsReactor = [
            'ns=3;s="AEM01"."MTP_AnaDrv"."OpMode"',
            'ns=3;s="MFH01"."MTP_BinVlv"."OpMode"',
            'ns=3;s="MFH02"."MTP_BinVlv"."OpMode"',
            'ns=3;s="MFH03"."MTP_BinVlv"."OpMode"'];

        const valuesReactor = [
            ['ns=3;s="Fill_Level_Max"."MTP"."VExt"', 1.5],
            ['ns=3;s="Stir_Level_Min"."MTP"."VExt"', 0.5],
            ['ns=3;s="Stir_Period"."MTP"."VExt"', 0.5],
            ['ns=3;s="Stir_Period"."MTP"."VOp"', 0.5],
            ['ns=3;s="Empty_Level_Tank_Deadband"."MTP"."VExt"', 0.5],
            ['ns=3;s="Empty_Level_Tank_Deadband"."MTP"."VExt"', 0.5],
            ['ns=3;s="Empty_Level_Tank"."MTP"."VExt"', 0.5],
            ['ns=3;s="Empty_Level_Tank"."MTP"."VOp"', 0.5],
            ['ns=3;s="Empty_Vol_Flow"."MTP"."VOp"', 2.5],
            ['ns=3;s="Empty_Vol_Flow"."MTP"."VExt"', 2.5],
        ];

        this.logger.info(`[${this.id}] Fixing nodes in reactor PEA server`);

        // first set to manual
        await Promise.all(nodeIdsReactor.map(nodeId => {
            return this.session.writeSingleNode(
                nodeId,
                {
                    dataType: DataType.UInt32,
                    value: 16,
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                }
            );
        }));
        await delay(200);

        // then to automatic
        await Promise.all(nodeIdsReactor.map(nodeId => {
            return this.session.writeSingleNode(
                nodeId,
                {
                    dataType: DataType.UInt32,
                    value: 64,
                    arrayType: VariantArrayType.Scalar,
                }
            );
        }));

        // give all Parameters nice default values
        await Promise.all(valuesReactor.map(async (item) => {
            return this.session.writeSingleNode(
                item[0],
                {
                    dataType: DataType.Float,
                    value: item[1],
                    arrayType: VariantArrayType.Scalar,
                }
            );
        }));

        this.logger.info(`[${this.id}] Nodes in reactor PEA server fixed`);
    }

}
