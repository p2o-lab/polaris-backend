import {Service, ServiceOptions} from './Service';
import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    OPCUAClient
} from 'node-opcua-client';
import {catOpc, catRecipe} from '../config/logging';
import {EventEmitter} from "events";
import {ServiceState} from "./enum";

export interface ModuleOptions {
    name: string;
    endpoint: string;
    services: Map<string, ServiceOptions>;
    variables: Map<string, string>;
}

export class Module {
    name: string;
    endpoint: string;
    services: Map<string, Service>;
    variables: Map<string, string>;

    client: OPCUAClient;
    session: ClientSession;
    subscription: ClientSubscription;
    monitoredItems: Map<string, ClientMonitoredItem> = new Map<string, ClientMonitoredItem>();

    constructor(options: ModuleOptions) {
        this.name = options.name;
        this.endpoint = options.endpoint;
        this.variables = new Map<string, string>();
        Object.keys(options.variables).forEach((key) => {
            this.variables.set(key, options.variables[key]);
        });
        this.services = new Map<string, Service>();
        Object.keys(options.services).forEach((key) => {
            const serviceOptions: ServiceOptions = options.services[key];

            this.services.set(key, new Service(serviceOptions, this));
        });
    }

    /**
     * Opens connection to server and establish session
     * @returns {Promise<ClientSession>}
     */
    async connect(): Promise<ClientSession> {
        catOpc.info(`connect module ${this.name} ${this.endpoint}`);

        this.client = new OPCUAClient({
            endpoint_must_exist: false,
            connectionStrategy: {
                maxRetry: 10
            }
        });

        await this.client.connect(this.endpoint);

        catOpc.trace(`module connected ${this.name} ${this.endpoint}`);

        this.session = await this.client.createSession();

        catOpc.trace(`session established ${this.name} ${this.endpoint}`);

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

        return this.session;
    }

    async getServiceStates(): Promise<any[]> {
        catRecipe.trace('check services');
        const tasks: any[] = [];
        this.services.forEach((service) => {
            tasks.push(service.getState()
                .then((state: ServiceState) => Promise.resolve({service: service.name, state: ServiceState[state]})));
        });
        return Promise.all(tasks);
    }

    /**
     * Close session and disconnect from server
     *
     */
    async disconnect(): Promise<any> {
        catRecipe.info(`Disconnect module ${this.name}`);
        await this.session.close();

        return this.client.disconnect();
    }

    listenToVariable(variable: string): EventEmitter {
        if (this.variables.has(variable)) {
            const monitoredItem: ClientMonitoredItem = this.subscription.monitor({
                    nodeId: coerceNodeId(this.variables.get(variable)),
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval: 1000,
                    discardOldest: true,
                    queueSize: 10
                });

            monitoredItem.emitter = new EventEmitter();
            monitoredItem.on('changed', (dataValue) => {
                catOpc.debug(`Variable Changed (${variable}) = ${dataValue.value.value.toString()}`);
                monitoredItem.emitter.emit('changed', dataValue.value.value);
            });
            this.monitoredItems.set(variable, monitoredItem);

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

    readVariable(variable: string) {
        return this.session.readVariableValue(coerceNodeId(this.variables.get(variable)));
    }
}
