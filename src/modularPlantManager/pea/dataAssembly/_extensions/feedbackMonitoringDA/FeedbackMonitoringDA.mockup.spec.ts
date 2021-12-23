import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {FeedbackMonitoringDAMockup} from './FeedbackMonitoringDA.mockup';
import {OpcUaConnection} from '../../../connection';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoringDAMockup', () => {
    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create FeedbackMonitoringDAMockup', async () => {
            const mockup= new FeedbackMonitoringDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('getFeedbackMonitoringMockupReferenceJSON()',  () => {
            const mockup = new FeedbackMonitoringDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
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

    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: FeedbackMonitoringDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new FeedbackMonitoringDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get MonEn', async () => {
            await connection.writeNode('Variable.MonEn', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.MonEn', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(5000);

        it('get MonSafePos', async () => {
            await connection.readNode('Variable.MonSafePos', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatErr', async () => {
            await connection.readNode('Variable.MonStatErr', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonDynErr', async () => {
            await connection.readNode('Variable.MonDynErr', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatTi', async () => {
            await connection.readNode('Variable.MonStatTi', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(5000);
        it('get MonDynTi', async () => {
            await connection.readNode('Variable.MonDynTi', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(5000);

    });
});
