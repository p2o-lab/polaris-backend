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

import {BaseStaticDataItem} from './index';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DataItemOptions} from './DataItemFactory';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataItem', () => {

	describe('BaseStaticDataItem', () => {

		describe('Type number', () => {

			it('should work with float default value', () => {
				const options: DataItemOptions = {type: 'number', defaultValue: 1.2};
				const dataItem = new BaseStaticDataItem<number>(options);
				expect(dataItem.value).to.equal(1.2);
			});

			it('should work with string default value', () => {
				const options: DataItemOptions = {type: 'number', defaultValue: '1.2'};
				const dataItem = new BaseStaticDataItem<number>(options);
				expect(dataItem.value).to.equal(1.2);
			});

			it('should work with boolean default value', () => {
				const options: DataItemOptions = {type: 'number', defaultValue: true};
				const dataItem = new BaseStaticDataItem<number>(options);
				expect(dataItem.value).to.equal(1);
			});

			it('should work with value = 0', () => {
				const options: DataItemOptions = {type: 'number', defaultValue: 0.0};
				const dataItem = new BaseStaticDataItem<number>(options);
				expect(dataItem.value).to.equal(0);
			});

			it('should work with negative value', () => {
				const options: DataItemOptions = {type: 'number', defaultValue: -2};
				const dataItem = new BaseStaticDataItem<number>(options);
				expect(dataItem.value).to.equal(-2.0);
			});

			it('should work with undefined value', () => {
				const options: DataItemOptions = {type: 'number', defaultValue: undefined};
				const dataItem = new BaseStaticDataItem<number>(options);
				expect(dataItem.value).to.equal(0);
			});
		});

		describe('Type string', () => {

			it('should work with float default value', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: 1.2};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('1.2');
			});

			it('should work with string default value', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: '1.2'};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('1.2');
			});

			it('should work with boolean default value', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: true};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('true');
			});

			it('should work with value = 0', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: 0.0};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('');
			});

			it('should work with value = 0', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: 0};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('');
			});

			it('should work with negative value', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: -2};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('-2');
			});

			it('should work with undefined value', () => {
				const options: DataItemOptions = {type: 'string', defaultValue: undefined};
				const dataItem = new BaseStaticDataItem<string>(options);
				expect(dataItem.value).to.equal('');
			});
		});

		describe('Type boolean', () => {

			it('should work with float default value', () => {
				const options: DataItemOptions = {type: 'boolean', defaultValue: 1};
				const dataItem = new BaseStaticDataItem<boolean>(options);
				expect(dataItem.value).to.equal(true);
			});

			it('should work with string default value', () => {
				const options: DataItemOptions = {type: 'boolean', defaultValue: '1.2'};
				const dataItem = new BaseStaticDataItem<boolean>(options);
				expect(dataItem.value).to.equal(false);
			});

			it('should work with boolean default value', () => {
				const options: DataItemOptions = {type: 'boolean', defaultValue: true};
				const dataItem = new BaseStaticDataItem<boolean>(options);
				expect(dataItem.value).to.equal(true);
			});

			it('should work with value = 0', () => {
				const options: DataItemOptions = {type: 'boolean', defaultValue: 0.0};
				const dataItem = new BaseStaticDataItem<boolean>(options);
				expect(dataItem.value).to.equal(false);
			});

			it('should work with negative value', () => {
				const options: DataItemOptions = {type: 'boolean', defaultValue: -2};
				const dataItem = new BaseStaticDataItem<boolean>(options);
				expect(dataItem.value).to.equal(false);
			});

			it('should work with undefined value', () => {
				const options: DataItemOptions = {type: 'boolean', defaultValue: undefined};
				const dataItem = new BaseStaticDataItem<boolean>(options);
				expect(dataItem.value).to.equal(false);
			});
		});
	});
});
