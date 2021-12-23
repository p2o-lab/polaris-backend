import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {SourceModeDAMockup} from './SourceModeDA.mockup';
import {OpcUaConnection} from '../../../connection';
import {ServiceSourceMode, SourceMode} from '@p2olab/polaris-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('SourceModeDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create SourceModeDAMockup', async () => {
            const mockup= new SourceModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('getSourceModeMockupReferenceJSON()',  () => {
            const mockup = new SourceModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getSourceModeDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(7);
            expect(json.SrcChannel).to.not.be.undefined;
            expect(json.SrcManAut).to.not.be.undefined;
            expect(json.SrcIntAut).to.not.be.undefined;
            expect(json.SrcManOp).to.not.be.undefined;
            expect(json.SrcIntOp).to.not.be.undefined;
            expect(json.SrcManAct).to.not.be.undefined;
            expect(json.SrcIntAct).to.not.be.undefined;
        });
    });
    describe('dynamic', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: SourceModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new SourceModeDAMockup(mockupServer.nameSpace,
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

        it('set and get SrcManOp', async () => {
            await connection.writeNode('Variable.SrcManOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcManOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.false;
            expect(mockup.srcManAct).to.true;
            expect(mockup.srcMode).to.equal(SourceMode.Manual);
        }).timeout(3000);

        it('set and get SrcIntOp', async () => {
            await connection.writeNode('Variable.SrcIntOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcIntOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcManOp, write false', async () => {
            await connection.writeNode('Variable.SrcManOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.SrcManOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcIntOp, write false', async () => {
            await connection.writeNode('Variable.SrcIntOp', mockupServer.nameSpaceUri, false, 'Boolean');
            await connection.readNode('Variable.SrcIntOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);

        //TODO get the rest

    });
    describe('dynamic, srcChannel is true', () => {
        // we need to check if the nodes was added successfully and are writeable and readable
        let mockupServer: MockupServer;
        let mockup: SourceModeDAMockup;
        let connection: OpcUaConnection;
        beforeEach(async function () {
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            mockup = new SourceModeDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            mockup.srcChannel = true;
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get SrcManOp, nothing should change', async () => {
            await connection.writeNode('Variable.SrcManOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcManOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(SourceMode.Intern);
        }).timeout(3000);

        it('set and get SrcIntOp, nothing should change', async () => {
            await connection.writeNode('Variable.SrcIntOp', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.SrcIntOp', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
            expect(mockup.srcIntAct).to.true;
            expect(mockup.srcManAct).to.false;
            expect(mockup.srcMode).to.equal(ServiceSourceMode.Intern);
        }).timeout(3000);
    });
});
