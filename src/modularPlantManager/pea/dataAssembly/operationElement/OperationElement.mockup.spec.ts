import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {OperationElementMockup} from './OperationElement.mockup';
import {MockupServer} from '../../../_utils';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OperationElementMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async function (){
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create OperationElementMockup', async () => {
            const mockup= new OperationElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            //TODO: test more

        });
        it('getOperationElementMockupReferenceJSON()',  () => {
            const mockup = new OperationElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getOperationElementInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(1);
            //TODO: test more
        });
    });
});
