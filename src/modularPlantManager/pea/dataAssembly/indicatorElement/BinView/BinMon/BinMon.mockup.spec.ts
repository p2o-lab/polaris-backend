import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../../../../../_utils';
import {BinMonMockup} from './BinMon.mockup';
import {OpcUaConnection} from '../../../../connection';

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
            const mockup= new BinMonMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;
            //TODO: test more?
        });

        it('getBinMonMockupReferenceJSON()',  () => {
            const mockup = new BinMonMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
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
            mockup = new BinMonMockup(mockupServer.nameSpace,
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

        it('set VFlutTi', async () => {
            await connection.writeNode('Variable.VFlutTi',
                mockupServer.nameSpaceUri,
                1.1, 'Double');
            await connection.readNode('Variable.VFlutTi',
                mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1.1));
        }).timeout(5000);

        it('set VFlutCnt', async () => {
            await connection.writeNode('Variable.VFlutCnt',
                mockupServer.nameSpaceUri,
                1.1, 'Int32');
            await connection.readNode('Variable.VFlutCnt',
                mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1));
        }).timeout(5000);

    });
});
