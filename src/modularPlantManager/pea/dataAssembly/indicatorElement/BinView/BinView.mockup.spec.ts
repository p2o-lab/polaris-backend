import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {BinViewMockup} from './BinView.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinViewMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create BinViewMockup', async () => {
            const mockup= new BinViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getBinViewMockupReferenceJSON()',  () => {
            const mockup = new BinViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinViewInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(4);
            //TODO: test more
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: BinViewMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new BinViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VState0', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VState0', namespaceUrl, 'state0_inactive', 'String');
            await connection.readOpcUaNode('ns=1;s=Variable.VState0', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal('state0_inactive'));
        }).timeout(3000);

        it('set and get VState1', async () => {
            await connection.writeOpcUaNode('ns=1;s=Variable.VState1', namespaceUrl, 'state1_inactive', 'String');
            await connection.readOpcUaNode('ns=1;s=Variable.VState1', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal('state1_inactive'));
        }).timeout(3000);

        //TODO get the rest
    });
});
