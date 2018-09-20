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

import { Step } from './Step';
import { Condition } from './Condition';
import { ConditionOptions, TransitionInterface } from 'pfe-ree-interface';
import { Module } from './Module';
import { Recipe } from './Recipe';

export interface TransitionOptions {
    next_step: string;
    condition: ConditionOptions;
}

export class Transition {
    next_step: Step;
    next_step_name: string;
    condition: Condition;

    constructor(options: TransitionOptions, modules: Module[], recipe: Recipe) {
        if (options.next_step) {
            this.next_step_name = options.next_step;
        } else {
            throw new Error(`"next_step" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.condition) {
            this.condition = Condition.create(options.condition, modules, recipe);
        } else {
            throw new Error(`"condition" property is missing in ${JSON.stringify(options)}`);
        }
    }

    json(): TransitionInterface {
        return {
            next_step: this.next_step_name,
            condition: this.condition.json()
        };
    }
}
