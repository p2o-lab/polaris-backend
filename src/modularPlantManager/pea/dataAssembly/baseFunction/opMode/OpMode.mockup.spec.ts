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
import {getOpModeDataItemModel, OpModeMockup} from './OpMode.mockup';
import {OperationMode} from '@p2olab/polaris-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpModeMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async () => {
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create OpModeMockup', async () => {
            const mockup = new OpModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static OpMode DataItemOptions', () => {
            const options = getOpModeDataItemModel(1, 'Test');

            expect(Object.keys(options).length).to.equal(10);
            expect(options.find(i => i.name === 'StateChannel')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOffAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOpAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateAutAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOffOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOpOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateAutOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOpAct')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateAutAct')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOffAct')).to.not.be.undefined;
        });

        it('dynamic OpMode DataItemOptions', () => {
            const mockup = new OpModeMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            const options = mockup.getDataItemModel();

            expect(Object.keys(options).length).to.equal(10);
            expect(options.find(i => i.name === 'StateChannel')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOffAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOpAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateAutAut')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOffOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOpOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateAutOp')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOpAct')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateAutAct')).to.not.be.undefined;
            expect(options.find(i => i.name === 'StateOffAct')).to.not.be.undefined;
        });

        it('get stateOpAct', async () => {
            const mockup = new OpModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup.stateOpAct).to.be.false;
        });

        it('get stateAutAct', async () => {
            const mockup = new OpModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup.stateAutAct).to.be.false;
        });

        it('get stateOffAct', async () => {
            const mockup = new OpModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup.stateOffAct).to.be.true;
        });

    });
    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: OpModeMockup;
        let connectionHandler: ConnectionHandler;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new OpModeMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler= new ConnectionHandler();
            connectionHandler.setupConnectionAdapter({endpointUrl: mockupServer.endpoint});
            await connectionHandler.connect();
        });
        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get StateOffOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.StateOffOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.StateOffOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateOpOp', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.StateOpOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.StateOpOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateAutOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.StateAutOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.StateAutOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Automatic);
        }).timeout(2000);

        it('set and get StateOffOp, write false', async () => {
            mockup.opMode = OperationMode.Operator;
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.StateOffOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, false);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.StateOffOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateOpOp, write false', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.StateOpOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, false);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.StateOpOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateAutOp, write false', async () => {
            mockup.opMode = OperationMode.Operator;
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.StateAutOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, false);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.StateAutOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

    });
});
