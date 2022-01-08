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
import {getSourceModeDataItemOptions, SourceModeMockup} from './SourceMode.mockup';
import {OpcUaConnection} from '../../../connection';
import {ServiceSourceMode, SourceMode} from '@p2olab/polaris-interface';
import {SourceModeRuntime} from './SourceModeController';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SourceModeMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create SourceModeMockup', async () => {
            const mockup= new SourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getSourceModeDataItemOptions(1, 'Test') as SourceModeRuntime;

            expect(Object.keys(options).length).to.equal(7);
            expect(options.SrcChannel).to.not.be.undefined;
            expect(options.SrcManAut).to.not.be.undefined;
            expect(options.SrcIntAut).to.not.be.undefined;
            expect(options.SrcManOp).to.not.be.undefined;
            expect(options.SrcIntOp).to.not.be.undefined;
            expect(options.SrcManAct).to.not.be.undefined;
            expect(options.SrcIntAct).to.not.be.undefined;
        });

        it('dynamic DataItemOptions', () => {
            const mockup = new SourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataItemOptions() as SourceModeRuntime;

            expect(Object.keys(options).length).to.equal(7);
            expect(options.SrcChannel).to.not.be.undefined;
            expect(options.SrcManAut).to.not.be.undefined;
            expect(options.SrcIntAut).to.not.be.undefined;
            expect(options.SrcManOp).to.not.be.undefined;
            expect(options.SrcIntOp).to.not.be.undefined;
            expect(options.SrcManAct).to.not.be.undefined;
            expect(options.SrcIntAct).to.not.be.undefined;
        });

    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: SourceModeMockup;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new SourceModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcManOp', async () => {
            await connection.writeNode('Variable.SrcManOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcManOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcManAct).to.true;
            expect(mockup.srcMode).to.equal(SourceMode.Manual);
        }).timeout(3000);

        it('set and get SrcIntOp', async () => {
            await connection.writeNode('Variable.SrcIntOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcIntOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcManOp, write false', async () => {
            await connection.writeNode('Variable.SrcManOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.SrcManOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcIntOp, write false', async () => {
            await connection.writeNode('Variable.SrcIntOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.SrcIntOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);
    });

    describe('dynamic, srcChannel is true', () => {

        let mockupServer: MockupServer;
        let mockup: SourceModeMockup;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new SourceModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            mockup.srcChannel = true;
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcManOp, nothing should change', async () => {
            await connection.writeNode('Variable.SrcManOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcManOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcIntOp, nothing should change', async () => {
            await connection.writeNode('Variable.SrcIntOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcIntOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);
    });
});
