import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {AnaProcessValueInMockup} from './AnaProcessValueIn.mockup';
import {MockupServer} from '../../../../../_utils';
import {OpcUaConnection} from '../../../../connection';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';
import {getVlvMockupReferenceJSON} from '../../../activeElement/vlv/Vlv.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaProcessValueInMockup', () => {
    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        it('should create AnaProcessValueInMockup', async () => {
            const mockup= new AnaProcessValueInMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getAnaProcessValueInMockupReferenceJSON()',  () => {
            const mockup = new AnaProcessValueInMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getAnaProcessValueInInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(5);
            //TODO: test more
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: AnaProcessValueInMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new AnaProcessValueInMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });

        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VExt, >VSclMax', async () => {
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, 1.1, 'Double');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(3000);

        it('set and get VExt, <VSclMin', async () => {
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, -1.1, 'Double');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(3000);
        it('set and get VExt', async () => {
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, 0, 'Double');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(3000);
        //TODO get the rest
    });
});
