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
			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as AnaProcessValueIn;
			expect(da1).to.be.not.undefined;
			expect(da1.communication.VExt).to.be.not.undefined;
			expect(da1.communication.VSclMax).to.be.not.undefined;
			expect(da1.communication.VSclMin).to.be.not.undefined;
			expect(da1.communication.VUnit).to.be.not.undefined;
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

			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as AnaProcessValueIn;
			const pv =  da1.subscribe();
			await connection.startMonitoring();
			await pv;

			expect(da1.communication.VExt.value).equal(0);
			expect(da1.communication.VUnit.value).equal(0);
			expect(da1.communication.VSclMin.value).equal(0);
			expect(da1.communication.VSclMax.value).equal(1);

		}).timeout(4000);

		it('setparameter', async () => {

			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as AnaProcessValueIn;
			const pv =  da1.subscribe();
			await connection.startMonitoring();
			await pv;

			await da1.setParameter(1,'VExt');
			expect(mockup.vExt).equal(1);
			//TODO: problem= we have to wait for the variable to change (EventEmitter), maybe this is not optimal
			await new Promise(f => setTimeout(f, 1000));
			expect(da1.communication.VExt.value).equal(1);

		}).timeout(4000);
	});
});

