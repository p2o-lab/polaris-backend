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

import {ParameterOptions, ScopeOptions} from '@plt/pfe-ree-interface';
import {Expression} from 'expr-eval';
import {catParameter} from '../../config/logging';
import {EventEmitter} from 'events';
import {DataType} from 'node-opcua-client';
import {Service} from '../core/Service';
import {OpcUaNode, Strategy} from '../core/Interfaces';
import {Module, OpcUaNodeEvents} from '../core/Module';
import StrictEventEmitter from 'strict-event-emitter-types';
import * as assign from 'assign-deep';
import {ScopeItem} from './ScopeItem';

/**
 * Parameter passed to a service or function block. Can be used also as part of an [[Operation]].
 * Can be static or dynamic. Dynamic parameters can depend on variables of the same or
 * other modules. These can also be continuously updated (specified via continuous property)
 */
export class Parameter {

    /**
     * name of parameter
     */
    name: string;
    variable: string;
    /**
     * Expression to be calculated and used as value.
     * Can contain variables, which can bei declared inside scopeArray or by using correct variable names
     * following this syntax "[module].[processValue].[variable]". module can be ommited if only eone module
     * is loaded. Variable can be omitted. Then "V" is used as variable.
     * "." in the name of modules or processvariables can be escaped with "\\."
     * @example
     * "CIF.Sensoren\.L001.V"
     */
    value: string | number | boolean;
    scopeArray: ScopeItem[];
    /**
     * should parameter continuously be updated
     */
    continuous: boolean;
    private expression: Expression;
    private service: Service;
    private _opcUaDataType: DataType;
    private _opcUaNode: OpcUaNode;

    /**
     *
     * @param {ParameterOptions} parameterOptions
     * @param {Service} service         service where the parameter belongs to
     * @param {Strategy} strategy       strategy to use
     * @param {Module[]} modules        modules where expression can be matched
     */
    constructor(parameterOptions: ParameterOptions, service: Service, strategy?: Strategy, modules?: Module[]) {
        catParameter.trace(`Create Parameter: ${JSON.stringify(parameterOptions)}`);

        this.name = parameterOptions.name;
        this.variable = parameterOptions.variable || 'VExt';
        this.value = parameterOptions.value.toString();
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

        // evaluate scopeArray
        this.scopeArray = (parameterOptions.scope || [])
            .map((item: ScopeOptions) => ScopeItem.extractFromScopeOptions(item, modules));

        // evaluate additional variables from expression
        const extraction = ScopeItem.extractFromExpressionString(this.value, modules);
        this.expression = extraction.expression;
        this.scopeArray.push (...extraction.scopeItems);
    }

    public async getDataType(): Promise<DataType> {
        if (!this._opcUaDataType) {
            const value = await this.service.parent.readVariableNode(this._opcUaNode);
            catParameter.debug(`Datatype for ${this.service.name}.${this.name}.${this.variable} - ${this._opcUaNode.node_id} = ${JSON.stringify(value)}`);
            this._opcUaDataType = value.value ? value.value.dataType : undefined;
            catParameter.debug(`Get datatype for ${this.service.name}.${this.name} = ${this._opcUaDataType}`);
        }
        return this._opcUaDataType;
    }

    public listenToParameter() {
        const eventEmitter: StrictEventEmitter<EventEmitter, OpcUaNodeEvents> = new EventEmitter();
        this.scopeArray.forEach(async (item) => {
            item.module.listenToOpcUaNode(item.variable)
                .on('changed', (data) => eventEmitter.emit('changed', data));
        });
        return eventEmitter;
    }

    /**
     * calculate value from current scopeArray
     * @returns {Promise<any>}
     */
    public async getValue(): Promise<any> {
        if (!this.expression) {
            return undefined;
        }
        // get current variables
        const tasks = await Promise.all(this.scopeArray.map((item) => item.getScopeValue()));
        const scope = assign(...tasks);
        const result = this.expression.evaluate(scope);
        catParameter.info(`Specific parameters: ${this.name} = ${this.value} (${JSON.stringify(scope)}) = ${result}`);
        return result;
    }

    /**
     * calculate value from current scopeArray and write it down to module
     * @returns {Promise<any>}
     */
    async updateValueOnModule(): Promise<any> {
        const value = await this.getValue();
        catParameter.info(`Set parameter "${this.service.name}[${this.variable}]" for ${this.name} = ${value}`);
        return this.service.setParameter(
            this._opcUaNode,
            await this.getDataType(),
            value);
    }
}
