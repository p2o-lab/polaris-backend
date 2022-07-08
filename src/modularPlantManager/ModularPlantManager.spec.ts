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

import {ModularPlantManager} from './ModularPlantManager';
import {PEA} from './pea';

import * as fs from 'fs';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as peaModel from './peaModel.spec.json';
import {PEAModel} from '@p2olab/pimad-interface';
import {getEmptyPEAModel} from './pea/PEA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ModularPlantManager', () => {

	it('getAllPEAControllers(), empty', async () => {
		const modularPlantManager = new ModularPlantManager();
		expect(modularPlantManager.getAllPEAs()).empty;
	});

	describe('functions, which require PEA', () => {
		let modularPlantManager = new ModularPlantManager();

		beforeEach(async function () {
			this.timeout(5000);
			modularPlantManager = new ModularPlantManager();
		});


		it('addPEA()', async () => {
			await modularPlantManager.addPEA(peaModel as unknown as PEAModel);
			expect(modularPlantManager.peas.length).equal(1);
		}).timeout(5000);


	});

	describe('functions, which need PEA instance', () => {
		let peaId='';
		let modularPlantManager: ModularPlantManager;
		let pea: PEA;
		const peaModelDummy = getEmptyPEAModel();

		beforeEach(async()=>{
			pea = new PEA(peaModelDummy);
			modularPlantManager = new ModularPlantManager();
			modularPlantManager.peas.push(pea);
			peaId = pea.id;
		});

		it('getPEAController()',  () => {
			expect(() => modularPlantManager.findPEAController(peaId)).not.to.throw();
		});

		it('getPEAController() to fail', () => {
			expect(() => modularPlantManager.findPEAController('')).to.throw();
		});

		it('removePEAController()',  () => {
			expect(modularPlantManager.peas.length = 1);
			expect(modularPlantManager.removePEA(peaId)).to.not.throw;
			expect(modularPlantManager.peas.length = 0);
		});

		it('removePEAController() should fail with empty identifier', () => {
			return expect(modularPlantManager.removePEA('')).to.rejected;
		});

		it('removePEAController() should fail if pea is protected', async() => {
			const pea = new PEA(peaModelDummy);
			pea.protection = true;
			modularPlantManager.peas.length = 0;
			modularPlantManager.peas.push(pea);
			return expect(modularPlantManager.removePEA(peaId)).to.rejectedWith(`PEA ${peaModelDummy.name} can not be deleted since it is protected.`);
		});


		it('getAllPEAControllers()',  () => {
			expect(modularPlantManager.getAllPEAs()).to.not.empty;
		});

		it('getService()',  async() => {
			const pea = new PEA(peaModel as unknown as PEAModel);
			modularPlantManager.peas.length = 0;
			modularPlantManager.peas.push(pea);
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
		let pea: PEA;

		before(() => {
			const peaModelDummy = getEmptyPEAModel();
			pea = new PEA(peaModelDummy);
			modularPlantManager.peas.push(pea);
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
