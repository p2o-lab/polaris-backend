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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {catTestServer} from '../config/logging';
import {OpMode} from '../model/core/enum';

export abstract class TestServerVariable {

    public readonly name: string;
    public opMode: number = 0;
    public wqc: number = 0;
    public osLevel: number = 0;
    protected simulation: boolean;
    protected variableNode: UAObject;

    constructor(namespace: Namespace, rootNode: UAObject, variableName: string, simulation = false) {
        catTestServer.info(`Add variable ${variableName}`);

        this.name = variableName;
        this.simulation = simulation;

        this.variableNode = namespace.addObject({
            organizedBy: rootNode,
            browseName: variableName
        });

        namespace.addVariable({
            componentOf: this.variableNode,
            nodeId: `ns=1;s=${variableName}.WQC`,
            browseName: `${variableName}.WQC`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.wqc});
                }
            }
        });

        namespace.addVariable({
            componentOf: this.variableNode,
            nodeId: `ns=1;s=${variableName}.OSLevel`,
            browseName: `${variableName}.OSLevel`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.osLevel});
                }
            }
        });

        namespace.addVariable({
            componentOf: this.variableNode,
            nodeId: `ns=1;s=${variableName}.OpMode`,
            browseName: `${variableName}.OpMode`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    catTestServer.debug(`[${variableName}] Get Opmode in testserver ${this.opMode}`);
                    return new Variant({dataType: DataType.UInt32, value: this.opMode});
                },
                set: (variant) => {
                    const opModeInt = parseInt(variant.value, 10);
                    if (opModeInt === OpMode.stateManOp) {
                        this.opMode = this.opMode & ~OpMode.stateAutAct;
                        this.opMode = this.opMode | OpMode.stateManAct;
                    } else if (opModeInt === OpMode.stateAutOp) {
                        this.opMode = this.opMode & ~OpMode.stateManAct;
                        this.opMode = this.opMode | OpMode.stateAutAct;
                    } else if (opModeInt === OpMode.srcExtOp) {
                        this.opMode = this.opMode | OpMode.srcExtAct;
                    } else {
                        return StatusCodes.Bad;
                    }
                    catTestServer.debug(`[${variableName}] Set Opmode in testserver ${variant} ` +
                        `${opModeInt} -> ${this.opMode}`);
                    return StatusCodes.Good;
                }
            }
        });
    }

    public abstract startSimulation();

    public abstract stopSimulation();
}
