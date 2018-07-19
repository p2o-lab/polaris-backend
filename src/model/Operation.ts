import {Module} from "./Module";
import {Service} from "./Service";

export class Operation {
    module: Module;
    service: Service;
    command: string;
    parameter: any;

    constructor(json, modules: Map<string, Module>) {
        this.module = modules.get(json.module);
        this.service = this.module.services.get(json.service);
        this.command = json.command;
        this.parameter = json.parameter;
    }


}