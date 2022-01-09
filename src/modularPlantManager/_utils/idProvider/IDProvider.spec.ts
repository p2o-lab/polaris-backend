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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {IDProvider} from './IDProvider';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('IDProvider', () => {

	describe('get identifier', () => {

		it('should create Identifier', () => {
			expect(IDProvider.generateIdentifier()).to.not.throw;
		});

		it('should return identifier as string', () => {
			const result = IDProvider.generateIdentifier();
			expect(result).to.be.not.undefined;
			expect(typeof result).to.equal('string');
		});
	});

	describe('validate identifier', () => {

		it('should work with valid uuid', async () => {
			expect(IDProvider.validIdentifier('6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b')).to.equal(true);
		});

		it('should fail with invalid uuid', async () => {
			expect(IDProvider.validIdentifier('invalid154+#0')).to.equal(false);
		});

		it('should fail with empty uuid', async () => {
			expect(IDProvider.validIdentifier('')).to.equal(false);
		});

	});
});
