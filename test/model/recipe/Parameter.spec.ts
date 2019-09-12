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

import {expect} from 'chai';
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';
import {Service} from '../../../src/model/core/Service';
import {Parameter} from '../../../src/model/recipe/Parameter';
import {TestServerNumericVariable} from '../../../src/moduleTestServer/ModuleTestNumericVariable';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

describe('Parameter', () => {

    context('static', () => {
        let service: Service;
        let module: Module;

        before(() => {
            const file = fs.readFileSync('assets/modules/module_cif.json');

            module = new Module(JSON.parse(file.toString()).modules[0]);
            service = module.services[0];
        });

        it('should load', () => new Parameter({
                name: 'var1',
                value: 3
            }, service)
        );

        it('should load with expression', async () => {
            const param = new Parameter({
                name: 'var1',
                value: '3+2'
            }, service);
            expect(await param.getValue()).to.equal(5);
        });

        it('should load with complex expression', async () => {
            const param = new Parameter({
                name: 'var1',
                value: 'sin(3)+2'
            }, service);
            expect(await param.getValue()).to.be.closeTo(2.14, 0.01);
        });

        it('should fail with wrong parameter name', () => {
            expect(() => new Parameter({
                    name: 'non-existing-parameter',
                    value: 3
                }, service)
            ).to.throw();
        });

        it('should provide 0 with empty expression', async () => {
            const param = new Parameter({
                name: 'var1',
                value: ''
            }, service);
            expect(await param.getValue()).to.equal(0);
        });

        it('should provide 0 with no expression', async () => {
            const param = new Parameter({
                name: 'var1',
                value: null
            }, service);
            expect(await param.getValue()).to.equal(0);
        });

        it('should provide 0 with non valid expression', async () => {
            expect(() => new Parameter({
                name: 'var1',
                value: 'ssd+4335.,dfgölkp94'
            }, service)).to.throw('Parsing error');
        });
    });

    context('with ModuleTestServer', () => {
        let service: Service;
        let module: Module;
        let moduleTestServer: ModuleTestServer;

        before(async function before() {
            this.timeout(5000);
            moduleTestServer = new ModuleTestServer();
            await moduleTestServer.start();
            const moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
                .modules[0];
            module = new Module(moduleJson);
            service = module.services[0];
            await module.connect();
        });

        after(async () => {
            await module.disconnect();
            await moduleTestServer.shutdown();
        });

        it('should load with complex expression and given scopeArray', async () => {
            const param = new Parameter({
                name: 'Parameter001',
                value: 'sin(a)^2 + cos(CIF.Variable001)^2',
                scope: [
                    {
                        name: 'a',
                        module: 'CIF',
                        dataAssembly: 'Variable001',
                        variable: 'V'
                    }
                ]

            }, service, undefined, [module]);
            expect(param.scopeArray).to.have.lengthOf(2);
            expect(param.scopeArray[1].getScopeValue()).to.deep.equal({
                CIF: {
                    Variable001: 20
                }
            });
            expect(param.scopeArray[0].getScopeValue()).to.deep.equal({a: 20});
            expect(param.getValue()).to.be.closeTo(1, 0.01);
        });

        it('should load with complex expression with dataAssembly variables', () => {
            const param = new Parameter({
                name: 'Parameter001',
                value: '2 * CIF.Variable001.V + CIF.Variable002 + Variable\\.003'
            }, service, undefined, [module]);
            expect(param.getValue()).to.be.greaterThan(0.01);
        });

        it('should update value on module', async () => {
            const param = new Parameter({
                name: 'Parameter001',
                value: '2 * 3'
            }, service, undefined, [module]);
            await param.updateValueOnModule();
            const param1Ext = moduleTestServer.services[0].parameter[0] as TestServerNumericVariable;
            expect(param1Ext.vext).to.equal(6);

            const param2 = new Parameter({
                name: 'Parameter002',
                value: '2 * CIF.Variable001.V + CIF.Variable002 + Variable\\.003'
            }, service, undefined, [module]);
            const value = await param2.getValue();
            await param2.updateValueOnModule();
            const param2Ext = moduleTestServer.services[0].parameter[1] as TestServerNumericVariable;
            expect(param2Ext.vext).to.equal(value);
        });

        it('should listen to dynamic parameter', async () => {
            const param = new Parameter({
                name: 'Parameter001',
                value: '2 * CIF.Variable001.V'
            }, service, undefined, [module]);
            expect(param.scopeArray[0].dataAssembly.subscriptionActive).to.equal(true);
            expect(param.scopeArray[0].dataAssembly.name).to.equal('Variable001');
            expect(param.scopeArray[0].dataItem.value).to.equal(20);

            (moduleTestServer.variables[0] as TestServerNumericVariable).v = 10;
            await new Promise((resolve) => {
                param.listenToParameter().once('changed', () => resolve());
            });
            expect(param.getValue()).to.equal(20);
        });

    });

});
