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
import {Expression} from 'expr-eval';
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';
import {OpcUaDataItem} from '../../../src/model/dataAssembly/DataItem';
import {ScopeItem} from '../../../src/model/recipe/ScopeItem';
import {TestServerNumericVariable} from '../../../src/moduleTestServer/ModuleTestNumericVariable';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';
import {waitForParameterChange, waitForVariableChange} from '../../helper';

/**
 * Tests for [[ScopeItem]]
 */
describe('ScopeItem', () => {

    let moduleTestServer: Module;
    let moduleDosierer: Module;

    before(() => {
        moduleDosierer = new Module(
            JSON.parse(fs.readFileSync('assets/modules/module_dosierer_1.1.0.json').toString()).modules[0]);
        moduleTestServer = new Module(
            JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString()).modules[0]);
    });

    it('should work for normal expression', () => {
        const extraction = ScopeItem.extractFromExpressionString(
            'ModuleTestServer.Variable001 + 3', [moduleTestServer]);
        expect(extraction.scopeItems).to.have.lengthOf(1);
        expect(extraction.scopeItems[0].name).to.equal('ModuleTestServer.Variable001');
    });

    it('should work for multiple variables', () => {
        const extraction = ScopeItem.extractFromExpressionString(
            'ModuleTestServer.Variable001 + ModuleTestServer.Variable002', [moduleTestServer]);
        expect(extraction.scopeItems).to.have.lengthOf(2);
        expect(extraction.scopeItems[0].name).to.equal('ModuleTestServer.Variable001');
        expect(extraction.scopeItems[1].name).to.equal('ModuleTestServer.Variable002');
    });

    it('should work for multiple times of same variables', () => {
        const extraction = ScopeItem.extractFromExpressionString(
            'ModuleTestServer.Variable001 + ModuleTestServer.Variable001', [moduleTestServer]);
        expect(extraction.scopeItems).to.have.lengthOf(1);
        expect(extraction.scopeItems[0].name).to.equal('ModuleTestServer.Variable001');
    });

    it('should work for expression with special characters', () => {
        const extraction = ScopeItem.extractFromExpressionString('ModuleTestServer.Variable\\.003 + 3',
            [moduleTestServer]);
        expect(extraction.scopeItems).to.have.lengthOf(1);
        expect((extraction.scopeItems[0].dataItem as OpcUaDataItem<any>).nodeId).to.equal('TestServerVariable.3.V');
        expect(extraction.scopeItems[0].name).to.equal('ModuleTestServer.Variable__003');
    });

    it('should return null without modules', () => {
        expect(ScopeItem.extractFromExpressionVariable('Variable001', []))
            .to.equal(null);
    });

    it('should return ScopeItem 1', () => {
        const item = ScopeItem.extractFromExpressionVariable('Variable001', [moduleTestServer]);
        expect(item).to.have.property('module').to.have.property('id', 'ModuleTestServer');
        expect(item).to.have.property('name', 'Variable001');
        expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.V');
    });

    it('should return ScopeItem 2', () => {
        const item = ScopeItem.extractFromExpressionVariable('Variable001.VUnit', [moduleTestServer]);
        expect(item).to.have.property('module').to.have.property('id', 'ModuleTestServer');
        expect(item).to.have.property('name', 'Variable001.VUnit');
        expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.VUnit');
    });

    it('should return ScopeItem 3', () => {
        const item = ScopeItem.extractFromExpressionVariable('Variable001.V', [moduleTestServer]);
        expect(item).to.have.property('module').to.have.property('id', 'ModuleTestServer');
        expect(item).to.have.property('name', 'Variable001.V');
        expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.V');
    });

    it('should return ScopeItem 4', async () => {
        const item = ScopeItem.extractFromExpressionVariable('ModuleTestServer.Variable001.VUnit',
            [moduleTestServer, moduleDosierer]);
        expect(item).to.have.property('module').to.have.property('id', 'ModuleTestServer');
        expect(item).to.have.property('name', 'ModuleTestServer.Variable001.VUnit');
        expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Variable1.VUnit');
    });

    it('should return ScopeItem 5', () => {
        const item = ScopeItem.extractFromExpressionVariable('ModuleTestServer.Service1.Parameter001',
            [moduleTestServer, moduleDosierer]);
        expect(item).to.have.property('module').to.have.property('id', 'ModuleTestServer');
        expect(item).to.have.property('name', 'ModuleTestServer.Service1.Parameter001');
        expect(item).to.have.property('dataItem').to.have.property('nodeId', 'Service1.Parameter1.V');
    });

    it('should return null when parameter name is not existant', () => {
        const item = ScopeItem.extractFromExpressionVariable('ModuleTestServer.Service1.Parameter00x',
            [moduleTestServer, moduleDosierer]);
        expect(item).to.equal(null);
    });

    it('should return null if service name is not existant', () => {
        const item = ScopeItem.extractFromExpressionVariable('ModuleTestServer.Service5.Parameter00x',
            [moduleTestServer, moduleDosierer]);
        expect(item).to.equal(null);
    });

    it('should return null when no module is given and more than one module available', () => {
        expect(ScopeItem.extractFromExpressionVariable('Variable001', [moduleTestServer, moduleDosierer]))
            .to.equal(null);
    });

    context('with module testserver', () => {

        let moduleServer: ModuleTestServer;

        before(async function() {
            this.timeout(5000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();

            await moduleTestServer.connect();
        });

        after(async () => {
            await moduleTestServer.disconnect();
            await moduleServer.shutdown();
        });

        it('get scope value for variable', async () => {
            const item = ScopeItem.extractFromExpressionVariable('ModuleTestServer.Variable001',
                [moduleTestServer, moduleDosierer]);
            expect(item.getScopeValue()).to.deep.equal({
                'ModuleTestServer': {
                    'Variable001': 20
                }
            });

            (moduleServer.variables[0] as TestServerNumericVariable).v = 3;
            await waitForVariableChange(moduleTestServer, 'Variable001', 3);
            expect(item.getScopeValue()).to.deep.equal({
                'ModuleTestServer': {
                    'Variable001': 3
                }
            });

            (moduleServer.variables[0] as TestServerNumericVariable).v = 4;
            await waitForVariableChange(moduleTestServer, 'Variable001', 4);
            expect(item.getScopeValue()).to.deep.equal({
                'ModuleTestServer': {
                    'Variable001': 4
                }
            });
        }).timeout(5000);

        it('get scope value for parameter', async () => {
            const item = ScopeItem.extractFromExpressionVariable('ModuleTestServer.Service1.Parameter001',
                [moduleTestServer, moduleDosierer]);

            expect(item.name).to.equal('ModuleTestServer.Service1.Parameter001');
            expect((item.dataItem as OpcUaDataItem<any>).nodeId).to.equal('Service1.Parameter1.V');
            expect(item.getScopeValue()).to.deep.equal({
                'ModuleTestServer': {
                    'Service1': {
                        'Parameter001': 20
                    }
                }
            });

            (moduleServer.services[0].parameter[0] as TestServerNumericVariable).v = 30;
            await waitForParameterChange(moduleTestServer, 'Parameter001', 30);
            expect(item.getScopeValue()).to.deep.equal({
                'ModuleTestServer': {
                    'Service1': {
                        'Parameter001': 30
                    }
                }
            });
        }).timeout(5000);

        it('should work with state', () => {
            const data: {expression: Expression, scopeItems: ScopeItem[]} =
                ScopeItem.extractFromExpressionString('ModuleTestServer.Service1.state==\'IDLE\'', [moduleTestServer]);
            expect(data.scopeItems).to.have.lengthOf(1);
            expect(data.scopeItems[0]).to.have.property('module').to.have.property('id', 'ModuleTestServer');
            expect(data.scopeItems[0]).to.have.property('name', 'ModuleTestServer.Service1.state');
            expect(data.scopeItems[0]).to.have.property('dataItem').to.have.property('nodeId', 'Service1.State');

            const tasks = data.scopeItems.map((item) => {
                return item.getScopeValue();
            });
            const assign = require('assign-deep');
            const scope = assign(...tasks);
            expect(scope).to.deep.equal({
                ModuleTestServer: {
                    Service1: {
                        state: 'IDLE'
                    }
                }
            });
            expect(data.expression.evaluate(scope)).to.equal(true);
        });

    });
});
