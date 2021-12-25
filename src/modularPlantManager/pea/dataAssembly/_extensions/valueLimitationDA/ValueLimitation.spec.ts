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
import * as baseDataAssemblyOptions from '../../operationElement/man/dintMan/DIntMan.spec.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {DIntMan} from '../../operationElement';
import {ValueLimitation} from './ValueLimitation';
import {MockupServer} from '../../../../_utils';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {ValueLimitationDAMockup} from './ValueLimitationDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ValueLimitation', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperatorElement/DIntMan',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create ValueLimitationDA',  () => {
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
			const valueLimitation = new ValueLimitation(da);
			expect(valueLimitation).to.not.be.undefined;
			expect((da as DIntMan).communication.VMin).to.not.be.undefined;
			expect((da as DIntMan).communication.VMax).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: ValueLimitationDAMockup<any>;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new ValueLimitationDAMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable', DataType.Double);
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
			new ValueLimitation(da1);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect(da1.communication.VMax.value).to.equal(0);
			expect(da1.communication.VMin.value).to.equal(0);
		}).timeout(5000);
	});
});
