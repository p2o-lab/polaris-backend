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
import {MockupServer} from '../../../../_utils';
import {getServiceSourceModeDataItemModel, ServiceSourceModeMockup} from './ServiceSourceMode.mockup';

import {ServiceSourceMode} from '@p2olab/polaris-interface';
import {ServiceSourceModeRuntime} from './ServiceSourceModeController';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceSourceModeMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ServiceSourceModeMockup', async () => {
            const mockup= new ServiceSourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getServiceSourceModeDataItemModel(1, 'Test');

            expect(Object.keys(options).length).to.equal(7);
            expect(options.find(i => i.name === 'SrcChannel')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcExtAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcIntAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcExtOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcIntOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcExtAct')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcIntAct')).to.not.be.undefined;
        });

        it('dynamic DataItemOptions', () => {
            const mockup = new ServiceSourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataItemModel();

            expect(Object.keys(options).length).to.equal(7);
            expect(options.find(i => i.name === 'SrcChannel')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcExtAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcIntAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcExtOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcIntOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcExtAct')).to.not.be.undefined;
            expect(options.find(i => i.name === 'SrcIntAct')).to.not.be.undefined;
        });
    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: ServiceSourceModeMockup;
        let connectionHandler: ConnectionHandler;

        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ServiceSourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler= new ConnectionHandler();
            connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
            await connectionHandler.connect();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcExtOp', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.SrcExtOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.SrcExtOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcExtAct).to.true;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Extern);
        }).timeout(3000);

        it('set and get SrcIntOp', async () => {
            mockup.srcMode= ServiceSourceMode.Extern;
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.SrcIntOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.SrcIntOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcExtAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcExtOp, write false, nothing should change', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.SrcExtOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, false);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.SrcExtOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcExtAct).to.false;
        }).timeout(3000);

        it('set and get SrcIntOp, write false, nothing should change', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.SrcIntOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, false);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.SrcIntOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcExtAct).to.false;
        }).timeout(3000);

    });

    describe('dynamic with SrcChannel:= true, nothing should happen', () => {

        let mockupServer: MockupServer;
        let mockup: ServiceSourceModeMockup;
        let connectionHandler: ConnectionHandler;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ServiceSourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            mockup.srcChannel= true;
            await mockupServer.start();
            connectionHandler= new ConnectionHandler();
            connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
            await connectionHandler.connect();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcExtOp, nothing should change', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.SrcExtOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.SrcExtOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcExtAct).to.false;
        }).timeout(3000);

        it('set and get SrcIntOp, nothing should change', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.SrcIntOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.SrcIntOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcExtAct).to.false;
        }).timeout(3000);
    });
});
