/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import * as fs from 'fs';
import { Module } from '../../src/model/core/Module';
import { Parameter } from '../../src/model/recipe/Parameter';
import {expect} from 'chai';

describe('Parameter', () => {
    let service;

    before(() => {
        const file = fs.readFileSync('assets/modules/module_biofeed_1.4.2.json');

        service = new Module(JSON.parse(file.toString()).modules[0]).services[0];
    });

    it('should load', () => {
        const param = new Parameter({
            name: 'TargetVolume',
            value: 3
        }, service);
    });

    it('should load with expression', async() => {
        const param = new Parameter({
            name: 'TargetVolume',
            value: '3+2'
        }, service);
        expect(await param.getValue()).to.equal(5);
    });

    it('should load with complex expression', async() => {
        const param = new Parameter({
            name: 'TargetVolume',
            value: 'sin(3)+2'
        }, service);
        expect(await param.getValue()).to.be.closeTo(2.14, 0.01);
    });

    it('should fail with wrong parameter name', () => {
        expect(() => {
            const param = new Parameter({
                name: 'test',
                value: 3
            }, service);
        }).to.throw();
    });
});
