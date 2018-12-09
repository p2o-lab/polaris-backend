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

import { Condition, NotCondition, TimeCondition } from '../src/model/Condition';
import * as assert from 'assert';
import { catRecipe } from '../src/config/logging';
import { ConditionType } from 'pfe-ree-interface';
import * as fs from "fs";
import {Module} from "../src/model/Module";

describe('Integration test with CIF test PLC', () => {

    let module: Module;

    before(() => {
        const file = fs.readFileSync('assets/modules/module_cif.json');
        module = new Module(JSON.parse(file.toString()).modules[0]);
    });

    it('should connect to CIF', async function() {
        this.timeout(5000);
        await module.connect();

        let json = await module.json();
        assert.equal(json.id, 'CIF');
        assert.equal(json.endpoint, 'opc.tcp://10.6.51.200:4840');
        assert.equal(json.protected, false);
        assert.equal(json.connected, true);
        assert.equal(json.services.length, 6);

        await module.disconnect();
        json = await module.json();
        assert.equal(json.connected, false);
    });

});
