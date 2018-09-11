/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {Module} from './Module';
import {Service} from './Service';
import {catRecipe} from '../config/logging';
import {Recipe} from './Recipe';
import {Strategy} from './Interfaces';
import {Parameter} from './Parameter';
import {OperationInterface} from 'pfe-ree-interface/dist/interfaces';
import {ParameterOptions, ServiceCommand} from 'pfe-ree-interface';

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
            this.module = modules[0];
        } else {
            throw new Error('No module specified');
        }

        recipe.modules.add(this.module);
        this.service = this.module.services.find(service => service.name === options.service);
        if (this.service === undefined) {
            throw new Error(`Service ${options.service} (${this.module.id}) not found in modules`);
        }
        if (options.strategy) {
            this.strategy = this.service.strategies.find(strategy => strategy.name === options.strategy);
        } else {
            this.strategy = this.service.strategies.find(strategy => strategy.default === true);
        }
        if (options.command) {
            this.command = options.command;
        } else {
            throw new Error(`"command" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.parameter) {
            this.parameter = options.parameter.map(paramOptions => new Parameter(paramOptions));
        }
    }

    execute() {
        catRecipe.debug(`Perform operation ${this.module.id} ${this.service.name} (Strategy: ${this.strategy ? this.strategy.name : ''}) - ${JSON.stringify(this.parameter)}`);
        return this.service.executeCommand(this.command, this.strategy, this.parameter);
    }

    json(): OperationInterface {
        return {
            module: this.module.id,
            service: this.service.name,
            strategy: this.strategy ? this.strategy.name : undefined,
            command: this.command,
            parameter: this.parameter
        };
    }
}
