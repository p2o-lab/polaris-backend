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
import {Module} from '../core/Module';
import {ScopeItem} from './ScopeItem';

/**
 * Static or Dynamic Parameter. Dynamic Parameters can depend on variables of the same or
 * other modules. These can also be continuously updated (specified via continuous property)
 */
export class Parameter {

    /**
     * name of parameter which should be updated
     */
    public readonly name: string;
    /**
     * Expression to be calculated and used as value.
     * Can contain variables, which can be declared inside scopeArray or by using correct variable names
     * following this syntax "[module].[processValue].[variable]". module can be omitted if only one module
     * is loaded. TestServerVariable can be omitted. Then "V" is used as variable.
     * "." in the name of modules or processvariables can be escaped with "\\."
     * @example
     * "ModuleTestServer.Sensoren\.L001.V"
     */
    public readonly value: string | number | boolean;
    public readonly scopeArray: ScopeItem[];
    public readonly eventEmitter: StrictEventEmitter<EventEmitter, {changed: number | boolean}> = new EventEmitter();
    /**
     * should parameter continuously be updated
     */
    public readonly continuous: boolean;
    public readonly options: ParameterOptions;
    private readonly expression: Expression;
    private readonly logger: Category;
    private active: boolean = false;

    /**
     *
     * @param {ParameterOptions} parameterOptions
     * @param {Module[]} modules        modules where expression can be matched
     */
    constructor(parameterOptions: ParameterOptions, modules: Module[] = []) {
        catParameter.info(`Create Parameter: ${JSON.stringify(parameterOptions)}`);

        this.options = parameterOptions;
        this.name = parameterOptions.name;
        this.value = parameterOptions.value || 0;
        this.continuous = parameterOptions.continuous || false;

        this.logger = catParameter;

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
            throw new Error('Parsing error for Parameter ' + err.toString());
        }
        this.logger.debug(`Scope array: ${this.scopeArray.map((s) => s.dataAssembly.name)}`);

        this.notify = this.notify.bind(this);
    }

    public listenToScopeArray(): EventEmitter {
        if (this.active) {
            this.logger.info(`Provide existent emitter`);
        } else {
            this.logger.info(`Listening to parameter ${this.name}; ` +
                `subscribe to changes of ${this.scopeArray.map((s) => s.dataAssembly.name)}`);
            this.active = true;
            this.scopeArray.forEach((item) => {
                item.dataAssembly.on('changed', this.notify);
            });
        }
        return this.eventEmitter;
    }

    public unlistenToScopeArray() {
        if (this.active) {
            this.scopeArray.forEach((item) => {
                item.dataAssembly.removeListener('changed', this.notify);
            });
            this.active = false;
        }
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
        catParameter.debug(`Specific parameters: ${this.name} = ${this.value} (${JSON.stringify(scope)}) = ${result}`);
        return result;
    }

    private notify() {
        const newValue = this.getValue();
        this.logger.debug(`Parameter has updated due to dependant variabled to: ${newValue}`);
        this.eventEmitter.emit('changed', newValue);
    }

}
