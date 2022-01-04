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
import {AnaDrv} from './AnaDrv';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './AnaDrv.spec.json';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaDrv', () => {

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create AnaDrv',  () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/AnaDrv',
				dataItems: baseDataAssemblyOptions
			};
			const dataAssemblyController = new AnaDrv(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController.sourceMode).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmSclMax).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmSclMin).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmUnit).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmMin).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmMax).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmInt).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmMan).to.not.be.undefined;
			expect(dataAssemblyController.communication.Rpm).to.not.be.undefined;

			expect(dataAssemblyController.communication.RpmFbk).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmFbkCalc).to.not.be.undefined;
			expect(dataAssemblyController.communication.RpmRbk).to.not.be.undefined;
		});
	});
});
