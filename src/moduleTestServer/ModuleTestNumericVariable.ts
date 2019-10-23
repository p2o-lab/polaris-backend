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

import {DataType, StatusCodes, Variant} from 'node-opcua';
import Timeout = NodeJS.Timeout;
import {catTestServer} from '../logging/logging';
import {TestServerVariable} from './ModuleTestVariable';

export class TestServerNumericVariable extends TestServerVariable {

    public v: number;
    public vext: number;
    public sclMin: number;
    public sclMax: number;
    public unit: number;
    protected interval: Timeout;

    constructor(namespace, rootNode, variableName: string, initialValue = 20, initialUnit?, initialMin?, initialMax?) {
        super(namespace, rootNode, variableName);

        this.v = initialValue;
        this.vext = initialValue;
        this.sclMin = initialMin || initialValue - Math.random() * 100;
        this.sclMax = initialMax || initialValue + Math.random() * 100;
        this.unit = initialUnit || Math.floor((Math.random() * 100) + 1000);

        namespace.addVariable({
            componentOf: this.variableNode,
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
            componentOf: this.variableNode,
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
            componentOf: this.variableNode,
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
            componentOf: this.variableNode,
            nodeId: `ns=1;s=${variableName}.VSclMax`,
            browseName: `${variableName}.VSclMax`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.sclMax});
                }
            }
        });

        namespace.addVariable({
            componentOf: this.variableNode,
            nodeId: `ns=1;s=${variableName}.VExt`,
            browseName: `${variableName}.VExt`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.vext});
                },
                set: (variant) => {
                    this.vext = parseFloat(variant.value);
                    catTestServer.debug(`Set Vext of ${this.name} to ${variant.value} -> ${this.vext}`);
                    setTimeout(() => {
                        this.v = this.vext;
                    }, 500);
                    return StatusCodes.Good;
                }

            }
        });
    }

    public startRandomOscillation() {
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

    public stopRandomOscillation() {
        global.clearInterval(this.interval);
    }
}
