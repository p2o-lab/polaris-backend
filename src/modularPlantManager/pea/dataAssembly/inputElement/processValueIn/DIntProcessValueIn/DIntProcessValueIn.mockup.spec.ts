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
import {DIntProcessValueInMockup, getDIntProcessValueInDataAssemblyModel, getDIntProcessValueInDataItemModel} from './DIntProcessValueIn.mockup';
import {MockupServer} from '../../../../../_utils';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {Access} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntProcessValueInMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
			await mockupServer.initialize();
        });

        it('should create DIntProcessValueInMockup', () => {
            const mockup= new DIntProcessValueInMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getDIntProcessValueInDataItemModel(1, 'Test');
            expect(Object.keys(options).length).to.equal(5);
        });

        it('static DataAssemblyModel', () => {
            const options = getDIntProcessValueInDataAssemblyModel(1, 'Test');
            expect(Object.keys(options.dataItems).length).to.equal(7);
        });

        it('dynamic DataAssemblyModel', () => {
            const mockup = new DIntProcessValueInMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyModel();

            expect(Object.keys(options.dataItems).length).to.equal(7);
        });
    });

    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connectionHandler: ConnectionHandler;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
			await mockupServer.initialize();
            new DIntProcessValueInMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler = new ConnectionHandler();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VExt, >VSclMax', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VExt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}}, 1);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VExt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(3000);

        it('set and get VExt, <VSclMin', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VExt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}}, -1);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VExt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(3000);

        it('set and get VExt', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.VExt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}}, 0);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.VExt', namespaceIndex: mockupServer.nameSpaceUri, access: Access.ReadWriteAccess}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(3000);
    });
});
