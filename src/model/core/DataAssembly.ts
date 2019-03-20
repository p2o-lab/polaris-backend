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

import {OpcUaNodeOptions} from './Interfaces';
import {catParameter, catService} from '../../config/logging';
import {Variant, VariantArrayType} from 'node-opcua';
import {Module} from './Module';

export abstract class DataAssembly {
    name: string;
    interface_class: string;
    communication: {
        VExt: OpcUaNodeOptions,
        VOut: OpcUaNodeOptions,
        VMin: OpcUaNodeOptions,
        VMax: OpcUaNodeOptions,
        VSclMax: OpcUaNodeOptions,
        VSclMin: OpcUaNodeOptions,
        VRbk: OpcUaNodeOptions,
        VUnit: OpcUaNodeOptions,
        WQC: OpcUaNodeOptions,
        OSLevel: OpcUaNodeOptions
    };

    private module: Module;

    constructor(module: Module) {
        this.module = module;
    }


    async setParameter(paramValue: any, variable: string = 'VExt'): Promise<any> {
        const opcUaNode = this.communication[variable];
        const value = await this.module.readVariableNode(opcUaNode);
        const opcUaDataType = value.value ? value.value.dataType : undefined;
        catParameter.debug(`Get data type for ${this.module.id}.${this.name} = ${opcUaDataType}`);

        const dataValue: Variant = {
            dataType: opcUaDataType,
            value: paramValue,
            arrayType: VariantArrayType.Scalar,
            dimensions: null
        };
        catService.debug(`Set Parameter: ${this.name} - ${JSON.stringify(opcUaNode)} -> ${JSON.stringify(dataValue)}`);
        return await this.module.writeNode(opcUaNode, dataValue);
    }
}