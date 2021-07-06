import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Namespace, UAObject} from 'node-opcua';
import {DiagnosticElementMockup} from './DiagnosticElement.mockup';
import {MockupServer} from '../../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DiagnosticElementMockup', () => {

    describe('static', () => {
        let mockupServer: any;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create DiagnosticElementMockup', async () => {
            const mockup= new DiagnosticElementMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            expect(mockup).to.not.be.undefined;
            expect(mockup.wqc).to.not.be.undefined;


        });
        it('getDiagnosticElementMockupReferenceJSON()',  () => {
            const mockup = new DiagnosticElementMockup(mockupServer.namespace as Namespace,
                mockupServer.rootComponent as UAObject, 'Variable');
            const json = mockup.getDiagnosticElementInstanceMockupJSON();
            expect(Object.keys(json).length).to .equal(1);
        });
    });
});
