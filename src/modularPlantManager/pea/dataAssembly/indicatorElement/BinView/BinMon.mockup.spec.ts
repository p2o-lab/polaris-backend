import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {BinMonMockup} from './BinMon.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMonMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async function(){
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create BinMonMockup',  () => {
            const mockup= new BinMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;
            //TODO: test more?
        });

        it('getBinMonMockupReferenceJSON()',  () => {
            const mockup = new BinMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinMonInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(9);
            //TODO: test more?
        });
    });
    describe('dynamic (with MockupServer)', () => {
        let mockupServer: MockupServer;
        let mockup: BinMonMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new BinMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set VFlutTi', async () => {
            await connection.writeOpcUaNode(
                'ns=1;s=Variable.VFlutTi',
                namespaceUrl,
                1.1, 'Double');
            await connection.readOpcUaNode('ns=1;s=Variable.VFlutTi',
                namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1.1));
        }).timeout(5000);

        it('set VFlutCnt', async () => {
            await connection.writeOpcUaNode(
                'ns=1;s=Variable.VFlutCnt',
                namespaceUrl,
                1.1, 'Int32');
            await connection.readOpcUaNode('ns=1;s=Variable.VFlutCnt',
                namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1));
        }).timeout(5000);

    });
});
