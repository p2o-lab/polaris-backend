import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../_utils';
import {ActiveElementMockup} from './ActiveElement.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ActiveElementMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
 
        it('should create ActiveElementMockup', async () => {
            const mockup= new ActiveElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getActiveElementMockupReferenceJSON()',  () => {
            const mockup = new ActiveElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getActiveElementMockupJSON();
            expect(Object.keys(json).length).to .equal(2);
        });
    });
});
