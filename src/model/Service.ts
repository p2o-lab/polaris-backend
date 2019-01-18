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

import { DataType, DataValue, Variant, VariantArrayType } from 'node-opcua-client';
import { Module } from './Module';
import { catOpc, catService } from '../config/logging';
import {
    controlEnableToJson,
    isAutomaticState,
    isExtSource,
    isManualState,
    isOffState,
    OpMode,
    ServiceControlEnable,
    ServiceMtpCommand,
    ServiceState
} from './enum';
import { OpcUaNode, ServiceParameter, Strategy } from './Interfaces';
import { Parameter } from './Parameter';
import {
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    StrategyInterface,
    ControlEnableInterface
} from '@plt/pfe-ree-interface';
import { Unit } from './Unit';
import { manager } from './Manager';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';

export interface ServiceOptions {
    name: string;
    communication: {
        OpMode: OpcUaNode;
        ControlOp: OpcUaNode;
        ControlExt: OpcUaNode;
        ControlEnable: OpcUaNode;
        State: OpcUaNode;
        StrategyOp: OpcUaNode;
        StrategyExt: OpcUaNode;
        ErrorMessage: OpcUaNode;
    };
    strategies: Strategy[];
    parameters: ServiceParameter[];
}

/**
 * Events emitted by [[Service]]
 */
interface ServiceEvents {
    /**
     * when errorMessage of the [[Service]] changes
     * @event
     */
    errorMessage: string;
    /**
     * Notify when the [[Service] changes its state
     * @event
     */
    state: {state: ServiceState, serverTimestamp: Date};
    /**
     * Notify when controlOp changes
     * @event controlEnable
     */
    controlEnable: ControlEnableInterface;
    /**
     * whenever a command is executed from the PFE
     * @event
     */
    commandExecuted: {
        timestampPfe: Date,
        strategy: Strategy,
        command: ServiceCommand,
        parameter: Parameter[],
        scope?: any[]
    };
}

type ServiceEmitter = StrictEventEmitter<EventEmitter, ServiceEvents>;

/**
 * Service of a [[Module]]
 *
 * after connection to a real PEA, commands can be triggered and states can be retrieved
 *
 */
export class Service extends (EventEmitter as { new(): ServiceEmitter }) {

    /** name of the service */
    readonly name: string;
    /** strategies of the service */
    readonly strategies: Strategy[];
    /** service parameters */
    readonly parameters: ServiceParameter[];
    /** [Module] of the service */
    readonly parent: Module;
    /** timestamp of last change of state */
    lastChange: Date;
    private serviceParametersEventEmitters: EventEmitter[];

    /** OPC UA node of command/controlOp variable */
    readonly command: OpcUaNode;
    /** OPC UA node of status variable */
    readonly status: OpcUaNode;
    /** OPC UA node of controlEnable variable */
    readonly controlEnable: OpcUaNode;
    /** OPC UA node of opMode variable */
    readonly opMode: OpcUaNode;
    /** OPC UA node of strategy variable */
    readonly strategy: OpcUaNode;
    /** OPC UA node of errorMessage variable */
    readonly errorMessage: OpcUaNode;

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        super();
        this.name = serviceOptions.name;

        this.opMode = serviceOptions.communication.OpMode;
        this.status = serviceOptions.communication.State;
        this.controlEnable = serviceOptions.communication.ControlEnable;
        this.command = manager.automaticMode ?
            serviceOptions.communication.ControlExt : serviceOptions.communication.ControlOp;
        this.strategy = manager.automaticMode ?
            serviceOptions.communication.StrategyExt : serviceOptions.communication.StrategyOp;

        this.errorMessage = serviceOptions.communication.ErrorMessage;

        this.strategies = serviceOptions.strategies;
        this.parameters = serviceOptions.parameters;

        this.parent = parent;
        this.serviceParametersEventEmitters = [];
    }

    async getServiceState(): Promise<ServiceState> {
        try {
            const result: DataValue = await this.parent.readVariableNode(this.status);
            const state: ServiceState = <ServiceState> result.value.value;
            return state;
        } catch (err) {
            catOpc.error('Error reading opMode', err);
            return undefined;
        }
    }

    /**
     * Reads current ControlEnable from [[Module]]
     * @returns {Promise<ServiceControlEnable>}
     */
    async getControlEnable(): Promise<ControlEnableInterface> {
        try {
            const result: DataValue = await this.parent.readVariableNode(this.controlEnable);
            const controlEnable: ServiceControlEnable = <ServiceControlEnable> result.value.value;
            catOpc.trace(`Read ControlEnable ${this.name}: ${controlEnable}`);
            return controlEnableToJson(controlEnable);
        } catch (err) {
            catOpc.error('Error reading controlEnable', err);
            return undefined;
        }
    }

    /**
     * read error string from module
     * @returns {Promise<string>}
     */
    async getErrorString(): Promise<string> {
        try {
            const result: DataValue = await this.parent.readVariableNode(this.errorMessage);
            catOpc.trace(`Read error string ${this.name}: ${result}`);
            return result.value.value;
        } catch (err) {
            catOpc.debug(`Error reading ErrorString for service ${this.name}: ${err.toString()}`);
            return undefined;
        }
    }

    /**
     * read opMode from module
     * @returns {Promise<string>}
     */
    async getOpMode(): Promise<OpMode> {
        try {
            const result: any = await this.parent.readVariableNode(this.opMode);
            catService.trace(`OpMode: ${JSON.stringify(this.opMode)} -> ${result}`);
            if (result.value) {
                const opMode: number = result.value.value;
                const opModeString: string = OpMode[opMode];

                catOpc.trace(`OpMode ${this.name}: ${opMode} (${opModeString})`);
                return opMode;
            }
        } catch (err) {
            catOpc.error('Error reading opMode', err);
            return undefined;
        }
    }

    /**
     * get JSON output of service status
     * @returns {Promise<ServiceInterface>}
     */
    async getOverview(): Promise<ServiceInterface> {
        const opMode = await this.getOpMode();
        const state = this.getServiceState();
        const strategies = this.getStrategies();
        const params = this.getCurrentParameters();
        const errorString = this.getErrorString();
        const controlEnable = this.getControlEnable();
        return {
            name: this.name,
            opMode: OpMode[opMode] || opMode,
            status: ServiceState[await state],
            strategies: await strategies,
            currentStrategy: await this.getCurrentStrategy(),
            parameters: await params,
            error: await errorString,
            controlEnable: await controlEnable,
            lastChange: this.lastChange
        };
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

    /**
     * Read current strategy from module
     * @returns {Promise<string>}   strategy name
     */
    private async getCurrentStrategy(): Promise<string> {
        try {
            const id = await this.parent.readVariableNode(this.strategy).value.value;
            return this.strategies.find(strat => strat.id === id.value.value).name;
        } catch (err) {
            return undefined;
        }
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

    /**
     * Execute command by writing parameters and ControlOp/ControlExt
     * Set ControlOp/ControlExt back after 500ms
     *
     * @param {ServiceCommand} command
     * @param {Strategy} strategy
     * @param {Parameter[]} parameters
     * @returns {Promise<boolean>}
     */
    async executeCommand(command: ServiceCommand, strategy: Strategy, parameters: Parameter[]): Promise<boolean> {
        catService.info(`${command} service ${this.name}(${strategy ? strategy.name : ''})`);
        this.emit('commandExecuted', {
            timestampPfe: new Date(),
            strategy: strategy,
            command: command,
            parameter: parameters
        });
        let result;
        if (command === 'start') {
            result = this.start(strategy, parameters);
        } else if (command === 'stop') {
            result = this.stop();
        } else if (command === 'reset') {
            result = this.reset();
        } else if (command === 'complete') {
            result = this.complete();
        } else if (command === 'abort') {
            result = this.abort();
        } else if (command === 'unhold') {
            result = this.unhold();
        } else if (command === 'pause') {
            result = this.pause();
        } else if (command === 'resume') {
            result = this.resume();
        } else if (command === 'restart') {
            result = this.restart(strategy, parameters);
        } else {
            throw new Error(`Command ${command} can not be interpreted`);
        }
        await result;
        // reset ControlOp variable after 100ms
        // setTimeout(() => this.clearCommand(), 100);
        return result;
    }

    async clearCommand(): Promise<boolean> {
        return await this.sendCommand(ServiceMtpCommand.UNDEFINED);
    }

    async start(strategy?: Strategy, parameters?: Parameter[]): Promise<boolean> {
        await this.setStrategyParameters(strategy, parameters);
        return await this.sendCommand(ServiceMtpCommand.START);
    }

    async restart(strategy: Strategy, parameter: Parameter[]): Promise<boolean> {
        await this.setStrategyParameters(strategy, parameter);
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    stop(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    async reset(): Promise<boolean> {
        return await this.sendCommand(ServiceMtpCommand.RESET);
    }

    complete(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    abort(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    unhold(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    pause(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    resume(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESUME);
    }

    /**
     * Set service configuration parameters for adaption to environment. Can set also process values
     * @param {ParameterOptions[]} parameters
     * @returns {Promise<any[]>}
     */
    async setServiceParameters(parameters: ParameterOptions[]): Promise<any[]> {
        catService.info(`Set service parameters: ${JSON.stringify(parameters)}`);
        const tasks = parameters.map((paramOptions: ParameterOptions) => {
            const param: Parameter = new Parameter(paramOptions, this);
            return param.updateValueOnModule();
        });
        return Promise.all(tasks);
    }

    /** can set also configuration parameter or process values
     *
     * @param {Strategy} strategy
     * @param {Parameter[]} parameters
     * @returns {Promise<boolean>}
     */
    public async setStrategyParameters(strategy?: Strategy, parameters?: Parameter[]): Promise<boolean> {
        // set strategy
        if (strategy) {
            catService.info(`Set strategy "${strategy.name}" for service ${this.name}`);
            await this.parent.writeNode(this.strategy,
                {
                    dataType: DataType.UInt32,
                    value: strategy.id,
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                });
        }

        // set parameter (both configuration and strategy parameters)
        if (strategy && parameters) {
            const tasks = parameters.map((param: Parameter) => param.updateValueOnModule());
            const paramResults = await Promise.all(tasks);
            catService.trace(`Set Parameter Promises: ${JSON.stringify(paramResults)}`);
            this.listenToServiceParameters(parameters);
        }

        return Promise.resolve(true);
    }

    private listenToServiceParameters(parameters: Parameter[]) {
        parameters.forEach((param) => {
            if (param.continuous) {
                const listener: EventEmitter = param.listenToParameter()
                    .on('changed', () => param.updateValueOnModule());
                this.serviceParametersEventEmitters.push(listener);
            }
        });
    }

    private clearListeners() {
        this.serviceParametersEventEmitters.forEach(listener => listener.removeAllListeners());
    }

    async setParameter(opcUaNode: OpcUaNode, dataType: DataType, paramValue: any): Promise<any> {
        const dataValue: Variant = {
            dataType,
            value: paramValue,
            arrayType: VariantArrayType.Scalar,
            dimensions: null
        };
        catService.debug(`Set Parameter: ${this.name} - ${JSON.stringify(opcUaNode)} -> ${JSON.stringify(dataValue)}`);
        return await this.parent.writeNode(opcUaNode, dataValue);
    }

    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<boolean> {
        const result = await this.parent.writeNode(this.opMode,
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });
        return result.value === 0;
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
                this.parent.listenToOpcUaNode(this.opMode)
                    .on('changed', ({value, serverTimestamp}: {value: number, serverTimestamp: Date}) => {
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
                this.parent.listenToOpcUaNode(this.opMode)
                    .on('changed', ({value, serverTimestamp}: {value: number, serverTimestamp: Date}) => {
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
                    .on('changed', ({value, serverTimestamp}: {value: number, serverTimestamp: Date}) => {
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

    private setToManualOperationMode(): Promise<boolean> {
        return this.writeOpMode(OpMode.stateManOp);
    }

    private async sendCommand(command: ServiceMtpCommand): Promise<boolean> {
        if (!this.parent.isConnected()) {
            return Promise.reject('Module is not connected');
        }
        catService.info(`Send command ${ServiceMtpCommand[command]} (${command}) to service "${this.name}"`);
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

        return result.value === 0;
    }

    /**
     * Listen to state and error of service and emits specific events for them
     *
     * <uml>
     *     Caller -> Service : subscribeToService
     *     ...
     *     Caller <- Service : emit "state"
     *     Caller <- Service : emit "errorMessage"
     * </uml>
     * @returns {Service} emits 'errorMessage' and 'state' events
     */
    public subscribeToService(): Service {
        if (this.errorMessage) {
            this.parent.listenToOpcUaNode(this.errorMessage)
                .on('changed', ({value, serverTimestamp}: {value: string, serverTimestamp: Date}) => {
                    this.emit('errorMessage', value);
                });
        } else {
            catService.warn(`Service ${this.name} from module ${this.parent.id}` +
                ` does not have a errorMessage variable`);
        }
        if (this.controlEnable) {
            this.parent.listenToOpcUaNode(this.controlEnable)
                .on('changed', (data) => {
                    this.emit('controlEnable', controlEnableToJson(data.value));
                });
        }
        if (this.status) {
            this.parent.listenToOpcUaNode(this.status)
                .on('changed', ({value, serverTimestamp}: {value: number, serverTimestamp: Date}) => {
                    this.lastChange = new Date();
                    catService.info(`${this.name} = ${ServiceState[value]} ${this.lastChange}`);
                    this.emit('state', {state: value, serverTimestamp});
                });
        } else {
            throw new Error(`OPC UA variable for status of service ${this.name} not defined`);
        }
        return this;
    }

}
