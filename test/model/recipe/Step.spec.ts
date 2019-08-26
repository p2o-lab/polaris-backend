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

import {ServiceCommand, StepOptions} from '@p2olab/polaris-interface';
import {expect} from 'chai';
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';
import {Step} from '../../../src/model/recipe/Step';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

describe('Step', () => {

    it('should fail to create with missing name', () => {
        expect(() => new Step({name: null, operations: null, transitions: null}, null)).to.throw('missing');
    });

    it('should fail to create with missing operations', () => {
        expect(() => new Step({name: 'test', operations: null, transitions: null}, null)).to.throw('missing');
    });

    it('should fail to create with missing name', () => {
        expect(() => new Step({name: 'test', operations: [], transitions: null}, null)).to.throw('missing');
    });

    it('should create', () => {
        expect(new Step({name: 'test', operations: [], transitions: []}, null)).to.have.property('name', 'test');
    });

    describe('with module test server', () => {

        let moduleServer: ModuleTestServer;
        let module: Module;

        beforeEach(async function() {
            this.timeout(5000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();

            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString())
                .modules[0];
            module = new Module(moduleJson);
            await module.connect();

        });

        afterEach(async () => {
            await moduleServer.shutdown();
        });

        it('should execute step', async () => {
            const step = new Step({
                name: 'S0.CheckInitialConditions',
                operations: [ {
                    service: 'Service1',
                    command: ServiceCommand.start
                }],
                transitions: [
                    {
                        next_step: 'completed',
                        condition: {
                            type: 'state',
                            module: 'CIF',
                            service: 'Service1',
                            state: 'starting'
                        }
                    }
                ]
            } as StepOptions, [module]);

            step.execute();

            await new Promise((resolve) => step.eventEmitter.on('completed', resolve));
        });

    });
});
