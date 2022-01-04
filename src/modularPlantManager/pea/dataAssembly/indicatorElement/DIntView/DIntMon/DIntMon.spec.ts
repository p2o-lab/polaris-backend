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
import {DIntMon} from './DIntMon';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from './DIntMon.spec.json';
import {MockupServer} from '../../../../../_utils';
import {DIntMonMockup} from './DIntMon.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntMon', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/DIntMon',
		dataItems: baseDataAssemblyOptions
	};
	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection();
		it('should create DIntMon', async () => {
			const dataAssemblyController: DIntMon= new DIntMon(dataAssemblyOptions, emptyOPCUAConnection);
			expect(dataAssemblyController instanceof DIntMon).to.equal(true);

			expect(dataAssemblyController.tagName).to.equal('Variable');
			expect(dataAssemblyController.tagDescription).to.equal('Test');

			expect(dataAssemblyController.communication.V).to.not.equal(undefined);
			expect(dataAssemblyController.communication.WQC).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VSclMax).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VSclMin).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VUnit).to.not.equal(undefined);

			expect(dataAssemblyController.communication.OSLevel).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VAHEn).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VAHLim).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VAHAct).to.not.equal(undefined);

			expect(dataAssemblyController.communication.VWHEn).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VWHLim).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VWHAct).to.not.equal(undefined);

			expect(dataAssemblyController.communication.VTHEn).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VTHLim).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VTHAct).to.not.equal(undefined);

			expect(dataAssemblyController.communication.VTLEn).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VTLLim).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VTLAct).to.not.equal(undefined);

			expect(dataAssemblyController.communication.VWLEn).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VWLLim).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VWLAct).to.not.equal(undefined);

			expect(dataAssemblyController.communication.VALEn).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VALLim).to.not.equal(undefined);
			expect(dataAssemblyController.communication.VALAct).to.not.equal(undefined);
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			new DIntMonMockup( mockupServer.nameSpace, mockupServer.rootObject,'Variable');
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

			const dataAssemblyController = new DIntMon(dataAssemblyOptions, connection);
			await dataAssemblyController.subscribe();
			await connection.startMonitoring();
			await new Promise((resolve => dataAssemblyController.on('changed', resolve)));

			expect(dataAssemblyController.communication.V.value).equal(0);
			expect(dataAssemblyController.communication.WQC.value).equal(0);
			expect(dataAssemblyController.communication.VUnit.value).equal(0);
			expect(dataAssemblyController.communication.VSclMin.value).equal(0);
			expect(dataAssemblyController.communication.VSclMax.value).equal(0);

			expect(dataAssemblyController.communication.OSLevel.value).to.equal(0);
			expect(dataAssemblyController.communication.VAHEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VAHLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VAHAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VWHEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VWHLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VWHAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VTHEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VTHLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VTHAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VTLEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VTLLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VTLAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VWLEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VWLLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VWLAct.value).to.equal(false);

			expect(dataAssemblyController.communication.VALEn.value).to.equal(false);
			expect(dataAssemblyController.communication.VALLim.value).to.equal(0);
			expect(dataAssemblyController.communication.VALAct.value).to.equal(false);

		}).timeout(4000);
	});
});
