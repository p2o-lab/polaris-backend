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
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../../_utils';
import {BinProcessValueInMockup, getBinProcessValueInOptions} from './BinProcessValueIn.mockup';

import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';
import {BinProcessValueIn} from './BinProcessValueIn';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinProcessValueIn', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		const emptyOPCUAConnection = new OpcUaConnection();
		dataAssemblyOptions = getBinProcessValueInOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

		it('should create BinProcessValueIn', () => {

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as BinProcessValueIn;

			expect(dataAssemblyController).to.be.not.undefined;
			expect(dataAssemblyController.communication.VExt).to.be.not.undefined;
			expect(dataAssemblyController.communication.VState0).to.be.not.undefined;
			expect(dataAssemblyController.communication.VState1).to.be.not.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let binProcessValueInMockup: BinProcessValueInMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			binProcessValueInMockup = new BinProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
			dataAssemblyOptions = binProcessValueInMockup.getDataAssemblyOptions();
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
			const dataAssemblyController = new BinProcessValueIn(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.VExt.value).equal(false);
			expect(dataAssemblyController.communication.VState0.value).equal('state0_active');
			expect(dataAssemblyController.communication.VState1.value).equal('state1_active');
		}).timeout(4000);

		it('set Parameter', async () => {
			const dataAssemblyController = new BinProcessValueIn(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			await dataAssemblyController.setParameter(true,'VExt');
			await dataAssemblyController.setParameter('test','VState0');
			await dataAssemblyController.setParameter('test','VState1');

			expect(binProcessValueInMockup.vExt).equal(true);

			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			expect(dataAssemblyController.communication.VExt.value).equal(true);
			expect(dataAssemblyController.communication.VState0.value).equal('test');
			expect(dataAssemblyController.communication.VState1.value).equal('test');
		}).timeout(8000);

	});
});
