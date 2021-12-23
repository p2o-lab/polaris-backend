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
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {PEAMockup} from '../../../../PEA.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../../../tests/binprocessvaluein.json';
import {MockupServer} from '../../../../../_utils';
import {BinProcessValueInMockup} from '../BinProcessValueIn/BinProcessValueIn.mockup';
import {Namespace, UAObject} from 'node-opcua';

import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {BinProcessValueIn} from './BinProcessValueIn';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinProcessValueIn', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/InputElement/BinProcessValueIn',
		dataItems: baseDataAssemblyOptions
	};

	describe('', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create BinProcessValueIn', () => {

			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as BinProcessValueIn;

			expect(da1).to.be.not.undefined;
			expect(da1.communication.VExt).to.be.not.undefined;
			expect(da1.communication.VState0).to.be.not.undefined;
			expect(da1.communication.VState1).to.be.not.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: BinProcessValueInMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new BinProcessValueInMockup(
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
			const da1 = new BinProcessValueIn(dataAssemblyOptions, connection);
			const pv =  da1.subscribe();
			await connection.startMonitoring();
			await pv;

			expect(da1.communication.VExt.value).equal(false);
			expect(da1.communication.VState0.value).equal('state0_active');
			expect(da1.communication.VState1.value).equal('state1_active');
		}).timeout(4000);

		it('setparameter', async () => {
			const da1 = new BinProcessValueIn(dataAssemblyOptions, connection);
			const pv =  da1.subscribe();
			await connection.startMonitoring();
			await pv;

			await da1.setParameter(true,'VExt');
			await da1.setParameter('test','VState0');
			await da1.setParameter('test','VState1');

			expect(mockup.vExt).equal(true);
			//TODO: problem: we have to wait for the variable to change (EventEmitter), maybe this is not optimal
			await new Promise(f => setTimeout(f, 1000));
			expect(da1.communication.VExt.value).equal(true);
			expect(da1.communication.VState0.value).equal('test');
			expect(da1.communication.VState1.value).equal('test');
		}).timeout(4000);

		it('setValue', async () => {
			// TODO
		}).timeout(4000);

		it('tojson', async () => {
			// TODO
		}).timeout(4000);
	});
});
