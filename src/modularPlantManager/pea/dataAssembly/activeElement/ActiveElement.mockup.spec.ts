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
import {MockupServer} from '../../../_utils';
import {ActiveElementMockup, getActiveElementDataItemModel, getActiveElementOptions} from './ActiveElement.mockup';
import {ActiveElementRuntime} from './ActiveElement';
import {DataAssemblyModel} from '@p2olab/pimad-interface';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ActiveElementMockup', () => {

    describe('static', () => {

        let mockupServer: MockupServer;

        beforeEach(async()=>{
            mockupServer = new MockupServer();
            await mockupServer.initialize();
        });
 
        it('should create ActiveElementMockup', async () => {
            const mockup= new ActiveElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            expect(mockup).to.not.be.undefined;

        });

        it('static DataItemOptions', () => {
            const options = getActiveElementDataItemModel(1, 'Test');
            expect(Object.keys(options).length).to.equal(2);
        });

        it('static DataAssemblyModel', () => {
            const options = getActiveElementOptions(1, 'Test') as DataAssemblyModel;
            expect(Object.keys(options.dataItems).length).to.equal(4);
        });

        it('dynamic DataAssemblyModel', () => {
            const mockup = new ActiveElementMockup(mockupServer.nameSpace,
                mockupServer.rootObject, 'Variable');
            const options = mockup.getDataAssemblyModel();

            expect(Object.keys(options.dataItems).length).to.equal(4);
        });
    });
});
