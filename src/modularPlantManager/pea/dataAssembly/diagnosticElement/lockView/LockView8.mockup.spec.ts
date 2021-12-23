import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {LockView8Mockup} from './LockView8.mockup';
import {MockupServer} from '../../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView8Mockup', () => {

    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create LockView8Mockup', async () => {
            const mockup= new LockView8Mockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;


        });
        it('getLockView8MockupReferenceJSON()',  () => {
            const mockup = new LockView8Mockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getLockView8InstanceMockupJSON();
            expect(Object.keys(json).length).to .equal(44);
        });
    });
    describe('dynamic', () => {
        it('get...', async () => {
            //TODO get the rest
        });
    });
});
