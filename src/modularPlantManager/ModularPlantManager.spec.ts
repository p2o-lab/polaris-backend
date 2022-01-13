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

import {PEAOptions} from '@p2olab/polaris-interface';
import {ModularPlantManager} from './ModularPlantManager';
import {PEAController} from './pea';

import * as fs from 'fs';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as peaOptions from './peaOptions.spec.json';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ModularPlantManager', () => {

	it('getAllPEAControllers(), empty', async () => {
		const modularPlantManager = new ModularPlantManager();
		expect(modularPlantManager.getAllPEAControllers()).empty;
	});

	describe('functions, which require PEA', () => {
		let modularPlantManager = new ModularPlantManager();
		let identifier = '';

		beforeEach(async function () {
			this.timeout(5000);
			modularPlantManager = new ModularPlantManager();
			const peaModel = await modularPlantManager.peaProvider.addPEAToPool({source: 'tests/testpea.zip'});
			identifier = peaModel.pimadIdentifier;
		});


		it('loadPEAController()', async () => {
			await modularPlantManager.loadPEAController(identifier);
			expect(modularPlantManager.peas.length).equal(1);
		}).timeout(5000);

		it('loadPEAController() to fail, wrong identifier', async () => {
			return expect(modularPlantManager.loadPEAController('')).to.be.rejectedWith('PEA with identifier [] not found.');
		});

	});

	describe('functions, which need PEAController instance', () => {
		let peaId='';
		let modularPlantManager: ModularPlantManager;
		let peaController: PEAController;
		const peaOptionsDummy = {
			name:'test',
			id: 'test',
			pimadIdentifier: 'test',
			username: 'admin',
			password: '1234',
			opcuaServerUrl:'localhost',
			services:[],
			dataAssemblies:[]
		};

		beforeEach(async()=>{
			peaController = new PEAController(peaOptionsDummy);
			modularPlantManager = new ModularPlantManager();
			modularPlantManager.peas.push(peaController);
			peaId = peaController.id;
		});

		it('getPEAController()',  () => {
			expect(() => modularPlantManager.getPEAController(peaId)).not.to.throw();
		});

		it('getPEAController() to fail', () => {
			expect(() => modularPlantManager.getPEAController('')).to.throw();
		});

		it('removePEAController()',  () => {
			expect(modularPlantManager.peas.length = 1);
			expect(modularPlantManager.removePEAController(peaId)).to.not.throw;
			expect(modularPlantManager.peas.length = 0);
		});

		it('removePEAController() should fail with empty peaId', () => {
			return expect(modularPlantManager.removePEAController('')).to.rejected;
		});

		it('removePEAController() should fail if pea is protected', async() => {
			const peaController = new PEAController(peaOptionsDummy);
			peaController.protection = true;
			modularPlantManager.peas.length = 0;
			modularPlantManager.peas.push(peaController);
			return expect(modularPlantManager.removePEAController(peaId)).to.rejectedWith(`PEA ${peaOptionsDummy.name} can not be deleted since it is protected.`);
		});


		it('getAllPEAControllers()',  () => {
			expect(modularPlantManager.getAllPEAControllers()).to.not.empty;
		});

		it('getService()',  async() => {
			const peaController = new PEAController(peaOptions as unknown as PEAOptions);
			modularPlantManager.peas.length = 0;
			modularPlantManager.peas.push(peaController);
			expect(()=>modularPlantManager.getService(peaId, 'Trigonometry')).to.not.throw();
		});
		it('getService() to fail, wrong peaId',  () => {
			expect(()=>modularPlantManager.getService('', 'Integral1')).to.throw();
		});
		it('getService() to fail, wrong serviceName',  () => {
			expect(()=>modularPlantManager.getService(peaId, '')).to.throw();
		});

	});
	context('ServerSettings', () => {
		const modularPlantManager = new ModularPlantManager();
		let peaController: PEAController;

		before(() => {
			peaController = new PEAController({
				name:'test',
				id: 'test',
				pimadIdentifier: 'test',
				opcuaServerUrl:'localhost',
				services:[],
				dataAssemblies:[]
			});
			modularPlantManager.peas.push(peaController);
		});


	});

	it('should load and remove recipe', () => {
		const peasRecipe =
			JSON.parse(fs.readFileSync('src/modularPlantManager/recipe/assets/recipes/recipe_time_local.spec.json').toString());
		const modularPlantManager = new ModularPlantManager();
		modularPlantManager.loadRecipe(peasRecipe);
		modularPlantManager.loadRecipe(peasRecipe, true);

		expect(modularPlantManager.recipes).to.have.lengthOf(2);

		expect(() => modularPlantManager.removeRecipe('whatever')).to.throw('Recipe whatever not found.');

		modularPlantManager.removeRecipe(modularPlantManager.recipes[0].id);
		expect(modularPlantManager.recipes).to.have.lengthOf(1);

		expect(() => modularPlantManager.removeRecipe(modularPlantManager.recipes[0].id)).to.throw('protected');
	});

	it('should load and provide pol services', () => {
		const modularPlantManager = new ModularPlantManager();
		expect(modularPlantManager.getPOLServices()).to.have.length(0);

		modularPlantManager.addPOLService({name: 'timer1', type: 'timer'});
		expect(modularPlantManager.getPOLServices()).to.have.length(1);
		expect(modularPlantManager.getPOLServices()[0]).to.have.property('name', 'timer1');

		expect(() => modularPlantManager.removePOLService('timer234')).to.throw('not available');
		modularPlantManager.removePOLService('timer1');
		expect(modularPlantManager.getPOLServices()).to.have.length(0);

		expect(() => modularPlantManager.removePOLService('timer1')).to.throw('not available');
	});

	it('should instantiate and run pol service', async () => {
		const modularPlantManager = new ModularPlantManager();
		modularPlantManager.addPOLService({name: 'timer1', type: 'timer'});
		await modularPlantManager.polServices[0].setParameters([{name: 'duration', value: 100}]);
		await modularPlantManager.polServices[0].start();
		await modularPlantManager.polServices[0].waitForStateChangeWithTimeout('COMPLETED');
	});

});
