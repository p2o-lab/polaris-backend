import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../../_utils';
import {BinManIntMockup} from './BinManInt.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinManIntMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });

        it('should create BinManIntMockup', async () => {
            const mockup= new BinManIntMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more
        });

        it('getBinManIntMockupReferenceJSON()',  () => {
            const mockup = new BinManIntMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getBinManIntMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(16);
            //TODO: test more
        });
    });
});
