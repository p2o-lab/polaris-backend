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

import {ParameterOptions, ScopeOptions} from '@p2olab/polaris-interface';
import * as assign from 'assign-deep';
import {EventEmitter} from 'events';
import {Expression} from 'expr-eval';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catParameter} from '../../config/logging';
import {Module, OpcUaNodeEvents} from '../core/Module';
import {Service} from '../core/Service';
import {Strategy} from '../core/Strategy';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {ScopeItem} from './ScopeItem';

/**
 * Parameter of an [[Operation]]. Can be static or dynamic. Dynamic Parameters can depend on variables of the same or
 * other modules. These can also be continuously updated (specified via continuous property)
 */
export class Parameter {

    /**
     * name of parameter which should be updated
     */
    public name: string;
    // name of the variable inside the data assembly which should be updated
    public variable: string;
    /**
     * Expression to be calculated and used as value.
     * Can contain variables, which can be declared inside scopeArray or by using correct variable names
     * following this syntax "[module].[processValue].[variable]". module can be omitted if only one module
     * is loaded. TestServerVariable can be omitted. Then "V" is used as variable.
     * "." in the name of modules or processvariables can be escaped with "\\."
     * @example
     * "CIF.Sensoren\.L001.V"
     */
    public value: string | number | boolean;
    public scopeArray: ScopeItem[];
    /**
     * should parameter continuously be updated
     */
    public continuous: boolean;
    public readonly options: ParameterOptions;
    private expression: Expression;
    private service: Service;
    private _parameter: DataAssembly;
    private logger: Category;

    /**
     *
     * @param {ParameterOptions} parameterOptions
     * @param {Service} service         service where the parameter belongs to
     * @param {Strategy} strategy       strategyNode to use
     * @param {Module[]} modules        modules where expression can be matched
     */
    constructor(parameterOptions: ParameterOptions, service: Service, strategy?: Strategy, modules?: Module[]) {
        catParameter.trace(`Create Parameter: ${JSON.stringify(parameterOptions)}`);

        this.options = parameterOptions;
        this.name = parameterOptions.name;
        this.variable = parameterOptions.variable || service.automaticMode ? 'VExt' : 'VMan';
        this.value = parameterOptions.value || 0;
        this.continuous = parameterOptions.continuous || false;

        this.logger = catParameter;

        this.service = service;
        const strategyUsed: Strategy = strategy || service.strategies.find((strat) => strat.default);
        const parameterList: DataAssembly[] = [].concat(service.parameters, strategyUsed.parameters);
        try {
            this._parameter = parameterList.find((obj) => (obj && obj.name === this.name));
        } catch {
            throw new Error(`Could not find parameter "${this.name}" in ${service.name}`);
        }
        if (!this._parameter) {
            throw new Error(`Could not find parameter "${this.name}" in ${service.name} - ${strategyUsed.name}`);
        }

        // evaluate scopeArray
        this.scopeArray = (parameterOptions.scope || [])
            .map((item: ScopeOptions) => ScopeItem.extractFromScopeOptions(item, modules));

        // evaluate additional variables from expression
        try {
            const extraction = ScopeItem.extractFromExpressionString(
                this.value.toString(), modules, this.scopeArray.map((scope) => scope.name)
            );
            this.expression = extraction.expression;
            this.scopeArray.push(...extraction.scopeItems);
        } catch (err) {
            throw new Error('Parsing error for Parameter');
        }
    }

    public listenToParameter() {
        const eventEmitter: StrictEventEmitter<EventEmitter, OpcUaNodeEvents> = new EventEmitter();
        this.scopeArray.forEach((item) => {
            item.listen().on('changed', (data) => eventEmitter.emit('changed', data));
        });
        return eventEmitter;
    }

    /**
     * calculate value from current scopeArray
     * @returns number | boolean
     */
    public getValue(): number | boolean {
        // get current variables
        const tasks = this.scopeArray.map((item) => item.getScopeValue());
        const scope = assign(...tasks);
        const result = this.expression.evaluate(scope);
        catParameter.info(`Specific parameters: ${this.name} = ${this.value} (${JSON.stringify(scope)}) = ${result}`);
        return result;
    }

    /**
     * calculate value from current scopeArray and write it down to module
     * @returns {Promise<any>}
     */
    public async updateValueOnModule(): Promise<any> {
        const value = await this.getValue();
        catParameter.info(`Set parameter "${this.service.name}.${this.name}[${this.variable}]" to ${value}`);
        await this.setOperationMode();
        await this._parameter.setParameter(value, this.variable);
    }

    /**
     * set operation mode of parameter according to its service
     * @returns {Promise<void>}
     */
    public async setOperationMode(): Promise<void> {
        if (this.service.automaticMode) {
            this.logger.info(`[${this.service.qualifiedName}.${this.name}] Bring to automatic mode`);
            this._parameter.setToAutomaticOperationMode();
            this.logger.info(`[${this.service.qualifiedName}.${this.name}] Parameter now in automatic mode`);
        } else {
            this.logger.info(`[${this.service.qualifiedName}.${this.name}] Bring to manual mode`);
            await this._parameter.setToManualOperationMode();
            this.logger.info(`[${this.service.qualifiedName}.${this.name}] Parameter now in manual mode`);
        }
    }

}
