import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {DrvMockup} from './Drv.mockup';
import {MockupServer} from '../../../../_utils';
import {BinDrvMockup} from './binDrv/BinDrv.mockup';
import {OpcUaConnection} from '../../../connection';

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
            const mockup= new DrvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getDrvMockupReferenceJSON()',  () => {
            const mockup = new DrvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getDrvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(37);
            //TODO test more
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: BinDrvMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new BinDrvMockup(mockupServer.nameSpace,
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

        it('set and get StopOp', async () => {
            await connection.writeNode('Variable.StopOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.StopOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(3000);

        it('set and get FwdOp', async () => {
            await connection.writeNode('Variable.FwdOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.FwdOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));

        }).timeout(3000);

        it('set and get RevOp', async () => {
            await connection.writeNode('Variable.RevOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.RevOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(3000);

        //TODO get the rest
    });
});
