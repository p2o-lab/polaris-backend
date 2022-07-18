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

import {ExternalTrigger} from './ExternalTrigger';
import {MockupServer} from '../../modularPlantManager/_utils';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ExternalTrigger', () => {

	let mockupServer: MockupServer;

	before(async () => {
		mockupServer = new MockupServer();
		await mockupServer.initialize();
		await mockupServer.start();
	});

	after(async () => {
		await mockupServer.shutdown();
	});

	it('should fail with missing endpoint', () => {
		expect(() => new ExternalTrigger('', '', () =>{
			// do nothing
		})).to.throw();
		expect(() => new ExternalTrigger('sdfsd', '', () => {
			// do nothing
		})).to.throw();
		expect(() => new ExternalTrigger(
			'opc.tcp://localhost:4334/Ua/MyServer',
			'',
			// tslint:disable-next-line:no-empty
			() => {
				// do nothing
			})).to.throw();
	});

	it('should work with the sample server', async () => {
		let et: ExternalTrigger;
		await new Promise<void>( (resolve) => {
			et = new ExternalTrigger('opc.tcp://localhost:4334/Ua/MyLittleServer',
				'ns=1;s=trigger', resolve);
			et.startMonitoring();

			expect(et.getValue()).to.equal(false);
			mockupServer.externalTrigger = true;

			expect(et.getValue()).to.equal(true);
			et.disconnect();
		});
	});

});
