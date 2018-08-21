import {Module} from './Module';
import {Service} from './Service';
import {catRecipe} from '../config/logging';
import {Recipe} from "./Recipe";
import {Strategy} from "./Interfaces";
import {ServiceCommand} from "pfe-ree-interface";
import {Parameter, ParameterOptions} from "./Parameter";

export interface OperationOptions {
    // module id (can be omitted if only one module is registered)
    module?: string;
    // service name
    service: string;
    // strategy can be omitted; then default strategy is chosen
    strategy?: string;
    // command name
    command: ServiceCommand;
    // optional parameters for start or restart
    parameter?: ParameterOptions[];
}

export class Operation {
    module: Module;
    service: Service;
    strategy: Strategy;
    command: ServiceCommand;
    parameter: Parameter[];

    constructor(options: OperationOptions, modules: Module[], recipe: Recipe) {
        if (options.module) {
            this.module = modules.find(module => module.id === options.module);
            if (!this.module) {
                throw new Error(`Could not find module ${options.module}`);
            }
        } else if (modules.length === 1) {
            this.module == modules[0];
        } else {
            throw new Error('No module specified');
        }

        recipe.modules.add(this.module);
        this.service = this.module.services.find(service => service.name === options.service);
        if (this.service == undefined) {
            throw new Error(`Service ${options.service} (${this.module.id}) not found in modules`);
        }
        if (options.strategy) {
            this.strategy = this.service.strategies.find(strategy => strategy.name === options.strategy);
        } else {
            this.strategy = this.service.strategies.find(strategy => strategy.default === true);
        }
        if (options.command){
            this.command = options.command;
        } else {
            throw new Error(`"command" property is missing in ${JSON.stringify(options)}`);
        }
        this.parameter = options.parameter;
    }

    execute() {
        catRecipe.debug(`Perform operation ${this.module.id} ${this.service.name}`);
        return this.service.executeCommand(this.command, this.strategy, this.parameter);
    }

    json() {
        return {
            module: this.module.id,
            service: this.service.name,
            strategy: this.strategy ? this.strategy.name : undefined,
            command: this.command,
            parameter: this.parameter
        }
    }
}
