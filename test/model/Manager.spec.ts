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

import {Manager} from '../../src/model/Manager';
import * as fs from 'fs';
import {expect} from 'chai';
import {Service} from '../../src/model/core/Service';


describe('Manager', () => {

    it('should handle recipes and modules from biofeed', () => {
        const manager  = new Manager();
        let modules = manager.loadModule(
            JSON.parse(fs.readFileSync('assets/modules/module_biofeed_1.4.2.json').toString()),
            true);
        expect(modules).to.have.lengthOf(1);
        manager.loadRecipe(
            JSON.parse(fs.readFileSync('assets/recipes/biofeed/recipe_biofeed_88370C_0.3.1.json').toString()),
            true);
        expect(() => manager.removeRecipe('something')).to.throw();
        expect(() => manager.removeRecipe(manager.recipes[0].id)).to.throw();
        manager.loadRecipe(
            JSON.parse(fs.readFileSync('assets/recipes/biofeed/recipe_biofeed_88370C_0.3.1.json').toString()),
            false);
        expect(() => manager.removeRecipe(manager.recipes[1].id)).to.not.throw();
    });

    it('should load the achema modules', () => {
        const manager = new Manager();
        let modules = manager.loadModule(
            JSON.parse(fs.readFileSync('assets/modules/modules_achema.json').toString()),
            true);
        expect(modules).to.have.lengthOf(3);

        expect(manager.modules).to.have.lengthOf(3);

        let service = manager.getService('Dose', 'Fill');
        expect(service).to.be.instanceOf(Service);
        expect(service.name).to.equal('Fill');
        expect(() => {manager.getService('Dose', 'NoService')}).to.throw();
        expect(() => {manager.getService('NoModule', 'NoService')}).to.throw();
    });

    it('should provide JSON output', () => {
        const manager= new Manager();
        expect(manager.json().autoReset).to.equal(true);
    });

});
