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

import {ExternalTrigger} from '../../src/server/ExternalTrigger';
import {OPCUAServer} from 'node-opcua-server';
import {expect} from 'chai';
import {ModuleTestServer} from '../../src/moduleTestServer/ModuleTestServer';

describe('ExternalTrigger', () => {

    let moduleServer: ModuleTestServer;

    before(async () => {
        moduleServer = new ModuleTestServer();
        await moduleServer.start();
    });

    after(async () => {
        await moduleServer.shutdown();
    });

    it('should fail with missing endpoint', () => {
        expect(() => {let et = new ExternalTrigger(undefined, undefined, undefined)}).to.throw();
        expect(() => {let et = new ExternalTrigger("sdfsd", undefined, undefined)}).to.throw();
        expect(() => {let et = new ExternalTrigger("opc.tcp://localhost:4334/Ua/MyLittleServer", undefined, undefined)}).to.throw();
    });

    it('should work with the sample server', async () => {
        let et: ExternalTrigger;
        await new Promise(async (resolve) => {
            et = new ExternalTrigger("opc.tcp://localhost:4334/Ua/MyLittleServer",
                'ns=1;s=trigger', resolve);
            await et.startMonitoring();

            expect(await et.getValue()).to.be.false;
            moduleServer.externalTrigger = true;

            expect(await et.getValue()).to.be.true;
        });
        await et.disconnect();
    });


});