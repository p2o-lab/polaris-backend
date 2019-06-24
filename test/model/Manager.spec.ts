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

import {ServiceCommand} from '@p2olab/polaris-interface';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import * as parseJson from 'json-parse-better-errors';
import {ServiceState} from '../../src/model/core/enum';
import {Service} from '../../src/model/core/Service';
import {Manager} from '../../src/model/Manager';
import {ModuleTestServer} from '../../src/moduleTestServer/ModuleTestServer';
import {waitForStateChange} from '../helper';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Manager', () => {

    context('loading modules', () => {

        it('should reject loading modules with empty options', () => {
            const manager = new Manager();
            expect(() => manager.loadModule(null)).to.throw();
            expect(() => manager.loadModule({})).to.throw();
            expect(() => manager.loadModule({someattribute: 'abc'} as any)).to.throw();
        });

        it('should load modules', () => {
            const modulesJson = JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString());
            const manager = new Manager();
            manager.loadModule(modulesJson);
            expect(() => manager.loadModule(modulesJson)).to.throw('already in registered modules');
        });

        it('should load with single module', () => {
            const modulesJson = JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString());
            const moduleJson = modulesJson.modules[0];
            const manager = new Manager();
            manager.loadModule({module: moduleJson});
            expect(() => manager.loadModule({module: moduleJson})).to.throw('already in registered modules');
        });

        it('should load with subplants options', () => {
            const modulesJson = JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString());
            const manager = new Manager();
            manager.loadModule({subplants: [modulesJson]});
            expect(() => manager.loadModule({subplants: [modulesJson]})).to.throw('already in registered modules');
        });

        it('should load the achema modules', () => {
            const manager = new Manager();
            const modules = manager.loadModule(
                JSON.parse(fs.readFileSync('assets/modules/modules_achema.json').toString()),
                true);
            expect(modules).to.have.lengthOf(3);

            expect(manager.modules).to.have.lengthOf(3);

            const service = manager.getService('Dose', 'Fill');
            expect(service).to.be.instanceOf(Service);
            expect(service.name).to.equal('Fill');
            expect(() => manager.getService('Dose', 'NoService')).to.throw();
            expect(() => manager.getService('NoModule', 'NoService')).to.throw();

            expect(manager.removeModule('something')).to.be.rejectedWith(/No Module/);
            expect(manager.removeModule(manager.modules[1].id)).to.be.rejectedWith(/is protected/);
        });

        it('should prevent removing a protected module', () => {
            const manager = new Manager();
            const modules = manager.loadModule(
                JSON.parse(fs.readFileSync('assets/modules/modules_achema.json').toString()),
                true);
        });
    });

    it('should load and remove recipe', () => {
        const modulesRecipe =
            JSON.parse(fs.readFileSync('assets/recipes/test/recipe_time_local.json').toString());
        const manager = new Manager();
        manager.loadRecipe(modulesRecipe);
        manager.loadRecipe(modulesRecipe, true);

        expect(manager.recipes).to.have.lengthOf(2);

        expect(() => manager.removeRecipe('whatever')).to.throw('not available');

        manager.removeRecipe(manager.recipes[0].id);
        expect(manager.recipes).to.have.lengthOf(1);

        expect(() => manager.removeRecipe(manager.recipes[0].id)).to.throw('protected');
    });

    describe('test with test module', () => {
        let moduleServer: ModuleTestServer;

        before(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
        });

        after(async () => {
            await moduleServer.shutdown();
        });

        it('should load from options, stop, abort and reset manager and remove module', async () => {
            const moduleJson = parseJson(
                fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'), null, 60);

            const manager = new Manager();
            manager.loadModule(moduleJson);
            expect(manager.modules).to.have.lengthOf(1);

            const module = manager.modules[0];
            const service1 = module.services[0];
            const service2 = module.services[1];

            module.connect();
            await waitForStateChange(service2, 'IDLE', 2000);
            service2.execute(ServiceCommand.start);
            await waitForStateChange(service2, 'EXECUTE');

            await manager.stopAllServices();
            await waitForStateChange(service2, 'STOPPED');
            expect(service2.state).to.equal(ServiceState.STOPPED);

            await manager.abortAllServices();
            await Promise.all([
                    waitForStateChange(service1, 'ABORTED'),
                    waitForStateChange(service2, 'ABORTED')]
            );
            expect(service1.state).to.equal(ServiceState.ABORTED);
            expect(service2.state).to.equal(ServiceState.ABORTED);

            await manager.resetAllServices();
            await waitForStateChange(service2, 'IDLE');
            expect(service2.state).to.equal(ServiceState.IDLE);

            await manager.removeModule(module.id);
            expect(manager.modules).to.have.lengthOf(0);
        }).timeout(5000);

        it('should autoreset service', async () => {
            const moduleJson = parseJson(
                fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8'), null, 60);

            const manager = new Manager();
            manager.autoreset = true;
            manager.loadModule(moduleJson);

            const module = manager.modules[0];
            const service = module.services[1];

            module.connect();
            await waitForStateChange(service, 'IDLE', 2000);
            service.execute(ServiceCommand.start);
            await waitForStateChange(service, 'EXECUTE');

            service.execute(ServiceCommand.complete);
            await waitForStateChange(service, 'COMPLETED');
            await waitForStateChange(service, 'IDLE');
        });

    });

});
