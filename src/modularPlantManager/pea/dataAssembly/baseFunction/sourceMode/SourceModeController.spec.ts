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



import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {SourceMode} from '@p2olab/polaris-interface';
import {MockupServer} from '../../../../_utils';
import {SourceModeMockup} from './SourceMode.mockup';
import {SourceModeController} from './SourceModeController';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {getBinManDataAssemblyModel} from '../../operationElement/man/binMan/BinMan.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SourceModeController', () => {

	const options = getBinManDataAssemblyModel(2, 'Variable', 'Variable');

	describe('static', () => {

		const connectionHandler = new ConnectionHandler();

		it('should create SourceModeController', async () => {
			const da = new SourceModeController(options, connectionHandler);
			expect(da.SrcChannel).to.be.not.undefined;
			expect(da.SrcManAut).to.be.not.undefined;
			expect(da.SrcIntAut).to.be.not.undefined;
			expect(da.SrcIntOp).to.be.not.undefined;
			expect(da.SrcManOp).to.be.not.undefined;
			expect(da.SrcIntAct).to.be.not.undefined;
			expect(da.SrcManAct).to.be.not.undefined;
		});

	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			new SourceModeMockup(mockupServer.nameSpace, mockupNode,'Variable');
			await mockupServer.start();
			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const dataAssembly = new SourceModeController(options, connectionHandler);

			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
			
			expect(dataAssembly.SrcChannel.value).equal(false);
			expect(dataAssembly.SrcManAut.value).equal(false);
			expect(dataAssembly.SrcIntAut.value).equal(false);
			expect(dataAssembly.SrcIntOp.value).equal(false);
			expect(dataAssembly.SrcManOp.value).equal(false);
			expect(dataAssembly.SrcIntAct.value).equal(true);
			expect(dataAssembly.SrcManAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, manual', async () => {
		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: SourceModeMockup;
		let sourceMode: SourceModeController;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			mockup = new SourceModeMockup(
				mockupServer.nameSpace,
				mockupNode,
				'Variable');
			mockup.srcMode = SourceMode.Manual;
			await mockupServer.start();

			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			dataAssembly = new SourceModeController(options, connectionHandler);
			await connectionHandler.connect();
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
		});
		
		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('getSourceMode, should be manual', () => {
			expect(sourceMode.getSourceMode()).to.equal(SourceMode.Manual);
		});

		it('isSourceMode', () => {
			expect(sourceMode.isSourceMode(SourceMode.Manual)).to.be.true;
			expect(sourceMode.isSourceMode(SourceMode.Intern)).to.be.false;
		});

		it('setToManualSourceMode(), nothing should happen', async () => {
			await sourceMode.setToManualSourceMode();
			expect(dataAssembly.SrcManAct.value).to.be.true;
			expect(dataAssembly.SrcIntAct.value).to.be.false;
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await dataAssembly.SrcIntOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Intern);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			return expect(sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Intern)).to.be
				.rejectedWith('Timeout: SourceMode did not change');
		}).timeout(4000);
	});

	describe('dynamic functions, Intern on', async () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let sourceMode: SourceModeController;
		let dataAssembly: any;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			new SourceModeMockup(mockupServer.nameSpace, mockupNode, 'Variable');
			await mockupServer.start();

			connectionHandler= new ConnectionHandler();
			connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
			dataAssembly = new SourceModeController(options, connectionHandler);
			await connectionHandler.connect();
			await dataAssembly.subscribe();
			await connectionHandler.connect();
			await new Promise((resolve => dataAssembly.on('changed', resolve)));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('getSourceMode', async () => {
			expect(sourceMode.getSourceMode()).to.equal(SourceMode.Intern);
		});

		it('isSourceMode', async () => {
			expect(sourceMode.isSourceMode(SourceMode.Intern)).to.be.true;
			expect(sourceMode.isSourceMode(SourceMode.Manual)).to.be.false;
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			dataAssembly.SrcManAct.value = true;
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await dataAssembly.SrcManOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			return expect(sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual)).to.be
				.rejectedWith('Timeout: SourceMode did not change');
		}).timeout(5000);

		it('setToManualSourceMode()', async () => {
			await sourceMode.setToManualSourceMode();
			expect(dataAssembly.SrcManAct.value).to.be.true;
			expect(dataAssembly.SrcIntAct.value).to.be.false;
		}).timeout(4000);
	});

});
