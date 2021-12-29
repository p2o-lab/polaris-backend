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
import {OpModeDAMockup} from './OpModeDA.mockup';
import {OpcUaConnection} from '../../../connection';
import {OperationMode} from '@p2olab/polaris-interface';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpModeDAMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create OpModeDAMockup', async () => {
            const mockup= new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('OpModeDAMockupReferenceJSON()',  () => {
            const mockup = new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getOpModeDAInstanceMockupJSON() as any;
            expect(Object.keys(json).length).to.equal(10);
            expect(json.StateChannel).to.not.be.undefined;
            expect(json.StateOffAut).to.not.be.undefined;
            expect(json.StateOpAut).to.not.be.undefined;
            expect(json.StateAutAut).to.not.be.undefined;
            expect(json.StateOffOp).to.not.be.undefined;
            expect(json.StateOpOp).to.not.be.undefined;
            expect(json.StateAutOp).to.not.be.undefined;
            expect(json.StateOpAct).to.not.be.undefined;
            expect(json.StateAutAct).to.not.be.undefined;
            expect(json.StateOffAct).to.not.be.undefined;
        });

        it('get stateOpAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup.stateOpAct).to.be.false;
        });
        it('get stateAutAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup.stateAutAct).to.be.false;
        });
        it('get stateOffAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup.stateOffAct).to.be.true;
        });

    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: OpModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get StateOffOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.StateOffOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StateOffOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateOpOp', async () => {
            await connection.writeNode('Variable.StateOpOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StateOpOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateAutOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.StateAutOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StateAutOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Automatic);
        }).timeout(2000);

        it('set and get StateOffOp, write false', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.StateOffOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.StateOffOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateOpOp, write false', async () => {
            await connection.writeNode('Variable.StateOpOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.StateOpOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateAutOp, write false', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.StateAutOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.StateAutOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);
        //TODO get the rest

    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: OpModeDAMockup;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new OpModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            mockup.stateChannel = true;
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get StateOffOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.StateOffOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StateOffOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateOpOp', async () => {
            await connection.writeNode('Variable.StateOpOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StateOpOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateAutOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.StateAutOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StateAutOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

    });
});
