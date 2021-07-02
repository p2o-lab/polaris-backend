import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../../_utils';
import {BinManMockup} from './BinMan.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

// this fake class is needed to test the protected variable
class FakeClass extends BinManMockup{
    constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
        super(namespace, rootNode, variableName);
    }
    public getVOut(){
        return this.vOut;
    }
}
describe('BinManMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create BinManMockup', async () => {
            const mockup= new BinManMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getBinManMockupReferenceJSON(namespace, objectBrowseName)',  () => {
            const mockup = new BinManMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinManMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(7);
            //TODO: test more
        });
        it('startCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(false);
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.equal(true);
        });
        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(false);
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.equal(false);
        });
        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: FakeClass = new FakeClass(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable') as FakeClass;
            expect((() => mockup.stopCurrentTimeUpdate())).to.throw();
        });
    });
});
