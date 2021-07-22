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
import * as baseDataAssemblyOptions from '../../../../../../tests/dintmanint.json';
import {DataAssemblyController} from '../../DataAssemblyController';
import {ScaleSettings} from '../scaleSettingsDA/ScaleSettings';
import {DIntMan} from '../../operationElement';
import {UnitSettings} from './UnitSettings';
import {MockupServer} from '../../../../_utils';
import {OSLevelDAMockup} from '../osLevelDA/OSLevelDA.mockup';
import {Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {OSLevel} from '../osLevelDA/OSLevel';
import {UnitDAMockup} from './UnitDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('UnitSettings', () => {
	const dataAssemblyOptions: DataAssemblyOptions = {
		name: 'Variable',
		metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/OperatorElement/DIntMan',
		dataItems: baseDataAssemblyOptions
	};
	// set namespaceUrl
	for (const key in dataAssemblyOptions.dataItems as any) {
		//skip static values
		if ((typeof (dataAssemblyOptions.dataItems as any)[key] != 'string')) {
			(dataAssemblyOptions.dataItems as any)[key].namespaceIndex = namespaceUrl;
		}
	}
	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create UnitSettings',  () => {
			const da = new DataAssemblyController(dataAssemblyOptions, emptyOPCUAConnection);
			const unitSettings = new UnitSettings(da);
			expect(unitSettings).to.not.be.undefined;
			expect((da as DIntMan).communication.VUnit).to.not.be.undefined;
			expect(unitSettings.getUnit()).to.be.empty;
		});
	});
	describe('dynamic', () => {
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		let mockup: UnitDAMockup;

		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			mockup = new UnitDAMockup(
				mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject,
				'Variable');
			await mockupServer.start();
			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334', '', '');
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			const da1 = new DataAssemblyController(dataAssemblyOptions, connection) as any;
			new UnitSettings(da1);
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;
			expect(da1.communication.VUnit.value).to.equal(0);
		}).timeout(5000);
	});
});
