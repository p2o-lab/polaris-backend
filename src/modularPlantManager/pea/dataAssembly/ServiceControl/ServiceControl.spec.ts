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
	BaseDataAssemblyOptions,
	DataAssemblyOptions,
	OperationMode,
	ServiceControlOptions
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../../connection';
import {PEAController} from '../../PEAController';
import {
	AnaMan,
	DataAssemblyControllerFactory,
	ServiceControl, ServParam
} from '../index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {PEAMockup} from '../../PEA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceControl', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const parseJson = require('json-parse-better-errors');

	describe('static', () => {
		const emptyOPCUAConnection = new OpcUaConnection('', '');
		it('should create ServiceControl', async () => {
			const daOptions: BaseDataAssemblyOptions = parseJson(fs.readFileSync(
				'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssemblyController/ServiceControl.json',
				'utf8'), null, 60);
			const da1: ServiceControl = DataAssemblyControllerFactory.create({
				name: 'serviceControl1',
				metaModelRef: 'ServiceControl',
				dataItems: daOptions
			} as DataAssemblyOptions, emptyOPCUAConnection) as ServiceControl;
			expect(da1 instanceof ServiceControl).to.equal(true);
			expect(da1.communication.CommandExt).to.not.equal(undefined);
			expect(da1.communication.WQC).to.not.equal(undefined);
			expect(da1.communication.TagName).to.equal(undefined);
		});

		it('should have correct check for ServiceControl', async () => {
			const daOptions: ServiceControlOptions = parseJson(fs.readFileSync(
				'assets/ModularAutomation/PEA_Reference/MTPContent/Json/DataAssemblyController/ServiceControl.json',
				'utf8'), null, 60);
			daOptions.TagName.value = 'a';
			daOptions.TagDescription.value = 'b';
			daOptions.OSLevel.value = 0;
			daOptions.WQC.value = 0;
			daOptions.CommandOp.value = 0;
			daOptions.CommandExt.value = 0;
			daOptions.CommandEn.value = 0;
			daOptions.StateCur.value = 0;
			daOptions.ProcedureCur.value = 0;
			daOptions.ProcedureInt.value = 0;
			daOptions.ProcedureExt.value = 0;
			daOptions.ProcedureOp.value = 0;
			daOptions.OpMode.value = 0;
			const da1: ServiceControl = DataAssemblyControllerFactory.create({
				name: 'serviceControl1',
				metaModelRef: 'ServiceControl',
				dataItems: daOptions
			} as DataAssemblyOptions, emptyOPCUAConnection) as ServiceControl;
		});
	});
	describe('dynamic with PEATestServer', () => {

		let peaServer: PEAMockup;
		let connection: OpcUaConnection;

		beforeEach(async () => {
			peaServer = new PEAMockup();
			//await peaServer.start();

			connection = new OpcUaConnection('PEATestServer', 'opc.tcp://127.0.0.1:4334/PEATestServer');
			await connection.connect();
		});

		afterEach(async () => {
			await connection.disconnect();
		});

		it('should subscribe and unsubscribe from ExtIntAnaOp', async () => {
			const daJson = JSON.parse(
				fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
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
			const daJson = JSON.parse(
				fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
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
			const daPEA = JSON.parse(
				fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0];
			const pea = new PEAController(daPEA);
			await pea.connect();
			peaServer.startSimulation();

			const da = pea.services[0].procedures[0].parameters[0] as ServParam;
			const inputDa = pea.variables[0];
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
		}).timeout(5000);

		it('should create ServiceControl old', async () => {
			const daJson = JSON.parse(
				fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0.json').toString())
				.peas[0].services[0];
			const da: ServiceControl = DataAssemblyControllerFactory.create(
				{...daJson, metaModelRef: 'ServiceControl'} as any, connection) as ServiceControl;

			await da.subscribe();
			expect(da.name).to.equal('Service1');
			expect(da instanceof ServiceControl).to.equal(true);

			expect(da.getOperationMode()).to.equal(OperationMode.Offline);

			await da.setToOperatorOperationMode();
			expect(da.getOperationMode()).to.equal(OperationMode.Operator);

			await da.writeOpMode(OperationMode.Offline);
			await da.waitForOpModeToPassSpecificTest(OperationMode.Offline);

			await da.setToAutomaticOperationMode();
			expect(da.getOperationMode()).to.equal(OperationMode.Automatic);
		}).timeout(8000);

		it('should create ServiceControl new', async () => {
			const daJson = JSON.parse(
				fs.readFileSync('assets/ModularAutomation/pea_testserver_1.0.0_2.json').toString())
				.peas[0].services[0];
			const da: ServiceControl = DataAssemblyControllerFactory.create(
				{...daJson, metaModelRef: 'ServiceControl'} as any, connection) as ServiceControl;

			await da.subscribe();
			expect(da.name).to.equal('Service1');
			expect(da instanceof ServiceControl).to.equal(true);

			expect(da.getOperationMode()).to.equal(OperationMode.Offline);

			await da.setToOperatorOperationMode();
			expect(da.getOperationMode()).to.equal(OperationMode.Operator);

			await da.writeOpMode(OperationMode.Offline);
			await da.waitForOpModeToPassSpecificTest(OperationMode.Offline);

			await da.setToAutomaticOperationMode();
			expect(da.getOperationMode()).to.equal(OperationMode.Automatic);
		}).timeout(8000);

	});

});
