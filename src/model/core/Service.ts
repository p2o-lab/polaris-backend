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

import { DataType, DataValue, Variant, VariantArrayType } from 'node-opcua-client';
import { Module } from './Module';
import {catOpc, catRecipe, catService} from '../../config/logging';
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
import { Parameter } from '../recipe/Parameter';
import {
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    StrategyInterface,
    ControlEnableInterface
} from '@plt/pfe-ree-interface';
import { Unit } from './Unit';
import { manager } from '../Manager';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import undefinedError = Mocha.utils.undefinedError;

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
        CurrentStrategy: OpcUaNode;
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
    state: {state: ServiceState, timestamp: Date};
    /**
     * Notify when controlEnable changes
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
        parameter: ParameterInterface[],
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
    /** OPC UA node of currentStrategy variable */
    readonly currentStrategy: OpcUaNode;

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
        this.currentStrategy = serviceOptions.communication.CurrentStrategy;
        this.errorMessage = serviceOptions.communication.ErrorMessage;

        this.strategies = serviceOptions.strategies;
        this.parameters = serviceOptions.parameters;

        this.parent = parent;
        this.serviceParametersEventEmitters = [];
    }

    public getServiceState(): ServiceState {
        try {
            //const result: DataValue = await this.parent.readVariableNode(this.status);
            const state: ServiceState = <ServiceState> this.status.value;
            return state;
        } catch (err) {
            catOpc.error('Error reading opMode', err);
            return undefined;
        }
    }

    /**
     * Reads current ControlEnable from [[Module]]
     * @returns {ServiceControlEnable}
     */
    public getControlEnable(): ControlEnableInterface {
        try {
            //const result: DataValue = await this.parent.readVariableNode(this.controlEnable);
            const controlEnable: ServiceControlEnable = <ServiceControlEnable> this.controlEnable.value;
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
    public getErrorString(): string {
        try {
            const result: string = this.errorMessage.value.toString();
            catOpc.trace(`Read error string ${this.name}: ${result}`);
            return result;
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
        const currentStrategy = this.getCurrentStrategy();
        return {
            name: this.name,
            opMode: OpMode[opMode] || opMode,
            status: state,
            strategies: await strategies,
            currentStrategy: (await currentStrategy).name,
            parameters: await params,
            error: await errorString,
            controlEnable: controlEnable,
            lastChange: this.status.timestamp
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
     *
     * if an error occurs, *undefined* is returned
     * @returns {Strategy}   strategy
     */
    public getCurrentStrategy(): Strategy {
        //this.currentStrategy.value = this.parent.readVariableNode(this.currentStrategy).value.value;
        return this.strategies.find(strat => strat.id == this.currentStrategy.value);
    }

    /** get current parameters
     * from strategy or service (if strategy is undefined)
     * @param {Strategy} strategy
     * @returns {Promise<ParameterInterface[]>}
     */
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
                    unit,
                    readonly: param.interface_class === "StrView"
                };
            });
        }
        return await Promise.all(tasks);
    }


    /**
     *
     * @returns {Promise<void>}
     */
    async execute(command?: ServiceCommand, strategyIn?: Strategy, parametersIn?: (Parameter|ParameterOptions)[] ): Promise<void> {
        catService.info(`Execute ${command} service ${this.parent.id}.${this.name}(${ strategyIn ? strategyIn.name : '' })`);
        let result;
        if (strategyIn) {
            await this.setStrategyParameters(strategyIn, parametersIn);
        }
        if (command) {
            result = await this.executeCommand(command);
        }
        this.emit('commandExecuted', {
            timestampPfe: new Date(),
            strategy: await this.getCurrentStrategy(),
            command: command,
            parameter: await this.getCurrentParameters(strategyIn)
        });
        return result;
    }

    /**
     * Execute command by writing ControlOp/ControlExt
     * (currently disabled - Set ControlOp/ControlExt back after 100ms)
     *
     * @param {ServiceCommand} command
     * @returns {Promise<boolean>}
     */
    private async executeCommand(command: ServiceCommand): Promise<boolean> {
        let result;
        if (command === ServiceCommand.start) {
            result = this.start();
        } else if (command === ServiceCommand.stop) {
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
            result = this.restart();
        } else {
            throw new Error(`Command ${command} can not be interpreted`);
        }
        // reset ControlOp variable after 100ms
        // setTimeout(() => this.clearCommand(), 100);
        return result;
    }

    private clearCommand(): Promise<boolean> {
        catService.info(`command ${this.name} reset`);
        return this.sendCommand(ServiceMtpCommand.UNDEFINED);
    }

    private start(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.START);
    }

    private restart(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    private stop(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    private reset(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    private complete(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    private abort(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    private unhold(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    private pause(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    private resume(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESUME);
    }

    /**
     * Set service configuration parameters for adaption to environment. Can set also process values
     * @param {ParameterOptions[]} parameters
     * @returns {Promise<any[]>}
     */
    public setServiceParameters(parameters: ParameterOptions[]): Promise<any[]> {
        catService.info(`Set service parameters: ${JSON.stringify(parameters)}`);
        const tasks = parameters.map((paramOptions: ParameterOptions) => {
            const param: Parameter = new Parameter(paramOptions, this);
            return param.updateValueOnModule();
        });
        return Promise.all(tasks);
    }

    /** Set strategy and strategy parameter
     * Use default strategy if strategy is omitted
     *
     * @param {Strategy|string} strategy    object or name of desired strategy
     * @param {(Parameter|ParameterOptions)[]} parameters
     * @returns {Promise<boolean>}
     */
    public async setStrategyParameters(strategy?: Strategy|string, parameters?: (Parameter|ParameterOptions)[]): Promise<boolean> {
        // get strategy from input parameters
        let strat: Strategy;
        if (!strategy) {
            strat = this.strategies.find(strat => strat.default === true);
        } else if (typeof strategy === "string") {
            strat = this.strategies.find(strat => strat.name === strategy);
        } else {
            strat = strategy;
        }

        // set strategy
        catService.info(`Set strategy "${strat.name}" (${strat.id}) for service ${this.name}`);
        await this.parent.writeNode(this.strategy,
            {
                dataType: DataType.UInt32,
                value: strat.id,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });

        // TODO: is order of parameters and strategy important?
        // set strategy
        if (parameters) {
            let params: Parameter[] = parameters.map((param) => {
                if (param instanceof Parameter) {
                    return param;
                } else {
                    return new Parameter(param, this, strat)
                }
            });
            const tasks = params.map((param: Parameter) => param.updateValueOnModule());
            const paramResults = await Promise.all(tasks);
            catService.trace(`Set Parameter Promises: ${JSON.stringify(paramResults)}`);
            this.listenToServiceParameters(params);
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
        catService.info(`Set Parameter: ${this.name} - ${JSON.stringify(opcUaNode)} -> ${JSON.stringify(dataValue)}`);
        return await this.parent.writeNode(opcUaNode, dataValue);
    }

    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<void> {
        const result = await this.parent.writeNode(this.opMode,
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });
        if (result.value !== 0) {
            return Promise.reject()
        } else {
            return Promise.resolve();
        }
    }


    public setOperationMode(): Promise<void> {
        if (manager.automaticMode) {
            return this.setToAutomaticOperationMode();
        } else {
            return this.setToManualOperationMode();
        }
    }
    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<void>}
     */
    private async setToAutomaticOperationMode(): Promise<void> {
        let opMode: OpMode = await this.getOpMode();

        if (isOffState(opMode)) {
            catService.trace('First go to Manual state');
            await this.writeOpMode(OpMode.stateManOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opMode)
                    .once('changed', (data) => {
                        if (isManualState(data.value)) {
                            catService.trace(`finally in ManualMode`);
                            opMode = data.value;
                            resolve();
                        }
                    });
            });
        }

        if (isManualState(opMode)) {
            catService.trace('Go to Automatic state');
            await this.writeOpMode(OpMode.stateAutOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opMode)
                    .once('changed', (data) => {
                        catOpc.trace(`OpMode changed: ${data.value}`);
                        if (isAutomaticState(data.value)) {
                            catService.trace(`finally in AutomaticMode`);
                            opMode = data.value;
                            resolve();
                        }
                    });
            });
        }

        if (!isExtSource(opMode)) {
            catService.trace('Go to External source');
            await this.writeOpMode(OpMode.srcExtOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opMode)
                    .once('changed', (data) => {
                        catService.trace(`OpMode changed: ${data.value}`);
                        if (isExtSource(data.value)) {
                            catService.trace(`finally in ExtSource`);
                            resolve();
                        }
                    });
            });
        }
        return Promise.resolve();
    }

    private setToManualOperationMode(): Promise<void> {
        return this.writeOpMode(OpMode.stateManOp);
    }

    private async sendCommand(command: ServiceMtpCommand): Promise<boolean> {
        if (!this.parent.isConnected()) {
            return Promise.reject('Module is not connected');
        }
        catService.debug(`Send command ${ServiceMtpCommand[command]} (${command}) to service "${this.name}"`);
        await this.setOperationMode();

        let controlEnable: ControlEnableInterface = await this.getControlEnable();
        catService.debug(`ControlEnable of service ${this.name}: ${JSON.stringify(controlEnable)}`);

        let commandExecutable =
            (command===ServiceMtpCommand.START && controlEnable.start) ||
            (command===ServiceMtpCommand.STOP && controlEnable.stop) ||
            (command===ServiceMtpCommand.RESTART && controlEnable.restart) ||
            (command===ServiceMtpCommand.PAUSE && controlEnable.pause) ||
            (command===ServiceMtpCommand.RESUME && controlEnable.resume) ||
            (command===ServiceMtpCommand.COMPLETE && controlEnable.complete) ||
            (command===ServiceMtpCommand.UNHOLD && controlEnable.unhold) ||
            (command===ServiceMtpCommand.ABORT && controlEnable.abort) ||
            (command===ServiceMtpCommand.RESET && controlEnable.reset);
        if (!commandExecutable) {
            return Promise.reject(`ControlOp does not allow ${ServiceMtpCommand[command]} for service ${this.name} (${ServiceState[await this.getServiceState()]} - ${JSON.stringify(controlEnable)})`);
        }

        const result = await this.parent.writeNode(this.command,
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        catService.info(`Command ${ServiceMtpCommand[command]}(${command}) written to ${this.name}: ${result.name}`);

        return result.value === 0;
    }

    /**
     * Listen to state and error of service and emits specific events for them
     *
     * @returns {Service} emits 'errorMessage' and 'state' events
     */
    public subscribeToService(): Service {
        if (this.errorMessage) {
            this.parent.listenToOpcUaNode(this.errorMessage)
                .on('changed', (data) => {
                    Object.assign(this.errorMessage, data);
                    catService.info(`errorMessage changed for ${this.name}: ${data.value}`);
                    this.emit('errorMessage', data.value);
                });
        }
        if (this.controlEnable) {
            this.parent.listenToOpcUaNode(this.controlEnable)
                .on('changed', (data) => {
                    Object.assign(this.controlEnable, data);
                    catService.debug(`ControlEnable changed for ${this.name}: ${JSON.stringify(controlEnableToJson(data.value))}`);
                    this.emit('controlEnable', controlEnableToJson(data.value));
                });
        }
        if (this.status) {
            this.parent.listenToOpcUaNode(this.status)
                .on('changed', (data) => {
                    Object.assign(this.controlEnable, data);
                    catService.info(`Status changed for ${this.name}: ${ServiceState[data.value]}`);
                    this.emit('state', {state: data.value, timestamp: data.serverTimestamp});
                });
        }
        if (this.command) {
            this.parent.listenToOpcUaNode(this.command)
                .on('changed', (data) => {
                    Object.assign(this.controlEnable, data);
                    catService.debug(`Command changed for ${this.name}: ${ServiceMtpCommand[data.value]} (${data.value})`);
                });
        }
        if (this.command) {
            this.parent.listenToOpcUaNode(this.currentStrategy)
                .on('changed', (data) => {
                    Object.assign(this.controlEnable, data);
                    catService.debug(`Current strategy changed for ${this.name}: ${ServiceMtpCommand[data.value]} (${data.value})`);
                });
        }
        return this;
    }

    /**
     * Remove all Event listeners from service
     */
    public removeAllSubscriptions() {
        this.removeAllListeners('state');
        this.removeAllListeners('controlEnable');
        this.removeAllListeners('errorMessage');
    }

}
