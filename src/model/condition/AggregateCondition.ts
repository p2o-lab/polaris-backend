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

import {AndConditionOptions, OrConditionOptions} from '@p2olab/polaris-interface';
import {Module} from '../core/Module';
import {Condition} from './Condition';
import {ConditionFactory} from './ConditionFactory';

export abstract class AggregateCondition extends Condition {
    public conditions: Condition[] = [];

    constructor(options: AndConditionOptions | OrConditionOptions, modules: Module[]) {
        super(options);
        this.conditions = options.conditions.map((option) => {
            return ConditionFactory.create(option, modules);
        });
        this._fulfilled = false;
    }

    public clear() {
        super.clear();
        this.conditions.forEach((cond) => cond.clear());
    }

    public getUsedModules(): Set<Module> {
        const set = new Set<Module>();
        this.conditions.forEach((cond) => {
            Array.from(cond.getUsedModules()).forEach((module) => {
                set.add(module);
            });
        });
        return set;
    }
}
