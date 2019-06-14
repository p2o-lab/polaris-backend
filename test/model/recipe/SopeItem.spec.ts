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
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';
import {ScopeItem} from '../../../src/model/recipe/ScopeItem';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ScopeItem', () => {

    let moduleTestServer: Module;
    let moduleDosierer: Module;

    before(() => {
        moduleDosierer = new Module(
            JSON.parse(fs.readFileSync('assets/modules/module_dosierer_1.1.0.json').toString()).modules[0]);
        moduleTestServer = new Module(
            JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json').toString()).modules[0]);
    });

    it('should return null without modules', () => {
        expect(ScopeItem.extractFromExpressionVariable('Variable001', []))
            .to.equal(null);
    });

    it('should return ScopeItem 1', () => {
        const item = ScopeItem.extractFromExpressionVariable('Variable001', [moduleTestServer]);
        expect(item).to.have.property('module').to.have.property('id', 'CIF');
        expect(item).to.have.property('name', 'Variable001');
        expect(item).to.have.property('variable').to.have.property('node_id', 'Variable1.V');
    });

    it('should return ScopeItem 2', () => {
        const item = ScopeItem.extractFromExpressionVariable('Variable001.VUnit', [moduleTestServer]);
        expect(item).to.have.property('module').to.have.property('id', 'CIF');
        expect(item).to.have.property('name', 'Variable001.VUnit');
        expect(item).to.have.property('variable').to.have.property('node_id', 'Variable1.VUnit');
    });

    it('should return ScopeItem 3', () => {
        const item = ScopeItem.extractFromExpressionVariable('Variable001.V', [moduleTestServer]);
        expect(item).to.have.property('module').to.have.property('id', 'CIF');
        expect(item).to.have.property('name', 'Variable001.V');
        expect(item).to.have.property('variable').to.have.property('node_id', 'Variable1.V');
    });

    it('should return ScopeItem 4', async () => {
        const item = ScopeItem.extractFromExpressionVariable('CIF.Variable001.VUnit', [moduleTestServer, moduleDosierer]);
        expect(item).to.have.property('module').to.have.property('id', 'CIF');
        expect(item).to.have.property('name', 'CIF.Variable001.VUnit');
        expect(item).to.have.property('variable').to.have.property('node_id', 'Variable1.VUnit');
    });

    it('should return ScopeItem 5', () => {
        const item = ScopeItem.extractFromExpressionVariable('CIF.Service1.Parameter001', [moduleTestServer, moduleDosierer]);
        expect(item).to.have.property('module').to.have.property('id', 'CIF');
        expect(item).to.have.property('name', 'CIF.Service1.Parameter001');
        expect(item).to.have.property('variable').to.have.property('node_id', 'Service1.Parameter1.V');
    });

    it('should return ScopeItem 6', () => {
        const item = ScopeItem.extractFromExpressionVariable('CIF.Service1.Parameter00x', [moduleTestServer, moduleDosierer]);
        expect(item).to.equal(null);
    });

    it('should return ScopeItem 7', () => {
        const item = ScopeItem.extractFromExpressionVariable('CIF.Service5.Parameter00x', [moduleTestServer, moduleDosierer]);
        expect(item).to.equal(null);
    });

    it('should return null when no module is given and more than one module available', () => {
        expect(ScopeItem.extractFromExpressionVariable('Variable001', [moduleTestServer, moduleDosierer]))
            .to.equal(null);
    });

    context('with moduletestserver', () => {

        let moduleServer: ModuleTestServer;

        before(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();

            await moduleTestServer.connect();
        });

        after(async () => {
            await moduleTestServer.disconnect();
            await moduleServer.shutdown();
        });

        it('get scope value', async () => {
            const item = ScopeItem.extractFromExpressionVariable('CIF.Service1.Parameter001', [moduleTestServer, moduleDosierer]);
            expect(await item.getScopeValue()).to.deep.equal({
                'CIF': {
                    'Service1': {
                        'Parameter001': 20
                    }
                }
            });
        });

    });
});
