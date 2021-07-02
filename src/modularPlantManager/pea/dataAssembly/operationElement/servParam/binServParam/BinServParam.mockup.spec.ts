import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {BinServParamMockup, getBinServParamMockupReferenceJSON} from './BinServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';
import {AnaServParamMockup} from '../anaServParam/AnaServParam.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

// this fake class is needed to test the protected variable
class FakeClass extends BinServParamMockup{
    constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
        super(namespace, rootNode, variableName);
    }
    public getVOut(){
        return this.vOut;
    }
}
describe('BinServParamMockup', () => {

    describe('static', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });

        it('should create BinServParamMockup', () => {
            const mockup = new BinServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getBinServParamMockupReferenceJSON()',  () => {
            const mockup = new BinServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinServParamMockupJSON();
            //TODO: check expected length
            expect(Object.keys(json).length).to .equal(28);
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
            expect(mockup.getVOut()).to.be.false;
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.be.true;
        });

        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.be.false;
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.be.false;
        });

        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            expect((() => mockup.stopCurrentTimeUpdate())).to.throw();
        });
    });
});
