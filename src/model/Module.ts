import {Service, ServiceOptions} from "./Service";
import {ClientSession, ClientSubscription, OPCUAClient} from 'node-opcua';
import {catOpc, catRecipe} from "../config/logging";


export interface ModuleOptions {
    name: string;
    endpoint: string;
    services: Map<string, ServiceOptions>;
}

export class Module {
    name: string;
    endpoint: string;
    services: Map<string,Service>;

    client: OPCUAClient;
    session: ClientSession;
    subscription: ClientSubscription;

    constructor(options: ModuleOptions) {
        this.name = options.name;
        this.endpoint = options.endpoint;

        this.services = new Map<string, Service>();
        Object.keys(options.services).forEach((key) => {
            let json_service: ServiceOptions = options.services[key];
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
            .on("keepalive", () => catOpc.debug("keepalive"))
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
}
