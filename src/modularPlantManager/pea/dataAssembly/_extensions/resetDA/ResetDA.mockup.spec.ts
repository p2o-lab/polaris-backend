import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ResetDAMockup} from './ResetDA.mockup';
import {OSLevelDAMockup} from '../osLevelDA/OSLevelDA.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ResetDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ResetDAMockup', async () => {
            const mockup= new ResetDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getResetDAMockupReferenceJSON()',  () => {
            const mockup = new ResetDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getResetDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(2);
            expect(json.ResetOp).to.not.be.undefined;
            expect(json.ResetAut).to.not.be.undefined;
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: ResetDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new ResetDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get ResetOp', async () => {
            await connection.writeOpcUaNode('Variable.ResetOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.ResetOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));
        }).timeout(2000);

    });
});
