import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {BinProcessValueInMockup} from './BinProcessValueIn.mockup';
import {MockupServer} from '../../../../../_utils';
import {AnaProcessValueInMockup} from '../AnaProcessValueIn/AnaProcessValueIn.mockup';
import {OpcUaConnection} from '../../../../connection';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinProcessValueInMockup', () => {
    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create BinProcessValueInMockup', () => {
            const mockup= new BinProcessValueInMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getBinProcessValueInMockupReferenceJSON()',  () => {
            const mockup = new BinProcessValueInMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getBinProcessValueInInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(4);
            //TODO: test more
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: BinProcessValueInMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new BinProcessValueInMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });

        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get VExt', async () => {
            await connection.writeNode('Variable.VExt', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.VExt', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(3000);

        it('set and get VState0', async () => {
            await connection.writeNode('Variable.VState0', mockupServer.nameSpaceUri, 'state0_inactive', 'String');
            await connection.readNode('Variable.VState0', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal('state0_inactive'));
        }).timeout(3000);

        it('set and get VState1', async () => {
            await connection.writeNode('Variable.VState1', mockupServer.nameSpaceUri, 'state1_inactive', 'String');
            await connection.readNode('Variable.VState1', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal('state1_inactive'));
        }).timeout(3000);

        //TODO get the rest
    });
});
