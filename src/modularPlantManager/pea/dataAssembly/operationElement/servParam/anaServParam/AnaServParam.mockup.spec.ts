/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {AnaServParamMockup, getAnaServParamDataItemOptions, getAnaServParamOptions} from './AnaServParam.mockup';
import {MockupServer} from '../../../../../_utils';
import {OpcUaConnection} from '../../../../connection';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {AnaServParamRuntime} from './AnaServParam';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AnaServParamMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async function(){
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create AnaServParamMockup', () => {
            const mockup = new AnaServParamMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getAnaServParamDataItemOptions(1, 'Test') as AnaServParamRuntime;
            expect(Object.keys(options).length).to.equal(31);
        });

        it('static DataAssemblyOptions', () => {
            const options = getAnaServParamOptions(1, 'Test') as DataAssemblyOptions;
            expect(Object.keys(options.dataItems).length).to.equal(33);
        });

        it('dynamic DataAssemblyOptions', () => {
            const mockup = new AnaServParamMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyOptions() as any;

            expect(Object.keys(options.dataItems).length).to.equal(33);
            expect(options.dataItems.VExt).to.not.be.undefined;
            expect(options.dataItems.VOp).to.not.be.undefined;
            expect(options.dataItems.VInt).to.not.be.undefined;
            expect(options.dataItems.VReq).to.not.be.undefined;
            expect(options.dataItems.VOut).to.not.be.undefined;
            expect(options.dataItems.VFbk).to.not.be.undefined;
        });

        // TODO
 /*       it('startCurrentTimeUpdate()',  async() => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as AnaServParamMockupTestClass;
            mockup.startCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            expect(mockup.getVOut()).to.not.equal(0);
        });

        it('stopCurrentTimeUpdate()',  async() => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as AnaServParamMockupTestClass;
            mockup.startCurrentTimeUpdate();
            mockup.stopCurrentTimeUpdate();
            expect(mockup.getVOut()).to.equal(0);
            await new Promise(f => setTimeout(f, 1000));
            //vOut should not change, because Update is stopped!
            expect(mockup.getVOut()).to.equal(0);
        });

        it('stopCurrentTimeUpdate(), interval undefined',  () => {
            const mockup: AnaServParamMockupTestClass = new AnaServParamMockupTestClass(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable') as AnaServParamMockupTestClass;
            expect((() => mockup.stopCurrentTimeUpdate())).to.throw();
        });*/
    });

    describe('dynamic (with MockupServer)', () => {
        let mockupServer: MockupServer;
        let connection: OpcUaConnection;

        beforeEach(async function(){
            this.timeout(10000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            new AnaServParamMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpoint: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set VExt',async()=>{
           await connection.writeNode('Variable.VExt', mockupServer.nameSpaceUri, 1,'Double');
           await connection.readNode('Variable.VExt', mockupServer.nameSpaceUri)
               .then((dataValue)=>expect((dataValue)?.value.value).to.equal(1));
        }).timeout(10000);

        it('set VOp',async()=>{
            await connection.writeNode('Variable.VOp', mockupServer.nameSpaceUri, 1, 'Double');
            await connection.readNode('Variable.VOp',
                mockupServer.nameSpaceUri)
                .then((dataValue)=>expect((dataValue)?.value.value).to.equal(1));
        }).timeout(10000);
    });
});
