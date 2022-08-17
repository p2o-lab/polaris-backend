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
import fetch from 'node-fetch';
import * as peaModelFileContent from '../modularPlantManager/peaModel.spec.json';


const peaModel = peaModelFileContent as unknown as PEAModel;

export class PEAProvider {

	/**
	 * Get all PEAs from PEA-Pool
	 * @return {Promise<PEAModel[]>}
	 */
	public async getAllPEAsFromPiMAd(): Promise<PEAModel[]> {
		const response = await fetch('http://localhost:3002/api/allPEAs');
		return await response.json() as PEAModel[];
	}

	/**
	 * Get PEA from PiMAd
	 * @param {string} peaId ID of PEA
	 * @return {Promise<PEAModel[]>}
	 */
	public async getPEAFromPiMAd(peaId: string): Promise<PEAModel> {

		//Todo create mockup for test purpose
		if(peaId === 'test') return Array.isArray(peaModel)? peaModel[0] : peaModel;

		const response = await fetch(`http://localhost:3002/api/${peaId}`);
		return await response.json() as PEAModel;
	}
}
