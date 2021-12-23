import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../_utils';
import {ServiceControlMockup} from './ServiceControl.mockup';
import {OpcUaConnection} from '../../connection';
import {OperationMode, ServiceSourceMode} from '@p2olab/polaris-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceControlMockup', () => {

    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ServiceControlMockup', async () => {
            const mockup= new ServiceControlMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getServiceControlMockupReferenceJSON()',  () => {
            const mockup = new ServiceControlMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getServiceControlInstanceMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(32);
            //TODO check all variables
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: ServiceControlMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ServiceControlMockup(mockupServer.nameSpace,
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

        // CommandOp
        it('set and get CommandOp, should work', async () => {
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Operator;
            mockup.commandEn = 1;

            await connection.writeNode('Variable.CommandOp', mockupServer.nameSpaceUri, 1, 'UInt32');
            await connection.readNode('Variable.CommandOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        });
        it('set CommandOp, value not valid, should fail', async () => {
            return expect(connection.writeNode('Variable.CommandOp', mockupServer.nameSpaceUri, 100, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandOp, not Operator, should fail', async () => {
           return expect(connection.writeNode('Variable.CommandOp', mockupServer.nameSpaceUri, 1, 'UInt32'))
               .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandOp, commandEn=0, should fail', async () => {
            mockup.operationMode.opMode = OperationMode.Operator; // set up mockup
            return expect(connection.writeNode('Variable.CommandOp', mockupServer.nameSpaceUri, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        // CommandExt
        it('set CommandExt, should change state', async () => {
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Automatic;
            mockup.serviceSourceMode.srcMode = ServiceSourceMode.Extern;
            await connection.writeNode('Variable.CommandExt', mockupServer.nameSpaceUri, 4, 'UInt32');
            await connection.readNode('Variable.StateCur', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(64));

        });
        it('set CommandExt, value not valid, should fail', async () => {
            return expect(connection.writeNode('Variable.CommandExt', mockupServer.nameSpaceUri, 100, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandExt, not Automatic, should fail', async () => {
            return expect(connection.writeNode('Variable.CommandExt', mockupServer.nameSpaceUri, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandExt, commandEn=0, should fail', async () => {
            mockup.operationMode.opMode = OperationMode.Automatic;
            return expect(connection.writeNode('Variable.CommandExt', mockupServer.nameSpaceUri, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        //ProcedureOp
        it('set and get ProcedureOp, should work', async () => {
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Operator;
            await connection.writeNode('Variable.ProcedureOp', mockupServer.nameSpaceUri, 1, 'UInt32');
            await connection.readNode('Variable.ProcedureOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        });
        it('set and get ProcedureOp, should fail', async () => {
            return expect(connection.writeNode('Variable.ProcedureOp', mockupServer.nameSpaceUri, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        //ProcedureExt
        it('set and get ProcedureExt, should work', async () => {
            //TODO test needs to be adjusted
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Automatic;
            mockup.serviceSourceMode.srcMode = ServiceSourceMode.Extern;
            await connection.writeNode('Variable.ProcedureExt', mockupServer.nameSpaceUri, 1, 'UInt32');
            await connection.readNode('Variable.ProcedureExt', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        });
        it('set and get ProcedureExt, should fail', async () => {
            return expect(connection.writeNode('Variable.ProcedureExt', mockupServer.nameSpaceUri, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        //TODO get the rest
    });
});
