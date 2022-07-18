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
import {getResetDataItemModel, ResetMockup} from './Reset.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ResetMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
			await mockupServer.initialize();
            
        });

        it('should create ResetMockup', async () => {
            const mockup= new ResetMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });

        it('static Reset DataItemOptions',  () => {
            const options = getResetDataItemModel(1, 'Test');

            expect(Object.keys(options).length).to.equal(2);
            expect(options.find(i => i.name === 'ResetOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'ResetAut')).to.not.be.undefined;
        });

        it('dynamic Reset DataItemOptions',  () => {
            const mockup = new ResetMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            const options = mockup.getDataItemModel();

            expect(Object.keys(options).length).to.equal(2);
            expect(options.find(i => i.name === 'ResetOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'ResetAut')).to.not.be.undefined;
        });
    });

    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connectionHandler: ConnectionHandler;

        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
			await mockupServer.initialize();
            new ResetMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler= new ConnectionHandler();
            connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
            await connectionHandler.connect();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get ResetOp', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.ResetOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.ResetOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(2000);

    });
});
