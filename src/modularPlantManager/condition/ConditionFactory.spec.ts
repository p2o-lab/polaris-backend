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

import {ConditionOptions} from '@p2olab/polaris-interface';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {ConditionFactory} from './ConditionFactory';
import {TrueCondition} from './logical';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test for [[Condition]]
 */
describe('ConditionFactory', () => {
	describe('without test server', () => { // TODO: Add Test

		it('should provide TrueCondition if type is undefined', () => {
			expect(ConditionFactory.create({} as ConditionOptions, [])).to.instanceOf(TrueCondition);
		});

		it('should provide TrueCondition if type is unknown', () => {
			const cond = ConditionFactory.create({type: 'test'} as unknown as ConditionOptions, []);
			expect(cond).to.instanceOf(TrueCondition);
		});

	});

});

