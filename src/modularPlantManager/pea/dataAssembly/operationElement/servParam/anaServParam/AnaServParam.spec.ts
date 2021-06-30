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
import {AnaServParam} from './AnaServParam';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {PEAMockup} from '../../../../PEA.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../../tests/anaserveparam.json';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {ServParam} from '../ServParam';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaServParam', () => {

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create AnaServParam', () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
				dataItems: baseDataAssemblyOptions
			};
			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as AnaServParam;
			expect(da1.scaleSettings).to.not.be.undefined;
			expect(da1.unitSettings).to.not.be.undefined;
			expect(da1.valueLimitation).to.not.be.undefined;

			expect(da1.communication.VExt).to.not.be.undefined;
			expect(da1.communication.VOp).to.not.be.undefined;
			expect(da1.communication.VInt).to.not.be.undefined;
			expect(da1.communication.VReq).to.not.be.undefined;
			expect(da1.communication.VOut).to.not.be.undefined;
			expect(da1.communication.VFbk).to.not.be.undefined;
		});
	});
});
