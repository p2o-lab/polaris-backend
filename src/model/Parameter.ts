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

import { ParameterOptions, ScopeOptions } from 'pfe-ree-interface';
import { Expression, Parser } from 'expr-eval';
import { manager } from './Manager';
import {catRecipe, catService} from '../config/logging';
import { EventEmitter } from 'events';
import { DataType } from 'node-opcua-client';
import { Service } from './Service';
import {OpcUaNode, ServiceParameter, Strategy} from './Interfaces';

export class Parameter {

    name: string;
    variable: string;
    value: any;
    scope: ScopeOptions[];
    continuous: boolean;
    private expression: Expression;
    private service: Service;
    private _opcUaDataType: DataType;
    private _opcUaNode: OpcUaNode;

    constructor(parameterOptions: ParameterOptions, service: Service, strategy?: Strategy) {
        catRecipe.trace(`Create Parameter: ${JSON.stringify(parameterOptions)}`);

        this.name = parameterOptions.name;
        this.variable = parameterOptions.variable || 'VExt';
        this.value = parameterOptions.value;
        this.scope = parameterOptions.scope || [];
        this.continuous = parameterOptions.continuous || false;

        this.service = service;
        const strategyUsed = strategy || service.strategies.find(strategy => strategy.default);
        const parameterList = [].concat(service.parameters, strategyUsed.parameters);
        try {
            this._opcUaNode = parameterList.find(obj => (obj && obj.name === this.name))
                .communication[this.variable];
        } catch {
            throw new Error(`Could not find parameter "${this.name}" in ${service.name}`);
        }

        const parser: Parser = new Parser();
        this.expression = parser.parse(this.value.toString());
    }

    public async getDataType(): Promise<DataType> {
        if (!this._opcUaDataType) {
            const value = await this.service.parent.readVariableNode(this._opcUaNode);
            catService.info(`Datatype for ${this.service.name}.${this.name}.${this.variable} - ${this._opcUaNode.node_id} = ${JSON.stringify(value)}`);
            this._opcUaDataType = value.value ? value.value.dataType : undefined;
            catService.info(`Get datatype for ${this.service.name}.${this.name} = ${this._opcUaDataType}`);
        }
        return this._opcUaDataType;
    }

    public listenToParameter() {
        const eventEmitter = new EventEmitter();
        this.scope.forEach(async (item: ScopeOptions) => {
            const module = manager.modules.find(module => module.id === item.module);
            module.listenToVariable(item.dataAssembly, item.variable)
                .on('refresh', () => eventEmitter.emit('refresh'));
        });
        return eventEmitter;
    }

    /**
     * calculate value from current scope
     * @returns {Promise<any>}
     */
    public async getValue(): Promise<any> {
        // get current variables
        const scope = {};
        const tasks = this.scope.map(async (item: ScopeOptions) => {
            const module = manager.modules.find(module => module.id === item.module);
            return module.readVariable(item.dataAssembly, item.variable)
                    .then(value => scope[item.name] = value.value.value);
        });
        await Promise.all(tasks);
        catService.trace(`Scope: ${JSON.stringify(scope)} <- ${JSON.stringify(this.scope)}`);
        const result = this.expression.evaluate(scope);
        catService.info(`Specific parameters: ${this.name} = ${this.value}(${JSON.stringify(scope)}) = ${result}`);
        return result;
    }

    /**
     * calculate value from current scope and write it down to module
     * @returns {Promise<any>}
     */
    async updateValueOnModule(): Promise<any> {
        const value = await this.getValue();
        catService.debug(`Set parameter "${this.service.name}[${this.variable}]" for ${this.name} = ${value}`);
        return this.service.setParameter(
            this._opcUaNode,
            await this.getDataType(),
            value);
    }
}
