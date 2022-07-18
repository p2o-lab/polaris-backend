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

import {AnaVlvMockup, getAnaVlvDataAssemblyModel, getAnaVlvDataItemModel} from './AnaVlv.mockup';
import {MockupServer} from '../../../../../_utils';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {getEndpointDataModel} from '../../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaVlvMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
			await mockupServer.initialize();

        });

        it('should create AnaVlvMockup', async () => {
            const mockup= new AnaVlvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.sourceModeMockup).to.not.be.undefined;

        });

        it('static DataItemOptions', () => {
            const options = getAnaVlvDataItemModel(2, 'Test');
            expect(Object.keys(options).length).to.equal(51);
        });

        it('static DataAssemblyModel', () => {
            const options = getAnaVlvDataAssemblyModel(2, 'Test');
            expect(Object.keys(options.dataItems).length).to.equal(53);
        });

        it('dynamic DataAssemblyModel', () => {
            const mockup = new AnaVlvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyModel();

            expect(Object.keys(options.dataItems).length).to.equal(53);
        });
    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connectionHandler: ConnectionHandler;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
			await mockupServer.initialize();

            new AnaVlvMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler= new ConnectionHandler();
            connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
            await connectionHandler.connect();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get PosMan', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.PosMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1.1);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.PosMan', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1.1));
        }).timeout(3000);
    });
});
