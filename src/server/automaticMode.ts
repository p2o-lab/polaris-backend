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

import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    DataType,
    OPCUAClient,
    VariantArrayType
} from 'node-opcua-client';
import { catOpc } from '../config/logging';

let session;

async function fixModule(endpoint: string, nodeIds: string[] = undefined, values = undefined) {

    const client: OPCUAClient = new OPCUAClient({
        endpoint_must_exist: false
    });

    catOpc.info('Connect to ' + endpoint);
    await client.connect(endpoint);

    session = await client.createSession();
    if (nodeIds) {
        const tasks = nodeIds.map(value => setOpModeToAutomatic(value));

        Promise.all(tasks).then(() => {
            catOpc.info('all OpModes set');
        }).catch((reason) => {
            catOpc.error('something happened', reason);
        }).then(() => {
            client.disconnect();
        });
    }

    catOpc.info('Write Values');
    if (values) {
        values.forEach(async (item) => {
            const result = await session.writeSingleNode(
                item[0],
                {
                    dataType: DataType.Float,
                    value: item[1],
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                }
            );
            catOpc.info('value written' + item + result);
        });
    }
}

async function wait() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

async function setOpModeToAutomatic(nodeId) {

    let result = await session.readVariableValue(nodeId);
    catOpc.debug('Read OpMode' + nodeId.toString() + result.value);

    result = await session.writeSingleNode(
        nodeId,
        {
            dataType: DataType.UInt32,
            value: 16,
            arrayType: VariantArrayType.Scalar,
            dimensions: null
        }
    );

    await wait();

    result = await session.writeSingleNode(
        nodeId,
        {
            dataType: DataType.UInt32,
            value: 64,
            arrayType: VariantArrayType.Scalar,
            dimensions: null
        }
    );

    await wait();

    result = await session.readVariableValue(nodeId);
    catOpc.info('Read OpMode ' + nodeId.toString() + result.value);
}

const nodeIdsReactor = [
    'ns=3;s="AEM01"."MTP_AnaDrv"."OpMode"',
    'ns=3;s="MFH01"."MTP_BinVlv"."OpMode"',
    'ns=3;s="MFH02"."MTP_BinVlv"."OpMode"',
    'ns=3;s="MFH03"."MTP_BinVlv"."OpMode"'];

const valuesReactor = [
    ['ns=3;s="Fill_Level_Max"."MTP"."VExt"', 1.5],
    ['ns=3;s="Stir_Level_Min"."MTP"."VExt"', 0.5],
    ['ns=3;s="Stir_Period"."MTP"."VExt"', 0.5],
    ['ns=3;s="Stir_Period"."MTP"."VOp"', 0.5],
    ['ns=3;s="Empty_Level_Tank_Deadband"."MTP"."VExt"', 0.5],
    ['ns=3;s="Empty_Level_Tank_Deadband"."MTP"."VExt"', 0.5],
    ['ns=3;s="Empty_Level_Tank"."MTP"."VExt"', 0.5],
    ['ns=3;s="Empty_Level_Tank"."MTP"."VOp"', 0.5],
    ['ns=3;s="Empty_Vol_Flow"."MTP"."VOp"', 2.5],
    ['ns=3;s="Empty_Vol_Flow"."MTP"."VExt"', 2.5],
];
export function fixReactor() {
// reactor
// fixModule("opc.tcp://192.168.2.35:4840", nodeIdsReactor);
    fixModule('opc.tcp://10.6.51.22:4840', nodeIdsReactor, valuesReactor);
}

const nodeIdsDosierer = [
    'ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.P001.OpMode.binary',
    'ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.P001_PID.OpMode.binary',
    'ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.V001.OpMode.binary',
    'ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.V002.OpMode.binary',
    'ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.V003.OpMode.binary'
];

// dosierer
// fixModule("opc.tcp://192.168.2.110:4840", inodeIdsDosierer);
// fixModule("opc.tcp://10.6.51.21:4840", nodeIdsDosierer);

