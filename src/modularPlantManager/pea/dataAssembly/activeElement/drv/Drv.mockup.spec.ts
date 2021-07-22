import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';

import {DrvMockup} from './Drv.mockup';
import {MockupServer} from '../../../../_utils';
import {BinDrvMockup} from './binDrv/BinDrv.mockup';
import {OpcUaConnection} from '../../../connection';
import {namespaceUrl} from '../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DrvMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create DrvMockup', async () => {
            const mockup= new DrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getDrvMockupReferenceJSON()',  () => {
            const mockup = new DrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDrvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(37);
            //TODO test more
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: BinDrvMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new BinDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get StopOp', async () => {
            await connection.writeOpcUaNode('Variable.StopOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.StopOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));
        }).timeout(3000);

        it('set and get FwdOp', async () => {
            await connection.writeOpcUaNode('Variable.FwdOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.FwdOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));

        }).timeout(3000);

        it('set and get RevOp', async () => {
            await connection.writeOpcUaNode('Variable.RevOp', namespaceUrl, true, 'Boolean');
            await connection.readOpcUaNode('Variable.RevOp', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(true));
        }).timeout(3000);

        //TODO get the rest
    });
});
