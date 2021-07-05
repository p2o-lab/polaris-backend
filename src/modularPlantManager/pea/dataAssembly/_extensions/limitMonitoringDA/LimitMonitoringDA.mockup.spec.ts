import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {LimitMonitoringDAMockup} from './LimitMonitoringDA.mockup';
import {FeedbackMonitoringDAMockup} from '../feedbackMonitoringDA/FeedbackMonitoringDA.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LimitMonitoringDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create LimitMonitoringDAMockup, Int32', async () => {
            const mockup= new LimitMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable', DataType.Int32);
            expect(mockup).to.not.be.undefined;
        });

        it('should create LimitMonitoringDAMockup, Double', async () => {
            const mockup= new LimitMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable', DataType.Double);
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
    describe('dynamic, Double', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: LimitMonitoringDAMockup<any>;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new LimitMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable', DataType.Double);
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VAHLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VAHLim', namespaceUrl, 1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VAHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWHLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VWHLim', namespaceUrl, 1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VWHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTHLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VTHLim', namespaceUrl, 1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VTHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTLLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VTLLim', namespaceUrl, 1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VTLLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VALLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VALLim', namespaceUrl, 1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VALLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWLLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VWLLim', namespaceUrl, 1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VWLLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        //TODO: get the rest of values

    });
    describe('dynamic, Int32', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: LimitMonitoringDAMockup<any>;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new LimitMonitoringDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable', DataType.Int32);
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VAHLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VAHLim', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VAHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWHLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VWHLim', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VWHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTHLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VTHLim', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VTHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VTLLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VTLLim', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VTLLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VALLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VALLim', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VALLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        it('set and get VWLLim', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VWLLim', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VWLLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(2000);
        //TODO: get the rest of values
    });
});
