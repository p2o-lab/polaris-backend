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
import {BinMon} from '../../indicatorElement';
import {DataAssemblyController} from '../../DataAssemblyController';
import {WQC} from './WQC';
import * as baseDataAssemblyOptions from './WQC.spec.json';
import {MockupServer} from '../../../../_utils';
import {WQCDAMockup} from './WQCDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

const staticWQC = {
	TagName: 'Variable',
	TagDescription: 'Test',
	WQC: { value: '255'}
};

describe('WQCDA', () => {
	const dataAssemblyOptionsStatic: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
		dataItems: staticWQC
	};
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/BinMon',
		dataItems: baseDataAssemblyOptions
	};

	describe('static WQC', () => {

		let wqcObject: WQC;
		let da: DataAssemblyController;

		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection();

			da = new DataAssemblyController(dataAssemblyOptionsStatic, emptyOPCUAConnection);
		});

		it('should create WQC', async () => {
			wqcObject = new WQC(da);
			expect((da as BinMon).communication.WQC).to.be.exist;
		});

		it('getter', async () => {
			wqcObject = new WQC(da);
			expect(wqcObject.WQC).to.equal(255);
		});
	});
	describe('dynamic WQC', () => {

		let wqcObject: WQC;
		let da: DataAssemblyController;

		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection();
			da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
		});

		it('should create WQC', async () => {
			wqcObject = new WQC(da);
			expect((da as BinMon).communication.WQC).to.exist;
		});

		it('getter', async () => {
			wqcObject = new WQC(da);
			expect(wqcObject.WQC).to.equal(255);
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new WQCDAMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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
			const wqcObject = new WQC(da1);
			da1.subscribe();
			await connection.startMonitoring();
			expect(wqcObject.WQC).to.equal(255);
		}).timeout(5000);
	});
});
