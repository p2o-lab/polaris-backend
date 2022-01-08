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

import {
	BaseDataAssemblyOptions, DataAssemblyOptions
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../connection';
import {DataAssemblyControllerFactory} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {getDataAssemblyOptions} from './DataAssemblyController.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssemblyFactory', () => {

	let dataAssemblyOptions: DataAssemblyOptions;

	describe('static', () => {

		dataAssemblyOptions = getDataAssemblyOptions('Variable', 'Variable', 'Test') as DataAssemblyOptions;

		const emptyOPCUAConnection = new OpcUaConnection();

		it('should use default DataAssemblyController when provided type not found', () => {
			const dataAssemblyController = DataAssemblyControllerFactory.create(dataAssemblyOptions, emptyOPCUAConnection);

			expect(dataAssemblyController.toJson()).to.deep.equal({
				name: 'Variable',
			});
		});

		it('should fail without provided PEA', async () => {
			expect(() => DataAssemblyControllerFactory.create(
				{name: 'test', metaModelRef: 'none', dataItems: {} as BaseDataAssemblyOptions},
				emptyOPCUAConnection)
			).to.throw('Creating DataAssemblyController Error: No Communication dataAssemblies found in DataAssemblyOptions');

		});
	});

	describe('dynamic with PEATestServer', () => {
		//TODO
/*
		let mockupServer: MockupServer;
		let connection: OpcUaConnection;

		beforeEach(async () => {
			mockupServer = new MockupServer();
			await mockupServer.start();
			connection = new OpcUaConnection();
            connection.initialize({endpoint: 'opc.tcp://localhost:4334/PEATestServer'});
			await connection.connect();
		});

		afterEach(async () => {
			await connection.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe and unsubscribe from ExtIntAnaOp', async () => {
			const daJson = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0].services[0].procedures[0].parameters[0];
			const da = DataAssemblyControllerFactory.create(daJson as any, connection) as AnaMan;

			await da.subscribe();

			da.setParameter(2);
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 2) {
					resolve();
				}
			}));
			expect(da.defaultWriteDataItem?.value).to.equal(2);

			await da.setParameter(3, 'VExt');
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 3) {
					resolve();
				}
			}));

			da.unsubscribe();
			da.setParameter(2);
			await Promise.race([
				new Promise((resolve, reject) => da.on('changed', reject)),
				new Promise((resolve) => setTimeout(resolve, 500))
			]);
		}).timeout(5000);

		it('should set value', async () => {
			const daJson = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0].services[0].procedures[0].parameters[0];
			const da = DataAssemblyControllerFactory.create(daJson as any, connection) as AnaMan;

			await da.subscribe();

			await da.setValue({value: 11, name: 'abc'}, []);
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 11) {
					resolve();
				}
			}));
			expect(da.defaultWriteDataItem?.value).to.equal(11);

			await da.setValue({value: 12, name: 'abc'}, []);
			await new Promise((resolve) => da.on('changed', () => {
				if (da.defaultWriteDataItem?.value === 12) {
					resolve();
				}
			}));
			expect(da.defaultWriteDataItem?.value).to.equal(12);
		}).timeout(5000);

		it('should set continuous value', async () => {
			const daPEA = JSON.parse(fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEAController(daPEA);
			await pea.connectAndSubscribe();

			const da = pea.services[0].procedures[0].parameters[0] as ServParam;
			const inputDa = pea.dataAssemblies[0];
			await da.subscribe();
			await inputDa.subscribe();

			await new Promise((resolve) => inputDa.on('changed', () => resolve()));

			da.setValue({value: '2 * PEATestServer.Variable001', name: da.name, continuous: true}, [pea]);
			const inputValue = inputDa.getDefaultReadValue();
			await new Promise((resolve) => da.on('changed', () => resolve()));
			expect(da.getDefaultReadValue()).to.be.closeTo(2 * inputValue, 0.05 * inputValue);

			await da.setValue({value: '11', name: da.name}, []);
			await new Promise((resolve) => da.on('changed', () => resolve()));
			expect(da.getDefaultReadValue()).to.equal(11);
		}).timeout(5000);*/
	});
});
