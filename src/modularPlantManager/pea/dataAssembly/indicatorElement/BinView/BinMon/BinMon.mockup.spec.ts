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
import {MockupServer} from '../../../../../_utils';
import {BinMonMockup, getBinMonDataAssemblyModel, getBinMonDataItemModel} from './BinMon.mockup';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';
import {Access} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMonMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async function(){
            this.timeout(5000);
            mockupServer = new MockupServer();
			await mockupServer.initialize();
        });

        it('should create BinMonMockup',  () => {
            const mockup= new BinMonMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getBinMonDataItemModel(1, 'Test');
            expect(Object.keys(options).length).to.equal(9);
        });

        it('static DataAssemblyModel', () => {
            const options = getBinMonDataAssemblyModel(1, 'Test');
            expect(Object.keys(options.dataItems).length).to.equal(11);
        });

        it('dynamic DataAssemblyModel', () => {
            const mockup = new BinMonMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyModel();

            expect(Object.keys(options.dataItems).length).to.equal(11);
        });
    });

    describe('dynamic (with MockupServer)', () => {

        let mockupServer: MockupServer;
        let connectionHandler: ConnectionHandler;
        let adapterId: string;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
			await mockupServer.initialize();
            
            new BinMonMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler = new ConnectionHandler();
            adapterId = connectionHandler.addConnectionAdapter(getEndpointDataModel(mockupServer.endpoint));
            await connectionHandler.connect(adapterId);
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set VFlutTi', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VFlutTi', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}},1.1);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VFlutTi', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1.1));
        }).timeout(5000);

        it('set VFlutCnt', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VFlutCnt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}},1.1);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VFlutCnt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(5000);

    });
});
