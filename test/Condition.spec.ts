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

import {suite, test} from "mocha-typescript";
import {Condition, TimeCondition} from "../src/model/Condition";
import * as assert from "assert";
import {catRecipe} from "../src/config/logging";
import {ConditionType} from "pfe-ree-interface";

@suite
class ConditionTest {
    @test TimeCondition() {
        let cond = new TimeCondition({type: ConditionType.time, duration: 3});

        assert.equal(cond.fulfilled, false);

        cond.listen(() => {
            assert.equal(cond.fulfilled, true);
        });

        assert.equal(cond.fulfilled, false);
    }

    @test
    AndCondition() {
        let condition = Condition.create({
            type: ConditionType.and,
            conditions: [
                {type: ConditionType.time, duration: 2},
                {type: ConditionType.time, duration: 0.5}
            ]
        }, undefined, undefined);
        condition.listen((status) => catRecipe.info(`Status: ${status}`));
    }

}