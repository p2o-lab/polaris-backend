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
import {recipe_manager} from "./RecipeManager";
import {ServiceState} from "./enum";
import {ModuleInterface, ServiceInterface} from "pfe-interface";
import {promiseTimeout} from "../timeout-promise";

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

                await promiseTimeout(5000, client.connect(this.endpoint));
                catOpc.debug(`module connected ${this.id} ${this.endpoint}`);

                const session = await client.createSession();
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
                recipe_manager.eventEmitter.emit('refresh', 'module');

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
            recipe_manager.eventEmitter.emit('refresh', 'module');
            return 'Disconnected'
        } else {
            return Promise.resolve('Already disconnected');
        }
    }

    resolveNodeId(variable: OpcUaNode) {
        return coerceNodeId(`ns=${this.namespaceArray.indexOf(variable.namespace_index)};s=${variable.node_id}`);
    }

    listenToVariable(dataStructureName: string, variableName: string): EventEmitter {
        const dataStructure: ProcessValue = this.variables.find(variable => variable.name === dataStructureName);
        if (dataStructure) {
            const variable: OpcUaNode = dataStructure.communication[variableName];
            return this.listenToOpcUaNode(variable);
        } else {
            throw new Error('ProcessValue is not specified for module');
        }
    }

    listenToOpcUaNode(node: OpcUaNode): EventEmitter {
        const monitoredItem: ClientMonitoredItem = this.subscription.monitor({
                nodeId: this.resolveNodeId(node),
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
        this.monitoredItems.set(this.resolveNodeId(node), monitoredItem);

        return monitoredItem.emitter;
    }

    private subscribeToAllServices() {
        this.services.forEach((service) => {
            if (service.status === undefined) {
                throw new Error(`OPC UA variable for status of service ${service.name} not defined`);
            }
            this.listenToOpcUaNode(service.status)
                .on('changed', (data) => {
                    catModule.debug(`state changed: ${service.name} = ${ServiceState[data]}`);
                    recipe_manager.eventEmitter.emit('refresh', 'module');
                });
        });
    }

    clearListener(variable: string) {
        const monitoredItem = this.monitoredItems.get(variable);

        if (monitoredItem) {
            monitoredItem.terminate(() => catOpc.trace(`Listener ${variable} terminated`));
        }
    }

    readVariable(dataStructureName: string, variableName: string) {
        const dataStructure = this.variables.find(variable => variable.name === dataStructureName);
        if (dataStructure) {
            const variable = dataStructure.communication[variableName];
            return this.session.readVariableValue(this.resolveNodeId(variable));
        }
    }

    isConnected(): boolean {
        return this.session;
    }

    /**
     *
     * @returns {Promise<ModuleInterface>}
     */
    async json(): Promise<ModuleInterface> {
        if (this.isConnected()) {
            const services = await this.getServiceStates();
            return {
                id: this.id,
                endpoint: this.endpoint,
                connected: true,
                services: services
            };
        } else {
            return {
                id: this.id,
                endpoint: this.endpoint,
                connected: false
            };
        }
    }


}
