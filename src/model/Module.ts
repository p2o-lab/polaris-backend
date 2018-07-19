import {Service} from "./Service";

export interface IModule {
    name: string;
    endpoint: string;
    services: Map<string,Service>;
}

export class Module {
    constructor(json: IModule) {
        this.name = json.name;
        this.endpoint = json.endpoint;

        this.services = new Map<string, Service>();
        Object.keys(json.services).forEach( (key) => {
            let json_service: Service = json.services[key];
            this.services.set(key, new Service(json_service));

        });
    }



    name: string;
    endpoint: string;

    services: Map<string,Service>;
}
