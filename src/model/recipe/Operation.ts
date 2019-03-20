/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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

import { Module } from '../core/Module';
import { Service } from '../core/Service';
import {catOperation} from '../../config/logging';
import { Recipe } from './Recipe';
import { Strategy } from '../core/Interfaces';
import { Parameter } from './Parameter';
import { OperationInterface, OperationOptions, ServiceCommand } from '@plt/pfe-ree-interface';
import * as delay from 'timeout-as-promise';

/** Operation used in a [[Step]] of a [[Recipe]]
 *
 */
export class Operation {
    module: Module;
    service: Service;
    strategy: Strategy;
    command: ServiceCommand;
    parameters: Parameter[];

    constructor(options: OperationOptions, modules: Module[], recipe: Recipe) {
        if (modules) {
            if (options.module) {
                this.module = modules.find(module => module.id === options.module);
                if (!this.module) {
                    throw new Error(`Could not find module ${options.module}`);
                }
            } else if (modules.length === 1) {
                this.module = modules[0];
            } else {
                throw new Error(`Operation ${JSON.stringify(options)} has no module specified ` +
                `and there is more than one module loaded`);
            }
        } else {
            throw new Error('No modules specified');
        }

        recipe.modules.add(this.module);
        this.service = this.module.services.find(service => service.name === options.service);
        if (this.service === undefined) {
            throw new Error(`Service ${ options.service }(${ this.module.id }) not found in modules`);
        }
        if (options.strategy) {
            this.strategy = this.service.strategies.find(strategy => strategy.name === options.strategy);
        } else {
            this.strategy = this.service.strategies.find(strategy => strategy.default === true);
        }
        if (!this.strategy) {
            throw new Error(`Strategy '${options.strategy}' could not be found in ${ this.service.name }.`);
        }
        if (options.command) {
            this.command = options.command;
        }
        if (options.parameter) {
            this.parameters = options.parameter.map(
                paramOptions => new Parameter(paramOptions, this.service, this.strategy, modules)
            );
        }
    }

    /**
     * Execute Operation at runtime during recipe run
     * @returns {Promise<void>}
     */
    async execute(): Promise<void> {
        catOperation.info(`Perform operation ${ this.module.id } ${ this.service.name } ${ this.command } ` +
            `(Strategy: ${ this.strategy ? this.strategy.name : '' })`);
        return this.service.execute(this.command, this.strategy, this.parameters)
            .catch(async (reason) => {
                catOperation.warn('Could not execute operation. Another try in 500ms');
                await delay(500);
                return this.service.execute(this.command, this.strategy, this.parameters);
            });
    }

    json(): OperationInterface {
        return {
            module: this.module.id,
            service: this.service.name,
            strategy: this.strategy ? this.strategy.name : undefined,
            command: this.command,
            parameter: this.parameters
        };
    }
}
