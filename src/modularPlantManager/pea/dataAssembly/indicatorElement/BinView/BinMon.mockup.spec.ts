import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {BinMonMockup} from './BinMon.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinMonMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create BinMonMockup', async () => {
            const mockup= new BinMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getBinMonMockupReferenceJSON()',  () => {
            const mockup = new BinMonMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinMonInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(9);
            //TODO: test more
        });
    });
});
