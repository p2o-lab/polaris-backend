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

import {getVlvDataItemOptions, getVlvOptions, VlvMockup} from './Vlv.mockup';
import {MockupServer} from '../../../../_utils';
import {OpcUaConnection} from '../../../connection';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {VlvRuntime} from './Vlv';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('VlvMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create VlvMockup', async () => {
            const mockup= new VlvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getVlvDataItemOptions(1, 'Test') as VlvRuntime;
            expect(Object.keys(options).length).to.equal(31);
        });

        it('static DataAssemblyOptions', () => {
            const options = getVlvOptions(1, 'Test') as DataAssemblyOptions;
            expect(Object.keys(options.dataItems).length).to.equal(33);
        });

        it('dynamic DataAssemblyOptions', () => {
            const mockup = new VlvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyOptions();

            expect(Object.keys(options.dataItems).length).to.equal(33);
        });

    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            new VlvMockup(mockupServer.nameSpace,
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

        it('set and get OpenOp', async () => {
            await connection.writeNode('Variable.OpenOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.OpenOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(3000);

        it('set and get CloseOp', async () => {
            await connection.writeNode('Variable.CloseOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.CloseOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(3000);

        //TODO get the rest
    });
});
