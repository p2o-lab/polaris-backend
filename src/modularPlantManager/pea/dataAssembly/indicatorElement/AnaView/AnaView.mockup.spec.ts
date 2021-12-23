import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {AnaViewMockup} from './AnaView.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaViewMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create AnaViewMockup', async () => {
            const mockup= new AnaViewMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getAnaViewMockupReferenceJSON()',  () => {
            const mockup = new AnaViewMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getAnaViewInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            //TODO: test more
        });
    });
});
