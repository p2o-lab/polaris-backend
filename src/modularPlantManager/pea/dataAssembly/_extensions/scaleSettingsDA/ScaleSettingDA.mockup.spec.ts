import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ScaleSettingDAMockup} from './ScaleSettingDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ScaleSettingDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ScaleSettingDAMockup, Double', async () => {
            const mockup= new ScaleSettingDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            expect(mockup).to.not.be.undefined;
        });
        it('should create ScaleSettingDAMockup', async () => {
            const mockup= new ScaleSettingDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Int32);
            expect(mockup).to.not.be.undefined;
        });
        it('getScaleSettingDAMockupReferenceJSON(), Double',  () => {
            const mockup = new ScaleSettingDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            const json = mockup.getScaleSettingDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(2);
            expect(json.VSclMax).to.not.be.undefined;
            expect(json.VSclMin).to.not.be.undefined;
        });
        it('getScaleSettingDAMockupReferenceJSON()',  () => {
            const mockup = new ScaleSettingDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Int32);
            const json = mockup.getScaleSettingDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(2);
            expect(json.VSclMax).to.not.be.undefined;
            expect(json.VSclMin).to.not.be.undefined;
        });

    });


});
