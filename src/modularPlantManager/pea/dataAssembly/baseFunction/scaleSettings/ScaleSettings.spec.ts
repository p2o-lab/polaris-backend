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
import {DataAssemblyController} from '../../DataAssemblyController';
import {ScaleSettings} from './ScaleSettings';
import {MockupServer} from '../../../../_utils';
import {ScaleSettingMockup} from './ScaleSetting.mockup';
import {getDIntManOptions} from '../../operationElement/man/dintMan/DIntMan.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ScaleSettings', () => {

	const dataAssemblyOptions = getDIntManOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create ScaleSettings', async () => {
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as any;
			const scaleSettings = new ScaleSettings(da);
			expect(scaleSettings).to.not.be.undefined;
			expect(da.communication.VSclMax).to.not.be.undefined;
			expect(da.communication.VSclMin).to.not.be.undefined;
		});
	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new ScaleSettingMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', 'Ana');
			await mockupServer.start();
			connection = new OpcUaConnection();
			connection.initialize({endpointUrl: mockupServer.endpoint});
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new ScaleSettings(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			expect(dataAssemblyController.communication.VSclMin.value).equal(0);
			expect(dataAssemblyController.communication.VSclMax.value).equal(0);
		}).timeout(5000);
	});
});
