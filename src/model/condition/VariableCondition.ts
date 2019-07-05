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

import {VariableConditionOptions} from '@p2olab/polaris-interface';
import {Module} from '../core/Module';
import {catCondition} from '../../config/logging';
import {Condition} from './Condition';
import {ModuleCondition} from './ModuleCondition';

export class VariableCondition extends ModuleCondition {
    public readonly dataStructure: string;
    public readonly variable: string;
    public readonly value: string | number;
    public readonly operator: '==' | '<' | '>' | '<=' | '>=';

    constructor(options: VariableConditionOptions, modules: Module[]) {
        super(options, modules);
        if (!options.dataAssembly) {
            throw new Error(`Condition does not have 'dataAssembly' ${JSON.stringify(options)}`);
        }
        this.dataStructure = options.dataAssembly;
        this.variable = options.variable || 'V';
        this.value = options.value;
        this.operator = options.operator || '==';
    }

    public listen(): Condition {
        catCondition.debug(`Listen to ${this.dataStructure}.${this.variable}`);
        this.module.listenToVariable(this.dataStructure, this.variable)
            .on('changed', this.check);
        return this;
    }

    private check = (data) => {
        catCondition.debug(`value changed to ${data.value} -  (${this.operator}) compare against ${this.value}`);
        const value: number = data.value;
        let result = false;
        if (this.operator === '==') {
            if (value === this.value) {
                result = true;
            }
        } else if (this.operator === '<=') {
            if (value <= this.value) {
                result = true;
            }
        } else if (this.operator === '>=') {
            if (value >= this.value) {
                result = true;
            }
        } else if (this.operator === '<') {
            if (value < this.value) {
                result = true;
            }
        } else if (this.operator === '>') {
            if (value > this.value) {
                result = true;
            }
        }
        this._fulfilled = result;
        this.emit('stateChanged', this._fulfilled);
        catCondition.debug(`VariableCondition ${this.dataStructure}: ` +
            `${data.value} ${this.operator} ${this.value} = ${this._fulfilled}`);
    }

}
