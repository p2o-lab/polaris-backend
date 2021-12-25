import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {LockView4Mockup} from './LockView4.mockup';
import {MockupServer} from '../../../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView4Mockup', () => {

    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create LockView4Mockup', async () => {
            const mockup= new LockView4Mockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;


        });
        it('getLockView4MockupReferenceJSON()',  () => {
            const mockup = new LockView4Mockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getLockView4InstanceMockupJSON();
            expect(Object.keys(json).length).to .equal(24);
        });
    });
    describe('dynamic', () => {
        it('get...', async () => {
            //TODO get the rest
        });
    });
});
