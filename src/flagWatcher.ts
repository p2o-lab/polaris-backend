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

/*global require,console,setTimeout */
let opcua = require('node-opcua');
let async = require('async');
let request = require('request');

let client = new opcua.OPCUAClient({
    endpoint_must_exist: false,
    connectionStrategy: {
        maxRetry: 5
    }
});

// options
let endpointUrl = 'opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer';	// OPC-UA Server
let nodeId = 'ns=3;s=BooleanDataItem'; // "ns=[0-9];[i,s]=[0-9/a-z]"
let httpURL = 'http://www.google.de';		// http POST destination

let the_session;
let the_subscription;

async.series([

        // step 1 : connect to
        function (callback) {
            client.connect(endpointUrl, function (err) {
                if (err) {
                    console.log(' cannot connect to endpoint :', endpointUrl);
                } else {
                    console.log('connected !');
                }
                callback(err);
            });
        },

        // step 2 : createSession
        function (callback) {
            client.createSession(function (err, session) {
                if (!err) {
                    the_session = session;
                }
                callback(err);
            });
        },

        // step 5: install a subscription and install a monitored item for 10 seconds
        function (callback) {

            the_subscription = new opcua.ClientSubscription(the_session, {
                requestedPublishingInterval: 1000,
                requestedLifetimeCount: 10,
                requestedMaxKeepAliveCount: 2,
                maxNotificationsPerPublish: 10,
                publishingEnabled: true,
                priority: 10
            });

            // install monitored item
            const monitoredItem = the_subscription.monitor({
                    nodeId: opcua.resolveNodeId(nodeId),
                    attributeId: opcua.AttributeIds.Value
                },
                {
                    samplingInterval: 100,
                    discardOldest: true,
                    queueSize: 10
                },
                opcua.read_service.TimestampsToReturn.Both
            );
            console.log('-------------------------------------');

            monitoredItem.on('changed', function (dataValue) {
                console.log(' % flag is ', dataValue.value.value);
                if (dataValue.value.value) {
                    httpPost();
                }

            });
        },

        // close session
        function (callback) {
            the_session.close(function (err) {
                if (err) {
                    console.log('session closed failed ?');
                }
                callback();
            });
        }

    ],
    function (err) {
        if (err) {
            console.log(' failure ', err);
        } else {
            console.log('done!');
        }
        client.disconnect(function () {
        });
    });

function httpPost() {
    console.log('make post');
    request.post(
        httpURL,
        { json: { key: 'value' } },
        (err, res, body) => {
            if (!err && res.statusCode === 200) {
                console.log(body);
            }
        }
    );
}
