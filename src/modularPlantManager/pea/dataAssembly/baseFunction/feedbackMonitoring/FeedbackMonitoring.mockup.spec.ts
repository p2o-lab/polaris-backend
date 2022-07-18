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
import {FeedbackMonitoringMockup, getFeedbackMonitoringDataItemModel} from './FeedbackMonitoring.mockup';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemAccessLevel} from '@p2olab/pimad-interface';
import {getEndpointDataModel} from '../../../connectionHandler/ConnectionHandler.mockup';

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
            const options = getFeedbackMonitoringDataItemModel(1, 'Test');

            expect(Object.keys(options).length).to.equal(6);
        });

        it('dynamic FeedbackMonitoring DataItemOptions',  () => {
            const mockup = new FeedbackMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Test');
            const options = mockup.getDataItemModel();

            expect(Object.keys(options).length).to.equal(6);
            expect(options.find(i => i.name === 'MonDynTi')).to.not.be.undefined;
            expect(options.find(i => i.name === 'MonStatTi')).to.not.be.undefined;
            expect(options.find(i => i.name === 'MonDynErr')).to.not.be.undefined;
            expect(options.find(i => i.name === 'MonEn')).to.not.be.undefined;
            expect(options.find(i => i.name === 'MonStatErr')).to.not.be.undefined;
            expect(options.find(i => i.name === 'MonSafePos')).to.not.be.undefined;
        });
    });

    describe('dynamic', () => {

        let mockupServer: MockupServer;
        let connectionHandler: ConnectionHandler;

        beforeEach(async function () {
            this.timeout(5000);
            mockupServer = new MockupServer();
			await mockupServer.initialize();

            new FeedbackMonitoringMockup(mockupServer.nameSpace, mockupServer.rootObject, 'Variable');
            await mockupServer.start();
            connectionHandler= new ConnectionHandler();
            connectionHandler.initializeConnectionAdapters([getEndpointDataModel(mockupServer.endpoint)]);
            await connectionHandler.connect();
        });

        afterEach(async () => {
            await connectionHandler.disconnect();
            await mockupServer.shutdown();
        });

        it('set and get MonEn', async () => {
            await connectionHandler.writeDataItemValue({nodeId: {identifier: 'Variable.MonEn', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}}, true);
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.MonEn', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(true));
        }).timeout(5000);

        it('get MonSafePos', async () => {
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.MonSafePos', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatErr', async () => {
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.MonStatErr', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonDynErr', async () => {
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.MonDynErr', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(false));
        }).timeout(5000);

        it('get MonStatTi', async () => {
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.MonStatTi', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(5000);

        it('get MonDynTi', async () => {
            await connectionHandler.readDataItemValue({nodeId: {identifier: 'Variable.MonDynTi', namespaceIndex: mockupServer.nameSpaceUri, access: DataItemAccessLevel.ReadWrite}})
                .then((dataValue) => expect((dataValue)?.value.value).to.equal(0));
        }).timeout(5000);

    });
});
