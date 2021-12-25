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
import * as baseDataAssemblyOptionsStatic from '../../../../../../tests/binmon_static.json';
import {BinMon, IndicatorElement} from '../../indicatorElement';
import {DataAssemblyController} from '../../DataAssemblyController';
import {WQC} from './WQC';
import * as baseDataAssemblyOptions from '../../indicatorElement/BinView/BinMon/BinMon.spec.json';
import {MockupServer} from '../../../../_utils';
import {WQCDAMockup} from './WQCDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('WQCDA', () => {
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

	describe('static WQC', () => {
		let wqcObject: any;
		let da: any;
		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection();

			da = new DataAssemblyController(dataAssemblyOptionsStatic, emptyOPCUAConnection);
			wqcObject = new WQC(da);
		});

		it('should create WQC', async () => {
			expect(wqcObject.wqc).to.equal(0);
			expect((da as BinMon).communication.WQC).to.be.undefined;
		});

		it('getter', async () => {
			expect(wqcObject.WQC).to.equal(0);
		});
		//TODO: toJson();
	});
	describe('dynamic WQC', () => {
		let wqcObject: any;
		let da: any;
		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection();
			da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
			wqcObject = new WQC(da);
		});

		it('should create OSLevel', async () => {
			expect(wqcObject.wqc).to.be.undefined;
			expect((da as BinMon).communication.WQC).to.not.be.undefined;
		});

		it('getter', async () => {
			expect(wqcObject.WQC).to.be.undefined;
		});
		//TODO: toJson();
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: WQCDAMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new WQCDAMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			const da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new WQC(da1);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect(da1.communication.WQC.value).to.equal(0);
		}).timeout(5000);
	});
});
