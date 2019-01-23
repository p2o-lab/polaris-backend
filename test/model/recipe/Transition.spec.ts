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

import {Transition} from '../../../src/model/recipe/Transition';
import {expect} from 'chai';
import {ConditionType} from '@plt/pfe-ree-interface';

describe('Transition', () => {


    it('should load from options', () => {
        let t = new Transition({next_step: "nextStep", condition: {type: ConditionType.time, duration: 1}}, [], undefined);

        const json = t.json();
        expect(json).to.haveOwnProperty('next_step', 'nextStep');
    });

    it('should fail with missing parameters', () => {

        expect(() =>  {let t = new Transition({next_step: undefined, condition: undefined}, [], undefined)}).to.throw;
        expect(() =>  {let t = new Transition({next_step: "a", condition: undefined}, [], undefined)}).to.throw;
        expect(() =>  {let t = new Transition({next_step: undefined, condition: {type: ConditionType.time, duration: 1}}, [], undefined)}).to.throw;
    });
});
