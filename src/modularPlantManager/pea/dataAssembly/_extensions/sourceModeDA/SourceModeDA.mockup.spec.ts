import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {SourceModeDAMockup} from './SourceModeDA.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';
import {ServiceSourceMode, SourceMode} from '@p2olab/polaris-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;
// this test class is needed to test the protected variable
class SourceModeDAMockupTestClass extends SourceModeDAMockup{
    constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
        super(namespace, rootNode, variableName);
    }
    public getSrcMode(){
        return this.srcMode;
    }
    public getSrcIntAct(){
        return this.srcIntAct;
    }
    public getSrcManAct(){
        return this.srcManAct;
    }
    public setSrcChannelToTrue(){
        this.srcChannel = true;
    }
}

describe('SourceModeDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create SourceModeDAMockup', async () => {
            const mockup= new SourceModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('getSourceModeMockupReferenceJSON()',  () => {
            const mockup = new SourceModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getSourceModeDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(7);
            expect(json.SrcChannel).to.not.be.undefined;
            expect(json.SrcManAut).to.not.be.undefined;
            expect(json.SrcIntAut).to.not.be.undefined;
            expect(json.SrcManOp).to.not.be.undefined;
            expect(json.SrcIntOp).to.not.be.undefined;
            expect(json.SrcManAct).to.not.be.undefined;
            expect(json.SrcIntAct).to.not.be.undefined;
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: SourceModeDAMockupTestClass;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new SourceModeDAMockupTestClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            mockup.setSrcChannelToTrue();
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
            expect(mockup.getSrcIntAct()).to.false;
            expect(mockup.getSrcManAct()).to.true;
            expect(mockup.getSrcMode()).to.equal(SourceMode.Manual);
        }).timeout(3000);

        it('set and get SrcIntOp', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.getSrcIntAct()).to.true;
            expect(mockup.getSrcManAct()).to.false;
            expect(mockup.getSrcMode()).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcExtOp, write false', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.getSrcIntAct()).to.false;
            expect(mockup.getSrcManAct()).to.true;
            expect(mockup.getSrcMode()).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcIntOp, write false', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl, false, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.getSrcIntAct()).to.false;
            expect(mockup.getSrcManAct()).to.true;
            expect(mockup.getSrcMode()).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);

        //TODO get the rest

    });
    describe('dynamic, srcChannel is false', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: SourceModeDAMockupTestClass;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new SourceModeDAMockupTestClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcExtOp, write false', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcExtOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.getSrcIntAct()).to.false;
            expect(mockup.getSrcManAct()).to.true;
            expect(mockup.getSrcMode()).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcIntOp, write false', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.SrcIntOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
            expect(mockup.getSrcIntAct()).to.false;
            expect(mockup.getSrcManAct()).to.true;
            expect(mockup.getSrcMode()).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);
    });
});
