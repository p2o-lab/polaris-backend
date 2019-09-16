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
import {OpcUaDataItem} from '../../../src/model/dataAssembly/DataItem';
import {ModuleTestServer} from '../../../src/moduleTestServer/ModuleTestServer';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DataItem', () => {

    describe('static', () => {

        const connection = new OpcUaConnection(null, null);

        it('should reject construction with missing options', () => {
            const di = OpcUaDataItem.fromOptions(null, null, 'read', 'string');
            expect(di.access).to.equal('read');
        });

        it('should work with float', () => {
            const di = OpcUaDataItem.fromOptions(
                {value: 1.2, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, null, 'read', 'number');
            expect(di.value).to.equal(1.2);
        });

        it('should work with float conversion', () => {
            const di = OpcUaDataItem.fromOptions(
                {value: '1.2', data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, null, 'read', 'number');
            expect(di.value).to.equal(1.2);
        });

        it('should work with value = 0', () => {
            const di = OpcUaDataItem.fromOptions(
                {value: 0.0, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, null, 'read', 'number');
            expect(di.value).to.equal(0);
        });

        it('should work with negative value', () => {
            const di = OpcUaDataItem.fromOptions(
                {value: -2, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, null, 'read', 'number');
            expect(di.value).to.equal(-2.0);
        });

        it('should work with null value', () => {
            const di = OpcUaDataItem.fromOptions(
                {value: null, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, null, 'read', 'number');
            expect(di.value).to.equal(null);
            expect(di.access).to.equal('read');
        });

        it('should work with undefined value', () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    value: undefined,
                    data_type: 'Float',
                    node_id: 'test',
                    namespace_index: 'test2'
                }, null, 'write', 'number');
            expect(di.value).to.equal(undefined);
            expect(di.access).to.equal('write');
        });

        it('should work with string conversion', () => {
            const di = OpcUaDataItem.fromOptions(
                {value: 1.2, data_type: 'Float', node_id: 'test', namespace_index: 'test2'}, null, 'read', 'string');
            expect(di.value).to.equal('1.2');
        });

        it('should reject working when not connected', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.Parameter1.VExt',
                    data_type: 'Double'
                }, connection, 'write', 'number');
            await expect(di.read()).to.be.rejectedWith('namespace');
        });
    });

    describe('with testserver', () => {

        let moduleServer: ModuleTestServer;
        let connection: OpcUaConnection;

        before(async function() {
            this.timeout(5000);
            moduleServer = new ModuleTestServer();
            await moduleServer.start();
            moduleServer.startSimulation();

            connection = new OpcUaConnection('ModuleTestServer', 'opc.tcp://127.0.0.1:4334/ModuleTestServer');
            await connection.connect();
        });

        after(async () => {
            await connection.disconnect();
            moduleServer.stopSimulation();
            await moduleServer.shutdown();
        });

        it('should subscribe', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.ErrorMsg.Text',
                    data_type: 'String'
                }, connection, 'write', 'string');

            const a = await di.subscribe();
            expect(di.value).to.equal('initial value');

            await new Promise((resolve) => a.on('changed', resolve));
        });

        it('should subscribe, disconnect and resubscribe', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.ErrorMsg.Text',
                    data_type: 'String'
                }, connection, 'write', 'string');

            const a = await di.subscribe();
            await new Promise((resolve) => a.on('changed', resolve));

            await connection.disconnect();
            await connection.connect();

            const a1 = await di.subscribe();
            await new Promise((resolve) => a1.on('changed', resolve));
        });

        it('should write', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.Parameter1.VExt',
                    data_type: 'Double'
                }, connection, 'write', 'number');
            await di.write(22.0);

            const value = await di.read();
            expect(value).to.be.equal(22.0);
        });

        it('should fail while writing with wrong datatype', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.Parameter1.VExt',
                    data_type: 'Float'
                }, connection, 'write', 'number');

            await expect(di.write(22)).to.be.rejectedWith('value supplied for the attribute is not of the same type');
        });

        it('should fail while writing with wrong datatype 2', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.Parameter1.VExt',
                    data_type: 'abc'
                }, connection, 'write', 'number');

            await expect(di.write(22)).to.be.rejectedWith('datatype abc must be registered');
        });

        it('should fail while writing with wrong datatype 3', async () => {
            const di = OpcUaDataItem.fromOptions(
                {
                    namespace_index: 'urn:NodeOPCUA-Server-default',
                    node_id: 'Service1.Parameter1.VExt',
                    data_type: 'Byte'
                }, connection, 'write', 'number');

            await expect(di.write(22)).to.be.rejectedWith('value supplied for the attribute is not of the same type');
        });
    });
});
