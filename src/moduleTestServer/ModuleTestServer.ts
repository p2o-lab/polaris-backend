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

import * as net from 'net';
import {DataType, Variant} from 'node-opcua';
import {OPCUAServer} from 'node-opcua-server';
import {catTestServer} from '../config/logging';
import {TestServerService} from './ModuleTestService';
import {TestServerVariable} from './ModuleTestVariable';

export class ModuleTestServer {

    public externalTrigger: boolean;
    public variables: TestServerVariable[] = [];
    public services: TestServerService[] = [];
    private server: OPCUAServer;
    private port: number;

    constructor(port = 4334) {
        this.port = port;
        this.server = new OPCUAServer({port: this.port});

        this.externalTrigger = false;
    }

    public async portInUse(): Promise<boolean> {
        const server = net.createServer((socket) => {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });

        return new Promise((resolve) => {
            server.listen(this.port, '127.0.0.1');
            server.on('error', () => {
                resolve(true);
            });
            server.on('listening', () => {
                server.close();
                resolve(false);
            });
        });
    }

    public async start() {
        if (await this.portInUse()) {
            throw new Error('Port is in use');
        }
        await new Promise((resolve) => this.server.initialize(resolve));
        this.createAddressSpace();
        await new Promise((resolve) => this.server.start(resolve));
        catTestServer.info('server started');
    }

    public async shutdown() {
        catTestServer.info('Shutdown test server');
        await new Promise((resolve) => this.server.shutdown(100, resolve));
    }

    public startSimulation() {
        this.variables.forEach((variable) => variable.startSimulation());
        this.services.forEach((service) => service.startSimulation());
    }

    public stopSimulation() {
        this.variables.forEach((variable) => variable.stopSimulation());
        this.services.forEach((services) => services.stopSimulation());
    }

    private createAddressSpace() {
        const addressSpace = this.server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        // declare a new object
        const myModule = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: 'TestModule'
        });

        this.variables.push(new TestServerVariable(namespace, myModule, 'Variable1', true));
        this.variables.push(new TestServerVariable(namespace, myModule, 'Variable2', true));
        this.variables.push(new TestServerVariable(namespace, myModule, 'TestServerVariable.3', true));

        this.services.push(new TestServerService(namespace, myModule, 'Service1'));
        this.services.push(new TestServerService(namespace, myModule, 'Service2'));

        namespace.addVariable({
            componentOf: myModule,
            browseName: 'ExternalTrigger',
            nodeId: 'ns=1;s=trigger',
            dataType: 'Boolean',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Boolean, value: this.externalTrigger});
                }
            }
        });

    }
}
