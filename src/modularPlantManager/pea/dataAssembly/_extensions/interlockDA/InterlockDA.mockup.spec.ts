import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {InterlockDAMockup} from './InterlockDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('InterlockDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        it('should create InterlockDAMockup', async () => {
            const mockup= new InterlockDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new InterlockDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getInterlockDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(6);
            expect(json.PermEn).to.not.be.undefined;
            expect(json.Interlock).to.not.be.undefined;
            expect(json.IntlEn).to.not.be.undefined;
            expect(json.Permit).to.not.be.undefined;
            expect(json.Protect).to.not.be.undefined;
            expect(json.ProtEn).to.not.be.undefined;
        });
    });
});
