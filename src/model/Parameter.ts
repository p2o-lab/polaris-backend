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

import {ParameterOptions, ScopeOptions} from 'pfe-ree-interface';
import {Parser} from 'expr-eval';
import {manager} from './Manager';
import {catService} from '../config/logging';

export class Parameter {
    name: string;
    variable: string;
    value: any;
    scope: ScopeOptions[];

    constructor(parameterOptions: ParameterOptions) {
        this.name = parameterOptions.name;
        this.variable = parameterOptions.variable || 'VExt';
        this.value = parameterOptions.value;
        this.scope = parameterOptions.scope;
    }

    public toString() {
        return `${this.name} = ${this.value}(${JSON.stringify(this.scope)})`;
    }

    public async getValue(): Promise<any> {
        const parser: Parser = new Parser();
        // get current variables
        const scope = {};
        const tasks = [];
        if (this.scope) {
            this.scope.forEach(async (item: ScopeOptions) => {
                const module = manager.modules.find(module => module.id === item.module);
                tasks.push(
                    module.readVariable(item.dataAssembly, item.variable)
                        .then(value => scope[item.name] = value.value.value)
                );
            });
            await Promise.all(tasks);
        }
        catService.trace(`Scope: ${JSON.stringify(scope)} <- ${JSON.stringify(this.scope)}`);
        const result = parser.evaluate(this.value.toString(), scope);
        catService.info(`Specific parameters: ${this.name} = ${this.value}(${JSON.stringify(scope)}) = ${result}`);
        return result;
    }
}
