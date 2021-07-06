import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';

import {VlvMockup} from './Vlv.mockup';
import {MockupServer} from '../../../../_utils';
import {BinDrvMockup} from '../drv/binDrv/BinDrv.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('VlvMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create VlvMockup', async () => {
            const mockup= new VlvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getVlvMockupReferenceJSON()',  () => {
            const mockup = new VlvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getVlvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(31);
            //TODO test more?
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: VlvMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new VlvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get OpenOp', async () => {
            await connection.writeOpcUaNode('Variable.OpenOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.OpenOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));
        }).timeout(3000);

        it('set and get CloseOp', async () => {
            await connection.writeOpcUaNode('Variable.CloseOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.CloseOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));
        }).timeout(3000);

        //TODO get the rest
    });
});
