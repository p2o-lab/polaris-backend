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
import {DataType} from 'node-opcua';
import {MockupServer} from '../../../../_utils';
import {ValueLimitationDAMockup} from './ValueLimitationDA.mockup';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ValueLimitationDAMockup', () => {
    describe('', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create ValueLimitationDAMockup', async () => {
            const mockup= new ValueLimitationDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            expect(mockup).to.not.be.undefined;
        });

        it('getValueLimitationMockupReferenceJSON(), Double',  () => {
            const mockup = new ValueLimitationDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Double);
            const json = mockup.getValueLimitationDAInstanceMockupJSON() as {VMin: {} ; VMax: {}};
            expect(Object.keys(json).length).to.equal(2);
            expect(json.VMin).to.not.be.undefined;
            expect(json.VMax).to.not.be.undefined;
        });
        it('getValueLimitationMockupReferenceJSON(), Int32',  () => {
            const mockup = new ValueLimitationDAMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable', DataType.Int32);
            const json = mockup.getValueLimitationDAInstanceMockupJSON() as {VMin: {} ; VMax: {}};
            expect(Object.keys(json).length).to.equal(2);
            expect(json.VMin).to.not.be.undefined;
            expect(json.VMax).to.not.be.undefined;
        });
        //TODO get/read values
    });
});
