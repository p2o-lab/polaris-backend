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

/** Fix reactor of ACHEMA demonstrator.
 * Set all opModes from devices to automatic and set correct default values
 */
import { ClientSession } from 'node-opcua';
import {DataType, Variant, VariantArrayType} from 'node-opcua-variant';
import * as delay from 'timeout-as-promise';
import {catOpc} from '../config/logging';

export async function fixReactor(session: ClientSession) {
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

    catOpc.info(`Fixing nodes in reactor PEA server`);

    // first set to manual
    await Promise.all(nodeIdsReactor.map((nodeId) => {
        return session.writeSingleNode(
            nodeId,
            Variant.coerce({
                dataType: DataType.UInt32,
                value: 16,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            })
        );
    }));
    await delay(200);

    // then to automatic
    await Promise.all(nodeIdsReactor.map((nodeId) => {
        return session.writeSingleNode(
            nodeId,
            Variant.coerce({
                dataType: DataType.UInt32,
                value: 64,
                arrayType: VariantArrayType.Scalar,
            })
        );
    }));

    // give all Parameters nice default values
    await Promise.all(valuesReactor.map(async (item) => {
        return session.writeSingleNode(
            item[0],
            Variant.coerce({
                dataType: DataType.Float,
                value: item[1],
                arrayType: VariantArrayType.Scalar,
            })
        );
    }));

    catOpc.info(`Nodes in reactor PEA server fixed`);
}
