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
import {DataAssemblyController} from '../../DataAssemblyController';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/monbinvlv.json';
import {FeedbackMonitoring} from './FeedbackMonitoring';
import {MonBinVlv} from '../../activeElement';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoring', () => {

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create FeedbackMonitoring', () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/MonBinVlv',
				dataItems: baseDataAssemblyOptions
			};
			const da1 = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as MonBinVlv;
			const feedbackMonitoring = new FeedbackMonitoring(da1);
			expect(feedbackMonitoring).to.not.to.undefined;
			expect(da1.communication.MonEn).to.not.to.undefined;
			expect(da1.communication.MonSafePos).to.not.to.undefined;
			expect(da1.communication.MonStatErr).to.not.to.undefined;
			expect(da1.communication.MonDynErr).to.not.to.undefined;
			expect(da1.communication.MonStatTi).to.not.to.undefined;
			expect(da1.communication.MonDynTi).to.not.to.undefined;
		});
	});
});
