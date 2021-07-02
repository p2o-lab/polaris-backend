import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../../_utils';
import {AnaManIntMockup} from './AnaManInt.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaManIntMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create AnaManIntMockup', async () => {
            const mockup= new AnaManIntMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getAnaManIntMockupReferenceJSON()',  () => {
            const mockup = new AnaManIntMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getAnaManIntMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(19);
            //TODO: test more
        });
    });
});
