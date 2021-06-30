import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {FeedbackMonitoringDAMockup} from './FeedbackMonitoringDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoringDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });

        it('should create FeedbackMonitoringDAMockup', async () => {
            const mockup= new FeedbackMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('getAnaServParamMockupReferenceJSON()',  () => {
            const mockup = new FeedbackMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getFeedbackMonitoringDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(6);
            expect(json.MonDynTi).to.not.be.undefined;
            expect(json.MonStatTi).to.not.be.undefined;
            expect(json.MonDynErr).to.not.be.undefined;
            expect(json.MonEn).to.not.be.undefined;
            expect(json.MonStatErr).to.not.be.undefined;
            expect(json.MonSafePos).to.not.be.undefined;
        });
    });
});
