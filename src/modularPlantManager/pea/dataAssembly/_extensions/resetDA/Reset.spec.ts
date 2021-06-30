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

import {OpcUaConnection} from '../../../connection';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/monbinvlv.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {MonBinVlv} from '../../activeElement';
import {Reset} from './Reset';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Reset', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const parseJson = require('json-parse-better-errors');

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create Reset',  () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/MonBinVlv',
				dataItems: baseDataAssemblyOptions
			};
			const da1 = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as MonBinVlv;
			const reset = new Reset(da1); //this will set communication variables
			expect(reset).to.not.to.undefined;
			expect(da1.communication.ResetAut).to.not.to.undefined;
			expect(da1.communication.ResetOp).to.not.to.undefined;
		});
	});
});
