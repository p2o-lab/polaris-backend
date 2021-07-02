import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ServParamMockup} from './ServParam.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ServParamMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create ServParamMockup',  () => {
            const mockup= new ServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getServParamMockupReferenceJSON()',  () => {
            const mockup = new ServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getServParamMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to .equal(19);
            //TODO: test more
        });
    });
});
