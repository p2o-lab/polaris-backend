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
import {DataType} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {LimitMonitoringMockup} from './LimitMonitoring.mockup';
import {OpcUaConnection} from '../../../connection';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoringMockup', () => {
    describe('static', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create LimitMonitoringMockup, Int32', async () => {
            const mockup= new LimitMonitoringMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Int32);
            expect(mockup).to.not.be.undefined;
        });

        it('should create LimitMonitoringMockup, Double', async () => {
            const mockup= new LimitMonitoringMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            expect(mockup).to.not.be.undefined;
        });

        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new LimitMonitoringMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Int32);
            const json = mockup.getLimitMonitoringInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(18);
        });

    });
    describe('dynamic, Double', () => {

        let mockupServer: MockupServer;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            new LimitMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', DataType.Double);
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VAHLim', async () => {
            await connection.writeNode('Variable.VAHLim', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VAHLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWHLim', async () => {
            await connection.writeNode('Variable.VWHLim', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VWHLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTHLim', async () => {
            await connection.writeNode('Variable.VTHLim', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VTHLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTLLim', async () => {
            await connection.writeNode('Variable.VTLLim', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VTLLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VALLim', async () => {
            await connection.writeNode('Variable.VALLim', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VALLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWLLim', async () => {
            await connection.writeNode('Variable.VWLLim', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VWLLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        //TODO: get the rest of values

    });
    describe('dynamic, Int32', () => {

        let mockupServer: MockupServer;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            new LimitMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable', DataType.Int32);
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VAHLim', async () => {
            await connection.writeNode('Variable.VAHLim', mockupServer.nameSpaceUri, 1, 'Int32');
            await connection.readNode('Variable.VAHLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWHLim', async () => {
            await connection.writeNode('Variable.VWHLim', mockupServer.nameSpaceUri, 1, 'Int32');
            await connection.readNode('Variable.VWHLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTHLim', async () => {
            await connection.writeNode('Variable.VTHLim', mockupServer.nameSpaceUri, 1, 'Int32');
            await connection.readNode('Variable.VTHLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTLLim', async () => {
            await connection.writeNode('Variable.VTLLim', mockupServer.nameSpaceUri, 1, 'Int32');
            await connection.readNode('Variable.VTLLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VALLim', async () => {
            await connection.writeNode('Variable.VALLim', mockupServer.nameSpaceUri, 1, 'Int32');
            await connection.readNode('Variable.VALLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWLLim', async () => {
            await connection.writeNode('Variable.VWLLim', mockupServer.nameSpaceUri, 1, 'Int32');
            await connection.readNode('Variable.VWLLim', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(2000);
        //TODO: get the rest of values
    });
});
