import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {AnaServParamMockup, getAnaServParamMockupReferenceJSON} from './AnaServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';
import {AnaView} from '../../../indicatorElement';
import * as peaOptions from '../../../../../../../tests/peaOptions.json';
import {PEAController} from '../../../../PEAController';
import {OpcUaConnection} from '../../../../connection';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';


chai.use(chaiAsPromised);
const expect = chai.expect;

// this test class is needed to test the protected variable
class AnaServParamMockupTestClass extends AnaServParamMockup{
    constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
        super(namespace, rootNode, variableName);
    }
    public getVOut(){
        return this.vOut;
    }

}
describe('AnaServParamMockup', () => {

    describe('static', () => {
        let mockupServer: MockupServer;
        beforeEach(async function(){
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create AnaServParamMockup', () => {
            const mockup = new AnaServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO test more?

        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new AnaServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');

            const json = mockup.getAnaServParamMockupJSON();
            expect(Object.keys(json).length).to .equal(31);
            expect(json.VExt).to.not.be.undefined;
            expect(json.VOp).to.not.be.undefined;
            expect(json.VInt).to.not.be.undefined;
            expect(json.VReq).to.not.be.undefined;
            expect(json.VOut).to.not.be.undefined;
            expect(json.VFbk).to.not.be.undefined;
        });
        //TODO test more
        it('startCurrentTimeUpdate()',  async() => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as AnaServParamMockupTestClass;
            mockup.startCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.not.equal(0);
        });

        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as AnaServParamMockupTestClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.equal(0);
        });

        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as AnaServParamMockupTestClass;
            expect((() => mockup.stopCurrentTimeUpdate())).to.throw();
        });
    });

    describe('dynamic (with MockupServer)', () => {
        let mockupServer: MockupServer;
        let mockup: AnaServParamMockupTestClass;
        let connection: OpcUaConnection;
        beforeEach(async function(){
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new AnaServParamMockupTestClass(mockupServer.namespace as Namespace,
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
            await connection.writeOpcUaNode(
                'ns=1;s=Variable.VExt',
                namespaceUrl,
                1,'Double');
           await connection.readOpcUaNode('ns=1;s=Variable.VExt',
               'urn:Liens-MacBook-Pro.local:NodeOPCUA-Server')
               .then(datavalue=>expect(datavalue?.value.value).to.equal(1));
        }).timeout(10000);

        it('set VOp',async()=>{
            await connection.writeOpcUaNode(
                'ns=1;s=Variable.VOp',
                namespaceUrl,
                1,'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VOp',
                'urn:Liens-MacBook-Pro.local:NodeOPCUA-Server')
                .then(datavalue=>expect(datavalue?.value.value).to.equal(1));
        }).timeout(10000);
    });
});
