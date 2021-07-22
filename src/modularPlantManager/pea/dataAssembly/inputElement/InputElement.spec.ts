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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import * as baseDataAssemblyOptions from '../../../../../tests/binprocessvaluein.json';
import {MockupServer} from '../../../_utils';
import {Namespace, UAObject} from 'node-opcua';
import {namespaceUrl} from '../../../../../tests/namespaceUrl';
import {InputElementMockup} from './InputElement.mockup';
import {InputElement} from './InputElement';
import {DataAssemblyControllerFactory} from '../DataAssemblyControllerFactory';
import {OSLevel, WQC} from '../_extensions';
import {ActiveElementMockup} from '../activeElement/ActiveElement.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('InputElement', () => {
	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create InputElement', async () => {
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: 'Variable',
				metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/InputElement/BinProcessValueIn',
				dataItems: baseDataAssemblyOptions
			};
			//TODO: problem with circular dependencies, new InputElement() does not work
			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection) as InputElement;
			//const da1 = new InputElement(dataAssemblyOptions, emptyOPCUAConnection);

			expect(da1).to.be.not.undefined;
			expect(da1.communication).to.be.not.undefined;
			expect(da1.wqc).to.be.not.undefined;
		});
	});

	describe('dynamic', () => {
		const dataAssemblyOptions: DataAssemblyOptions = {
			name: 'Variable',
			metaModelRef: 'MTPDataObjectSUCLib/DataAssembly/InputElement/',
			dataItems: baseDataAssemblyOptions
		};
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;
		// set namespaceUrl
		for (const key in dataAssemblyOptions.dataItems as any) {
			//skip static values
			if((typeof(dataAssemblyOptions.dataItems as any)[key] != 'string')){
				(dataAssemblyOptions.dataItems as any)[key].namespaceIndex = namespaceUrl;
			}
		}
		beforeEach(async function () {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockup = new InputElementMockup(
				mockupServer.namespace as Namespace,
				mockupServer.rootComponent as UAObject,
				'Variable');

			await mockupServer.start();
			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334','','');
			await connection.connect();
		});

		afterEach(async function () {
			this.timeout(4000);
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {
			//TODO: problem with circular dependencies, new InputElement() does not work
			//const da1 = new InputElement(dataAssemblyOptions, connection);
			const da1 = DataAssemblyControllerFactory.create(dataAssemblyOptions, connection) as InputElement;
			new WQC(da1);
			const pv = da1.subscribe();
			await connection.startListening();
			await pv;
			expect(da1.communication.WQC.value).equal(0);
		}).timeout(4000);
		//TODO toJSON
	});
});
