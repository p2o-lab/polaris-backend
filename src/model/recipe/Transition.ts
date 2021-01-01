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

import {TransitionInterface, TransitionOptions} from '@p2olab/polaris-interface';
import {Condition} from '../condition/Condition';
import {ConditionFactory} from '../condition/ConditionFactory';
import {PEA} from 'src/model/core/PEA';
import {Step} from './Step';

export class Transition {
    public nextStep: Step;
    public readonly nextStepName: string;
    public readonly condition: Condition;

    constructor(options: TransitionOptions, modules: PEA[]) {
        if (options.next_step) {
            this.nextStepName = options.next_step;
        } else {
            throw new Error(`"next_step" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.condition) {
            this.condition = ConditionFactory.create(options.condition, modules);
        } else {
            throw new Error(`"condition" property is missing in ${JSON.stringify(options)}`);
        }
    }

    public getUsedModules(): Set<PEA> {
        return new Set([...this.condition.getUsedModules()]);
    }

    public json(): TransitionInterface {
        return {
            next_step: this.nextStepName,
            condition: this.condition.json()
        };
    }
}
