import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../_utils';
import {
    AnaServParamMockup,
    getAnaServParamMockupReferenceJSON
} from '../operationElement/servParam/anaServParam/AnaServParam.mockup';
import {ActiveElement} from './ActiveElement';
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
            const mockup= new ActiveElementMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getActiveElementMockupReferenceJSON()',  () => {
            const mockup = new ActiveElementMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getActiveElementMockupJSON();
            expect(Object.keys(json).length).to .equal(2);
        });
    });
});
