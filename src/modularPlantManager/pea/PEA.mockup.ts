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

import {ServiceMockup} from './serviceSet/service/Service.mockup';
import {MockupServer} from '../_utils';
import {IndicatorElementMockup} from './dataAssembly/indicatorElement/IndicatorElement.mockup';
import {PEAModel} from '@p2olab/pimad-interface';


export function getEmptyPEAModel(): PEAModel {
	return {dataAssemblies: [], dataModel: '', endpoint: [], feas: [], name: '', pimadIdentifier: '', services: []};
}

export function getPEAMockupReferenceJSON(): object {

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

	public indicatorElements: IndicatorElementMockup[] = [];
	public services: ServiceMockup[] = [];
	public mockupServer: MockupServer;

	constructor() {
		this.mockupServer = new MockupServer();
		this.mockupServer.initialize().then();
	}

	public async startSimulation(): Promise<void> {
		await this.mockupServer.start();
		this.services.forEach((service) => service.startSimulation());
	}

	public async stopSimulation(): Promise<void> {
		this.services.forEach((services) => services.stopSimulation());
		await this.mockupServer.shutdown();
	}
}
