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
import {FeedbackMonitoringMockup, getFeedbackMonitoringDataItemOptions} from './FeedbackMonitoring.mockup';
import {OpcUaConnection} from '../../../connection';
import {FeedbackMonitoringRuntime} from './FeedbackMonitoring';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FeedbackMonitoringMockup', () => {
    describe('static', () => {
        let mockupServer: MockupServer;
        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });

        it('should create FeedbackMonitoringMockup', async () => {
            const mockup= new FeedbackMonitoringMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;
        });

        it('generic FeedbackMonitoring DataItemOptions',  () => {
            const options = getFeedbackMonitoringDataItemOptions(1, 'Test') as FeedbackMonitoringRuntime;

            expect(Object.keys(options).length).to.equal(6);
            expect(options.MonDynTi).to.not.be.undefined;
            expect(options.MonStatTi).to.not.be.undefined;
            expect(options.MonDynErr).to.not.be.undefined;
            expect(options.MonEn).to.not.be.undefined;
            expect(options.MonStatErr).to.not.be.undefined;
            expect(options.MonSafePos).to.not.be.undefined;
        });

        it('dynamic FeedbackMonitoring DataItemOptions',  () => {
            const mockup = new FeedbackMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Test');
            const options = mockup.getDataItemOptions() as FeedbackMonitoringRuntime;

            expect(Object.keys(options).length).to.equal(6);
            expect(options.MonDynTi).to.not.be.undefined;
            expect(options.MonStatTi).to.not.be.undefined;
            expect(options.MonDynErr).to.not.be.undefined;
            expect(options.MonEn).to.not.be.undefined;
            expect(options.MonStatErr).to.not.be.undefined;
            expect(options.MonSafePos).to.not.be.undefined;
        });
    });

    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connection: OpcUaConnection;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
            await mockupServer.initialize();
            new FeedbackMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connection = new OpcUaConnection();
            connection.initialize({endpointUrl: mockupServer.endpoint});
            await connection.connect();
        });
        afterEach(async () => {
            await connection.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get MonEn', async () => {
            await connection.writeNode('Variable.MonEn', mockupServer.nameSpaceUri, true, 'Boolean');
            await connection.readNode('Variable.MonEn', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(5000);

        it('get MonSafePos', async () => {
            await connection.readNode('Variable.MonSafePos', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatErr', async () => {
            await connection.readNode('Variable.MonStatErr', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonDynErr', async () => {
            await connection.readNode('Variable.MonDynErr', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatTi', async () => {
            await connection.readNode('Variable.MonStatTi', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(5000);
        it('get MonDynTi', async () => {
            await connection.readNode('Variable.MonDynTi', mockupServer.nameSpaceUri)
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(5000);

    });
});
