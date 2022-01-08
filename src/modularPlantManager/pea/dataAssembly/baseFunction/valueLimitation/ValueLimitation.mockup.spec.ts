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
import {getValueLimitationDataItemOptions, ValueLimitationMockup} from './ValueLimitation.mockup';
import {getLimitMonitoringDataItemOptions, LimitMonitoringMockup} from '../limitMonitoring/LimitMonitoring.mockup';
import {LimitMonitoringRuntime} from '../limitMonitoring/LimitMonitoring';
import {ValueLimitationRuntime} from './ValueLimitation';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ValueLimitationMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        describe('DIntValueMonitoring', () => {

            it('should create ValueLimitationMockup', async () => {
                const mockup= new ValueLimitationMockup(mockupServer.nameSpace,
                    mockupServer.rootObject, 'Variable', 'DInt');
                expect(mockup).to.not.be.undefined;
            });

            it('static DataItemOptions', () => {
                const options = getValueLimitationDataItemOptions(1, 'Test', 'DInt') as ValueLimitationRuntime;

                expect(Object.keys(options).length).to.equal(2);
                expect(options.VMin).to.not.be.undefined;
                expect(options.VMax).to.not.be.undefined;
            });

            it('dynamic DataItemOptions', () => {
                const mockup = new ValueLimitationMockup(mockupServer.nameSpace,
                    mockupServer.rootObject, 'Variable', 'DInt');
                const options = mockup.getDataItemOptions() as ValueLimitationRuntime;

                expect(Object.keys(options).length).to.equal(2);
                expect(options.VMin).to.not.be.undefined;
                expect(options.VMax).to.not.be.undefined;
            });
        });

        describe('AnaValueMonitoring', () => {

            it('should create ValueLimitationMockup', async () => {
                const mockup= new ValueLimitationMockup(mockupServer.nameSpace,
                    mockupServer.rootObject, 'Variable', 'Ana');
                expect(mockup).to.not.be.undefined;
            });

            it('static DataItemOptions', () => {
                const options = getValueLimitationDataItemOptions(1, 'Test', 'Ana') as ValueLimitationRuntime;

                expect(Object.keys(options).length).to.equal(2);
                expect(options.VMin).to.not.be.undefined;
                expect(options.VMax).to.not.be.undefined;
            });

            it('dynamic DataItemOptions', () => {
                const mockup = new ValueLimitationMockup(mockupServer.nameSpace,
                    mockupServer.rootObject, 'Variable', 'Ana');
                const options = mockup.getDataItemOptions() as ValueLimitationRuntime;

                expect(Object.keys(options).length).to.equal(2);
                expect(options.VMin).to.not.be.undefined;
                expect(options.VMax).to.not.be.undefined;
            });
        });


    });
});
