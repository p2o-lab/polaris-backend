import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {BinViewMockup} from './BinView.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinViewMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create BinViewMockup', async () => {
            const mockup= new BinViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getBinViewMockupReferenceJSON()',  () => {
            const mockup = new BinViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinViewInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(4);
            //TODO: test more
        });
    });
});
