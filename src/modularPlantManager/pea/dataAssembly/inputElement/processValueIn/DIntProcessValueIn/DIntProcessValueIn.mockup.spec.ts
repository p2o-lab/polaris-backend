import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {DIntProcessValueInMockup} from './DIntProcessValueIn.mockup';
import {MockupServer} from '../../../../../_utils';
import {AnaProcessValueInMockup} from '../AnaProcessValueIn/AnaProcessValueIn.mockup';
import {OpcUaConnection} from '../../../../connection';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntProcessValueInMockup', () => {
    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create DIntProcessValueInMockup', () => {
            const mockup= new DIntProcessValueInMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getDIntProcessValueInMockupReferenceJSON()',  () => {
            const mockup = new DIntProcessValueInMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDIntProcessValueInInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(5);
            //TODO: test more
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: DIntProcessValueInMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new DIntProcessValueInMockup(mockupServer.namespace as Namespace,
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
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, 1, 'Int32');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(3000);

        it('set and get VExt, <VSclMin', async () => {
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, -1, 'Int32');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(3000);

        it('set and get VExt', async () => {
            await connection.writeOpcUaNode('Variable.VExt', namespaceUrl, 0, 'Int32');
            await connection.readOpcUaNode('Variable.VExt', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(0));
        }).timeout(3000);

        //TODO get the rest
    });
});
