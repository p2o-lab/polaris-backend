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
import {AnaManMockup, getAnaManDataAssemblyModel, getAnaManDataItemModel} from './AnaMan.mockup';
import {MockupServer} from '../../../../../_utils';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';
import {Access} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaManMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async function () {
            this.timeout(4000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create AnaManMockup',  () => {
            const mockup= new AnaManMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getAnaManDataItemModel(1, 'Test');
            expect(Object.keys(options).length).to.equal(10);
        });

        it('static DataAssemblyModel', () => {
            const options = getAnaManDataAssemblyModel(1, 'Test');
            expect(Object.keys(options.dataItems).length).to.equal(12);
        }).timeout(6000);

        it('dynamic DataAssemblyModel', () => {
            const mockup = new AnaManMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyModel();

            expect(Object.keys(options.dataItems).length).to.equal(12);
        }).timeout(6000);

        // TODO
       /* it('startCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.not.equal(0);
        });

        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.equal(0);
        });

        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: FakeClass = new FakeClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as FakeClass;
            expect((() => mockup.stopCurrentTimeUpdate())).to.throw();
        });*/
    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connectionHandler: ConnectionHandler;
        let adapterId: string;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            new AnaManMockup(mockupServer.nameSpace, mockupServer.rootObject,'Variable');
            await mockupServer.start();
            connectionHandler = new ConnectionHandler();
            adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
            await connectionHandler.connectAdapter(adapterId);
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VMan', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VMan', namespaceIndex: mockupServer.nameSpaceUri, access: Access.WriteAccess}}, 1.1);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VMan', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadAccess}})
                .then((dataValue) => expect(dataValue?.value.value).to.equal(1.1));
        }).timeout(3000);
    });
});
