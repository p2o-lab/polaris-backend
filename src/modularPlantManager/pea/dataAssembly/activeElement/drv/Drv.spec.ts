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
import {
	Drv
} from './Drv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {PEAMockup} from '../../../PEA.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/monanadrv.json';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Drv', () => {
	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create Drv',  () => {
			const emptyOPCUAConnection = new OpcUaConnection('', '');
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/AnaDrv',
				dataItems: baseDataAssemblyOptions
			};
			const da1 = new Drv(dataAssemblyOptions, emptyOPCUAConnection);

			expect(da1.reset).to.be.not.undefined;
			expect(da1.interlock).to.not.be.undefined;
			expect(da1.opMode).to.be.not.undefined;

			expect(da1.communication.SafePos).to.not.be.undefined;
			expect(da1.communication.SafePosAct).to.not.be.undefined;

			expect(da1.communication.FwdAut).to.not.be.undefined;
			expect(da1.communication.FwdCtrl).to.not.be.undefined;
			expect(da1.communication.FwdEn).to.not.be.undefined;
			expect(da1.communication.FwdFbk).to.not.be.undefined;
			expect(da1.communication.FwdFbkCalc).to.not.be.undefined;
			expect(da1.communication.FwdOp).to.not.be.undefined;

			expect(da1.communication.RevAut).to.not.be.undefined;
			expect(da1.communication.RevCtrl).to.not.be.undefined;
			expect(da1.communication.RevEn).to.not.be.undefined;
			expect(da1.communication.RevFbk).to.not.be.undefined;
			expect(da1.communication.RevFbkCalc).to.not.be.undefined;
			expect(da1.communication.RevOp).to.not.be.undefined;

			expect(da1.communication.StopAut).to.not.be.undefined;
			expect(da1.communication.StopOp).to.not.be.undefined;
			expect(da1.communication.Trip).to.not.be.undefined;

			expect(Object.keys(da1.communication).length).to.equal(37);
		});
	});
});
