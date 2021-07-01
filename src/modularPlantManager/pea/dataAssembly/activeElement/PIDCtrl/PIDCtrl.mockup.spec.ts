import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';

import {PIDCtrlMockup} from './PIDCtrl.mockup';
import {MockupServer} from '../../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PIDCtrlMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
        afterEach(async () => {
            await mockupServer.shutdown();
        });
        it('should create PIDCtrlMockup', async () => {
            const mockup= new PIDCtrlMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });
        it('getPIDCtrlMockupReferenceJSON()',  () => {
            const mockup = new PIDCtrlMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getPIDCtrlMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(43);
            //TODO test more?
        });
    });
});
