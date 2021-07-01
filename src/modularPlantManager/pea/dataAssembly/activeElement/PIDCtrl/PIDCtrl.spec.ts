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
import {PIDCtrl} from './PIDCtrl';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../tests/pidctrl.json';
import {Vlv} from '../vlv';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PIDCtrl', () => {
	const parseJson = require('json-parse-better-errors');

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create PIDCtrl', async () => {
			const emptyOPCUAConnection = new OpcUaConnection('', '');
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperationElement/MonBinVlv',
				dataItems: baseDataAssemblyOptions
			};
			const da1 = new PIDCtrl(dataAssemblyOptions, emptyOPCUAConnection);

			expect(da1.wqc).to.be.not.undefined;
			expect(da1.osLevel).to.not.be.undefined;
			expect(da1.sourceMode).to.be.not.undefined;
			expect(da1.opMode).to.be.not.undefined;

			expect(da1.communication.PV).to.not.be.undefined;
			expect(da1.communication.PVSclMax).to.not.be.undefined;
			expect(da1.communication.PVSclMin).to.not.be.undefined;
			expect(da1.communication.PVUnit).to.not.be.undefined;

			expect(da1.communication.SP).to.not.be.undefined;
			expect(da1.communication.SPSclMax).to.not.be.undefined;
			expect(da1.communication.SPSclMin).to.not.be.undefined;
			expect(da1.communication.SPUnit).to.not.be.undefined;

			expect(da1.communication.SPMan).to.not.be.undefined;
			expect(da1.communication.SPManMin).to.not.be.undefined;
			expect(da1.communication.SPManMax).to.not.be.undefined;

			expect(da1.communication.SPInt).to.not.be.undefined;
			expect(da1.communication.SPIntMin).to.not.be.undefined;
			expect(da1.communication.SPIntMax).to.not.be.undefined;

			expect(da1.communication.MV).to.not.be.undefined;
			expect(da1.communication.MVMan).to.not.be.undefined;
			expect(da1.communication.MVMin).to.not.be.undefined;
			expect(da1.communication.MVMax).to.not.be.undefined;
			expect(da1.communication.MVSclMax).to.not.be.undefined;
			expect(da1.communication.MVSclMin).to.not.be.undefined;
			expect(da1.communication.MVUnit).to.not.be.undefined;

			expect(da1.communication.P).to.not.be.undefined;
			expect(da1.communication.Ti).to.not.be.undefined;
			expect(da1.communication.Td).to.not.be.undefined;

			expect(Object.keys(da1.communication).length).to.equal(43);
		});
	});
});
