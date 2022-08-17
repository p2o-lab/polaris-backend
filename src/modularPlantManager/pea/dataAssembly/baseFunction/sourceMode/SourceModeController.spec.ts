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
import {DataAssemblyFactory} from '../../DataAssemblyFactory';
import {getAnaDrvDataAssemblyModel} from '../../activeElement/drv/anaDrv/AnaDrv.mockup';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';
import {AnaDrvDataItems} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SourceModeController', () => {

	const connectionHandler = new ConnectionHandler();
	const referenceDataAssemblyModel = getAnaDrvDataAssemblyModel(2, 'Variable', 'Variable');
	const referenceDataAssembly = DataAssemblyFactory.create(referenceDataAssemblyModel, connectionHandler);

	describe('static', () => {

		it('should create SourceModeController', async () => {
			const baseFunction = new SourceModeController(referenceDataAssembly.dataItems as AnaDrvDataItems);
			expect(baseFunction.dataItems.SrcChannel).to.be.not.undefined;
			expect(baseFunction.dataItems.SrcManAut).to.be.not.undefined;
			expect(baseFunction.dataItems.SrcIntAut).to.be.not.undefined;
			expect(baseFunction.dataItems.SrcIntOp).to.be.not.undefined;
			expect(baseFunction.dataItems.SrcManOp).to.be.not.undefined;
			expect(baseFunction.dataItems.SrcIntAct).to.be.not.undefined;
			expect(baseFunction.dataItems.SrcManAct).to.be.not.undefined;
		});

	});

	describe('dynamic', () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let adapterId: string;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			new SourceModeMockup(mockupServer.nameSpace, mockupNode,'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
		});

		afterEach(async function () {
			this.timeout(4000);
			await connectionHandler.disconnect();
			await mockupServer.shutdown();
		});

		it('should subscribe successfully', async () => {

			const baseFunction = new SourceModeController(referenceDataAssembly.dataItems as AnaDrvDataItems);

			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
			
			expect(baseFunction.dataItems.SrcChannel.value).equal(false);
			expect(baseFunction.dataItems.SrcManAut.value).equal(false);
			expect(baseFunction.dataItems.SrcIntAut.value).equal(false);
			expect(baseFunction.dataItems.SrcIntOp.value).equal(false);
			expect(baseFunction.dataItems.SrcManOp.value).equal(false);
			expect(baseFunction.dataItems.SrcIntAct.value).equal(true);
			expect(baseFunction.dataItems.SrcManAct.value).equal(false);
		}).timeout(5000);
	});

	describe('dynamic functions, manual', async () => {

		let mockupServer: MockupServer;
		let connectionHandler: ConnectionHandler;
		let mockup: SourceModeMockup;
		let sourceMode: SourceModeController;
		let baseFunction: any;
		let adapterId: string;

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
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new SourceModeController(this.dataItems);
			await baseFunction.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
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
			expect(baseFunction.dataItems.SrcManAct.value).to.be.true;
			expect(baseFunction.dataItems.SrcIntAct.value).to.be.false;
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve instantly', async () => {
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await baseFunction.dataItems.SrcIntOp.write(true);
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
		let baseFunction: any;
		let adapterId: string;

		beforeEach(async function () {
			mockupServer = new MockupServer();
			await mockupServer.initialize();
			const mockupNode = (mockupServer.nameSpace).addObject({
				organizedBy: mockupServer.rootObject,
				browseName: 'Variable',
			});
			new SourceModeMockup(mockupServer.nameSpace, mockupNode, 'Variable');
			await mockupServer.start();
			connectionHandler = new ConnectionHandler();
			adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
			baseFunction = new SourceModeController(this.dataItems);
			await baseFunction.subscribe();
			await connectionHandler.connectAdapter(adapterId);
			await connectionHandler.startMonitoring(adapterId);
			await new Promise((resolve => baseFunction.on('changed', resolve)));
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
			baseFunction.dataItems.SrcManAct.value = true;
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		});

		it('waitForSourceModeToPassSpecificTest, promise should resolve after a while', async () => {
			await baseFunction.dataItems.SrcManOp.write(true);
			await sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}).timeout(4000);

		it('waitForSourceModeToPassSpecificTest, timeout', async () => {
			return expect(sourceMode.waitForSourceModeToPassSpecificTest(SourceMode.Manual)).to.be
				.rejectedWith('Timeout: SourceMode did not change');
		}).timeout(5000);

		it('setToManualSourceMode()', async () => {
			await sourceMode.setToManualSourceMode();
			expect(baseFunction.dataItems.SrcManAct.value).to.be.true;
			expect(baseFunction.dataItems.SrcIntAct.value).to.be.false;
		}).timeout(4000);
	});

});
