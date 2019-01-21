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
import {DataType, OPCUAServer, Variant} from 'node-opcua';
import {expect} from 'chai';

describe('ExternalTrigger', () => {

    let variable1 = false;
    let nodeId: string;
    let server: OPCUAServer;

    before(function(done) {
        this.timeout(5000);
         server = new OPCUAServer({
            port: 4334, // the port of the listening socket of the server
            resourcePath: 'UA/MyLittleServer', // this path will be added to the endpoint resource name
        });

        function post_initialize() {
            function construct_my_address_space(server) {
                const addressSpace = server.engine.addressSpace;
                const namespace = addressSpace.getOwnNamespace();

                // declare a new object
                const device = namespace.addObject({
                    organizedBy: addressSpace.rootFolder.objects,
                    browseName: 'MyDevice'
                });

                let a = namespace.addVariable({
                    componentOf: device,
                    browseName: 'MyVariable1',
                    dataType: 'Boolean',
                    value: {
                        get: function () {
                            return new Variant({dataType: DataType.Boolean, value: variable1 });
                        }
                    }
                });
                nodeId = a.nodeId.toString();
            }
            construct_my_address_space(server);
            server.start(done);
        }

        server.initialize(post_initialize);
    });

    after((done) => {
        server.shutdown(100, ()=> {done()})
    });

    it('should fail with missing endpoint', () => {

        expect(() => {let et = new ExternalTrigger(undefined, undefined)}).to.throw();
        expect(() => {let et = new ExternalTrigger("sdfsd", undefined)}).to.throw();
        expect(() => {let et = new ExternalTrigger("opc.tcp://localhost:4334/Ua/MyLittleServer", undefined)}).to.throw();
    });

    it('should work with the sample server', async () => {
        let et = new ExternalTrigger("opc.tcp://localhost:4334/Ua/MyLittleServer", nodeId);
        await et.startMonitoring();

        expect(await et.getValue()).to.be.false;
        variable1 = true;

        expect(await et.getValue()).to.be.true;
    });


});