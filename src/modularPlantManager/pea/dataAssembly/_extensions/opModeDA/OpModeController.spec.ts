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
import {AnaServParam} from '../../operationElement';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/anaserveparam.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {ServiceSourceModeController} from '../serviceSourceModeDA/ServiceSourceModeController';
import {OpModeController} from './OpModeController';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpMode', () => {
	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create OpMode', () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperatorElement/DIntMan',
				dataItems: baseDataAssemblyOptions
			};
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
			const opMode = new OpModeController(da);
			expect(opMode).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateChannel).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateOffAut).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateOpAut).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateAutAut).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateOffOp).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateOpOp).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateAutOp).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateOpAct).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateAutAct).to.not.be.undefined;
			expect((da as AnaServParam).communication.StateOffAct).to.not.be.undefined;
		});
	});
});
