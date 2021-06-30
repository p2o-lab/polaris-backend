import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {OpModeDAMockup} from './OpModeDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpModeDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });

        it('should create OpModeDAMockup', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('OpModeDAMockupReferenceJSON()',  () => {
            const mockup = new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getOpModeDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(10);
            expect(json.StateChannel).to.not.be.undefined;
            expect(json.StateOffAut).to.not.be.undefined;
            expect(json.StateOpAut).to.not.be.undefined;
            expect(json.StateAutAut).to.not.be.undefined;
            expect(json.StateOffOp).to.not.be.undefined;
            expect(json.StateOpOp).to.not.be.undefined;
            expect(json.StateAutOp).to.not.be.undefined;
            expect(json.StateOpAct).to.not.be.undefined;
            expect(json.StateAutAct).to.not.be.undefined;
            expect(json.StateOffAct).to.not.be.undefined;
        });
        it('get stateOpAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup.stateOpAct).to.be.false;
        });
        it('get stateAutAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup.stateAutAct).to.be.false;
        });
        it('get stateOffAct', async () => {
            const mockup= new OpModeDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup.stateOffAct).to.be.true;
        });
    });
});
