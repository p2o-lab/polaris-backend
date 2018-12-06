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

import * as assert from 'assert';
import * as fs from 'fs';
import {Module} from '../src/model/Module';

describe('Module', () => {
    describe('constructor', () => {

        it('should load the biofeed module json', (done) => {
            fs.readFile('assets/modules/module_biofeed_1.4.2.json', async (err, file) => {
                const module = new Module(JSON.parse(file.toString()).modules[0]);
                assert.equal(module.id, 'BioFeed');
                assert.equal(module.services.length, 14);
                assert.equal(module.isConnected(), false);

                module.json()
                    .then((json) => {
                        assert.deepEqual(json, {
                            id: 'BioFeed',
                            endpoint: 'opc.tcp://10.6.51.42:4840',
                            connected: false,
                            services: undefined,
                            protected: false
                        });
                    });
                done();
            });
        });

        it('should load the cif module json', (done) => {
            fs.readFile('assets/modules/module_cif.json', (err, file) => {
                const module = new Module(JSON.parse(file.toString()).modules[0]);
                assert.equal(module.id, 'CIF');
                assert.equal(module.services.length, 6);
                done();
            });
        });
    });
});
