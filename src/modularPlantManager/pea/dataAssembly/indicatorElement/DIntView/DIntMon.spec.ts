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
import {DIntMon} from './DIntMon';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/anamon.json';
import {DataAssemblyControllerFactory} from '../../DataAssemblyControllerFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntMon', () => {

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create DIntMon', async () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/DIntMon',
				dataItems: baseDataAssemblyOptions
			};
			const da1: DIntMon= DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as DIntMon;
			expect(da1 instanceof DIntMon).to.equal(true);
			expect(da1.communication.V).to.not.equal(undefined);
			expect(da1.communication.WQC).to.not.equal(undefined);
			expect(da1.communication.VSclMax).to.not.equal(undefined);
			expect(da1.communication.VSclMin).to.not.equal(undefined);
			expect(da1.tagName).to.not.equal(undefined);
			expect(da1.tagDescription).to.not.equal(undefined);
			expect(da1.communication.VUnit).to.not.equal(undefined);

			expect(da1.communication.OSLevel).to.not.equal(undefined);
			expect(da1.communication.VAHEn).to.not.equal(undefined);
			expect(da1.communication.VAHLim).to.not.equal(undefined);
			expect(da1.communication.VAHAct).to.not.equal(undefined);

			expect(da1.communication.VWHEn).to.not.equal(undefined);
			expect(da1.communication.VWHLim).to.not.equal(undefined);
			expect(da1.communication.VWHAct).to.not.equal(undefined);

			expect(da1.communication.VTHEn).to.not.equal(undefined);
			expect(da1.communication.VTHLim).to.not.equal(undefined);
			expect(da1.communication.VTHAct).to.not.equal(undefined);

			expect(da1.communication.VTLEn).to.not.equal(undefined);
			expect(da1.communication.VTLLim).to.not.equal(undefined);
			expect(da1.communication.VTLAct).to.not.equal(undefined);

			expect(da1.communication.VWLEn).to.not.equal(undefined);
			expect(da1.communication.VWLLim).to.not.equal(undefined);
			expect(da1.communication.VWLAct).to.not.equal(undefined);

			expect(da1.communication.VALEn).to.not.equal(undefined);
			expect(da1.communication.VALLim).to.not.equal(undefined);
			expect(da1.communication.VALAct).to.not.equal(undefined);
		});
	});
});
