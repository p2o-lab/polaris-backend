import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {InputElementMockup} from './InputElement.mockup';
import {MockupServer} from '../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('InputElementMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create InputElementMockup', async () => {
            const mockup= new InputElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;
        });
        it('getInputElementMockupReferenceJSON()',  () => {
            const mockup = new InputElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getInputElementInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(1);
            //TODO: test more
        });
    });
});
