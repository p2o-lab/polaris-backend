import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {BinServParamMockup, getBinServParamMockupReferenceJSON} from './BinServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {Namespace, UAObject} from 'node-opcua';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinServParamMockup', () => {

    describe('static', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });

        it('should create BinServParamMockup', () => {
            const mockup = new BinServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getBinServParamMockupReferenceJSON()',  () => {
            const mockup = new BinServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getBinServParamMockupJSON();
            //TODO: check expected length
            expect(Object.keys(json).length).to .equal(31);
            expect(json.VExt).to.not.be.undefined;
            expect(json.VOp).to.not.be.undefined;
            expect(json.VInt).to.not.be.undefined;
            expect(json.VReq).to.not.be.undefined;
            expect(json.VOut).to.not.be.undefined;
            expect(json.VFbk).to.not.be.undefined;
        });

        it('startCurrentTimeUpdate()',  async() => {
            const mockup = new BinServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            console.log(mockup.vOut);
            expect(mockup.)
            mockup.startCurrentTimeUpdate();
            await new Promise(f => setTimeout(f, 1000));
            console.log(mockup.vOut);


        });

        it('stopCurrentTimeUpdate()',  () => {
            const mockup = new BinServParamMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            mockup.stopCurrentTimeUpdate();
        });
    });
});
