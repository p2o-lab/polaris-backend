import {Service, ServiceOptions} from "./Service";
import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    OPCUAClient
} from 'node-opcua-client';
import {catOpc, catRecipe} from "../config/logging";

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
            const json_service: ServiceOptions = options.services[key];

            this.services.set(key, new Service(json_service, this));
        });
    }

    /**
     * Opens connection to server and establish session
     * @returns {Promise<>}
     */
    async connect() {
        catRecipe.info(`connect module ${this.name} ${this.endpoint}`);

        this.client = new OPCUAClient({
            endpoint_must_exist: false
        });

        await this.client.connect(this.endpoint);

        this.session = await this.client.createSession();

        this.subscription = new ClientSubscription(this.session, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 10,
            requestedMaxKeepAliveCount: 2,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });

        this.subscription
            .on("started", () => catOpc.debug(`subscription started - subscriptionId=${this.subscription.subscriptionId}`))
            //.on("keepalive", () => catOpc.trace("keepalive"))
            .on("terminated", () => catOpc.debug("subscription terminated"));

        return this.session;
    }



    async check_services_state() {
        catRecipe.debug("check services");
        let services = [];
        this.services.forEach(service => {
            services.push(service.getState())
        });
        return Promise.all(services);
    }

    /**
     * Close session and disconnect from server
     *
     */
    async disconnect() {
        catRecipe.info(`Disconnect module ${this.name}`);
        await this.session.close();

        return this.client.disconnect();
    }

    listenToVariable(variable: string, callback) {
        if (this.variables.has(variable)) {
            const monitoredItem = this.subscription.monitor({
                    nodeId: coerceNodeId(this.variables.get(variable)),
                    attributeId: AttributeIds.Value
                },
                {
                    samplingInterval: 1000,
                    discardOldest: true,
                    queueSize: 10
                });
            monitoredItem.on("changed", (dataValue) => {
                catOpc.debug(`Variable Changed (${variable}) = ${dataValue.value.value.toString()}`);
                callback(dataValue.value.value);
            });
            this.monitoredItems.set(variable, monitoredItem);
        } else {
            return new Error("Variable is not specified for module");
        }
    }

    clearListener(variable: string) {
        let monitoredItem = this.monitoredItems.get(variable);

        if (monitoredItem) {
            monitoredItem.terminate((err => catOpc.trace(`Listener ${variable} terminated`)));
        }
    }

    readVariable(variable: string) {
        return this.session.readVariableValue(coerceNodeId(this.variables.get(variable)));
    }
}
