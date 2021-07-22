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

import {Category} from 'typescript-logging';
import {ServiceMockup} from './serviceSet/service/Service.mockup';
import {PEATestNumericVariable} from '../_utils';



export function getPEAMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): any {

	return ({
			peas: [
				{
					id: 'PEATestServer',
					opcuaServerUrl: 'opc.tcp://127.0.0.1:4334/PEATestServer',
					services: [],
					processValues: [
						{
							name: 'Variable001',
							metaModelRef: 'AnaView',
							communication: '' //TODO Add Mockup here
						},
						{
							name: 'Variable002',
							metaModelRef: 'AnaView',
							communication: '' //TODO Add Mockup here
						},
						{
							name: 'Variable003',
							metaModelRef: 'AnaView',
							communication: '' //TODO Add Mockup here
						},
						{
							name: 'PvIntegral',
							metaModelRef: 'AnaView',
							communication: '' //TODO Add Mockup here
						}
					]
				}
			]
		}
	);
}


export class PEAMockup {

	public variables: PEATestNumericVariable[] = [];
	public services: ServiceMockup[] = [];

	constructor() {
		//do nothing
	}

	public startSimulation(): void {
		this.variables.forEach((variable) => variable.startRandomOscillation());
		this.services.forEach((service) => service.startSimulation());
	}

	public stopSimulation(): void {
		this.variables.forEach((variable) => variable.stopRandomOscillation());
		this.services.forEach((services) => services.stopSimulation());
	}
}
