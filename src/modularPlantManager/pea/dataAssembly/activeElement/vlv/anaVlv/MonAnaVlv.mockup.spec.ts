import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MonAnaVlvMockup} from './MonAnaVlv.mockup';
import {MockupServer} from '../../../../../_utils';
import {AnaVlvMockup} from './AnaVlv.mockup';
import {OpcUaConnection} from '../../../../connection';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaVlvMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create MonAnaVlvMockup', async () => {
            const mockup= new MonAnaVlvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getMonAnaVlvMockupReferenceJSON()',  () => {
            const mockup = new MonAnaVlvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getMonAnaVlvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(61);
            //TODO test more
        });
    });

    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: MonAnaVlvMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new MonAnaVlvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it(' get ...', async () => {
            //TODO get the rest
        }).timeout(3000);

    });
});
