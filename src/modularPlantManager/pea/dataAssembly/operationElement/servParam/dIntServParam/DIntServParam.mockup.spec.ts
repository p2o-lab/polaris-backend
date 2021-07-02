import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {DIntServParamMockup} from './DIntServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {OPCUAServer} from 'node-opcua-server';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntServParamMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create DIntServParamMockup',  () => {
            const mockup= new DIntServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getDIntServParamMockupReferenceJSON()',  () => {
            const mockup = new DIntServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDIntServParamMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to .equal(31);
            //TODO: test more
        });
    });
});
