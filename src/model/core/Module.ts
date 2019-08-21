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

import {
    ControlEnableInterface,
    ModuleInterface,
    ModuleOptions,
    OpcUaNodeOptions,
    OpModeInterface,
    ParameterInterface,
    ServiceCommand,
    ServiceInterface
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {DataType, VariantArrayType} from 'node-opcua';
import {
    AttributeIds,
    ClientMonitoredItemBase,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    DataValue,
    NodeId,
    OPCUAClient,
    Variant
} from 'node-opcua-client';
import {TimestampsToReturn} from 'node-opcua-service-read';
import {timeout} from 'promise-timeout';
import StrictEventEmitter from 'strict-event-emitter-types';
import * as delay from 'timeout-as-promise';
import {Category} from 'typescript-logging';
import {catModule} from '../../config/logging';
import {VariableLogEntry} from '../../logging/archive';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {OpcUaDataItem} from '../dataAssembly/DataItem';
import {ServiceState} from './enum';
import {Service} from './Service';
import {Strategy} from './Strategy';

/**
 * Events emitted by [[OpcUaNodeOptions]]
 */
export interface OpcUaNodeEvents {
    /**
     * when OpcUaNodeOptions changes its value
     * @event changed
     */
    changed: { value: any, timestamp: Date };
}

/**
 * Events emitted by [[Module]]
 */
interface ModuleEvents {
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
    /**
     * when controlEnable of one service changes
     * @event controlEnable
     */
    controlEnable: { service: Service, controlEnable: ControlEnableInterface };
    /**
     * Notify when a service changes its state
     * @event stateChanged
     */
    stateChanged: {
        timestampPfe: Date,
        timestampModule: Date,
        service: Service,
        state: ServiceState
    };
    /**
     * Notify when a service changes its opMode
     * @event opModeChanged
     */
    opModeChanged: {
        service: Service,
        opMode: OpModeInterface
    };
    /**
     * Notify when a variable inside a module changes
     * @event variableChanged
     */
    variableChanged: VariableLogEntry;

    /**
     * Notify when
     * @event parameterChanged
     */
    parameterChanged: {
        timestampPfe: Date,
        timestampModule: Date,
        service: string,
        strategy: string;
        parameter: string;
        value: any;
        unit: string;
    };

    /**
     * whenever a command is executed from the POL
     * @event commandExecuted
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
     * @event serviceCompleted
     */
    serviceCompleted: Service;
}

type ModuleEmitter = StrictEventEmitter<EventEmitter, ModuleEvents>;

type OpcUaNodeEmitter = StrictEventEmitter<EventEmitter, OpcUaNodeEvents>;

/**
 * Module (PEA) with its services and variables
 *
 * in order to interact with a module, you must first [[connect]] to it
 *
 */
export class Module extends (EventEmitter as new() => ModuleEmitter) {

    public readonly options: ModuleOptions;
    public readonly id: string;
    public readonly endpoint: string;
    public readonly hmiUrl: string;
    public readonly services: Service[];
    public readonly variables: DataAssembly[];
    public readonly logger: Category;

    // module is protected and can't be deleted by the user
    public protected: boolean = false;

    private session: ClientSession;
    private client: OPCUAClient;
    private subscription: ClientSubscription;
    private monitoredItems: Map<NodeId, OpcUaNodeEmitter>;
    private namespaceArray: string[];

    constructor(options: ModuleOptions, protectedModule: boolean = false) {
        super();
        this.options = options;
        this.id = options.id;
        this.endpoint = options.opcua_server_url;
        this.protected = protectedModule;

        if (options.services) {
            this.services = options.services.map((serviceOption) => new Service(serviceOption, this));
        }
        if (options.process_values) {
            this.variables = options.process_values
                .map((variableOptions) => DataAssemblyFactory.create(variableOptions, this));
        }
        this.hmiUrl = options.hmi_url;

        this.monitoredItems = new Map<NodeId, EventEmitter>();

        this.logger = catModule;

        this.client = OPCUAClient.create({
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

    /**
     * Opens connection to server and establish session
     *
     * Subscribe to all important variables
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
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

            const session = await this.client.createSession();
            this.logger.debug(`[${this.id}] session established`);

            const subscription = ClientSubscription.create(session, {
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

            // read namespace array
            const result: DataValue = await session.readVariableValue('ns=0;i=2255');
            this.namespaceArray = result.value.value;
            this.logger.debug(`[${this.id}] Got namespace array: ${JSON.stringify(this.namespaceArray)}`);

            // store everything
            this.session = session;
            this.subscription = subscription;

            if (this.endpoint === 'opc.tcp://10.6.51.22:4840') {
                await this.fixReactor();
            }

            await this.subscribeToAllServices()
                .then(() => this.logger.debug('subscribed to all services'))
            //.catch((err) => this.logger.warn('Could not connect to all services:' + err));
            await this.subscribeToAllVariables()
                .then(() => this.logger.debug('subscribed to all variables'))
            //.catch((err) => this.logger.warn('Could not connect to all variables:' + err));

            this.logger.info(`[${this.id}] Successfully connected with ${this.monitoredItems.size} active subscriptions`);
            this.emit('connected');
        }
    }

    public async getServiceStates(): Promise<ServiceInterface[]> {
        this.logger.trace(`[${this.id}] check service states`);
        const tasks = this.services.map((service) => service.getOverview());
        return Promise.all(tasks);
    }

    /**
     * Close session and disconnect from server of module
     *
     */
    public async disconnect(): Promise<void> {
        this.logger.info(`[${this.id}] Disconnect module`);
        this.services.forEach((s) => s.eventEmitter.removeAllListeners());
        if (this.subscription) {
            await this.subscription.terminate();
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
     * Listen to OPC UA node and return event listener which is triggered by any value change
     * @param {OpcUaNodeOptions} node
     * @param {number} samplingInterval     OPC UA sampling interval for this subscription in milliseconds
     * @returns {"events".internal.EventEmitter} "changed" event
     */
    public listenToOpcUaNode(node: OpcUaDataItem<any>, samplingInterval = 100): OpcUaNodeEmitter {
        const nodeId = this.resolveNodeId(node);
        if (!this.monitoredItems.has(nodeId)) {
            const emitter: OpcUaNodeEmitter = new EventEmitter();
            this.monitoredItems.set(nodeId, emitter);
            this.subscription.monitor({
                    nodeId,
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval,
                    discardOldest: true,
                    queueSize: 1
                }, TimestampsToReturn.Both)
                .then((monitoredItem: ClientMonitoredItemBase) => monitoredItem.on('changed', (dataValue) => {
                    this.logger.debug(`[${this.id}] Variable Changed (${nodeId}) ` +
                        `= ${dataValue.value.value.toString()}`);
                    node.value = dataValue.value.value;
                    node.timestamp = dataValue.serverTimestamp;
                    emitter.emit('changed', {value: dataValue.value.value, timestamp: dataValue.serverTimestamp});
                }));
        }
        return this.monitoredItems.get(nodeId);
    }

    public listenToVariable(dataStructureName: string, variableName: string): OpcUaNodeEmitter {
        const dataStructure: DataAssembly = this.variables.find((variable) => variable.name === dataStructureName);
        if (!dataStructure) {
            throw new Error(`ProcessValue ${dataStructureName} is not specified for module ${this.id}`);
        }
        const emitter: EventEmitter = new EventEmitter();
        dataStructure.on(variableName, (data) => emitter.emit('changed', data));
        return emitter;
    }

    public async readVariableNode(node: OpcUaDataItem<any>) {
        if (!this.isConnected()) {
            throw new Error(`Module ${this.id} not connected while trying to read variable ${JSON.stringify(node)}`);
        }
        const nodeId = this.resolveNodeId(node);
        const result = await this.session.readVariableValue(nodeId);
        this.logger.debug(`[${this.id}] Read Variable: ${JSON.stringify(node)} -> ${nodeId} = ${result}`);
        if (result.statusCode.value !== 0) {
            throw new Error(`Could not read ${nodeId.toString()}: ${result.statusCode.description}`);
        }
        node.value = result.value.value;
        node.timestamp = result.serverTimestamp;
        return result;
    }

    /** writes value to opc ua node
     *
     * @param {OpcUaNodeOptions} node
     * @param {} value
     * @returns {Promise<any>}
     */
    public async writeNode(node: OpcUaDataItem<any>, value: number | string) {
        if (!this.session) {
            throw new Error(`Can not write node since OPC UA connection to module ${this.id} is not established`);
        } else {
            if (!node.dataType) {
                const valueReadback = await this.readVariableNode(node);
                node.dataType = DataType[valueReadback.value.dataType];
            }
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
     * Get JSON serialisation of module
     *
     * @returns {Promise<ModuleInterface>}
     */
    public async json(): Promise<ModuleInterface> {
        return {
            id: this.id,
            endpoint: this.endpoint,
            hmiUrl: this.hmiUrl,
            connected: this.isConnected(),
            services: this.isConnected() ? await this.getServiceStates() : undefined,
            process_values: [],
            protected: this.protected
        };
    }

    /**
     * is module connected to physical PEA
     * @returns {boolean}
     */
    public isConnected(): boolean {
        return !!this.session;
    }

    /**
     * Abort all services in module
     */
    public abort(): Promise<void[]> {
        this.logger.info(`[${this.id}] Abort all services`);
        const tasks = this.services.map((service) => service.execute(ServiceCommand.abort));
        return Promise.all(tasks);
    }

    /**
     * Pause all services in module which are currently paused
     */
    public pause(): Promise<void[]> {
        this.logger.info(`[${this.id}] Pause all running services`);
        const tasks = this.services.map(async (service) => {
            if (service.state === ServiceState.EXECUTE) {
                return service.execute(ServiceCommand.pause);
            }
        });
        return Promise.all(tasks);
    }

    /**
     * Resume all services in module which are currently paused
     */
    public resume(): Promise<void[]> {
        this.logger.info(`[${this.id}] Resume all paused services`);
        const tasks = this.services.map(async (service) => {
            if (service.state === ServiceState.PAUSED) {
                return service.execute(ServiceCommand.resume);
            }
        });
        return Promise.all(tasks);
    }

    /**
     * Stop all services in module
     */
    public stop(): Promise<void[]> {
        this.logger.info(`[${this.id}] Stop all non-idle services`);
        const tasks = this.services.map((service) => {
            if (service.state !== ServiceState.IDLE) {
                return service.execute(ServiceCommand.stop);
            }
        });
        return Promise.all(tasks);
    }

    /**
     * Reset all services in module
     */
    public reset(): Promise<void[]> {
        this.logger.info(`[${this.id}] Reset all services`);
        const tasks = this.services.map((service) => service.execute(ServiceCommand.reset));
        return Promise.all(tasks);
    }

    private subscribeToAllVariables(): Promise<DataAssembly[]> {
        return Promise.all(
            this.variables.map((variable: DataAssembly) => {
                catModule.info(`[${this.id}] subscribe to process variable ${variable.name}`);
                variable.on('V', (data) => {
                    this.logger.info(`[${this.id}] variable changed: ${variable.name} = ` +
                        `${data.value} ${variable.getUnit()}`);
                    const entry: VariableLogEntry = {
                        timestampPfe: new Date(),
                        timestampModule: data.timestamp,
                        module: this.id,
                        variable: variable.name,
                        value: data.value,
                        unit: variable.getUnit()
                    };
                    this.emit('variableChanged', entry);
                });
                return variable.subscribe(1000);
            })
        );
    }

    private subscribeToAllServices() {
        return Promise.all(this.services.map(async (service) => {
            return (await service.subscribeToService())
                .on('commandExecuted', (data) => {
                    this.emit('commandExecuted', {
                        service,
                        timestampPfe: data.timestamp,
                        strategy: data.strategy,
                        command: data.command,
                        parameter: data.parameter
                    });
                })
                .on('controlEnable', (controlEnable: ControlEnableInterface) => {
                    this.emit('controlEnable', {service, controlEnable});
                })
                .on('state', ({state, timestamp}) => {
                    this.logger.debug(`[${this.id}] state changed: ${service.name} = ${ServiceState[state]}`);
                    const entry = {
                        timestampPfe: new Date(),
                        timestampModule: timestamp,
                        service,
                        state
                    };
                    this.emit('stateChanged', entry);
                    if (state === ServiceState.COMPLETED) {
                        this.emit('serviceCompleted', service);
                    }
                })
                .on('opMode', (opMode: OpModeInterface) => {
                    this.logger.debug(`[${this.id}] opMode changed: ${service.name} = ${JSON.stringify(opMode)}`);
                    const entry = {
                        service,
                        opMode
                    };
                    this.emit('opModeChanged', entry);
                })
                .on('variableChanged', (data) => {
                    this.logger.debug(`[${this.id}] service variable changed: ` +
                        `${data.strategy.name}.${data.parameter} = ${data.value}`);
                    const entry = {
                        timestampPfe: new Date(),
                        timestampModule: new Date(),
                        module: this.id,
                        variable: `${service.name}.${data.strategy.name}.${data.parameter}`,
                        value: data.value,
                        unit: data.unit
                    };
                    this.emit('variableChanged', entry);
                }).on('parameterChanged', (data) => {
                    this.logger.debug(`[${this.id}] parameter changed: ` +
                        `${data.strategy.name}.${data.parameter} = ${data.value}`);
                    const entry = {
                        timestampPfe: new Date(),
                        timestampModule: new Date(),
                        module: this.id,
                        service: service.name,
                        strategy: data.strategy.id,
                        parameter: data.parameter,
                        value: data.value,
                        unit: data.unit
                    };
                    this.emit('parameterChanged', entry);
                });
        }));
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

    /** Fix reactor of ACHEMA demonstrator.
     * Set all opModes from devices to automatic and set senseful default values
     */
    private async fixReactor() {
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
        await Promise.all(nodeIdsReactor.map((nodeId) => {
            return this.session.writeSingleNode(
                nodeId,
                Variant.coerce({
                    dataType: DataType.UInt32,
                    value: 16,
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                })
            );
        }));
        await delay(200);

        // then to automatic
        await Promise.all(nodeIdsReactor.map((nodeId) => {
            return this.session.writeSingleNode(
                nodeId,
                Variant.coerce({
                    dataType: DataType.UInt32,
                    value: 64,
                    arrayType: VariantArrayType.Scalar,
                })
            );
        }));

        // give all Parameters nice default values
        await Promise.all(valuesReactor.map(async (item) => {
            return this.session.writeSingleNode(
                item[0],
                Variant.coerce({
                    dataType: DataType.Float,
                    value: item[1],
                    arrayType: VariantArrayType.Scalar,
                })
            );
        }));

        this.logger.info(`[${this.id}] Nodes in reactor PEA server fixed`);
    }

}
