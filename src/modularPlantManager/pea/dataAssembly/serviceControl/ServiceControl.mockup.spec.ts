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
import {MockupServer} from '../../../_utils';
import {getServiceControlDataAssemblyModel, getServiceControlDataItemModel, ServiceControlMockup} from './ServiceControl.mockup';
import {OperationMode, ServiceSourceMode} from '@p2olab/polaris-interface';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';
import {getEndpointDataModel} from '../../connectionHandler/ConnectionHandler.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceControlMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
			await mockupServer.initialize();
            
        });

        it('should create ServiceControlMockup', async () => {
            const mockup= new ServiceControlMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });

        it('static DataItemOptions', () => {
            const options = getServiceControlDataItemModel(1, 'Test');
            expect(Object.keys(options).length).to.equal(32);
        });

        it('static DataAssemblyModel', () => {
            const options = getServiceControlDataAssemblyModel(1, 'Test');
            expect(Object.keys(options.dataItems).length).to.equal(34);
        });

        it('dynamic DataAssemblyModel', () => {
            const mockup = new ServiceControlMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyModel();

            expect(Object.keys(options.dataItems).length).to.equal(34);
        });
    });

    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let mockup: ServiceControlMockup;
        let connectionHandler: ConnectionHandler;
        const mockupName = 'Variable';

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            mockup = new ServiceControlMockup(mockupServer.nameSpace, mockupServer.rootObject, mockupName);
            await mockupServer.start();

            connectionHandler= new ConnectionHandler();
            connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
            await connectionHandler.connect();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        describe('CommandOp', () => {
            it('set and get CommandOp, should work', async () => {
                // set up mockup
                mockup.serviceOpMode.opMode = OperationMode.Operator;
                mockup.commandEn = 1;

                await connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
                await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.CommandOp', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                    .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
            });

            it('set CommandOp, value not valid, should fail', async () => {
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 100))
                    .rejectedWith('One or more arguments are invalid.');
            });

            it('set CommandOp, not Operator, should fail', async () => {
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1))
                    .rejectedWith('One or more arguments are invalid.');
            });

            it('set CommandOp, commandEn=0, should fail', async () => {
                mockup.serviceOpMode.opMode = OperationMode.Operator; // set up mockup
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1))
                    .rejectedWith('One or more arguments are invalid.');
            });
        });

        describe('CommandExt', () => {

            it('set CommandExt, should change state', async () => {
                // set up mockup
                mockup.serviceOpMode.opMode = OperationMode.Automatic;
                mockup.serviceSourceMode.srcMode = ServiceSourceMode.Extern;
                await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.CommandExt', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 4);
                await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.CommandExt', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                    .then((dataValue) => expect((dataValue)?.value.value).to.equal(64));

            });

            it('set CommandExt, value not valid, should fail', async () => {
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 100))
                    .rejectedWith('One or more arguments are invalid.');
            });
            it('set CommandExt, not Automatic, should fail', async () => {
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1))
                    .rejectedWith('One or more arguments are invalid.');
            });
            it('set CommandExt, commandEn=0, should fail', async () => {
                mockup.serviceOpMode.opMode = OperationMode.Automatic;
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.CommandExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1))
                    .rejectedWith('One or more arguments are invalid.');
            });
        });

        describe('ProcedureOp', () => {

            it('set and get ProcedureOp, should work', async () => {
                // set up mockup
                mockup.serviceOpMode.opMode = OperationMode.Operator;
                await connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
                await connectionHandler.readDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                    .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
            });

            it('set and get ProcedureOp, should fail', async () => {
                return expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureOp`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1))
                    .rejectedWith('One or more arguments are invalid.');
            });
        });

        describe('ProcedureExt', () => {

            it('set and get ProcedureExt, should work', async () => {
                expect(connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1));
                await connectionHandler.readDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                    .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
            });

            it('set ProcedureExt and get ProcedureReq, should work', async () => {
                mockup.serviceOpMode.opMode = OperationMode.Automatic;
                mockup.serviceSourceMode.srcMode = ServiceSourceMode.Extern;
                await connectionHandler.writeDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, 1);
                await connectionHandler.readDataItemValue({nodeId: {identifier: `${mockupName}.ProcedureExt`, namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                    .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
            });
        });
    });
});
