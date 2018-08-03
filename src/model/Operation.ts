import {Module} from './Module';
import {Service} from './Service';
import {catRecipe} from '../config/logging';
import {Recipe} from "./Recipe";
import {Parameter, Strategy} from "./Interfaces";

export interface OperationOptions {
    module: string;
    service: string;
    strategy: string;
    command: string;
    parameter: Parameter[];
}

export class Operation {
    module: Module;
    service: Service;
    strategy: Strategy;
    command: string;
    parameter: Parameter[];

    constructor(options: OperationOptions, modules: Module[], recipe: Recipe) {
        this.module = modules.find(module => module.id === options.module);
        if (!this.module) {
            throw new Error(`Could not find module ${options.module}`);
        }
        recipe.modules.add(this.module);
        this.service = this.module.services.find(service => service.name === options.service);
        if (this.service == undefined) {
            throw new Error(`Service ${options.service} not found in modules`);
        }
        this.strategy = this.service.strategies.find(strategy => strategy.name === options.strategy);
        this.command = options.command;
        this.parameter = options.parameter;
    }

    execute() {
        catRecipe.debug(`Perform operation ${this.module.id} ${this.service.name}`);
        if (this.command === 'start') {
            this.service.start(this.strategy, this.parameter);
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
