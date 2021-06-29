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

import {AggregatedServiceOptions, ServerSettingsOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {LoadOptions, ModularPlantManager} from './ModularPlantManager';
import {PEAController, Service} from './pea';
import {ServiceState} from './pea/dataAssembly';

import * as fs from 'fs';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {MockupServer} from './_utils';
import * as AdmZip from 'adm-zip';
import {PEAModel} from '@p2olab/pimad-core/dist/ModuleAutomation';
import {logger} from '@p2olab/pimad-core';
import {timeout} from 'promise-timeout';
import * as peaModel from '../../tests/peaModel.json';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ModularPlantManager', () => {
	const parseJson = require('json-parse-better-errors');

	it('getAllPEAControllers()',  async() => {
		const modularPlantManager = new ModularPlantManager();
		expect(modularPlantManager.getAllPEAControllers()).empty;
	});

	it('addPEAToPimadPool()',  async() => {
		const modularPlantManager = new ModularPlantManager();
		const peaModel = await modularPlantManager.addPEAToPimadPool({source: 'tests/testpea.zip'});
		expect(peaModel).to.not.be.undefined;

	});
	it('addPEAToPimadPool() fails',  () => {
		const modularPlantManager = new ModularPlantManager();
		return expect(modularPlantManager.addPEAToPimadPool({source: 'tests/stringview.json'})).to.be.rejected;
	});

	it('getAllPEAsFromPimadPool(), empty',  async() => {
		const modularPlantManager = new ModularPlantManager();
		return expect(modularPlantManager.getAllPEAsFromPimadPool()).to.be.empty;
	});

	describe('functions, which need PiMAdPEA', () => {
		let modularPlantManager = new ModularPlantManager();
		let pimadId = '';

		beforeEach(async () => {
			modularPlantManager = new ModularPlantManager();
			const peaModel = await modularPlantManager.addPEAToPimadPool({source: 'tests/testpea.zip'});
			pimadId = peaModel.pimadIdentifier;
		});

		it('getPEAFromPimadPool()', () => {
			return expect(modularPlantManager.getPEAFromPimadPool(pimadId)).to.not.be.rejected;
		});
		it('getPEAFromPimadPool() to fail', () => {
			return expect(modularPlantManager.getPEAFromPimadPool('')).to.be.rejected;
		});

		it('getAllPEAsFromPimadPool()', () => {
			return expect(modularPlantManager.getAllPEAsFromPimadPool()).to.not.be.rejected;
		});


		it('loadPEAController()', async () => {
			const peaControllers = await modularPlantManager.loadPEAController(pimadId);
			const peaController = peaControllers[0];
			const peaId = peaController.id;
			expect(modularPlantManager.peas.length).equal(1);
			//expect(() => modularPlantManager.getPEAController(peaId)).not.to.throw();
		});
		it('loadPEAController() to fail', async () => {
			return expect(modularPlantManager.loadPEAController('')).to.be.rejected;
		});

		it('deletePEAFromPimadPool()', () => {
			return expect(modularPlantManager.deletePEAFromPimadPool(pimadId)).to.not.throw;
		});
		it('deletePEAFromPimadPool() to fail', () => {
			return expect(modularPlantManager.deletePEAFromPimadPool('')).to.be.rejected;
		});
	});

	describe('functions, which need PEAController instance', () => {
		let peaId='';
		let modularPlantManager: ModularPlantManager;
		let pimadId = '';
		before(async()=>{
			modularPlantManager = new ModularPlantManager();
			const peaModel = await modularPlantManager.addPEAToPimadPool({source: 'tests/testpea.zip'});
			pimadId = peaModel.pimadIdentifier;
			const peaControllers = await modularPlantManager.loadPEAController(pimadId);
			const peaController = peaControllers[0];
			peaId = peaController.id;
		});

		it('getPEAController()',  () => {
			expect(() => modularPlantManager.getPEAController(peaId)).not.to.throw();
		});

		it('getPEAController() to fail', () => {
			expect(() => modularPlantManager.getPEAController('')).to.throw();
		});

		it('removePEAController()',  () => {
			return expect(modularPlantManager.removePEAController(peaId)).to.not.rejected;
		});

		it('removePEAController() to fail, wrong peaId', () => {
			return expect(modularPlantManager.removePEAController('')).to.rejected;
		});
		it('removePEAController() to fail, protected', async() => {
			const peaModel = await modularPlantManager.addPEAToPimadPool({source: 'tests/testpea.zip'});
			pimadId = peaModel.pimadIdentifier;
			const peaControllers = await modularPlantManager.loadPEAController(pimadId, true);
			const peaController = peaControllers[0];
			peaId = peaController.id;
			return expect(modularPlantManager.removePEAController('')).to.rejected;
		});
		it('updateServerSettings()', async () => {
			// instantiate PEAController first
			const peaControllers = await modularPlantManager.loadPEAController(pimadId);
			const peaController = peaControllers[0];
			const peaId = peaController.id;
			const options: ServerSettingsOptions = {
				id: peaId,
				username: 'Bob',
				password: '1234',
				serverUrl: 'url',
			};
			modularPlantManager.updateServerSettings(options);
			expect(peaController.connection.endpoint).equals('url');
			expect(peaController.connection.username).equals('Bob');
			expect(peaController.connection.password).equals('1234');
		});

		it('getAllPEAControllers()',  () => {
			expect(modularPlantManager.getAllPEAControllers()).to.not.empty;
		});

		it('getService()',  async() => {
			expect(()=>modularPlantManager.getService(peaId, 'Integral1')).to.not.throw();
			expect(()=>modularPlantManager.getService(peaId, 'Integral2')).to.not.throw();
			expect(()=>modularPlantManager.getService(peaId, 'Trigonometry')).to.not.throw();
		});
		it('getService() to fail, wrong peaId',  () => {
			expect(()=>modularPlantManager.getService('', 'Integral1')).to.throw();
		});
		it('getService() to fail, wrong serviceName',  () => {
			expect(()=>modularPlantManager.getService(peaId, '')).to.throw();
		});
		it('connect()',  async() => {
			//await modularPlantManager.getPEAController(peaId).connect();
		});
	});


	context('loading', () => {

	/*	it('should reject loading PEAs with empty options', () => {
			const modularPlantManager = new ModularPlantManager();
			expect(() => modularPlantManager.loadPEAController({})).to.throw();
			expect(() => modularPlantManager.loadPEAController({someattribute: 'abc'} as any)).to.throw();
		});*/

		/*it('should loadPEAControllerPEAController with single PEAController', () => {
			const peasJson = JSON.parse(fs.readFileSync('assets/peas/pea_cif.json').toString());
			const peaJson = peasJson.peas[0];
			const modularPlantManager = new ModularPlantManager();
			modularPlantManager.loadPEAController({pea: peaJson});
			expect(() => modularPlantManager.loadPEAController({pea: peaJson})).to.throw('already in registered PEAs');
		});

		it('should load with subMP options', () => {
			const peasJson = JSON.parse(fs.readFileSync('assets/peas/pea_cif.json').toString());
			const modularPlantManager = new ModularPlantManager();
			modularPlantManager.loadPEAController({subMP: [peasJson]});
			expect(() => modularPlantManager.loadPEAController({subMP: [peasJson]})).to.throw('already in registered PEAs');
		});
*/
		/*it('should load the Achema PEAs', async () => {
			const modularPlantManager = new ModularPlantManager();
			const peas = modularPlantManager.loadPEAController(
				JSON.parse(fs.readFileSync('assets/peas/achema_demonstrator/peas_achema.json').toString()),
				true);
			expect(peas).to.have.lengthOf(3);

			expect(modularPlantManager.loadPEAController).to.have.lengthOf(3);

			const service = modularPlantManager.getService('Dose', 'Fill');
			expect(service).to.be.instanceOf(Service);
			expect(service.name).to.equal('Fill');
			expect(() => modularPlantManager.getService('Dose', 'NoService')).to.throw();
			expect(() => modularPlantManager.getService('NoPEA', 'NoService')).to.throw();

			await expect(modularPlantManager.removePEAController('something')).to.be.rejectedWith('PEAController with id something not found');
		});*/

		it('should prevent removing a protected PEAController', async () => {
			const modularPlantManager = new ModularPlantManager();
			modularPlantManager.loadPEAController(
				JSON.parse(fs.readFileSync('assets/peas/pea_cif.json').toString()),
				true);
			await expect(modularPlantManager.removePEAController(modularPlantManager.peas[0].id)).to.be.rejectedWith(/is protected/);
		});
	});

	it('should load and remove recipe', () => {
		const peasRecipe =
			JSON.parse(fs.readFileSync('assets/recipes/test/recipe_time_local.json').toString());
		const modularPlantManager = new ModularPlantManager();
		modularPlantManager.loadRecipe(peasRecipe);
		modularPlantManager.loadRecipe(peasRecipe, true);

		expect(modularPlantManager.recipes).to.have.lengthOf(2);

		expect(() => modularPlantManager.removeRecipe('whatever')).to.throw('not available');

		modularPlantManager.removeRecipe(modularPlantManager.recipes[0].id);
		expect(modularPlantManager.recipes).to.have.lengthOf(1);

		expect(() => modularPlantManager.removeRecipe(modularPlantManager.recipes[0].id)).to.throw('protected');
	});

	it('should load and provide pol services', () => {
		const modularPlantManager = new ModularPlantManager();
		expect(modularPlantManager.getPOLServices()).to.have.length(0);

		modularPlantManager.instantiatePOLService({name: 'timer1', type: 'timer'});
		expect(modularPlantManager.getPOLServices()).to.have.length(1);
		expect(modularPlantManager.getPOLServices()[0]).to.have.property('name', 'timer1');

		expect(() => modularPlantManager.removePOLService('timer234')).to.throw('not available');
		modularPlantManager.removePOLService('timer1');
		expect(modularPlantManager.getPOLServices()).to.have.length(0);

		expect(() => modularPlantManager.removePOLService('timer1')).to.throw('not available');
	});

	it('should instantiate and run pol service', async () => {
		const modularPlantManager = new ModularPlantManager();
		modularPlantManager.instantiatePOLService({name: 'timer1', type: 'timer'});
		await modularPlantManager.polServices[0].setParameters([{name: 'duration', value: 100}]);
		await modularPlantManager.polServices[0].start();
		await modularPlantManager.polServices[0].waitForStateChangeWithTimeout('COMPLETED');
	});

	describe('test with Mockup Server', function () {
		this.timeout(5000);
		let mockupServer: MockupServer;

		before(async () => {
			mockupServer = new MockupServer();
			await mockupServer.start();
		});

		after(async () => {
			await mockupServer.shutdown();
		});

		it('should load from options, stop, abort and reset manager and remove PEAController', async () => {
			const peaJson = parseJson(
				fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'), null, 60);

			const modularPlantManager = new ModularPlantManager();
			modularPlantManager.loadPEAController(peaJson);
			expect(modularPlantManager.peas).to.have.lengthOf(1);

			const pea = modularPlantManager.peas[0];
			const service1 = pea.services[0];
			const service2 = pea.services[1];

			await pea.connectAndSubscribe();
			await service2.executeCommand(ServiceCommand.start);
			await service2.waitForStateChangeWithTimeout('EXECUTE');

			await modularPlantManager.stopAllServices();
			await service2.waitForStateChangeWithTimeout('STOPPED');
			expect(service2.state).to.equal(ServiceState.STOPPED);

			await modularPlantManager.abortAllServices();
			await Promise.all([
				service1.waitForStateChangeWithTimeout('ABORTED'),
				service2.waitForStateChangeWithTimeout('ABORTED')]
			);
			expect(service1.state).to.equal(ServiceState.ABORTED);
			expect(service2.state).to.equal(ServiceState.ABORTED);

			await modularPlantManager.resetAllServices();
			await service2.waitForStateChangeWithTimeout('IDLE');
			expect(service2.state).to.equal(ServiceState.IDLE);

			//await modularPlantManager.removePEA(pea.id);
			expect(modularPlantManager.peas).to.have.lengthOf(0);
		}).timeout(5000);

		it('should AutoReset service', async () => {
			const peaJson = parseJson(
				fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'), null, 60);

			const modularPlantManager = new ModularPlantManager();
			modularPlantManager.autoreset = true;
			modularPlantManager.loadPEAController(peaJson);

			const pea = modularPlantManager.peas[0];
			const service = pea.services[1];

			await pea.connectAndSubscribe();
			await service.executeCommand(ServiceCommand.start);
			await service.waitForStateChangeWithTimeout('EXECUTE');

			await service.executeCommand(ServiceCommand.complete);
			await service.waitForStateChangeWithTimeout('COMPLETED');
			await service.waitForStateChangeWithTimeout('IDLE');
		});

		it('should load two PEAs and an aggregated service', async () => {
			const modularPlantManager = new ModularPlantManager();

			const peaJson: LoadOptions = parseJson(
				fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8'), null, 60);

			//peaJson.peas[0].id = 'PEA1';
		//	modularPlantManager.loadPEAController(peaJson);
			//peaJson.peas[0].id = 'PEA2';
		//	modularPlantManager.loadPEAController(peaJson);

			const asJson: AggregatedServiceOptions = parseJson(
				fs.readFileSync('assets/polService/aggregatedService_peatestserver.json', 'utf8'), null, 60);
			modularPlantManager.instantiatePOLService(asJson);
		});

	});

});
