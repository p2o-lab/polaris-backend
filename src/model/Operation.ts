import {Module} from "./Module";
import {Service} from "./Service";

export interface OperationOptions {
    module: string;
    service: string;
    command: string;
    parameter: any;
}

export class Operation {
    module: Module;
    service: Service;
    command: string;
    parameter: any;

    constructor(options: OperationOptions, modules: Map<string, Module>) {
        this.module = modules.get(options.module);
        this.service = this.module.services.get(options.service);
        this.command = options.command;
        this.parameter = options.parameter;
    }

}