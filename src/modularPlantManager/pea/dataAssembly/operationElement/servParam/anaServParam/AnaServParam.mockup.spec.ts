import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {AnaServParamMockup, getAnaServParamMockupReferenceJSON} from './AnaServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';
import {OpcUaConnection} from '../../../../connection';



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
            const mockup = new AnaServParamMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO test more?

        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new AnaServParamMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');

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
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as AnaServParamMockupTestClass;
            mockup.startCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.not.equal(0);
        });

        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as AnaServParamMockupTestClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.equal(0);
        });

        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as AnaServParamMockupTestClass;
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
            mockup = new AnaServParamMockupTestClass(mockupServer.nameSpace,
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

        it('set VExt',async()=>{
           await connection.writeNode('Variable.VExt', mockupServer.nameSpaceUri, 1,'Double');
           await connection.readNode('Variable.VExt', mockupServer.nameSpaceUri)
               .then((dataValue)=>expect((dataValue)?.value.value).to.equal(1));
        }).timeout(10000);

        it('set VOp',async()=>{
            await connection.writeNode('Variable.VOp', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VOp',
                mockupServer.nameSpaceUri)
                .then((dataValue)=>expect((dataValue)?.value.value).to.equal(1));
        }).timeout(10000);
    });
});
