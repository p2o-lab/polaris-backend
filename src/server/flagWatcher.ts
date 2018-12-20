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

import { series } from 'async';
import { post } from 'request';
import { AttributeIds, ClientSubscription, OPCUAClient, resolveNodeId } from 'node-opcua';
import { catOpc } from '../config/logging';

/** options
 let endpointUrl = 'opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer';    // OPC-UA Server
 let nodeId = 'ns=3;s=BooleanDataItem'; // "ns=[0-9];[i,s]=[0-9/a-z]"
 let httpURL = 'http://www.google.de';        // http POST destination
 */

export async function watchFlag(endpoint: string, nodeId: string, httpURL: string) {

    const client = new OPCUAClient({
        endpoint_must_exist: false,
        connectionStrategy: {
            maxRetry: 5
        }
    });
    catOpc.info('Connect to ' + endpoint);
    await client.connect(endpoint);

    const the_session = await client.createSession();
    const the_subscription = new ClientSubscription(the_session, {
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 10,
        requestedMaxKeepAliveCount: 2,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 10
    });

    // install monitored item
    const monitoredItem = the_subscription.monitor({
        nodeId: resolveNodeId(nodeId),
        attributeId: AttributeIds.Value
    },
        {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        });

    monitoredItem.on('changed', (dataValue) => {
        catOpc.info(`flag is ${dataValue.value.value}`);
        if (dataValue.value.value) {
            httpPost();
        }

    });

    function httpPost() {
        post(
            httpURL,
            { json: { key: 'value' } },
            (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    catOpc.info(`HTTP Post successful ${body}`);
                }
            }
        );
    }
}
