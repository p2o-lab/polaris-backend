import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {HealthStateViewMockup} from './HealthStateView.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('HealthStateViewMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create HealthStateViewMockup', async () => {
            const mockup= new HealthStateViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getHealthStateViewMockupReferenceJSON()',  () => {
            const mockup = new HealthStateViewMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getHealthStateViewInstanceMockupJSON();
            expect(Object.keys(json).length).to .equal(1);
        });
    });
});
