import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace} from 'node-opcua';

import {PIDCtrlMockup} from './PIDCtrl.mockup';
import {MockupServer} from '../../../../_utils';
import {OpcUaConnection} from '../../../connection';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PIDCtrlMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create PIDCtrlMockup', async () => {
            const mockup= new PIDCtrlMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('getPIDCtrlMockupReferenceJSON()',  () => {
            const mockup = new PIDCtrlMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getPIDCtrlMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(43);
            //TODO test more?
        });
    });

    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: PIDCtrlMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new PIDCtrlMockup(mockupServer.nameSpace,
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

        it('set and get SPMan', async () => {
            await connection.writeNode('Variable.SPMan', mockupServer.nameSpaceUri, 1.1, 'Double');
            await connection.readNode('Variable.SPMan', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1.1));
        }).timeout(3000);

        it('set and get SPMan', async () => {
            await connection.writeNode('Variable.MVMan', mockupServer.nameSpaceUri, 1.1, 'Double');
            await connection.readNode('Variable.MVMan', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(1.1));
        }).timeout(3000);

        //TODO get the rest

    });
});
