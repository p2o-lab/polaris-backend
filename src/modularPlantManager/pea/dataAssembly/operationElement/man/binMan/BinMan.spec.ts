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

import {OpcUaConnection} from '../../../../connection';
import {BinMan} from './BinMan';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../../tests/binmanint.json';
import {OperationElement} from '../../OperationElement';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMan', () => {

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create BinMan', () => { /* TODO: Add Test */
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/BinMan',
				dataItems: baseDataAssemblyOptions
			};
			const da1: BinMan = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as BinMan;
			expect(da1.communication.VOut).to.not.equal(undefined);
			expect(da1.communication.VState0).to.not.equal(undefined);
			expect(da1.communication.VState1).to.not.equal(undefined);
			expect(da1.communication.VMan).to.not.equal(undefined);
			expect(da1.communication.VRbk).to.not.equal(undefined);
			expect(da1.communication.VFbk).to.not.equal(undefined);
			expect(da1.defaultReadDataItem).equal(da1.communication.VOut);
			expect(da1.defaultReadDataItemType).to.equal('boolean');
			expect(da1.defaultWriteDataItem).equal(da1.communication.VMan);
			expect(da1.defaultWriteDataItemType).to.equal('boolean');
		});
	});
});
