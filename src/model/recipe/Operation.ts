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

import {OperationInterface, OperationOptions, ParameterOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import * as delay from 'timeout-as-promise';
import {catOperation} from '../../logging/logging';
import {BaseService} from '../core/BaseService';
import {Module} from '../core/Module';
import {Procedure} from '../core/Procedure';
import {Service} from '../core/Service';

/** Operation used in a [[Step]] of a [[Recipe]] or [[PetrinetState]]
 *
 */
export class Operation {

    private static MAX_RETRIES: number = 10;
    private static RETRY_DELAY: number = 500;

    public module: Module;
    public service: BaseService;
    public procedure: Procedure;
    public command: ServiceCommand;
    public parameterOptions: ParameterOptions[];
    public readonly emitter: EventEmitter;
    private state: 'executing' | 'completed' | 'aborted';

    constructor(options: OperationOptions, modules: Module[]) {
        if (modules) {
            if (options.module) {
                this.module = modules.find((module) => module.id === options.module);
                if (!this.module) {
                    throw new Error(`Could not find module ${options.module} ` +
                        `in ${JSON.stringify(modules.map((m) => m.id))}`);
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

        this.service = this.module.getService(options.service);
        if (this.service instanceof Service) {
            if (options.strategy) {
                this.procedure = this.service.procedures.find((procedure) => procedure.name === options.strategy);
            } else {
                this.procedure = this.service.getDefaultProcedure();
            }
            if (!this.procedure) {
                throw new Error(`Procedure '${options.strategy}' could not be found in ${this.service.name}.`);
            }
        }
        if (options.command) {
            this.command = options.command;
        }
        if (options.parameter) {
            this.parameterOptions = options.parameter || [];
        }
        this.emitter = new EventEmitter();
    }

    /**
     * Execute Operation at runtime.
     *
     * There are a maximum of Operation.MAX_RETRIES retries of this operation
     * for example if command can not be executed due to commandEnable.
     * Between retries there is a delay of Operation.RETRY_DELAY milliseconds.
     */
    public async execute(): Promise<void> {
        let numberOfTries = 0;
        this.state = 'executing';
        while (this.state === 'executing') {
            catOperation.info(`Perform operation ${ this.module.id }.${ this.service.name }.${ this.command }() ` +
                `(Procedure: ${ this.procedure ? this.procedure.name : '' })`);
            if (this.service instanceof Service && this.procedure) {
                await this.service.setProcedure(this.procedure);
            }
            if (this.parameterOptions) {
                await this.service.setParameters(this.parameterOptions);
            }
            try {
                await this.service.executeCommand(this.command);
                this.state = 'completed';
                this.emitter.emit('changed', 'completed');
                this.emitter.removeAllListeners('changed');
            } catch (err) {
                numberOfTries++;
                catOperation.debug(`Operation could not be executed due to error: : ${err.toString()}`);
                if (numberOfTries === Operation.MAX_RETRIES) {
                    this.state = 'aborted';
                    this.emitter.emit('changed', 'aborted');
                    this.emitter.removeAllListeners('changed');
                    catOperation.warn('Could not execute operation. Stop restarting');
                } else {
                    catOperation.warn(`Could not execute operation. Another try in ${Operation.RETRY_DELAY}ms`);
                    await delay(Operation.RETRY_DELAY);
                }
            }
        }

        catOperation.info(`Operation ${ this.module.id }.${ this.service.name }.${ this.command }() executed`);
    }

    public stop() {
        if (this.state === 'executing') {
            this.state = 'aborted';
        }
    }

    public json(): OperationInterface {
        return {
            module: this.module.id,
            service: this.service.name,
            strategy: this.procedure ? this.procedure.name : undefined,
            command: this.command,
            parameter: this.parameterOptions,
            state: this.state
        };
    }
}
