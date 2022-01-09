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
import 'mocha';
import {PEAProvider} from './PEAProvider';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PEAProvider', async () => {

	const peaProvider = new PEAProvider();
	let testPeaIdentifier = '';

	it('getAllPEAsFromPEAPool()', async () => {
		expect(peaProvider.getAllPEAsFromPEAPool()).to.not.be.rejected;
	});

	it('getAllPEAsFromPEAPool(), empty', async () => {
		const peaProvider = new PEAProvider();
		return expect(peaProvider.getAllPEAsFromPEAPool()).to.be.empty;
	});

	it('addPEAToPool() fails', async () => {
		expect(peaProvider.addPEAToPool({source: 'tests/a.zip'})).to.be.rejected;
	});

	it('addPEAToPool()', async () => {
		const peaModel = await peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
		expect(peaModel).to.not.be.undefined;
		testPeaIdentifier = peaModel.pimadIdentifier;
	});

	it('getPEAControllerOptionsByPEAIdentifier() to fail with empty identifier', async () => {
		expect(peaProvider.getPEAControllerOptionsByPEAIdentifier('')).to.be.rejected;
	});

	it('getPEAControllerOptionsByPEAIdentifier() to fail with invalid identifier', async () => {
		expect(peaProvider.getPEAControllerOptionsByPEAIdentifier('qwer1234')).to.be.rejected;
	});

	it('getPEAControllerOptionsByPEAIdentifier()', async () => {
		expect(peaProvider.getPEAControllerOptionsByPEAIdentifier(testPeaIdentifier)).to.not.be.rejected;
	});

	it('deletePEAFromPEAPool() to fail with invalid identifier', async () => {
		expect(peaProvider.deletePEAFromPEAPool('qwer1234')).to.not.throw;
	});

	it('deletePEAFromPEAPool() to fail with empty identifier', async () => {
		expect(peaProvider.deletePEAFromPEAPool('')).to.be.rejected;
	});

	it('deletePEAFromPEAPool()', async () => {
		let result;
		await peaProvider.getAllPEAsFromPEAPool().then(value => result = value);
		expect(result).to.be.an.instanceof(Array);
		expect(result).to.have.lengthOf(1);
		expect(peaProvider.deletePEAFromPEAPool(testPeaIdentifier)).to.not.throw;
		expect(peaProvider.getAllPEAsFromPEAPool()).to.be.empty;
		expect(peaProvider.deletePEAFromPEAPool(testPeaIdentifier)).to.be.rejected;
	});

	it('deleteAllPEAsFromPEAPool()', async () => {
		expect(peaProvider.getAllPEAsFromPEAPool()).to.be.empty;
		await peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
		await peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
		let result;
		await peaProvider.getAllPEAsFromPEAPool().then(value => result = value);
		expect(result).to.be.an.instanceof(Array);
		expect(result).to.have.lengthOf(2);
		expect(peaProvider.deleteAllPEAsFromPEAPool()).to.not.throw;
		expect(peaProvider.getAllPEAsFromPEAPool()).to.be.empty;
	});

});
