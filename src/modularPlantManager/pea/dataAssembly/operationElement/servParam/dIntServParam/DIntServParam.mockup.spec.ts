import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {DIntServParamMockup} from './DIntServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {OpcUaConnection} from '../../../../connection';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

// this fake class is needed to test the protected variable
class FakeClass extends DIntServParamMockup{
    constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
        super(namespace, rootNode, variableName);
    }
    public getVOut(){
        return this.vOut;
    }
}
describe('DIntServParamMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create DIntServParamMockup',  () => {
            const mockup= new DIntServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getDIntServParamMockupReferenceJSON()',  () => {
            const mockup = new DIntServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDIntServParamMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to .equal(31);
            //TODO: test more
        });
        //TODO test more
        it('startCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.not.equal(0);
        });

        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.equal(0);
        });

        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            expect((() => mockup.stopCurrentTimeUpdate())).to.throw();
        });
    });

    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: DIntServParamMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new DIntServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });

        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VExt', async () => {
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(3000);

        it('set and get VOp', async () => {
            await connection.writeOpcUaNode('Variable.VOp', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('Variable.VOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(3000);

        //TODO get the rest
    });
    describe('dynamic (with MockupServer)', () => {
        let mockupServer: MockupServer;
        let mockup: DIntServParamMockup;
        let connection: OpcUaConnection;
        beforeEach(async function(){
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new DIntServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set VExt',async()=>{
            await connection.writeOpcUaNode('Variable.VExt',
                namespaceUrl,
                1,'Int32');
            await connection.readOpcUaNode('Variable.VExt',
                namespaceUrl)
                .then(datavalue=>expect(datavalue?.value.value).to.equal(1));
        }).timeout(10000);

        it('set VOp',async()=>{
            await connection.writeOpcUaNode('Variable.VOp',
                namespaceUrl,
                1,'Int32');
            await connection.readOpcUaNode('Variable.VOp',
                namespaceUrl)
                .then(datavalue=>expect(datavalue?.value.value).to.equal(1));
        }).timeout(10000);
    });
});