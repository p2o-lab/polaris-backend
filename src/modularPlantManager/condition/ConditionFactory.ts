/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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
 * @param {PEAController[]} peas    PEAs to be used for evaluating pea name in expressions
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
import {PEAController} from '../pea';
import {Condition} from './Condition';
import {ExpressionCondition, TimeCondition} from './custom';
import {
	AndCondition, NotCondition,
	OrCondition, TrueCondition
} from './logical';
import {ServiceStateCondition, VariableCondition} from './peaCondition';

export class ConditionFactory {
	public static create(options: ConditionOptions, peaSet?: PEAController[]): Condition {

		const type: ConditionType | undefined = options ? options.type : undefined;
		if (type === ConditionType.time) {
			return new TimeCondition(options as TimeConditionOptions);
		} else if (type === ConditionType.and) {
			return new AndCondition(options as AndConditionOptions, peaSet!);
		} else if (type === ConditionType.state) {
			return new ServiceStateCondition(options as StateConditionOptions, peaSet!);
		} else if (type === ConditionType.variable) {
			return new VariableCondition(options as VariableConditionOptions, peaSet!);
		} else if (type === ConditionType.or) {
			return new OrCondition(options as OrConditionOptions, peaSet!);
		} else if (type === ConditionType.not) {
			return new NotCondition(options as NotConditionOptions, peaSet!);
		} else if (type === ConditionType.expression) {
			return new ExpressionCondition(options as ExpressionConditionOptions, peaSet!);
		} else {
			return new TrueCondition(options);
		}
	}
}
