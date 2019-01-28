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
import {Expression, Parser} from 'expr-eval';
import {catRecipe, catService} from '../../config/logging';
import {EventEmitter} from 'events';
import {DataType} from 'node-opcua-client';
import {Service} from '../core/Service';
import {OpcUaNode, Strategy} from '../core/Interfaces';
import {Module, OpcUaNodeEvents} from '../core/Module';
import StrictEventEmitter from 'strict-event-emitter-types';
import {ProcessValue} from '../core/ProcessValue';

/**
 * Parameter of an [[Operation]]. Can be static or dynamic. Dynamic parameters can depend on variables of the same or
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
     * Can contain variables, which can bei declared inside scope or by using correct variable names
     * following this syntax "[module].[processValue].[variable]". module can be ommited if only eone module
     * is loaded. Variable can be omitted. Then "V" is used as variable.
     * "." in the name of modules or processvariables can be escaped with "\\."
     * @example
     * "CIF.Sensoren\.L001.V"
     */
    value: string | number | boolean;
    scope: ScopeOptions[];
    /**
     * should parameter continuously be updated
     */
    continuous: boolean;
    private expression: Expression;
    private service: Service;
    private _opcUaDataType: DataType;
    private _opcUaNode: OpcUaNode;
    private modules: Module[];

    /**
     *
     * @param {ParameterOptions} parameterOptions
     * @param {Service} service
     * @param {Strategy} strategy       strategy to use
     * @param {Module[]} modules        modules where expression can be matched
     */
    constructor(parameterOptions: ParameterOptions, service: Service, strategy?: Strategy, modules?: Module[]) {
        catRecipe.trace(`Create Parameter: ${JSON.stringify(parameterOptions)}`);

        this.name = parameterOptions.name;
        this.variable = parameterOptions.variable || 'VExt';
        this.value = parameterOptions.value.toString();
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

        this.modules = modules || undefined;

        const parser: Parser = new Parser({allowMemberAccess: true});
        this.value = this.value.replace(new RegExp('\\\\.', 'g'), '__');
        this.expression = parser.parse(this.value);
        this.scope.push(...this.expression.variables({ withMembers: true }).map((variable) => {
            let components = variable.split('.').map((token:string) => token.replace(new RegExp('__', 'g'),'.'));

            // find module
            let token = components.shift();
            let module = modules.find(m=> m.id === token);
            if (module==undefined) {
                if (modules.length == 1) {
                    module = modules[0];
                } else {
                    catRecipe.warn(`Module ${token} not found in ${variable}`);
                    return undefined;
                }
            } else {
                token = components.shift();
            }

            // find data assembly
            let dataAssembly: ProcessValue;
            /*if (module.services.find(s=> s.name === token)) {
                let service = module.services.find(s => s.name === token);
                token = components.shift();
                if (service.strategies.find( (s: Strategy) => s.name === token)) {
                    let strategy = service.strategies.find( (s: Strategy) => s.name === token);
                    dataAssembly = strategy.parameters.find(param => param.name === components.shift());
                } else {
                    let strategy = service.strategies.find( (s: Strategy) => s.default);
                    dataAssembly = strategy.parameters.find(param => param.name === token);
                }
            } else*/
            if (module.variables.find(v => v.name === token)) {
                dataAssembly = module.variables.find(v => v.name === token)
            } else {
                catRecipe.warn(`DataAssembly ${token} not found in ${variable}`);
                return undefined;
            }

            // find data assembly variable
            token = components.shift();
            let dataAssemblyVariable;
            if (token in dataAssembly.communication)
                dataAssemblyVariable = token;
            else if ('V' in dataAssembly.communication)
                dataAssemblyVariable = 'V';
            else if ('VExt' in dataAssembly.communication)
                dataAssemblyVariable = 'VExt';

            return {name: variable, module: module.id, dataAssembly: dataAssembly.name, variable: dataAssemblyVariable};
        }).filter(Boolean));
    }

    public async getDataType(): Promise<DataType> {
        if (!this._opcUaDataType) {
            const value = await this.service.parent.readVariableNode(this._opcUaNode);
            catService.debug(`Datatype for ${this.service.name}.${this.name}.${this.variable} - ${this._opcUaNode.node_id} = ${JSON.stringify(value)}`);
            this._opcUaDataType = value.value ? value.value.dataType : undefined;
            catService.debug(`Get datatype for ${this.service.name}.${this.name} = ${this._opcUaDataType}`);
        }
        return this._opcUaDataType;
    }

    public listenToParameter() {
        const eventEmitter: StrictEventEmitter<EventEmitter, OpcUaNodeEvents> = new EventEmitter();
        this.scope.forEach(async (item: ScopeOptions) => {
            const module = this.modules.find(module => module.id === item.module);
            module.listenToVariable(item.dataAssembly, item.variable)
                .on('changed', (data) => eventEmitter.emit('changed', data));
        });
        return eventEmitter;
    }

    /**
     * calculate value from current scope
     * @returns {Promise<any>}
     */
    public async getValue(): Promise<any> {
        if (!this.expression) {
            return undefined;
        }
        // get current variables
        const tasks = await Promise.all(this.scope.map(async (item: ScopeOptions) => {
            const module = this.modules.find(module => module.id === item.module);
            return module.readVariable(item.dataAssembly, item.variable)
                    .then(value => {
                        return item.name.split('.').reduceRight((previous, current) => {
                            let a = {};
                            a[current] = previous;
                            return a;
                        }, value.value.value );
                    });
        }));
        const assign = require('assign-deep');
        const scope = assign(...tasks);
        catService.info(`Scope: ${JSON.stringify(scope)} <- ${JSON.stringify(this.scope)}`);
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
        catService.info(`Set parameter "${this.service.name}[${this.variable}]" for ${this.name} = ${value}`);
        return this.service.setParameter(
            this._opcUaNode,
            await this.getDataType(),
            value);
    }
}
