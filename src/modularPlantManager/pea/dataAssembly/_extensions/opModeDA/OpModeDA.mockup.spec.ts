import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {OpModeDAMockup} from './OpModeDA.mockup';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {OpcUaConnection} from '../../../connection';
import {OperationMode} from '@p2olab/polaris-interface';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpModeDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create OpModeDAMockup', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('OpModeDAMockupReferenceJSON()',  () => {
            const mockup = new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getOpModeDAInstanceMockupJSON();
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
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup.stateOpAct).to.be.false;
        });
        it('get stateAutAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup.stateAutAct).to.be.false;
        });
        it('get stateOffAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup.stateOffAct).to.be.true;
        });

    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: OpModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get StateOffOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.StateOffOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StateOffOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateOpOp', async () => {
            await connection.writeOpcUaNode('Variable.StateOpOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StateOpOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateAutOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.StateAutOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StateAutOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Automatic);
        }).timeout(2000);

        it('set and get StateOffOp, write false', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.StateOffOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('Variable.StateOffOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateOpOp, write false', async () => {
            await connection.writeOpcUaNode('Variable.StateOpOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('Variable.StateOpOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateAutOp, write false', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.StateAutOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('Variable.StateAutOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);
        //TODO get the rest

    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: OpModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            mockup.stateChannel = true;
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get StateOffOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.StateOffOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StateOffOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

        it('set and get StateOpOp', async () => {
            await connection.writeOpcUaNode('Variable.StateOpOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StateOpOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Offline);
        }).timeout(2000);

        it('set and get StateAutOp', async () => {
            mockup.opMode = OperationMode.Operator;
            await connection.writeOpcUaNode('Variable.StateAutOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StateAutOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.opMode).to.equal(OperationMode.Operator);
        }).timeout(2000);

    });
});
