import {Service, ServiceOptions} from './Service';
import {Variable} from './Variable';
import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    OPCUAClient
} from 'node-opcua-client';
import {catModule, catOpc, catRecipe} from '../config/logging';
import {EventEmitter} from "events";
import {OpMode, ServiceState} from "./enum";
import {DataValue} from "node-opcua";
import {OpcUaNode} from "./Interfaces";

export interface ModuleOptions {
    id: string;
    endpoint: string;
    services: Map<string, ServiceOptions>;
    variables: Map<string, string>;
}

export class Module {
    id: string;
    endpoint: string;
    services: Service[];
    variables: Variable[];

    client: OPCUAClient;
    session: ClientSession;
    subscription: ClientSubscription;
    monitoredItems: Map<string, ClientMonitoredItem> = new Map<string, ClientMonitoredItem>();
    namespaceArray: string[];

    constructor(options) {
        this.id = options.id;
        this.endpoint = options.opcua_server_url;

        if (options.services) {
            this.services = options.services.map(serviceOption => new Service(serviceOption, this));
        }
        if (options.process_values) {
            this.variables = options.process_values.map(variableOptions => new Variable(variableOptions));
        }
    }

    /**
     * Opens connection to server and establish session
     * @returns {Promise<ClientSession>}
     */
    async connect(): Promise<ClientSession> {
        if (this.client === undefined) {
            try {
                catOpc.info(`connect module ${this.id} ${this.endpoint}`);

                this.client = new OPCUAClient({
                    endpoint_must_exist: false,
                    connectionStrategy: {
                        maxRetry: 10
                    }
                });

                await this.client.connect(this.endpoint);

                catOpc.debug(`module connected ${this.id} ${this.endpoint}`);

                this.session = await this.client.createSession();

                catOpc.debug(`session established ${this.id} ${this.endpoint}`);

                this.subscription = new ClientSubscription(this.session, {
                    requestedPublishingInterval: 1000,
                    requestedLifetimeCount: 10,
                    requestedMaxKeepAliveCount: 2,
                    maxNotificationsPerPublish: 10,
                    publishingEnabled: true,
                    priority: 10
                });

                this.subscription
                    .on('started', () => {
                        catOpc.trace(`subscription started - subscriptionId=${this.subscription.subscriptionId}`);
                    })
                    // .on("keepalive", () => catOpc.trace("keepalive"))
                    .on('terminated', () => catOpc.trace('subscription (Id=${this.subscription.subscriptionId}) terminated'));

                // read namespace array
                const result: DataValue = await this.session.readVariableValue('ns=0;i=2255');
                this.namespaceArray = result.value.value;
                catModule.debug(`Got namespace array for ${this.id}: ${JSON.stringify(this.namespaceArray)}`);
                return Promise.resolve(this.session);
            } catch (err) {
                catModule.warn(`Could not connect to module ${this.id} on ${this.endpoint}`);
                return Promise.reject(`Could not connect to module ${this.id} on ${this.endpoint}`);
            }
        } else {
            catOpc.debug(`Already connected to module ${this.id}`);
            return Promise.resolve(this.session);
        }
    }

    async getServiceStates(): Promise<object[]> {
        catRecipe.trace('check services');
        const tasks: any[] = [];
        this.services.forEach((service) => {
            tasks.push(service.getOverview()
                .then((result) => Promise.resolve(
                    {service: service.name, opMode: OpMode[result.opMode], state: ServiceState[result.status]}
                    )
                )
            );
        });
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

            return this.client.disconnect();
        } else {
            return Promise.resolve('Already disconnected');
        }
    }

    resolveNodeId(variable: OpcUaNode) {
        return coerceNodeId(`ns=${this.namespaceArray.indexOf(variable.namespace_index)};s=${variable.node_id}`);
    }

    listenToVariable(dataStructureName: string, variableName: string): EventEmitter {
        const dataStructure = this.variables.find(variable => variable.name === dataStructureName);
        if (dataStructure) {
            const variable = dataStructure.communication[variableName];
            const monitoredItem: ClientMonitoredItem = this.subscription.monitor({
                    nodeId: this.resolveNodeId(variable),
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval: 1000,
                    discardOldest: true,
                    queueSize: 10
                });

            monitoredItem.emitter = new EventEmitter();
            monitoredItem.on('changed', (dataValue) => {
                catOpc.debug(`Variable Changed (${dataStructureName}) = ${dataValue.value.value.toString()}`);
                monitoredItem.emitter.emit('changed', dataValue.value.value);
            });
            this.monitoredItems.set(dataStructureName, monitoredItem);

            return monitoredItem.emitter;
        } else {
            throw new Error('Variable is not specified for module');
        }
    }

    clearListener(variable: string) {
        const monitoredItem = this.monitoredItems.get(variable);

        if (monitoredItem) {
            monitoredItem.terminate((err => catOpc.trace(`Listener ${variable} terminated`)));
        }
    }


    readVariable(dataStructureName: string, variableName: string) {
        const dataStructure = this.variables.find(variable => variable.name === dataStructureName);
        if (dataStructure) {
            const variable = dataStructure.communication[variableName];
            return this.session.readVariableValue(this.resolveNodeId(variable));
        }
    }

    json() {
        return new Promise(async (resolve, reject) => {
            if (this.session) {
                const services = await this.getServiceStates();
                resolve({
                    id: this.id,
                    endpoint: this.endpoint,
                    connected: true,
                    services: services
                });
            } else {
                resolve({
                    id: this.id,
                    endpoint: this.endpoint,
                    connected: false
                });
            }
        });

    }
}
