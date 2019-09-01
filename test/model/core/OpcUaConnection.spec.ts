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
import {OpcUaConnection} from '../../../src/model/core/OpcUaConnection';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('OpcUaConnection', () => {

    it('should reject connecting to a server with too high port', async () => {
        const connection = new OpcUaConnection('test', 'opc.tcp://127.0.0.1:44447777');
        expect(connection.isConnected()).to.equal(false);
        await expect(connection.connect()).to.be.rejectedWith('The connection has been rejected by server');
    });

    it('should reject connecting to a server with not existing endpoint', async () => {
        const connection = new OpcUaConnection('test', 'opc.tcp://127.0.0.1:4444');
        expect(connection.isConnected()).to.equal(false);
        await expect(connection.connect()).to.be.rejectedWith('cannot be established');
        expect(connection.isConnected()).to.equal(false);
    }).timeout(5000);

    describe('with test server', () => {
        let moduleServer: ModuleTestServer;

        before(async () => {
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
        });

        after(async () => {
            await moduleServer.shutdown();
        });

        it('should connect to a opc ua test server, read an opc item and disconnect', async () => {
            const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
            expect(connection.isConnected()).to.equal(false);

            await connection.connect();
            expect(connection.isConnected()).to.equal(true);

            const result = await connection.readOpcUaNode('Service1.Parameter1.VExt', 'urn:NodeOPCUA-Server-default');
            expect(result.statusCode.value).to.equal(0);
            expect(result.statusCode.description).to.equal('No Error');
            expect(result.value.value).to.equal(20);

            await connection.disconnect();
        });

        it('should connect to a opc ua test server, subscribes to an opc item and disconnect', async () => {
            const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
            expect(connection.isConnected()).to.equal(false);

            await connection.connect();
            expect(connection.isConnected()).to.equal(true);

            const result = await connection.listenToOpcUaNode('Service1.ErrorMsg.Text', 'urn:NodeOPCUA-Server-default');
            expect(result.statusCode.value).to.equal(0);
            expect(result.statusCode.description).to.equal('No Error');

            await new Promise((resolve) =>
            result.on('changed', () => {
                resolve();
            }));

            await connection.disconnect();
        });

        it('should connect to a opc ua test server, listen to some opc item and disconnect', async () => {
            const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
            expect(connection.isConnected()).to.equal(false);

            await connection.connect();
            expect(connection.isConnected()).to.equal(true);

            await connection.listenToOpcUaNode('Service1.Parameter1.VExt', 'urn:NodeOPCUA-Server-default');
            expect(connection.monitoredItemSize()).equals(1);

            await connection.listenToOpcUaNode('Service1.Parameter1.VExt', 'urn:NodeOPCUA-Server-default');
            expect(connection.monitoredItemSize()).equals(1);

            await expect(connection.listenToOpcUaNode('notexistant', 'urn:NodeOPCUA-Server-default'))
                .to.be.rejectedWith('does not exist');
            expect(connection.monitoredItemSize()).equals(1);

            await expect(connection.listenToOpcUaNode('notexistant', 'urn:nan'))
                .to.be.rejectedWith('Could not resolve namespace');
            expect(connection.monitoredItemSize()).equals(1);

            await connection.listenToOpcUaNode('Service1.OpMode', 'urn:NodeOPCUA-Server-default');
            expect(connection.monitoredItemSize()).equals(2);

            await connection.disconnect();

        }).timeout(50000);

        it('should connect with username and password', async () => {
            const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334', 'admin', '1234');
            await connection.connect();
            await connection.disconnect();
        });

        it('should fail connecting with wrong username and password', async () => {
            const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334', 'admin', 'empty');
            await expect(connection.connect()).to.be.rejectedWith('BadUserAccessDenied');
        });

    });

    it('should connect to a opc ua test server and recognize a shutdown of this server', async () => {
        const connection = new OpcUaConnection('testserver', 'opc.tcp://localhost:4334');
        const moduleServer = new ModuleTestServer();
        await moduleServer.start();

        expect(connection.isConnected()).to.equal(false);

        await connection.connect();
        expect(connection.isConnected()).to.equal(true);

        await new Promise((resolve) => {
            connection.once('disconnected', () => {
                expect(connection.isConnected()).to.equal(false);
                resolve();
            });
            moduleServer.shutdown();
        });
    }).timeout(5000);

});
