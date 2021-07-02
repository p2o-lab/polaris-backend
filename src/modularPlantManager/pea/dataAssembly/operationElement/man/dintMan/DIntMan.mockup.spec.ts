import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../../_utils';
import {DIntManMockup} from './DIntMan.mockup';
import {AnaManMockup} from '../anaMan/AnaMan.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

// this fake class is needed to test the protected variable
class FakeClass extends DIntManMockup{
    constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
        super(namespace, rootNode, variableName);
    }
    public getVOut(){
        return this.vOut;
    }
}

describe('DIntManMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create DIntManMockup', async () => {
            const mockup= new DIntManMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getDIntManMockupReferenceJSON(namespace, objectBrowseName)',  () => {
            const mockup = new DIntManMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDIntManMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(10);
            //TODO: test more
        });
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
