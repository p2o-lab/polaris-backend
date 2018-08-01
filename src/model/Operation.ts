import {Module} from './Module';
import {Service} from './Service';
import {catRecipe} from '../config/logging';
import {Recipe} from "./Recipe";

export interface OperationOptions {
    module: string;
    service: string;
    command: string;
    parameter: { [param: string]: any };
}

export class Operation {
    module: Module;
    service: Service;
    command: string;
    parameter: { [param: string]: any };

    constructor(options: OperationOptions, modules: Module[], recipe: Recipe) {
        this.module = modules.find(module => module.id === options.module);
        if (!this.module) {
            throw new Error(`Could not find module ${options.module}`);
        }
        recipe.modules.add(this.module);
        this.service = this.module.services.find(service => service.name === options.service);
        if (!this.service) {
            throw new Error(`Service ${options.service} not found in modules`);
        }
        this.command = options.command;
        this.parameter = options.parameter;
    }

    execute() {
        catRecipe.debug(`perform operation ${this.module.id} ${this.service.name}`);
        if (this.command === 'start') {
            this.service.start(this.parameter);
        } else if (this.command === 'stop') {
            this.service.stop();
        } else if (this.command === 'reset') {
            this.service.stop();
        } else if (this.command === 'complete') {
            this.service.complete();
        } else if (this.command === 'abort') {
            this.service.abort();
        } else {
            throw new Error(`Command ${this.command} can not be interpreted`);
        }

    }

}
