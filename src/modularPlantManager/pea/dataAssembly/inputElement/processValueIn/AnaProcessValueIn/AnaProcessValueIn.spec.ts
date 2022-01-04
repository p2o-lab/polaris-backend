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
import {AnaProcessValueIn} from './AnaProcessValueIn';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './AnaProcessValueIn.spec.json';
import {MockupServer} from '../../../../../_utils';
import {AnaProcessValueInMockup} from './AnaProcessValueIn.mockup';
import {DataAssemblyControllerFactory} from '../../../DataAssemblyControllerFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaProcessValueIn', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/InputElement/AnaProcessValueIn',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create AnaProcessValueIn', async () => {
			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as AnaProcessValueIn;
			expect(dataAssemblyController).to.be.not.undefined;
			expect(dataAssemblyController.communication.VExt).to.be.not.undefined;
			expect(dataAssemblyController.communication.VSclMax).to.be.not.undefined;
			expect(dataAssemblyController.communication.VSclMin).to.be.not.undefined;
			expect(dataAssemblyController.communication.VUnit).to.be.not.undefined;
		});
	});

	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: AnaProcessValueInMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new AnaProcessValueInMockup(
				mockupServer.nameSpace,
				mockupServer.rootObject,
				'Variable');
			mockup.scaleSettings.vSclMax= 1;
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

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as AnaProcessValueIn;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.VExt.value).equal(0);
			expect(dataAssemblyController.communication.VUnit.value).equal(0);
			expect(dataAssemblyController.communication.VSclMin.value).equal(0);
			expect(dataAssemblyController.communication.VSclMax.value).equal(1);

		}).timeout(4000);

		it('setparameter', async () => {

			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as AnaProcessValueIn;
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			await dataAssemblyController.setParameter(1,'VExt');
			expect(mockup.vExt).equal(1);
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			expect(dataAssemblyController.communication.VExt.value).equal(1);

		}).timeout(4000);
	});
});

