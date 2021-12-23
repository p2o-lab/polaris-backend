import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {WQCDAMockup} from './WQCDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('WQCDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create WQCDAMockup', async () => {
            const mockup= new WQCDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');

            expect(mockup).to.not.be.undefined;

        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new WQCDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getWQCDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(1);
            expect(json.WQC).to.not.be.undefined;
        });
    });
});
