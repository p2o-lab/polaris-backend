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

import {OpcUaConnection} from '../connection';
import {DataAssemblyController} from './DataAssemblyController';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {MockupServer} from '../../_utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {
    describe('static', () => {
        const emptyOPCUAConnection = new OpcUaConnection();
        it('should create DataAssemblyController', () => {
            expect(() => {
                const da1 = new DataAssemblyController({
                    name: 'name',
                    dataItems: {TagName: 'test', TagDescription: 'test',},
                    metaModelRef: 'analogitem'
                }, emptyOPCUAConnection);
                expect(da1.communication.TagName.value).to.equal('test');
                expect(da1.communication.TagDescription.value).to.equal('test');
            }).to.not.throw();
        });

        it('should fail with undefined connection', () => {
            expect(() => new DataAssemblyController({
                    name: 'name',
                    dataItems: {TagName: 'test', TagDescription: 'test'},
                    metaModelRef: 'analogitem'
                }, undefined as any)
            ).to.throw('Creating DataAssemblyController Error: No OpcUaConnection provided');
        });

        it('should fail with undefined DataItems', () => {
            expect(() => new DataAssemblyController(
                {dataItems:undefined as any, name:'test', metaModelRef:'Test'}, emptyOPCUAConnection)
            ).to.throw('Creating DataAssemblyController Error: No Communication variables found in DataAssemblyOptions');
        });

    });
});
