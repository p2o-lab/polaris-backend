import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {StringServParamMockup} from './StringServParam.mockup';
import {MockupServer} from '../../../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('StringServParamMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create StringServParamMockup',  () => {
            const mockup= new StringServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getStringServParamMockupReferenceJSON()',  () => {
            const mockup = new StringServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getStringServParamMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to .equal(25);
            //TODO: test more
        });
    });
});
