import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {OSLevelDAMockup} from './OSLevelDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OSLevelDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create OSLevelDAMockup', async () => {
            const mockup= new OSLevelDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new OSLevelDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getOSLevelDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(1);
            expect(json.OSLevel).to.not.be.undefined;
        });
    });
});
