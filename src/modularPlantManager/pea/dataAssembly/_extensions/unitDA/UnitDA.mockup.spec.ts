import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataType, Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {UnitDAMockup} from './UnitDA.mockup';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('UnitDAMockup', () => {
    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {

        });
        it('should create UnitDAMockup', async () => {
            const mockup= new UnitDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('getUnitMockupReferenceJSON()',  () => {
            const mockup = new UnitDAMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getUnitDAInstanceMockupJSON();
            expect(Object.keys(json).length).to.equal(1);
            expect(json.VUnit).to.not.be.undefined;
        });
    });
});
