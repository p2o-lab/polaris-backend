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
import * as baseDataAssemblyOptions from '../../activeElement/vlv/binVlv/monBinVlv/MonBinVlv.spec.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {MonBinVlv} from '../../activeElement';
import {Interlock} from './Interlock';
import {MockupServer} from '../../../../_utils';
import {InterlockDAMockup} from './InterlockDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Interlock', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/MonBinVlv',
		dataItems: baseDataAssemblyOptions
	};

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create Interlock', () => {
			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection) as MonBinVlv;
			const interlock = new Interlock(dataAssemblyController); //this will set communication variables
			expect(interlock).to.not.to.undefined;
			expect(dataAssemblyController.communication.PermEn).to.not.to.undefined;
			expect(dataAssemblyController.communication.Permit).to.not.to.undefined;
			expect(dataAssemblyController.communication.IntlEn).to.not.to.undefined;
			expect(dataAssemblyController.communication.Interlock).to.not.to.undefined;
			expect(dataAssemblyController.communication.ProtEn).to.not.to.undefined;
			expect(dataAssemblyController.communication.Protect).to.not.to.undefined;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new InterlockDAMockup(
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

			const dataAssemblyController = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new Interlock(dataAssemblyController);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.PermEn.value).equal(false);
			expect(dataAssemblyController.communication.Permit.value).equal(false);
			expect(dataAssemblyController.communication.IntlEn.value).equal(false);
			expect(dataAssemblyController.communication.Interlock.value).equal(false);
			expect(dataAssemblyController.communication.ProtEn.value).equal(false);
			expect(dataAssemblyController.communication.Protect.value).equal(false);
		}).timeout(5000);
	});
});
