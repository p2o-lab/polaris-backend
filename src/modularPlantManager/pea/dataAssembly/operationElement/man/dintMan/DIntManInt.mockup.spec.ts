import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../../_utils';
import {DIntManIntMockup} from './DIntManInt.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DIntManIntMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create DIntManIntMockup', async () => {
            const mockup= new DIntManIntMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getDIntManIntMockupReferenceJSON()',  () => {
            const mockup = new DIntManIntMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDIntManIntMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(19);
            //TODO: test more
        });
    });
});
