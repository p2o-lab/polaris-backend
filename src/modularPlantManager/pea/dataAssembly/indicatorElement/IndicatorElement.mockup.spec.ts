import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {IndicatorElementMockup} from './IndicatorElement.mockup';
import {MockupServer} from '../../../_utils';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('IndicatorElementMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create IndicatorElementMockup', async () => {
            const mockup= new IndicatorElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;
        });

        it('getIndicatorElementMockupReferenceJSON()',  () => {
            const mockup = new IndicatorElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getIndicatorElementInstanceMockupJSON();
            expect(json).not.to.be.undefined;
            expect(Object.keys(json).length).to.equal(1);
            //TODO: test more
        });
    });
});
