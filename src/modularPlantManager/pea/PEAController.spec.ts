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

import {StringView} from './dataAssembly';
import {PEAController} from './PEAController';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {PEAMockup} from './PEA.mockup';
import {MockupServer} from '../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PEA', () => {

	it('should load the cif PEAController json', () => {
		const f = fs.readFileSync('assets/peas/pea_cif.json');
		const pea = new PEAController(JSON.parse(f.toString()).peas[0]);
		expect(pea).to.have.property('id', 'CIF');
		expect(pea.services).to.have.length(6);
	});

	context('with PEAController server', () => {
		let peaMockup: PEAMockup;
		let mockupServer: MockupServer;

		before(async function() {
			this.timeout(4000);
			mockupServer = new MockupServer();
			await mockupServer.start();
		});

		after(async () => {
			await mockupServer.shutdown();
		});

		it('should connect to PEAController, provide correct json output and disconnect', async () => {
			const peaJson =
				JSON.parse(fs.readFileSync('src/modularPlantManager/pea/_assets/JSON/pea_testserver_1.0.0_2.json', 'utf8')).peas[0];
			const pea = new PEAController(peaJson);
			await pea.connect();

			await Promise.all([
				new Promise((resolve) => pea.on('parameterChanged', resolve)),
				new Promise((resolve) => pea.on('variableChanged', resolve)),
				new Promise((resolve) => pea.on('stateChanged', resolve))
			]);

			const json = pea.json();
			expect(json).to.have.property('id', 'PEATestServer');
			expect(json).to.have.property('endpoint', 'opc.tcp://127.0.0.1:4334/PEATestServer');
			expect(json).to.have.property('protected', false);
			expect(json).to.have.property('services')
				.to.have.lengthOf(2);

			expect(pea.services[0].eventEmitter.listenerCount('state')).to.equal(1);
			expect(pea.services[0].serviceControl.listenerCount('State')).to.equal(1);
			expect(pea.variables[0].listenerCount('V')).to.equal(1);
			expect(pea.services[0].eventEmitter.listenerCount('parameterChanged')).to.equal(1);

			const errorMsg = pea.services[0].procedures[0].processValuesOut[0] as StringView;
			expect(errorMsg.communication.WQC.listenerCount('changed')).to.equal(2);
			expect(errorMsg.communication.Text?.listenerCount('changed')).to.equal(2);

			await pea.disconnect();
		});

		it('should work after reconnect', async () => {
			const peaJson =
				JSON.parse(fs.readFileSync('assets/peas/pea_testserver_1.0.0.json', 'utf8')).peas[0];
			const pea = new PEAController(peaJson);

			await pea.connect();
			await Promise.all([
				new Promise((resolve) => pea.on('parameterChanged', resolve)),
				new Promise((resolve) => pea.on('variableChanged', resolve)),
				new Promise((resolve) => pea.on('stateChanged', resolve))
			]);
			expect(pea.connection.monitoredItemSize()).to.be.greaterThan(80);
			await pea.disconnect();
			expect(pea.connection.monitoredItemSize()).to.equal(0);

			await pea.connect();
			await Promise.all([
				new Promise((resolve) => pea.on('parameterChanged', resolve)),
				new Promise((resolve) => pea.on('variableChanged', resolve)),
				new Promise((resolve) => pea.on('stateChanged', resolve))
			]);
			expect(pea.connection.monitoredItemSize()).to.be.greaterThan(80);
		});

	});

});
