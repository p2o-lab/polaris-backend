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

import {ScopeOptions} from '@plt/pfe-ree-interface';
import {catRecipe} from '../../config/logging';
import {ProcessValue} from '../core/ProcessValue';
import {Module} from '../core/Module';
import {OpcUaNode} from '../core/Interfaces';
import {manager} from '../Manager';

export class ScopeItem {

    /** name of variable which should be replaced in value */
    name: string;
    module: Module;
    variable: OpcUaNode;

    /**
     * Returning an nested object following the name construction. The leaf contains the current value
     * as object suitable for expr-eval.evaluate()
     */
    public async getScopeValue(): Promise<object> {
        const value = await this.module.readVariableNode(this.variable);
        return this.name.split('.').reduceRight((previous, current) => {
            let a = {};
            a[current] = previous;
            return a;
        }, value.value.value);
    }

    /**
     *
     * @param {string} variable
     * @param {Module[]} modules    modules to be searched in for variable names (default: all modules in manager)
     * @returns {ScopeItem}
     */
    static extractFromExpression(variable: string, modules= manager.modules): ScopeItem {
        let components = variable.split('.').map((token: string) => token.replace(new RegExp('__', 'g'), '.'));

        // find module
        let token = components.shift();
        let module = modules.find(m => m.id === token);
        if (module == undefined) {
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
        if (module.variables.find(v => v.name === token)) {
            dataAssembly = module.variables.find(v => v.name === token)
        } else {
            catRecipe.warn(`DataAssembly ${token} not found in module ${module.id} from variable ${variable}`);
            return undefined;
        }

        // find data assembly variable
        token = components.shift();
        const opcUaNode = dataAssembly.communication[token] ||
            dataAssembly.communication['V'] ||
            dataAssembly.communication['VExt'];

        return Object.assign(new ScopeItem(), {name: variable, module: module, variable: opcUaNode});
    }

    /**
     *
     * @param {ScopeOptions} item
     * @param {Module[]} modules    modules to be searched in for variable names (default: all modules in manager)
     * @returns {ScopeItem}
     */
    static extractFromScopeOptions(item: ScopeOptions, modules = manager.modules): ScopeItem {
        const module = modules.find(m => m.id === item.module);
        const dataAssembly = module.variables.find(v => v.name === item.dataAssembly);
        const opcUaNode = dataAssembly.communication[item.variable] ||
            dataAssembly.communication['V'] ||
            dataAssembly.communication['VExt'];
        return Object.assign(new ScopeItem(), {name: item.name, module: module, variable: opcUaNode});
    }
}