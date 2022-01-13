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
import {getOSLevelDataItemOptions, OSLevelMockup} from './OSLevel.mockup';
import {OSLevelRuntime} from './OSLevel';
import {OpcUaConnection} from '../../../connection';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OSLevelMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create OSLevelMockup', async () => {
            const mockup= new OSLevelMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });

        it('static OSLevel DataItemOptions',  () => {
            const options = getOSLevelDataItemOptions(1, 'Test') as OSLevelRuntime;

            expect(Object.keys(options).length).to.equal(1);
            expect(options.OSLevel).to.not.be.undefined;
        });

        it('dynamic OSLevel DataItemOptions',  () => {
            const mockup = new OSLevelMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            const options = mockup.getDataItemOptions() as OSLevelRuntime;

            expect(Object.keys(options).length).to.equal(1);
            expect(options.OSLevel).to.not.be.undefined;
        });
    });

    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: OSLevelMockup;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new OSLevelMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpointUrl: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get OsLevel', async () => {
            mockup.osLevel = 12;
            await connection.readNode('Variable.OSLevel', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(12));
            await connection.writeNode('Variable.OSLevel', mockupServer.nameSpaceUri, 1, 'Byte');
            await connection.readNode('Variable.OSLevel', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
            expect(mockup.osLevel).to.equal(1);
        }).timeout(2000);

    });

});
