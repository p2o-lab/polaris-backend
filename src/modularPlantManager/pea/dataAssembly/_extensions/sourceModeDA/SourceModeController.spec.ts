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
import * as baseDataAssemblyOptions from '../../../../../../tests/binmanint.json';
import {SourceModeController} from './SourceModeController';
import {BinManInt} from '../../operationElement';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SourceModeController', () => {

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create SourceModeController', async () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinManInt',
				dataItems: baseDataAssemblyOptions
			};
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);

			const sourceModeController = new SourceModeController(da);
			expect((da as BinManInt).communication.SrcChannel).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcManAut).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcIntAut).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcIntOp).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcManOp).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcIntAct).to.be.not.undefined;
			expect((da as BinManInt).communication.SrcManAct).to.be.not.undefined;
		});

	});
	//TODO: functions

});