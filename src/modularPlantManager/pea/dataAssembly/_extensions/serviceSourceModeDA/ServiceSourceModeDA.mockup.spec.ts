import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ServiceSourceModeDAMockup} from './ServiceSourceModeDA.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {ServiceSourceMode} from '@p2olab/polaris-interface';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServiceSourceModeDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ServiceSourceModeDAMockup', async () => {
            const mockup= new ServiceSourceModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('getServiceSourceModeMockupReferenceJSON()',  () => {
            const mockup = new ServiceSourceModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getServiceSourceModeDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(7);
            expect(json.SrcChannel).to.not.be.undefined;
            expect(json.SrcExtAut).to.not.be.undefined;
            expect(json.SrcIntAut).to.not.be.undefined;
            expect(json.SrcExtOp).to.not.be.undefined;
            expect(json.SrcIntOp).to.not.be.undefined;
            expect(json.SrcExtAct).to.not.be.undefined;
            expect(json.SrcIntAct).to.not.be.undefined;
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: ServiceSourceModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ServiceSourceModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            mockup.srcChannel = true;
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcExtOp', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcExtAct).to.true;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Extern);
        }).timeout(3000);

        it('set and get SrcIntOp', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcExtAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcExtOp, write false', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcExtAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Extern);
        }).timeout(3000);

        it('set and get SrcIntOp, write false', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcExtAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Extern);
        }).timeout(3000);

        //TODO get the rest

    });
    describe('dynamic, srcChannel is false', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: ServiceSourceModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ServiceSourceModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcExtOp', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcExtAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Extern);
        }).timeout(3000);

        it('set and get SrcIntOp', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcExtAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Extern);
        }).timeout(3000);
    });
});
