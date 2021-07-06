import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';

import {AnaDrvMockup} from './AnaDrv.mockup';
import {MockupServer} from '../../../../../_utils';
import {FeedbackMonitoringDAMockup} from '../../../_extensions/feedbackMonitoringDA/FeedbackMonitoringDA.mockup';
import {OpcUaConnection} from '../../../../connection';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaDrvMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create AnaDrvMockup', async () => {
            const mockup= new AnaDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getAnaDrvMockupReferenceJSON()',  () => {
            const mockup = new AnaDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getAnaDrvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(55);
            //TODO test more?
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: AnaDrvMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new AnaDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get RpmMan', async () => {
            await connection.writeOpcUaNode('Variable.RpmMan', namespaceUrl, 1.1, 'Double');
            await connection.readOpcUaNode('Variable.RpmMan', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1.1));
        }).timeout(3000);

        //TODO get the rest

    });
});
