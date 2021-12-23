import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ValueLimitationDAMockup} from './ValueLimitationDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ValueLimitationDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ValueLimitationDAMockup', async () => {
            const mockup= new ValueLimitationDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            expect(mockup).to.not.be.undefined;
        });

        it('getValueLimitationMockupReferenceJSON(), Double',  () => {
            const mockup = new ValueLimitationDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            const json = mockup.getValueLimitationDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(2);
            expect(json.VMin).to.not.be.undefined;
            expect(json.VMax).to.not.be.undefined;
        });
        it('getValueLimitationMockupReferenceJSON(), Int32',  () => {
            const mockup = new ValueLimitationDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Int32);
            const json = mockup.getValueLimitationDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(2);
            expect(json.VMin).to.not.be.undefined;
            expect(json.VMax).to.not.be.undefined;
        });
        //TODO get/read values
    });
});
