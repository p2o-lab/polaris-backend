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

import {TransitionInterface, TransitionOptions} from '@p2olab/polaris-interface';
import {Condition, ConditionFactory} from '../../../condition';
import {PEA} from '../../../pea';
import {Step} from '../Step';

export class Transition {
	public nextStep: Step | undefined;
	public readonly nextStepName: string;
	public readonly condition: Condition;

	constructor(options: TransitionOptions, peas: PEA[]) {
		if (options.nextStep) {
			this.nextStepName = options.nextStep;
		} else {
			throw new Error(`"next_step" property is missing in ${JSON.stringify(options)}`);
		}
		if (options.condition) {
			this.condition = ConditionFactory.create(options.condition, peas);
		} else {
			throw new Error(`"condition" property is missing in ${JSON.stringify(options)}`);
		}
	}

	public getUsedPEAs(): Set<PEA> {
		return new Set([...this.condition.getUsedPEAs()]);
	}

	public json(): TransitionInterface {
		return {
			nextStep: this.nextStepName,
			condition: this.condition.json()
		};
	}
}
