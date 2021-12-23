import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
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

        it('should create AnaManIntMockup', async () => {
            const mockup= new AnaManIntMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getAnaManIntMockupReferenceJSON()',  () => {
            const mockup = new AnaManIntMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            const json = mockup.getAnaManIntMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(19);
        });
    });
});
