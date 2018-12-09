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

import { Condition, NotCondition, TimeCondition } from '../src/model/Condition';
import * as assert from 'assert';
import { catRecipe } from '../src/config/logging';
import { ConditionType } from 'pfe-ree-interface';

describe('Condition', () => {

    it('should listen to a time condition of 0.4s', (done) => {
        const cond = new TimeCondition({ type: ConditionType.time, duration: 0.2 });

        assert.deepEqual(cond.json(), { type: 'time', duration: 0.2 });

        assert.equal(cond.fulfilled, false);

        cond.listen().on('state_changed', () => {
            assert.equal(cond.fulfilled, true);
            done();
        });

        assert.equal(cond.fulfilled, false);
    });

    it('should listen to an AND condition of two time conditions', (done) => {
        const condition = Condition.create({
            type: ConditionType.and,
            conditions: [
                { type: ConditionType.time, duration: 0.5 },
                { type: ConditionType.time, duration: 0.3 }
            ]
        }, undefined, undefined);
        assert.deepEqual(condition.json(), {
            type: 'and',
            conditions:
            [{ type: 'time', duration: 0.5 },
                    { type: 'time', duration: 0.3 }]
        });
        condition.listen().on('state_changed', (status) => {
            catRecipe.info(`Status: ${status}`);
            done();
        });
    });

    it('should listen to a OR condition of two time conditions', (done) => {
        const condition = Condition.create({
            type: ConditionType.or,
            conditions: [
                { type: ConditionType.time, duration: 2 },
                { type: ConditionType.time, duration: 0.5 }
            ]
        }, undefined, undefined);
        assert.deepEqual(condition.json(), {
            type: 'or',
            conditions:
            [{ type: 'time', duration: 2 },
                    { type: 'time', duration: 0.5 }]
        });
        condition.listen().on('state_changed', (status) => {
            catRecipe.info(`Status: ${status}`);
            done();
        });
    });

    it('should listen to a NOT condition', () => {
        const condition = new NotCondition({
            type: ConditionType.not,
            condition: { type: ConditionType.time, duration: 0.5 }
        }, undefined, undefined);
        assert.deepEqual(condition.json(), { type: 'not', condition: { type: 'time', duration: 0.5 } });

    });

});
