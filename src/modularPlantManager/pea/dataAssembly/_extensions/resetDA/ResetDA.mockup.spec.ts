import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ResetDAMockup} from './ResetDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ResetDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create ResetDAMockup', async () => {
            const mockup= new ResetDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new ResetDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getResetDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(2);
            expect(json.ResetOp).to.not.be.undefined;
            expect(json.ResetAut).to.not.be.undefined;
        });
    });
});
