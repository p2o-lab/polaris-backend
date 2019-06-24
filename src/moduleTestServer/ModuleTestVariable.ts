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

import {catTestServer} from '../config/logging';
import {DataType, Variant} from 'node-opcua';
import Timeout = NodeJS.Timeout;
import {OpMode} from '../model/core/enum';

export class TestServerVariable {

    public v: number = 20;
    public vext: number = 20;
    public sclMin: number = Math.random() * 100;
    public sclMax: number = this.sclMin + Math.random() * 100;
    public unit: number = Math.floor((Math.random() * 100) + 1000);
    public opMode: number = 0;
    private interval: Timeout;
    private simulation: boolean;

    constructor(namespace, rootNode, variableName, simulation = false, opMode = true) {
        catTestServer.info(`Add variable ${variableName}`);

        this.simulation = simulation;
        const variableNode = namespace.addObject({
            organizedBy: rootNode,
            browseName: variableName
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.V`,
            browseName: `${variableName}.V`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.v});
                }
            }
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.VUnit`,
            browseName: `${variableName}.VUnit`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.unit});
                }
            }
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.VSclMin`,
            browseName: `${variableName}.VSclMin`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.sclMin});
                }
            }
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.VSclMax`,
            browseName: `${variableName}.VSclMax`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.sclMax});
                }
            }
        });
        if (!this.simulation) {
            namespace.addVariable({
                componentOf: variableNode,
                nodeId: `ns=1;s=${variableName}.VExt`,
                browseName: `${variableName}.VExt`,
                dataType: 'Double',
                value: {
                    get: () => {
                        return new Variant({dataType: DataType.Double, value: this.vext});
                    },
                    set: (variant) => {
                        this.vext = parseInt(variant.value, 10);
                        setTimeout(() => {
                            this.v = this.vext;
                        }, 500);
                    }

                }
            });
        }

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.OpMode`,
            browseName: `${variableName}.OpMode`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    catTestServer.trace(`[${variableName}] Get Opmode in testserver ${this.opMode}`);
                    return new Variant({dataType: DataType.UInt32, value: this.opMode});
                },
                set: (variant) => {
                    if (parseInt(variant.value, 10) === OpMode.stateManOp) {
                        this.opMode = this.opMode & ~OpMode.stateAutAct;
                        this.opMode = this.opMode | OpMode.stateManAct;
                    }
                    if (parseInt(variant.value, 10) === OpMode.stateAutOp) {
                        this.opMode = this.opMode & ~OpMode.stateManAct;
                        this.opMode = this.opMode | OpMode.stateAutAct;
                    }
                    if (parseInt(variant.value, 10) === OpMode.srcExtOp) {
                        this.opMode = this.opMode | OpMode.srcExtAct;
                    }
                    catTestServer.trace(`[${variableName}] Set Opmode in testserver ${variant} ` +
                        `${parseInt(variant.value, 10)} -> ${this.opMode}`);
                }
            }
        });
    }

    public startSimulation() {
        if (this.simulation) {
            let time = 0;
            const f1 = Math.random();
            const f2 = Math.random();
            const amplitude = this.sclMax - this.sclMin;
            const average = (this.sclMax + this.sclMin) / 2;
            this.interval = global.setInterval(() => {
                time = time + 0.05;
                this.v = average + 0.5 * amplitude * Math.sin(2 * f1 * time + 3 * f2);
            }, 100);
        }
    }

    public stopSimulation() {
        clearTimeout(this.interval);

    }
}
