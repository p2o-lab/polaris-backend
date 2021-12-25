import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {LockView16Mockup} from './LockView16.mockup';
import {MockupServer} from '../../../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('LockView16Mockup', () => {

    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create LockView16Mockup', async () => {
            const mockup= new LockView16Mockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;


        });
        it('getLockView16MockupReferenceJSON()',  () => {
            const mockup = new LockView16Mockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getLockView16InstanceMockupJSON();
            expect(Object.keys(json).length).to .equal(84);
        });
    });
    describe('dynamic', () => {
        it('get...', async () => {
            //TODO get the rest
        });
    });
});
