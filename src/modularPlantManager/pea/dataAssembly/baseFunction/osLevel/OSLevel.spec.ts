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
import {OSLevel} from './OSLevel';
import {DataAssemblyController} from '../../DataAssemblyController';
import {MockupServer} from '../../../../_utils';
import {OSLevelMockup} from './OSLevel.mockup';
import {getBinMonOptions} from '../../indicatorElement/BinView/BinMon/BinMon.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OSLevel', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		dataAssemblyOptions = getBinMonOptions(2, 'Variable', 'Variable') as DataAssemblyOptions;
		let osLevelObject: OSLevel;
		let da: any;

		beforeEach(()=>{
			const emptyOPCUAConnection = new OpcUaConnection();
			da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
			osLevelObject = new OSLevel(da);
		});

		it('should create OSLevel', async () => {
			expect(osLevelObject.osLevel).to.equal(0);
			expect(da.communication.OSLevel).to.not.be.undefined;
		});

		it('getter', async () => {
			expect(osLevelObject.osLevel).to.equal(0);
		});

	});
	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new OSLevelMockup( mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
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
			new OSLevel(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));
			expect(dataAssemblyController.communication.OSLevel.value).to.equal(0);
		}).timeout(5000);
	});
});
