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

import {DataAssembly} from './DataAssembly';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {getDataAssemblyModel, getEmptyDataAssemblyModel} from './DataAssembly.mockup';
import {ConnectionHandler} from '../connectionHandler/ConnectionHandler';
import {BaseDataItem} from './dataItem/DataItem';
import {MTPDataTypes} from '@p2olab/pimad-types';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataAssembly', () => {
    const connectionHandler = new ConnectionHandler();

    describe('static', () => {

        it('should create DataAssembly', () => {
            expect(() => {
                const newDataAssemblyModel = getDataAssemblyModel('name', undefined, 'test', 'test' );
                const dataAssembly = new DataAssembly(newDataAssemblyModel, connectionHandler, true);
                (dataAssembly.dataItems.TagName as BaseDataItem<string>).read().then(function(data){
                    expect(data).to.equal('test');
                });
                (dataAssembly.dataItems.TagName as BaseDataItem<string>).read().then(function(data){
                    expect(data).to.equal('test');
                });
            }).to.not.throw();
        });


        it('should fail with missing DataItems', () => {
            const newDataAssemblyModel = getEmptyDataAssemblyModel();
            expect(() => new DataAssembly(newDataAssemblyModel,connectionHandler, true))
                .to.throw('DataAssemblyModel does not contain DataItemModel named TagName!');
        });

    });
});
