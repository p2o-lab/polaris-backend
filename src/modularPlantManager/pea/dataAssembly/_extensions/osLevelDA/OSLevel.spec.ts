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
import * as baseDataAssemblyOptions from '../../../../../../tests/binmon.json';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {PEAMockup} from '../../../PEA.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptionsStatic from '../../../../../../tests/binmon_static.json';
import {BinMon} from '../../indicatorElement';
import {OSLevel} from './OSLevel';
import {DataAssemblyController} from '../../DataAssemblyController';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OSLevel', () => {
	const dataAssemblyOptionsStatic: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
		dataItems: baseDataAssemblyOptionsStatic
	};
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
		dataItems: baseDataAssemblyOptions
	};

	describe('static OSLevel', () => {
		let oslevelObject: any;
		let da: any;
		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection('', '');
			da = new DataAssemblyController(dataAssemblyOptionsStatic, emptyOPCUAConnection);
			oslevelObject = new OSLevel(da);
		});

		it('should create OSLevel', async () => {
			expect(oslevelObject.OSLevel).to.equal(0);
			expect((da as BinMon).communication.OSLevel).to.be.undefined;
		});

		it('getter', async () => {
			expect(oslevelObject.OSLevel).to.equal(0);
		});
		//TODO: toJson();
	});
	describe('dynamic OSLevel', () => {
		let oslevelObject: any;
		let da: any;
		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection('', '');
			da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
			oslevelObject = new OSLevel(da);
		});

		it('should create OSLevel', async () => {
			expect(oslevelObject.OSLevel).to.be.undefined;
			expect((da as BinMon).communication.OSLevel).to.not.be.undefined;
		});

		it('getter', async () => {
			expect(oslevelObject.OSLevel).to.be.undefined;
		});
		//TODO: toJson();
	});

});
