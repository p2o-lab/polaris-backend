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
import {catTestServer} from '../config/logging';
import {TestServerVariable} from './ModuleTestVariable';

export class TestServerStringVariable extends TestServerVariable {

    public v: string = 'initial value';
    public vext: string = '';
    protected interval: Timeout;

    constructor(namespace, rootNode, variableName: string) {
        super(namespace, rootNode, variableName);

        namespace.addVariable({
            componentOf: this.variableNode,
            nodeId: `ns=1;s=${variableName}.Text`,
            browseName: `${variableName}.Text`,
            dataType: 'String',
            value: {
                get: () => {
                    catTestServer.debug(`[${this.name}] Get string variable in testserver ${this.v}`);
                    return new Variant({dataType: DataType.String, value: this.v});
                },
                set: (variant) => {
                    this.v = variant.value;
                    return StatusCodes.Good;
                }
            }
        });

    }

    public startSimulation() {
        this.interval = global.setInterval(() => {
            this.v = new Date().toTimeString();
        }, 1000);
    }

    public stopSimulation() {
        global.clearTimeout(this.interval);
    }
}
