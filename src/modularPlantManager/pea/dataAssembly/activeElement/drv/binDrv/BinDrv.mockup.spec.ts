import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';

import {BinDrvMockup} from './BinDrv.mockup';
import {MockupServer} from '../../../../../_utils';
import {FeedbackMonitoringDAMockup} from '../../../_extensions/feedbackMonitoringDA/FeedbackMonitoringDA.mockup';
import {OpcUaConnection} from '../../../../connection';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('BinDrvMockup', () => {

    describe('', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create BinDrvMockup', async () => {
            const mockup= new BinDrvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });
        it('getBinDrvMockupReferenceJSON()',  () => {
            const mockup = new BinDrvMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const json = mockup.getBinDrvMockupJSON();
            expect(json).to.not.be.undefined;
            expect(Object.keys(json).length).to.equal(37);
            //TODO test more?
        });
    });
    //rest is already tested in DrvMockup

});
