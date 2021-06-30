import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {AnaMonMockup} from './AnaMon.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaMonMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create AnaMonMockup', async () => {
            const mockup= new AnaMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getAnaMonMockupReferenceJSON()',  () => {
            const mockup = new AnaMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getAnaMonInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            //TODO: test more
        });
    });
});
