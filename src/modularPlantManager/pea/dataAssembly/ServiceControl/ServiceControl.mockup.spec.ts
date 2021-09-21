import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../_utils';
import {ServiceControlMockup} from './ServiceControl.mockup';
import {OpcUaConnection} from '../../connection';
import {namespaceUrl} from '../../../../../tests/namespaceUrl';
import {OperationMode, ServiceSourceMode} from '@p2olab/polaris-interface';
import {ServiceMtpCommand} from '../../serviceSet/service/enum';

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
            const mockup= new ServiceControlMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getServiceControlMockupReferenceJSON()',  () => {
            const mockup = new ServiceControlMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getServiceControlInstanceMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(32);
            //TODO check all variables
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: ServiceControlMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ServiceControlMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();

            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
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

            await connection.writeOpcUaNode('Variable.CommandOp', namespaceUrl, 1, 'UInt32');
            await connection.readOpcUaNode('Variable.CommandOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        });
        it('set CommandOp, value not valid, should fail', async () => {
            return expect(connection.writeOpcUaNode('Variable.CommandOp', namespaceUrl, 100, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandOp, not Operator, should fail', async () => {
           return expect(connection.writeOpcUaNode('Variable.CommandOp', namespaceUrl, 1, 'UInt32'))
               .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandOp, commandEn=0, should fail', async () => {
            mockup.operationMode.opMode = OperationMode.Operator; // set up mockup
            return expect(connection.writeOpcUaNode('Variable.CommandOp', namespaceUrl, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        // CommandExt
        it('set CommandExt, should change state', async () => {
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Automatic;
            mockup.serviceSourceMode.srcMode = ServiceSourceMode.Extern;
            await connection.writeOpcUaNode('Variable.CommandExt', namespaceUrl, 4, 'UInt32');
            await connection.readOpcUaNode('Variable.StateCur', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(64));

        });
        it('set CommandExt, value not valid, should fail', async () => {
            return expect(connection.writeOpcUaNode('Variable.CommandExt', namespaceUrl, 100, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandExt, not Automatic, should fail', async () => {
            return expect(connection.writeOpcUaNode('Variable.CommandExt', namespaceUrl, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });
        it('set CommandExt, commandEn=0, should fail', async () => {
            mockup.operationMode.opMode = OperationMode.Automatic;
            return expect(connection.writeOpcUaNode('Variable.CommandExt', namespaceUrl, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        //ProcedureOp
        it('set and get ProcedureOp, should work', async () => {
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.ProcedureOp', namespaceUrl, 1, 'UInt32');
            await connection.readOpcUaNode('Variable.ProcedureOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        });
        it('set and get ProcedureOp, should fail', async () => {
            return expect(connection.writeOpcUaNode('Variable.ProcedureOp', namespaceUrl, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        //ProcedureExt
        it('set and get ProcedureExt, should work', async () => {
            //TODO test needs to be adjusted
            // set up mockup
            mockup.operationMode.opMode = OperationMode.Automatic;
            mockup.serviceSourceMode.srcMode = ServiceSourceMode.Extern;
            await connection.writeOpcUaNode('Variable.ProcedureExt', namespaceUrl, 1, 'UInt32');
            await connection.readOpcUaNode('Variable.ProcedureExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        });
        it('set and get ProcedureExt, should fail', async () => {
            return expect(connection.writeOpcUaNode('Variable.ProcedureExt', namespaceUrl, 1, 'UInt32'))
                .rejectedWith('One or more arguments are invalid.');
        });

        //TODO get the rest
    });
});
