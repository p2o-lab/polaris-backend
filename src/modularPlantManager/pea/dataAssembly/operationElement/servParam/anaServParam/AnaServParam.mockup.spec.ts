import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {AnaServParamMockup, getAnaServParamMockupReferenceJSON} from './AnaServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';


chai.use(chaiAsPromised);
const expect = chai.expect;

// this fake class is needed to test the protected variable
class FakeClass extends AnaServParamMockup{
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
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create AnaServParamMockup', async () => {
            const mockup = new AnaServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO test more

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
});
