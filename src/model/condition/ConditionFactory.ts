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

/**
 * Create Condition
 * @param {ConditionOptions} options    options for creating Condition
 * @param {Module[]} modules    modules to be used for evaluating module name in expressions
 * @returns Condition
 */
import {
    AndConditionOptions,
    ConditionOptions,
    ConditionType,
    ExpressionConditionOptions,
    NotConditionOptions,
    OrConditionOptions,
    StateConditionOptions,
    TimeConditionOptions,
    VariableConditionOptions
} from '@p2olab/polaris-interface';
import {catCondition} from '../../logging/logging';
import {Module} from '../core/Module';
import {AndCondition} from './AndCondition';
import {Condition} from './Condition';
import {ExpressionCondition} from './ExpressionCondition';
import {NotCondition} from './NotCondition';
import {OrCondition} from './OrCondition';
import {StateCondition} from './StateCondition';
import {TimeCondition} from './TimeCondition';
import {TrueCondition} from './TrueCondition';
import {VariableCondition} from './VariableCondition';

export class ConditionFactory {
    public static create(options: ConditionOptions | string, modules: Module[]): Condition {
        catCondition.trace(`Create Condition: ${JSON.stringify(options)}`);
        if (typeof options === 'string') {
            return new ExpressionCondition({
                type: ConditionType.expression,
                expression: options
            } as ExpressionConditionOptions, modules);
        } else {
            const type: ConditionType = options ? options.type : null;
            if (type === ConditionType.time) {
                return new TimeCondition(options as TimeConditionOptions);
            } else if (type === ConditionType.and) {
                return new AndCondition(options as AndConditionOptions, modules);
            } else if (type === ConditionType.state) {
                return new StateCondition(options as StateConditionOptions, modules);
            } else if (type === ConditionType.variable) {
                return new VariableCondition(options as VariableConditionOptions, modules);
            } else if (type === ConditionType.or) {
                return new OrCondition(options as OrConditionOptions, modules);
            } else if (type === ConditionType.not) {
                return new NotCondition(options as NotConditionOptions, modules);
            } else if (type === ConditionType.expression) {
                return new ExpressionCondition(options as ExpressionConditionOptions, modules);
            } else {
                catCondition.warn('Default true condition');
                return new TrueCondition(options);
            }
        }
    }
}
