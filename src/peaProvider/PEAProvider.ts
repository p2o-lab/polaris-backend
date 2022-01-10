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

import {PEAModel} from '@p2olab/pimad-interface';
import {PEAOptions} from '@p2olab/polaris-interface';
import {Backbone, PEAPool, PEAPoolVendor,} from '@p2olab/pimad-core';
import {PEAOptionsParser} from './PEAOptionsParser/PEAOptionsParser';
import PiMAdResponse = Backbone.PiMAdResponse;


export interface LoadOptions {
	pea?: PEAOptions;
	peas?: PEAOptions[];
	subMP?: Array<{ peas: PEAOptions[] }>;
}

export class PEAProvider {

	public peaPool: PEAPool;

	constructor() {
		this.peaPool = new PEAPoolVendor().buyDependencyPEAPool();
		this.peaPool.initializeMTPFreeze202001Importer();
	}

	/**
	 * Get PEAController from PEA-Pool by given identifier
	 * @param identifier	Identifier
	 */
	public getPEAFromPEAPool(identifier: string): Promise<PEAModel>{
		return new Promise<PEAModel>((resolve,reject) => {
			this.peaPool.getPEA(identifier, (response: PiMAdResponse) => {
				if(response.getMessage()=='Success!') {
					const peaModel = response.getContent() as PEAModel;
					resolve(peaModel);
				} else {
					reject(new Error(response.getMessage()));
				}
			});
		});
	}

	/**
	 * Delete PEAController from PEA-Pool by given PEA-Identifier
	 * @param identifier	PEA-Identifier
	 */
	public deletePEAFromPEAPool(identifier: string): Promise<void> {
		return new Promise((resolve,reject)=> {
			this.peaPool.deletePEA(identifier,(response: PiMAdResponse) => {
				if(response.getMessage()=='Success!') {
					resolve();
				}
				else {
					reject(new Error(response.getMessage()));
				}
			});
		});
	}

	/**
	 * Delete PEAController from PEA-Pool by given PEA-Identifier
	 */
	public async deleteAllPEAsFromPEAPool(): Promise<unknown> {
		const peaModels = await this.getAllPEAsFromPEAPool();
		const tasks = peaModels.map((peaModel) => new Promise((resolve) => {
				this.deletePEAFromPEAPool(peaModel.pimadIdentifier).then(resolve);
			})
		);
		return Promise.all(tasks);
	}

	/**
	 * Get all PEAs from PEA-Pool
	 * @return {Promise<PEAModel[]>}
	 */
	public async getAllPEAsFromPEAPool(): Promise<PEAModel[]>{
		return new Promise<PEAModel[]>((resolve, reject)=>{
			this.peaPool.getAllPEAs((response: PiMAdResponse) => {
				if(response.getMessage()=='Success!') resolve(response.getContent() as PEAModel[]);
				else reject(new Error((response.getMessage())));
			});
		});
	}

	/**
	 * add PEA to PEAPool by given filepath
	 * @param filePath - filepath of the uploaded file in /uploads
	 */
	public addPEAToPool(filePath: { source: string}): Promise<PEAModel>{
		return new Promise<PEAModel>((resolve, reject)=>{
			this.peaPool.addPEA(filePath, (response: PiMAdResponse) => {
				if(response.getMessage() == 'Success!') resolve(response.getContent() as PEAModel);
				else reject(new Error(response.getMessage()));
			});
		});
	}

	/**
	 * Get PEAControllerOptions of PEA identified by given identifier
	 * @param {string} identifier
	 */
	public async getPEAControllerOptionsByPEAIdentifier(identifier: string): Promise<PEAOptions>{
		if (!identifier) {
			throw new Error(`PEA with identifier [${identifier}] not found.`);
		}
		const model = await this.getPEAFromPEAPool(identifier);
		return await PEAOptionsParser.createPEAOptions(model);
	}

	/**
	 * Get PEAControllerOptions of provided PEA-Model
	 * @param {PEAModel} model
	 */
	public async getPEAControllerOptionsByProvidedPEAModel(model: PEAModel): Promise<PEAOptions>{
		if (!model) {
			throw new Error('No valid model provided!');
		}
		return await PEAOptionsParser.createPEAOptions(model);
	}
}
