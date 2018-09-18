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

import {DataType, DataValue, Variant, VariantArrayType} from 'node-opcua-client';
import {Module} from './Module';
import {catOpc, catService} from '../config/logging';
import {
    isAutomaticState,
    isExtSource,
    isManualState,
    isOffState,
    OpMode,
    ServiceMtpCommand,
    ServiceState
} from './enum';
import {OpcUaNode, ServiceParameter, Strategy} from './Interfaces';
import {Parameter} from './Parameter';
import {
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    StrategyInterface
} from 'pfe-ree-interface';
import {Unit} from './Unit';
import {manager} from './Manager';

export interface ServiceOptions {
    name: string;
    communication: {
        OpMode: OpcUaNode;
        ControlOp: OpcUaNode;
        ControlExt: OpcUaNode;
        State: OpcUaNode;
        StrategyOp: OpcUaNode;
        StrategyExt: OpcUaNode;
    };
    strategies: Strategy[];
    parameters: ServiceParameter[];
}

export class Service {
    name: string;
    command: OpcUaNode;
    status: OpcUaNode;
    opMode: OpcUaNode;
    strategy: OpcUaNode;
    strategies: Strategy[];
    parameters: ServiceParameter[];

    parent: Module;

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        this.name = serviceOptions.name;

        this.opMode = serviceOptions.communication.OpMode;
        this.status = serviceOptions.communication.State;
        this.command = manager.automaticMode ?
            serviceOptions.communication.ControlExt : serviceOptions.communication.ControlOp;
        this.strategy = manager.automaticMode ?
            serviceOptions.communication.StrategyExt : serviceOptions.communication.StrategyOp;

        this.strategies = serviceOptions.strategies;
        this.parameters = serviceOptions.parameters;
        this.parent = parent;
    }

    async getServiceState(): Promise<ServiceState> {
        try {
            const result: DataValue = await this.parent.readVariableNode(this.status);
            const state: ServiceState = <ServiceState> result.value.value;
            const stateString: string = ServiceState[state];
            catOpc.trace(`Read state ${this.name}: ${state} (${stateString})`);
            return state;
        } catch (err) {
            catOpc.error('Error reading opMode', err);
            return undefined;
        }
    }

    async getOpMode(): Promise<OpMode> {
        try {
            const result: any = await this.parent.readVariableNode(this.opMode);
            catService.debug(`OpMode: ${JSON.stringify(this.opMode)} -> ${result}`);
            if (result.value) {

                const opMode: number = result.value.value;
                const opModeString: string = OpMode[opMode];

                catOpc.trace(`OpMode ${this.name}: ${opMode} (${opModeString})`);
                return opMode;
            } else {
                return undefined;
            }
        } catch (err) {
            catOpc.error('Error reading opMode', err);
            return undefined;
        }
    }

    async getOverview(): Promise<ServiceInterface> {
        const opMode = this.getOpMode();
        const state = this.getServiceState();
        const strategies = this.getStrategies();
        const params = this.getCurrentParameters();
        return Promise.all([opMode, state, strategies, params])
            .then(async (data) => {
                return {
                    name: this.name,
                    opMode: OpMode[data[0]] || data[0],
                    status: ServiceState[data[1]] || data[1],
                    strategies: data[2],
                    parameters: data[3]
                };
            });
    }

    async getStrategies(): Promise<StrategyInterface[]> {
        return await Promise.all(this.strategies.map(async (strategy) => {
            return {
                id: strategy.id,
                name: strategy.name,
                default: strategy.default,
                sc: strategy.sc,
                parameters: await this.getCurrentParameters(strategy).catch(() => undefined)
            };
        }));
    }

    async getCurrentParameters(strategy?: Strategy): Promise<ParameterInterface[]> {
        let params: ServiceParameter[] = [];
        if (strategy) {
            params = strategy.parameters;
        } else {
            params = this.parameters;
        }
        let tasks = [];
        if (params) {
            tasks = params.map(async (param) => {
                const name = param.name;
                let value;
                let max;
                let min;
                let unit;
                try {
                    const result = await this.parent.readVariableNode(param.communication.VExt);
                    value = result.value.value;
                } catch {
                    value = undefined;
                }
                try {
                    const result = await this.parent.readVariableNode(param.communication.VMax);
                    max = result.value.value;
                } catch {
                    max = undefined;
                }
                try {
                    const result = await this.parent.readVariableNode(param.communication.VMin);
                    min = result.value.value;
                } catch {
                    min = undefined;
                }
                try {
                    const result = await this.parent.readVariableNode(param.communication.VUnit);
                    const unitItem = Unit.find(item => item.value === result.value.value);
                    unit = unitItem.unit;
                } catch {
                    unit = undefined;
                }
                return {
                    name,
                    value,
                    max,
                    min,
                    unit
                };
            });
        }
        return await Promise.all(tasks);
    }

    executeCommand(command: ServiceCommand, strategy: Strategy, parameter: Parameter[]) {
        catService.info(`${command} service ${this.name}(${strategy ? strategy.name : ''}) - ${JSON.stringify(parameter)}`);
        if (command === 'start') {
            return this.start(strategy, parameter);
        } else if (command === 'stop') {
            return this.stop();
        } else if (command === 'reset') {
            return this.reset();
        } else if (command === 'complete') {
            return this.complete();
        } else if (command === 'abort') {
            return this.abort();
        } else if (command === 'unhold') {
            return this.unhold();
        } else if (command === 'pause') {
            return this.pause();
        } else if (command === 'resume') {
            return this.resume();
        } else if (command === 'restart') {
            return this.restart(strategy, parameter);
        } else {
            throw new Error(`Command ${command} can not be interpreted`);
        }
    }

    async start(strategy: Strategy, parameter: Parameter[]): Promise<any> {
        await this.setParameter(strategy, parameter);
        return await this.sendCommand(ServiceMtpCommand.START);
    }

    stop(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    async reset(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    complete(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    abort(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    unhold(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    pause(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    resume(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.RESUME);
    }

    async restart(strategy: Strategy, parameter: Parameter[]): Promise<any> {
        await this.setParameter(strategy, parameter);
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    /**
     * Set service parameters for adaption to environment
     * @param {ParameterOptions[]} parameter
     * @returns {Promise<any[]>}
     */
    async setServiceParameter(parameter: ParameterOptions[]): Promise<any[]> {
        catService.debug(`Set service parameters: ${JSON.stringify(parameter)}`);
        const tasks = [];
        parameter.forEach(async (paramOptions: ParameterOptions) => {
            const param: Parameter = new Parameter(paramOptions);
            const serviceParam = this.parameters.find(obj => obj.name === param.name);
            const variable = serviceParam.communication[param.variable];
            const dataValue: Variant = {
                dataType: DataType.Float,
                value: await param.getValue(),
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            };
            tasks.push(this.parent.writeNode(variable, dataValue));
        });
        return Promise.all(tasks);
    }

    private async setParameter(strategy: Strategy, parameter: Parameter[]): Promise<any[]> {

        // set strategy
        catService.debug(`Set strategy "${strategy.name}" for service ${this.name}`);
        if (strategy) {
            await this.parent.writeNode(this.strategy,
                {
                    dataType: DataType.UInt32,
                    value: strategy.id,
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                });
        }

        // set parameter
        const tasks = [];
        if (strategy && parameter) {
            parameter.forEach(async (param: Parameter) => {
                const params = [].concat(strategy.parameters, this.parameters);
                const serviceParam = params.find(obj => obj.name === param.name);
                const variable = serviceParam.communication[param.variable];
                const paramValue = await param.getValue();
                catService.debug(`Set parameter "${param.name}[${param.variable}]" for ${this.name} = ${paramValue}`);
                const dataValue: Variant = {
                    dataType: DataType.Float,
                    value: paramValue,
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                };
                tasks.push(this.parent.writeNode(variable, dataValue));
            });
        }
        return Promise.all(tasks);
    }

    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {any}
     */
    private writeOpMode(opMode: OpMode) {
        return this.parent.writeNode(this.opMode,
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
            });
    }

    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<boolean>}
     */
    private async setToAutomaticOperationMode(): Promise<any> {
        let opMode: OpMode = await this.getOpMode();

        if (isOffState(opMode)) {
            catService.trace('First go to Manual state');
            await this.writeOpMode(OpMode.stateManOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opMode).on('changed', (value) => {
                    if (isManualState(value)) {
                        catService.trace(`finally in ManualMode`);
                        opMode = value;
                        resolve(true);
                    }
                });
            });
        }

        if (isManualState(opMode)) {
            catService.trace('Go to Automatic state');
            await this.writeOpMode(OpMode.stateAutOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opMode).on('changed', (value) => {
                    catOpc.trace(`OpMode changed: ${value}`);
                    if (isAutomaticState(value)) {
                        catService.trace(`finally in AutomaticMode`);
                        opMode = value;
                        resolve(true);
                    }
                });
            });
        }
        if (!isExtSource(opMode)) {
            catService.trace('Go to External source');
            await this.writeOpMode(OpMode.srcExtOp);
            return new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opMode)
                    .on('changed', (value) => {
                        catService.trace(`OpMode changed: ${value}`);
                        if (isExtSource(value)) {
                            catService.trace(`finally in ExtSource`);
                            resolve(true);
                        }
                    });
            });
        } else {
            return Promise.resolve(true);
        }
    }

    private setToManualOperationMode(): Promise<any> {
        return this.writeOpMode(OpMode.stateManOp);
    }

    private async sendCommand(command: ServiceMtpCommand): Promise<any> {
        catService.debug(`Send command ${ServiceMtpCommand[command]} (${command}) to service "${this.name}"`);
        if (manager.automaticMode) {
            await this.setToAutomaticOperationMode();
        } else {
            await this.setToManualOperationMode();
        }

        const result = await this.parent.writeNode(this.command,
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        catService.trace(`Command ${command} written to ${this.name}: ${JSON.stringify(result)}`);

        return result;
    }

}
