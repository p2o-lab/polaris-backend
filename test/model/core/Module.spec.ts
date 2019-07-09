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

import {ModuleOptions} from '@p2olab/polaris-interface';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Module', () => {

    it('should not connect to a module with too high port', () => {
        const options: ModuleOptions =
            JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString()).modules[0];
        options.opcua_server_url = 'opc.tcp://10.6.51.99:44447777';
        const module = new Module(options);
        expect(module.isConnected()).to.equal(false);
        expect(module.connect()).to.be.rejectedWith('Port should be');
    });

    it.skip('should not connect to a module with not existing endpoint', async () => {
        // test does not terminate
        const options: ModuleOptions =
            JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString()).modules[0];
        options.opcua_server_url = 'opc.tcp://10.6.51.99:4444';
        const module = new Module(options);
        expect(module.isConnected()).to.equal(false);
        await expect(module.connect()).to.be.rejectedWith('Timeout');
        expect(module.isConnected()).to.equal(false);
    }).timeout(3000);

    it('should load the cif module json', (done) => {
        fs.readFile('assets/modules/module_cif.json', (err, file) => {
            const module = new Module(JSON.parse(file.toString()).modules[0]);
            expect(module).to.have.property('id', 'CIF');
            expect(module.services).to.have.length(6);
            done();
        });
    });

    it('should recognize a opc ua server shutdown', async () => {
        const moduleJson =
            JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8')).modules[0];

        const module = new Module(moduleJson);

        const moduleServer = new ModuleTestServer();
        await moduleServer.start();
        expect(module.isConnected()).to.equal(false);

        await module.connect();
        expect(module.isConnected()).to.equal(true);

        await new Promise((resolve) => {
            module.once('disconnected', () => {
                expect(module.isConnected()).to.equal(false);
                resolve();
            });
            moduleServer.shutdown();
        });
    }).retries(3);

    context('with module server', () => {
        let moduleServer: ModuleTestServer;
        let module: Module;

        before(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
            const moduleJson =
                JSON.parse(fs.readFileSync('assets/modules/module_testserver_1.0.0.json', 'utf8')).modules[0];
            module = new Module(moduleJson);

            await module.connect();
        });

        after(async () => {
            await module.disconnect();
            moduleServer.stopSimulation();
            await moduleServer.shutdown();
        });

        it('should provide correct json output', async () => {
            expect(await module.json()).to.have.property('services')
                .to.have.lengthOf(2);
        });

    });

});
