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

import {OpcUaConnection} from '../../connection';
import {
	ActiveElement
} from './ActiveElement';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../tests/monanadrv.json';
import {MockupServer} from '../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ActiveElement', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/',
		dataItems: baseDataAssemblyOptions
	};
	describe('static', () => {
		it('should create ActiveElement', () => {
			const emptyOPCUAConnection = new OpcUaConnection();
			emptyOPCUAConnection.initialize({endpoint : ''});
			const da1 = new ActiveElement(dataAssemblyOptions, emptyOPCUAConnection);
			expect(da1).to.be.not.undefined;
			expect(da1.wqc).to.be.not.undefined;
			expect(da1.osLevel).to.not.be.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpoint : mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const da1 = new ActiveElement(dataAssemblyOptions, connection);
			const pv = da1.subscribe();
			await connection.startMonitoring();
			await pv;
			expect(da1.communication.WQC.value).equal(0);
			expect(da1.communication.OSLevel.value).equal(0);
		}).timeout(4000);
	});
});
