import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {FeedbackMonitoringDAMockup} from './FeedbackMonitoringDA.mockup';
import {BinMonMockup} from '../../indicatorElement/BinView/BinMon.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';


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
            const mockup= new FeedbackMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('getFeedbackMonitoringMockupReferenceJSON()',  () => {
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

    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: FeedbackMonitoringDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new FeedbackMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get MonEn', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.MonEn', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('ns=1;s=Variable.MonEn', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));
        }).timeout(5000);

        it('get MonSafePos', async () => {
            await connection.readOpcUaNode('ns=1;s=Variable.MonSafePos', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatErr', async () => {
            await connection.readOpcUaNode('ns=1;s=Variable.MonStatErr', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonDynErr', async () => {
            await connection.readOpcUaNode('ns=1;s=Variable.MonDynErr', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatTi', async () => {
            await connection.readOpcUaNode('ns=1;s=Variable.MonStatTi', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(5000);
        it('get MonDynTi', async () => {
            await connection.readOpcUaNode('ns=1;s=Variable.MonDynTi', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(5000);

    });
});
