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

import {OpcUaNodeOptions} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {DataType, Variant, VariantArrayType} from 'node-opcua';
import {catParameter, catService} from '../../config/logging';
import {isAutomaticState, isExtSource, isManualState, isOffState, OpMode} from '../core/enum';
import {Module} from '../core/Module';

export interface DataAssemblyOptions {
    name: string;
    interface_class: string;
    communication: OpcUaNodeOptions[];
}

export class DataAssembly extends EventEmitter {

    public name: string;
    public interfaceClass: string;
    public communication: OpcUaNodeOptions[];
    protected module: Module;
    protected subscribedNodes: string[] = [];

    constructor(options: DataAssemblyOptions, module: Module) {
        super();
        this.name =  options.name;
        this.interfaceClass = options.interface_class;
        this.communication = options.communication;

        this.subscribedNodes.push('WQC', 'OSLevel');
        this.module = module;
        if (!this.module) {
            throw new Error(`No module for data assembly: ${JSON.stringify(options)}`);
        }
    }

    get OSLevel() {
        return this.communication['OSLevel'];
    }

    get WQC() {
        return this.communication['WQC'];
    }

    public subscribe(samplingInterval = 1000) {
        catParameter.debug(`DataAssembly ${this.name} subscribe to ${JSON.stringify(this.subscribedNodes)}`);
        this.subscribedNodes
            .filter((node) => this.communication[node] &&
                this.communication[node].node_id &&
                this.communication[node].namespace_index)
            .forEach((node) => {
                try {
                    this.module.listenToOpcUaNode(this.communication[node], samplingInterval)
                        .on('changed', () => {
                            catParameter.trace(`Emit ${this.name}.${node} = ${this.communication[node].value}`);
                            this.emit(node, this.communication[node]);
                        });
                } catch (err) {
                    catParameter.warn(`Could not subscribe to Data Assembly ${this.name}.${node}`);
                }
        });
        return this;
    }

    /**
     * Set parameter on module
     * @param paramValue
     * @param {string} variable
     * @returns {Promise<any>}
     */
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
            return result.value.value as OpMode;
        } else {
            return null;
        }
    }

    public async waitForOpModeToPassSpecificTest(testFunction: (opMode: OpMode) => boolean) {
        return new Promise((resolve) => {
            const event = this.module.listenToOpcUaNode(this.communication['OpMode']);
            event.on('changed', function test(data) {
                if (testFunction(data.value)) {
                    event.removeListener('changed', test);
                    resolve();
                }
            });
        });
    }

    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<void>}
     */
    public async setToAutomaticOperationMode(): Promise<void> {
        const opMode: OpMode = await this.getOpMode();
        catParameter.info(`[${this.name}] Current opMode = ${opMode}`);
        if (opMode && isOffState(opMode)) {
            catParameter.trace('First go to Manual state');
            this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
        }

        if (opMode && isManualState(opMode)) {
            this.writeOpMode(OpMode.stateAutOp);
            await this.waitForOpModeToPassSpecificTest(isAutomaticState);
        }

        if (opMode && !isExtSource(opMode)) {
            this.writeOpMode(OpMode.srcExtOp);
            await this.waitForOpModeToPassSpecificTest(isExtSource);
        }
    }

    public async setToManualOperationMode(): Promise<void> {
        const opMode = await this.getOpMode();
        if (opMode && !isManualState(opMode)) {
            this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
        }
    }

    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<void> {
        catParameter.debug(`[${this.name}] Write opMode: ${opMode as number}`);
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
}
