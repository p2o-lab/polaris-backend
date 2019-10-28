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

import {ScopeOptions} from '@p2olab/polaris-interface';
import {Expression, Parser} from 'expr-eval';
import {catScopeItem} from '../../logging/logging';
import {ServiceState} from '../core/enum';
import {Module} from '../core/Module';
import {Service} from '../core/Service';
import {Strategy} from '../core/Strategy';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataItem} from '../dataAssembly/DataItem';

export class ScopeItem {

    /**
     *
     * @param {string} expression
     * @param {Module[]} modules
     * @param {string[]}   ignoredNames   don't try to find scopeItems for this variable names
     */
    public static extractFromExpressionString(expression: string, modules: Module[], ignoredNames: string[] = [])
        : { expression: Expression, scopeItems: ScopeItem[] } {
        const parser: Parser = new Parser({allowMemberAccess: true});
        const value = expression.replace(new RegExp('\\\\.', 'g'), '__');
        const expressionObject = parser.parse(value);
        const scopeItems = expressionObject
            .variables({withMembers: true})
            .filter((variable) => !ignoredNames.find((n) => n === variable))
            .map((variable) => ScopeItem.extractFromExpressionVariable(variable, modules))
            .filter(Boolean);
        return {expression: expressionObject, scopeItems};
    }

    /**
     *
     * @param {ScopeOptions} item
     * @param {Module[]} modules    modules to be searched in for variable names (default: all modules in manager)
     * @returns {ScopeItem}
     */
    public static extractFromScopeOptions(item: ScopeOptions, modules: Module[]): ScopeItem {
        const module = modules.find((m) => m.id === item.module);
        const dataAssembly = module.variables.find((v) => v.name === item.dataAssembly);
        return new ScopeItem(item.name, module, dataAssembly, item.variable);
    }

    /**
     * Extract scope item from expression variable
     *
     * @param {string} variable
     * @param {Module[]} modules    modules to be searched in for variable names
     * @returns {ScopeItem}
     */
    public static extractFromExpressionVariable(variable: string, modules: Module[]): ScopeItem {
        catScopeItem.debug(`Extract ScopeItem from "${variable}"`);
        let dataAssembly: DataAssembly;
        const components = variable.split('.').map((tokenT: string) => tokenT.replace(new RegExp('__', 'g'), '.'));
        let token = components.shift();

        // find module
        let module = modules.find((m) => m.id === token);
        if (module === undefined) {
            if (modules.length === 1) {
                module = modules[0];
            } else {
                catScopeItem.warn(`Could not evaluate variable "${variable}": module "${token}" not found in ` +
                    `${JSON.stringify(modules.map((m) => m.id))}`);
                return null;
            }
        } else {
            token = components.shift();
        }
        catScopeItem.debug(`Found module "${module.id}" for expression "${variable}"`);

        // find service
        const service: Service = module.services.find((s) => s.name === token);
        let strategy: Strategy;
        if (service) {
            catScopeItem.debug(`Found service "${service.name}" for expression "${variable}"`);
            strategy = service.getCurrentStrategy();
            if (!strategy) {
                strategy = service.getDefaultStrategy();
            }
            token = components.shift();

            const paramList = [].concat(
                service.parameters,
                strategy.parameters,
                strategy.processValuesIn,
                strategy.processValuesOut,
                strategy.reportParameters);
            dataAssembly = paramList.find((p) => p.name === token);
            if (!dataAssembly) {
                if (token === 'state') {
                    return new ScopeItem(variable, module, service.serviceControl, 'State');
                } else {
                    catScopeItem.warn(`Could not evaluate variable "${variable}": ` +
                        `Token "${token}" not found as service parameter ` +
                        `in service ${service.qualifiedName}.${strategy.name}`);
                    return null;
                }
            }
        } else {
            // find data assembly in process values
            if (module.variables.find((v) => v.name === token)) {
                dataAssembly = module.variables.find((v) => v.name === token);
            } else {
                catScopeItem.warn(`Could not evaluate variable "${variable}": ` +
                    `Token "${token}" not found as dataAssembly ` +
                    `in module ${module.id}: ${module.variables.map((v) => v.name)}`);
                return null;
            }
        }

        // find data assembly variable
        token = components.shift();

        return new ScopeItem(variable, module, dataAssembly, token);
    }

    /** name of variable which should be replaced in value */
    public readonly name: string;
    public readonly dataAssembly: DataAssembly;
    public readonly module: Module;
    public readonly variableName: string;
    public readonly dataItem: DataItem<any>;

    constructor(name: string, module: Module, dataAssembly: DataAssembly, variableName?: string) {
        this.name = name;
        this.module = module;
        this.dataAssembly = dataAssembly;
        this.variableName = variableName;
        this.dataItem = this.dataAssembly.communication[variableName] || this.dataAssembly.readDataItem;
    }

    /**
     * Returning an nested object following the name construction. The leaf contains the current value
     * as object suitable for expr-eval.evaluate()
     */
    public getScopeValue(): object {
        let value = this.dataItem.value;
        if (this.variableName === 'State') {
            value = ServiceState[value as ServiceState];
        }
        if (value === undefined) {
            throw new Error(`Could not evaluate scope item ${this.name} since it seems not connected`);
        }
        return this.name.split('.').reduceRight((previous, current) => {
            const a = {};
            a[current] = previous;
            return a;
        }, value);
    }

}
