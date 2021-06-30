import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {LimitMonitoringDAMockup} from './LimitMonitoringDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoringDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });

        it('should create LimitMonitoringDAMockup', async () => {
            const mockup= new LimitMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable', DataType.Int32);
            expect(mockup).to.not.be.undefined;
        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new LimitMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable', DataType.Int32);
            const json = mockup.getLimitMonitoringDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(18);
            //TODO more testing?
        });
    });
});
