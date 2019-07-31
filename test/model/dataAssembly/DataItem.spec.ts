/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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
import {OpcUaDataItem} from '../../../src/model/dataAssembly/DataItem';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataItem', () => {

    it('should reject construction with missing options', () => {
        const di = OpcUaDataItem.fromOptions(null, 'read', 'string');
        expect(di.access).to.equal('read');
    });

    it('should work with float', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: 1.2, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'read', 'number');
        expect(di.value).to.equal(1.2);
    });

    it('should work with float conversion', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: '1.2', data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'read', 'number');
        expect(di.value).to.equal(1.2);
    });

    it('should work with value = 0', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: 0.0, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'read', 'number');
        expect(di.value).to.equal(0);
    });

    it('should work with negative value', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: -2, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'read', 'number');
        expect(di.value).to.equal(-2.0);
    });

    it('should work with null value', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: null, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'read', 'number');
        expect(di.value).to.equal(null);
        expect(di.access).to.equal('read');
    });

    it('should work with undefined value', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: undefined, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'write', 'number');
        expect(di.value).to.equal(undefined);
        expect(di.access).to.equal('write');
    });

    it('should work with string conversion', () => {
        const di = OpcUaDataItem.fromOptions(
            {value: 1.2, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, 'read', 'string');
        expect(di.value).to.equal('1.2');
    });

});
