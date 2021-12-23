/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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


import {OPCUAServer} from 'node-opcua-server';
import * as net from 'net';
import {AddressSpace, DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {catMockupServer} from '../../logging';

function validateUser(username: string, password: string): boolean {
	catMockupServer.info(`Try to login with ${username}:${password}`);
	return username === 'admin' && password === '1234';
}

export class MockupServer {

	public externalTrigger = false;

	private server: OPCUAServer;
	private initialized = false;
	private namespace: Namespace | undefined = undefined;
	private rootComponent: UAObject | undefined = undefined;
	private readonly port: number;
	private testNumber = 0;

	constructor(port = 4334) {
		this.port = port;
		this.server = new OPCUAServer({port: this.port, userManager: {isValidUser: validateUser}});
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

	public async initialize(): Promise<void> {
		if (await this.portInUse()) {
			throw new Error('Port is in use');
		}
		await this.server.initialize();
		this.createAddressSpace();
		this.initialized = true;
	}


	public async start(): Promise<void> {
		if(!this.initialized) await this.initialize();
		await new Promise((resolve) => this.server.start(resolve));
		catMockupServer.info('server started on port ' + this.port);
	}

	public async shutdown(): Promise<void> {
		catMockupServer.info('Shutdown mockup server');
		await new Promise((resolve) => this.server.shutdown(100, resolve));
		catMockupServer.info('Shutdown finished');
	}

	get endpoint(): string{
		return 'opc.tcp://' + require('os').hostname() + ':' + this.endpointPort;
	}

	get endpointUrl(): string{
		return 'opc.tcp://' + require('os').hostname() + ':NodeOPCUA-Server';
	}

	get endpointPort(): number{
		return this.port;
	}

	get nameSpaceUri(): string {
		return this.namespace? this.namespace.namespaceUri : '';
	}

	get nameSpace(): Namespace {
		if (!this.namespace) {
			throw new Error('Namespace is undefined!');
		}
		return this.namespace;
	}

	get rootObject(): UAObject {
		if (!this.rootComponent) {
			throw new Error('Root object is undefined!');
		}
		return this.rootComponent;
	}

	private createAddressSpace(): void {

		const addressSpace: AddressSpace | null = this.server.engine.addressSpace;
		if (!addressSpace){
			throw new Error('AddressSpace is undefined.');
		}

		const namespace: Namespace = addressSpace.getOwnNamespace();

		this.namespace = addressSpace.registerNamespace('urn:P2OLab:NodeOPCUA-Server');;
		// declare a new object
		const myMockup = namespace.addObject({
			organizedBy: addressSpace.rootFolder.objects,
			browseName: 'MockupServer'
		});
		this.rootComponent = myMockup;

		namespace.addVariable({
			componentOf: myMockup,
			browseName: 'ExternalTrigger',
			nodeId: 'ns=1;s=trigger',
			dataType: 'Boolean',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.externalTrigger});
				}
			}
		});
		namespace.addVariable({
			componentOf: myMockup,
			browseName: 'TestNumber',
			nodeId: 'ns=1;s=testNumber',
			dataType: 'Float',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Float, value: this.testNumber});
				},
				set: (variant: Variant): StatusCodes => {
					this.testNumber = variant.value;
					return StatusCodes.Good;
				},
			}
		});

	}
}
