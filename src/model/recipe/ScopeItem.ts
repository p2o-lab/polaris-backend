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
import {catScopeItem} from '../../config/logging';
import {BaseService} from '../core/BaseService';
import {ServiceState} from '../core/enum';
import {Module, OpcUaNodeEmitter} from '../core/Module';
import {Service} from '../core/Service';
import {Strategy} from '../core/Strategy';
import {ExtAnaOp} from '../dataAssembly/AnaOp';
import {AnaView} from '../dataAssembly/AnaView';
import {ExtBinOp} from '../dataAssembly/BinOp';
import {BinView} from '../dataAssembly/BinView';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {OpcUaDataItem} from '../dataAssembly/DataItem';
import {ExtDigOp} from '../dataAssembly/DigOp';
import {DigView} from '../dataAssembly/DigView';

export class ScopeItem {

    /**
     *
     * @param {string} expression
     * @param {Module[]} modules
     * @param {string[]}   ignoredNames   don't try to find scopeItems for this variable names
     */
    public static extractFromExpressionString(expression: string, modules: Module[], ignoredNames: string[] = [])
    : {expression: Expression, scopeItems: ScopeItem[]} {
        const parser: Parser = new Parser({allowMemberAccess: true});
        const value = expression.replace(new RegExp('\\\\.', 'g'), '__');
        const expressionObject = parser.parse(value);
        const scopeItems = expressionObject
            .variables({ withMembers: true })
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
        const opcUaNode = ScopeItem.getVariablefromDataAssembly(dataAssembly, item.variable);
        return new ScopeItem(item.name, module, opcUaNode);
    }

    /**
     * Extract scope item from expression variable
     *
     * @param {string} variable
     * @param {Module[]} modules    modules to be searched in for variable names
     * @returns {ScopeItem}
     */
    public static extractFromExpressionVariable(variable: string, modules: Module[]): ScopeItem {
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

        // find service
        const service: Service = module.services.find((s) => s.name === token);
        let strategy: Strategy;
        if (service) {
            strategy = service.getCurrentStrategy();
            if (!strategy) {
                strategy = service.strategies.find((strat) => strat.default);
            }
            token = components.shift();

            if (strategy.parameters.find((p) => p.name === token)) {
                dataAssembly = strategy.parameters.find((p) => p.name === token);
            } else if (service.parameters.find((p) => p.name === token)) {
                dataAssembly = strategy.parameters.find((p) => p.name === token);
            } else if (token === 'state') {
                return new ScopeItem(variable, module, null, service);
            } else {
                catScopeItem.warn(`Could not evaluate variable "${variable}": ` +
                    `Token "${token}" not found as service parameter ` +
                    `in service ${service.qualifiedName}.${strategy.name}`);
                return null;
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
        const opcUaNode = ScopeItem.getVariablefromDataAssembly(dataAssembly, token);

        return new ScopeItem(variable, module, opcUaNode);
    }

    private static getVariablefromDataAssembly(dataAssembly, token): OpcUaDataItem<any> {
        let opcUaNode = dataAssembly.communication[token];
        if (!opcUaNode) {
            // set default values
            if (dataAssembly instanceof AnaView) {
                opcUaNode = dataAssembly.communication.V;
            } else if (dataAssembly instanceof DigView) {
                opcUaNode = dataAssembly.communication.V;
            } else if (dataAssembly instanceof BinView) {
                opcUaNode = dataAssembly.communication.V;
            } else if (dataAssembly instanceof ExtAnaOp) {
                opcUaNode = dataAssembly.communication.VOut;
            } else if (dataAssembly instanceof ExtDigOp) {
                opcUaNode = dataAssembly.communication.VOut;
            } else if (dataAssembly instanceof ExtBinOp) {
                opcUaNode = dataAssembly.communication.VOut;
            }
        }
        return opcUaNode;
    }

    /** name of variable which should be replaced in value */
    public readonly name: string;
    public readonly variable: OpcUaDataItem<any>;
    public readonly module: Module;
    private readonly service: BaseService;

    constructor(name: string, module, variable?: OpcUaDataItem<any>, service?: BaseService) {
        this.name = name;
        this.module = module;
        this.variable = variable;
        this.service = service;
    }

    /**
     * Returning an nested object following the name construction. The leaf contains the current value
     * as object suitable for expr-eval.evaluate()
     */
    public getScopeValue(): object {
        const value = this.variable ? this.variable.value : ServiceState[this.service.state];
        if (value === undefined) {
            throw new Error(`Could not evaluate scope item ${this.name} (${JSON.stringify(this.variable)} ` +
                `since it seems not connected`);
        }
        return this.name.split('.').reduceRight((previous, current) => {
            const a = {};
            a[current] = previous;
            return a;
        }, value);
    }

    public listen(): Promise<OpcUaNodeEmitter> {
        return this.module.listenToOpcUaNode(this.variable);
    }

}
