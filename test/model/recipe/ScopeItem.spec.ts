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
import {Module} from '../../../src/model/core/Module';
import {OPCUAServer} from 'node-opcua-server';
import { timeout } from 'promise-timeout';
import * as fs from "fs";
import {ScopeItem} from '../../../src/model/recipe/ScopeItem';


/**
 * Test for [[Condition]]
 */
describe('Scope Item', () => {

    let moduleJson;
    let module: Module;

    before(() => {
        moduleJson = JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'))
            .modules[0];
        module = new Module(moduleJson);
    });

    it('should work for normal expression', () => {
        const extraction = ScopeItem.extractFromExpressionString("CIF.Variable001 + 3", [module]);
        expect(extraction.scopeItems).to.have.lengthOf(1);
        expect(extraction.scopeItems[0].name).to.equal('CIF.Variable001');
    });

    it('should work for mutliple variables', () => {
        const extraction = ScopeItem.extractFromExpressionString("CIF.Variable001 + CIF.Variable002", [module]);
        expect(extraction.scopeItems).to.have.lengthOf(2);
        expect(extraction.scopeItems[0].name).to.equal('CIF.Variable001');
        expect(extraction.scopeItems[1].name).to.equal('CIF.Variable002');
    });

    it('should work for mutliple times of same variables', () => {
        const extraction = ScopeItem.extractFromExpressionString("CIF.Variable001 + CIF.Variable001", [module]);
        expect(extraction.scopeItems).to.have.lengthOf(1);
        expect(extraction.scopeItems[0].name).to.equal('CIF.Variable001');
    });

    it('should work for expression with special characters', () => {
        const extraction = ScopeItem.extractFromExpressionString("CIF.Variable\\.001 + 3", [module]);
        expect(extraction.scopeItems).to.have.lengthOf(1);
        expect(extraction.scopeItems[0].variable.node_id).to.equal('MyVariable1');
        expect(extraction.scopeItems[0].name).to.equal('CIF.Variable__001');
    });

});