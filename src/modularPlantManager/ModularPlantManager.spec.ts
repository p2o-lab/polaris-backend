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
	PEAOptions,
	ServerSettingsOptions,
} from '@p2olab/polaris-interface';
import {ModularPlantManager} from './ModularPlantManager';
import {PEAController} from './pea';

import * as fs from 'fs';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as peaOptions from './peaOptions.spec.json';

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

describe('ModularPlantManager', () => {

	it('getAllPEAControllers(), empty', async () => {
		const modularPlantManager = new ModularPlantManager();
		expect(modularPlantManager.getAllPEAControllers()).empty;
	});

	it('addPEAToPimadPool()', async () => {
		const modularPlantManager = new ModularPlantManager();
		const peaModel = await modularPlantManager.addPEAToPimadPool({source: 'tests/testpea.zip'});
		expect(peaModel).to.not.be.undefined;

	});
	it('addPEAToPimadPool() fails', () => {
		const modularPlantManager = new ModularPlantManager();
		return expect(modularPlantManager.addPEAToPimadPool({source: 'tests/StringView.spec.json'})).to.be.rejected;
	});

	it('getAllPEAsFromPimadPool(), empty', async () => {
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
			await modularPlantManager.loadPEAController(pimadId);
			expect(modularPlantManager.peas.length).equal(1);
		});

		it('loadPEAController() to fail, wrong pimadIdentifier', async () => {
			return expect(modularPlantManager.loadPEAController('')).to.be.rejectedWith('No valid PiMAd Identifier');
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
			const peaController = new PEAController(peaOptionsDummy, true);
			modularPlantManager.peas.length = 0;
			modularPlantManager.peas.push(peaController);
			return expect(modularPlantManager.removePEAController(peaId)).to.rejectedWith(`PEA ${peaOptionsDummy.name} is protected and thus can not be deleted`);
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
				username: 'admin',
				password: '1234',
				opcuaServerUrl:'localhost',
				services:[],
				dataAssemblies:[]
			});
			modularPlantManager.peas.push(peaController);
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

});
