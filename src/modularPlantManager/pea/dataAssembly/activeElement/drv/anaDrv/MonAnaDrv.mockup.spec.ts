import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';

import {MonAnaDrvMockup} from './MonAnaDrv.mockup';
import {MockupServer} from '../../../../../_utils';
import {AnaDrvMockup} from './AnaDrv.mockup';
import {OpcUaConnection} from '../../../../connection';
import {namespaceUrl} from '../../../../../../../tests/namespaceUrl';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MonAnaDrvMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create MonAnaDrvMockup', async () => {
            const mockup= new MonAnaDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getMonAnaDrvMockupReferenceJSON()',  () => {
            const mockup = new MonAnaDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getMonAnaDrvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(68);
            //TODO test more?
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was addes succesfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: MonAnaDrvMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new MonAnaDrvMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection('PEATestServer', 'opc.tcp://localhost:4334');
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get RpmAHLim, Double', async () => {
            await connection.writeOpcUaNode('Variable.RpmAHLim', namespaceUrl, 1.1, 'Double');
            await connection.readOpcUaNode('Variable.RpmAHLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1.1));
        }).timeout(3000);

        it('set and get RpmALLim, Double', async () => {
            await connection.writeOpcUaNode('Variable.RpmALLim', namespaceUrl, 1.1, 'Double');
            await connection.readOpcUaNode('Variable.RpmALLim', namespaceUrl)
                .then(datavalue => expect(datavalue?.value.value).to.equal(1.1));
        }).timeout(3000);

        //TODO get the rest


    });
});
