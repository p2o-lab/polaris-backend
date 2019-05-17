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
import {DataType, Variant, VariantArrayType} from 'node-opcua';
import {Module} from './Module';
import {isAutomaticState, isExtSource, isManualState, isOffState, OpMode} from './enum';

export interface DataAssemblyOptions {
    name: string;
    interface_class: string;
    communication: OpcUaNodeOptions[];
}

export abstract class DataAssembly {
    name: string;
    interface_class: string;
    communication: OpcUaNodeOptions[];
        /*{
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
    };*/

    private module: Module;

    constructor(options: DataAssemblyOptions, module: Module) {
        this.name =  options.name;
        this.interface_class = options.interface_class;
        this.communication = options.communication;
        this.module = module;
        if (!this.module) {
            throw new Error(`No module for data assembly: ${JSON.stringify(options)}`);
        }
    }


    public async setParameter(paramValue: any, variable: string = 'VExt'): Promise<any> {
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
        catService.info(`Set Parameter: ${this.name} - ${JSON.stringify(opcUaNode)} -> ${JSON.stringify(dataValue)}`);
        return await this.module.writeNode(opcUaNode, dataValue);
    }

    /**
     * Get current opMode of DataAssembly from PEA memory.
     */
    public async getOpMode(): Promise<OpMode> {
        if (this.communication['OpMode']) {
            const result = await this.module.readVariableNode(this.communication['OpMode']);
            return <OpMode> result;
        } else {
            return null;
        }
    }

    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<void> {
        catParameter.debug(`[${this.name}] Write opMode: ${<number> opMode}`);
        const result = await this.module.writeNode(this.communication['OpMode'],
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });
        catParameter.debug(`[${this.name}] Setting opMode ${JSON.stringify(result)}`);
        if (result.value !== 0) {
            catParameter.warn(`[${this.name}] Error while setting opMode to ${opMode}: ${JSON.stringify(result)}`);
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<void>}
     */
    public async setToAutomaticOperationMode(): Promise<void> {
        let opMode: OpMode = await this.getOpMode();
        catParameter.info(`[${this.name}] Current opMode = ${opMode}`);
        if (opMode && isOffState(opMode)) {
            catParameter.trace('First go to Manual state');
            await this.writeOpMode(OpMode.stateManOp);
            await new Promise((resolve) => {
                let event = this.module.listenToOpcUaNode(this.communication['OpMode']);
                function test(data) {
                    if (isManualState(data.value)) {
                        opMode = data.value;
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
        }

        if (opMode && isManualState(opMode)) {
            await this.writeOpMode(OpMode.stateAutOp);
            await new Promise((resolve) => {
                let event = this.module.listenToOpcUaNode(this.communication['OpMode']);
                function test(data) {
                    if (isAutomaticState(data.value)) {
                        opMode = data.value;
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
        }

        if (opMode && !isExtSource(opMode)) {
            await this.writeOpMode(OpMode.srcExtOp);
            await new Promise((resolve) => {
                let event = this.module.listenToOpcUaNode(this.communication['OpMode']);
                function test(data) {
                    if (isExtSource(data.value)) {
                        opMode = data.value;
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
        }
    }

    public async setToManualOperationMode(): Promise<void> {
        let opMode = await this.getOpMode();
        if (opMode && !isManualState(opMode)) {
            this.writeOpMode(OpMode.stateManOp);
            await new Promise((resolve) => {
                let event = this.module.listenToOpcUaNode(this.communication['OpMode']);
                function test(data) {
                    if (isManualState(data.value)) {
                        opMode = data.value;
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
        }
    }
}