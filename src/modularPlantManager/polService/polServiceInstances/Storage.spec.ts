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

import {Storage} from './Storage';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Storage', () => {

	it('should work', async () => {
		const s1 = new Storage('s1');
		let params = s1.json().procedures[0].parameters;
		expect(params).to.have.lengthOf(1);
		expect(params[0]).to.have.property('name', 'storage');
		expect(params[0]).to.have.property('value', undefined);

		s1.setParameters([{name: 'storage', value: 2}]);
		params = s1.json().procedures[0].parameters;
		expect(params).to.have.lengthOf(1);
		expect(params[0]).to.have.property('name', 'storage');
		expect(params[0]).to.have.property('value', 2);

		s1.setParameters([{name: 'storage', value: 'teststring'}]);
		params = s1.json().procedures[0].parameters;
		expect(params).to.have.lengthOf(1);
		expect(params[0]).to.have.property('name', 'storage');
		expect(params[0]).to.have.property('value', 'teststring');

		await s1.start();
		await s1.complete();
		await s1.reset();
		params = s1.json().procedures[0].parameters;
		expect(params).to.have.lengthOf(1);
	});
});
