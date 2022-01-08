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
import {MockupServer} from '../../../../_utils';
import {getWQCDataItemOptions, WQCMockup} from './WQC.mockup';
import {getLimitMonitoringDataItemOptions, LimitMonitoringMockup} from '../limitMonitoring/LimitMonitoring.mockup';
import {LimitMonitoringRuntime} from '../limitMonitoring/LimitMonitoring';
import {WQCRuntime} from './WQC';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('WQCMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create WQCMockup', async () => {
            const mockup= new WQCMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('static DataItemOptions', () => {
            const options = getWQCDataItemOptions(1, 'Test') as WQCRuntime;

            expect(Object.keys(options).length).to.equal(1);
            expect(options.WQC).to.not.be.undefined;
        });

        it('dynamic DataItemOptions', () => {
            const mockup = new WQCMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataItemOptions() as WQCRuntime;

            expect(Object.keys(options).length).to.equal(1);
            expect(options.WQC).to.not.be.undefined;
        });
    });
});
