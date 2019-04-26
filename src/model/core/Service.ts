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

import {DataType, DataValue, Variant, VariantArrayType} from 'node-opcua-client';
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
import {OpcUaNodeOptions} from './Interfaces';
import {Parameter} from '../recipe/Parameter';
import {
    ControlEnableInterface,
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    StrategyInterface
} from '@plt/pfe-ree-interface';
import {Unit} from './Unit';
import {manager} from '../Manager';
import {EventEmitter} from 'events';
import {BaseService} from './BaseService';
import StrictEventEmitter from 'strict-event-emitter-types';
import {DataAssembly, DataAssemblyOptions} from './DataAssembly';
import {Strategy, StrategyOptions} from './Strategy';
import {ConfigurationParameter} from './ConfigurationParameter';
import {Category} from 'typescript-logging';
import {Module} from './Module';
import {catService} from '../../config/logging';

export interface ServiceOptions {
    name: string;
    communication: {
        OpMode: OpcUaNodeOptions;
        ControlOp?: OpcUaNodeOptions;
        CommandMan?: OpcUaNodeOptions;
        ControlExt?: OpcUaNodeOptions;
        CommandExt?: OpcUaNodeOptions
        ControlEnable?: OpcUaNodeOptions;
        CommandEnable?: OpcUaNodeOptions;
        State?: OpcUaNodeOptions;
        CurrentState?: OpcUaNodeOptions;
        StrategyOp?: OpcUaNodeOptions;
        StrategyMan?: OpcUaNodeOptions;
        StrategyExt: OpcUaNodeOptions;
        CurrentStrategy: OpcUaNodeOptions;
        ErrorMessage: OpcUaNodeOptions;
    };
    strategies: StrategyOptions[];
    parameters: DataAssemblyOptions[];
}

const InterfaceClassToType = {
    'StrView': 'string',
    'ExtAnaOp': 'number',
    'ExtDigOp': 'number'
};


/**
 * Service of a [[Module]]
 *
 * after connection to a real PEA, commands can be triggered and states can be retrieved
 *
 */
export class Service extends BaseService {

    /** strategies of the service */
    readonly strategies: Strategy[];
    /** service configuration configuration parameters */
    readonly parameters: ConfigurationParameter[];
    /** [Module] of the service */
    readonly parent: Module;

    private serviceParametersEventEmitters: EventEmitter[];

    get state(): ServiceState {
        return <ServiceState> this.statusNode.value;
    }

    get controlEnable(): ControlEnableInterface {
        return controlEnableToJson(<ServiceControlEnable> this.controlEnableNode.value);
    }

    public lastStatusChange: Date;

    /** OPC UA node of command/controlOp variable */
    readonly commandNode: OpcUaNodeOptions;
    /** OPC UA node of status variable */
    readonly statusNode: OpcUaNodeOptions;
    /** OPC UA node of controlEnable variable */
    readonly controlEnableNode: OpcUaNodeOptions;
    /** OPC UA node of opMode variable */
    readonly opModeNode: OpcUaNodeOptions;
    /** OPC UA node of strategy variable */
    readonly strategyNode: OpcUaNodeOptions;
    /** OPC UA node of currentStrategy variable */
    readonly currentStrategyNode: OpcUaNodeOptions;
    
    readonly logger: Category;

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        super();
        this._name = serviceOptions.name;

        const com = serviceOptions.communication;

        this.opModeNode = com.OpMode;
        if (!this.opModeNode) {
            throw new Error(`No opMode variable in service ${this.name} during parsing`);
        }

        this.statusNode = com.State || com.CurrentState;
        if (!this.statusNode) {
            throw new Error(`No status variable in service ${this.name} during parsing`);
        }

        this.controlEnableNode = com.ControlEnable || com.CommandEnable;
        if (!this.controlEnable) {
            throw new Error(`No controlEnable variable in service ${this.name} during parsing`);
        }

        this.commandNode = manager.automaticMode ? (com.ControlExt || com.CommandExt) : (com.ControlOp || com.CommandMan);
        if (!this.commandNode) {
            throw new Error(`No command variable in service ${this.name} during parsing`);
        }

        this.strategyNode = manager.automaticMode ? com.StrategyExt : (com.StrategyOp || com.StrategyMan);
        if (!this.strategyNode) {
            throw new Error(`No strategy variable in service ${this.name} during parsing`);
        }

        this.currentStrategyNode = com.CurrentStrategy;
        if (!this.currentStrategyNode) {
            throw new Error(`No currentStrategy variable in service ${this.name} during parsing`);
        }

        this.strategies = serviceOptions.strategies
            .map(option => new Strategy(option, parent));
        if (serviceOptions.parameters) {
            this.parameters = serviceOptions.parameters
                .map(options => new ConfigurationParameter(options, parent));
        }
        this.parent = parent;
        this.serviceParametersEventEmitters = [];

        this.lastStatusChange = new Date();
        this.logger = catService;
    }

    public get qualifiedName() {
        return `${this.parent.id}.${this.name}`
    }

    /**
     * Listen to state and error of service and emits specific events for them
     *
     * @returns {Service} emits 'errorMessage' and 'state' events
     */
    public async subscribeToService(): Promise<Service> {

        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        if (this.controlEnableNode) {
            await this.getControlEnable();
            this.logger.debug(`[${this.qualifiedName}] initial controlEnable: ${this.controlEnable}`);
            this.parent.listenToOpcUaNode(this.controlEnableNode)
                .on('changed', (data) => {
                    this._lastStatusChange = new Date();
                    this.controlEnableNode.value = data.value;
                    this.controlEnableNode.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] ControlEnable changed: ${this.controlEnable} - ${JSON.stringify(controlEnableToJson(<ServiceControlEnable> this.controlEnableNode.value))}`);
                    this.emit('controlEnable', this.controlEnable);
                });
        }
        if (this.statusNode) {
            await this.getServiceState();
            this.logger.debug(`[${this.qualifiedName}] initial status: ${this.statusNode.value}`);
            this.parent.listenToOpcUaNode(this.statusNode)
                .on('changed', (data) => {
                    this._state = data.value;
                    this._lastStatusChange = new Date();
                    this.statusNode.value = data.value;
                    this.statusNode.timestamp = new Date();
                    this.logger.info(`[${this.qualifiedName}] Status changed: ${ServiceState[<ServiceState> this.state]}`);
                    this.emit('state', {state: <ServiceState> this.statusNode.value, timestamp: this.statusNode.timestamp});
                });
        }
        if (this.commandNode) {
            let result = await this.parent.readVariableNode(this.commandNode);
            this.commandNode.value = result.value.value;
            this.logger.debug(`[${this.qualifiedName}] initial command: ${this.commandNode.value}`);
            this.parent.listenToOpcUaNode(this.commandNode)
                .on('changed', (data) => {
                    Object.assign(this.commandNode, data);
                    this.logger.debug(`[${this.qualifiedName}] Command changed: ${ServiceMtpCommand[<ServiceMtpCommand> this.commandNode.value]}`);
                });
        }
        if (this.currentStrategyNode) {
            await this.getCurrentStrategy();
    this.logger.debug(`[${this.qualifiedName}] initial current strategy: ${this.currentStrategyNode.value}`);
            this.parent.listenToOpcUaNode(this.currentStrategyNode)
                .on('changed', (data) => {
                    this.currentStrategyNode.value = data.value;
                    this.currentStrategyNode.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] Current Strategy changed: ${this.currentStrategyNode.value}`);
                });
        }
        if (this.opModeNode) {
            await this.getOpMode();
            this.logger.debug(`[${this.qualifiedName}] initial opMode: ${this.opModeNode.value}`);
            this.parent.listenToOpcUaNode(this.opModeNode)
                .on('changed', (data) => {
                    this.opModeNode.value = data.value;
                    this.opModeNode.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ${this.opModeNode.value}`);
                });
        }
        return this;
    }

    /**
     * Get current service state from internal memory.
     * If there is no state or the state is older than 1000ms, retrieve an updated version from PEA
     *
     * @returns {Promise<ServiceState>}
     */
    public async getServiceState(): Promise<ServiceState> {
        if (!this.statusNode.value ||
            (new Date().getMilliseconds() - this.statusNode.timestamp.getMilliseconds() < 1000)) {
            const result = await this.parent.readVariableNode(this.statusNode);
            if (result.value.value != this.statusNode.value) {
                this._lastStatusChange = new Date();
            }
            this.statusNode.value = result.value.value;
            this.statusNode.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update service state: ${ServiceState[<ServiceState> this.statusNode.value]}`);
        }
        return <ServiceState> this.statusNode.value;
    }

    /**
     * Get current control enable from internal memory.
     * If there is no control enable or it is older than 1000ms, retrieve an updated version from PEA
     * @param {boolean} force   force to retrieve data from PEA and not from internal memory
     * @returns {Promise<ControlEnableInterface>}
     */
    public async getControlEnable(force = false): Promise<ControlEnableInterface> {
        if (!this.controlEnableNode.value || force ||
            (new Date().getMilliseconds() - this.controlEnableNode.timestamp.getMilliseconds() < 1000)) {
            this.controlEnableNode.value = (await this.parent.readVariableNode(this.controlEnableNode)).value.value;
            this.controlEnableNode.timestamp = new Date();
                this.logger.debug(`[${this.qualifiedName}] Update control enable: ${JSON.stringify(controlEnableToJson(<ServiceControlEnable> this.controlEnableNode.value))}`);
        }
        return controlEnableToJson(<ServiceControlEnable> this.controlEnableNode.value);
    }

    /**
     * Get current strategy from internal memory.
     * If there is no current strategy or it is older than 1000ms, retrieve an updated version from PEA
     */
    public async getCurrentStrategy(): Promise<Strategy> {
        if (!this.currentStrategyNode.value ||
            (new Date().getMilliseconds() - this.currentStrategyNode.timestamp.getMilliseconds() < 1000)) {
            this.currentStrategyNode.value = (await this.parent.readVariableNode(this.strategyNode)).value.value;
            this.currentStrategyNode.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update currentStrategy: ${this.currentStrategyNode.value}`);
        }
        let strategy = this.strategies.find(strat => strat.id == this.currentStrategyNode.value);
        if (!strategy) {
            strategy = this.strategies.find(strat => strat.default);
            this.setStrategy(strategy);
        }
        return strategy;
    }


    /**
     * Get current opMode from internal memory.
     * If there is no opMode or it is older than 1000ms, retrieve an updated version from PEA
     */
    public async getOpMode(): Promise<OpMode> {
        if (!this.opModeNode.value ||
            (new Date().getMilliseconds() - this.opModeNode.timestamp.getMilliseconds() < 1000)) {
            const result = await this.parent.readVariableNode(this.opModeNode);
            this.opModeNode.value = result.value.value;
            this.opModeNode.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update opMode: ${<OpMode> this.opModeNode.value}`);
        }
        return <OpMode> this.opModeNode.value;
    }

    /**
     * get JSON overview about service and its state, opMode, strategies, parameters and controlEnable
     * @returns {Promise<ServiceInterface>}
     */
    async getOverview(): Promise<ServiceInterface> {
        const opMode = await this.getOpMode();
        const state = await this.getServiceState();
        const strategies = await this.getStrategies();
        const params = await this.getCurrentParameters();
        const controlEnable = await this.getControlEnable();
        const currentStrategy = await this.getCurrentStrategy();
        return {
            name: this.name,
            opMode: OpMode[opMode] || opMode,
            status: ServiceState[state],
            strategies: strategies,
            currentStrategy: currentStrategy.name,
            parameters: params,
            controlEnable: controlEnable,
            lastChange: (new Date().getTime() - this.lastStatusChange.getTime())/1000
        };
    }

    /**
     * Get all strategies for service with its current strategyParameters
     * @returns {Promise<StrategyInterface[]>}
     */
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

    /** get current parameters
     * from strategy or service (if strategy is undefined)
     * @param {Strategy} strategy
     * @returns {Promise<ParameterInterface[]>}
     */
    async getCurrentParameters(strategy?: Strategy): Promise<ParameterInterface[]> {
        let params: DataAssembly[] = [];
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
                    const result = await this.parent.readVariableNode(param.communication['VExt']);
                    value = result.value.value;
                } catch {
                    value = undefined;
                }
                try {
                    const result = await this.parent.readVariableNode(param.communication['VMax']);
                    max = result.value.value;
                } catch {
                    max = undefined;
                }
                try {
                    const result = await this.parent.readVariableNode(param.communication['VMin']);
                    min = result.value.value;
                } catch {
                    min = undefined;
                }
                try {
                    const result = await this.parent.readVariableNode(param.communication['VUnit']);
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
                    readonly: param.interface_class === "StrView",
                    type: InterfaceClassToType[param.interface_class]
                };
            });
        }
        return await Promise.all(tasks);
    }


    /**
     * Set strategyNode and strategyNode parameters and execute a command for service on PEA
     * @param {ServiceCommand} command  command to be executed on PEA
     * @param {Strategy}    strategy  strategy to be set on PEA
     * @param {Parameter[]|ParameterOptions[]} parameters     parameters to be set on PEA
     * @returns {Promise<void>}
     */
    public async execute(command?: ServiceCommand, strategy?: Strategy, parameters?: (Parameter|ParameterOptions)[] ): Promise<void> {
        if (!this.parent.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Execute ${command} (${ strategy ? strategy.name : '' })`);
        let result;
        if (strategy) {
            await this.setStrategy(strategy);
        }
        let strat: Strategy = await this.getCurrentStrategy();
        if (parameters) {
            await this.setParameters(parameters);
        }
        if (command) {
            result = await this.executeCommand(command);
        }

        this.emit('commandExecuted', {
            timestamp: new Date(),
            strategy: strat,
            command: command,
            parameter: await this.getCurrentParameters(strat)
        });
    }


    protected start(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.START);
    }

    protected restart(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    protected stop(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    protected reset(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    protected complete(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    protected abort(): Promise<boolean> {
        this.clearListeners();
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    protected unhold(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    protected pause(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    protected resume(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESUME);
    }

    /**
     * Set service configuration strategyParameters for adaption to environment. Can set also process values
     * @param {ParameterOptions[]} parameters
     * @returns {Promise<any[]>}
     */
    public setServiceParameters(parameters: ParameterOptions[]): Promise<any[]> {
        this.logger.info(`[${this.qualifiedName}] Set service parameters: ${JSON.stringify(parameters)}`);
        const tasks = parameters.map((paramOptions: ParameterOptions) => {
            const param: Parameter = new Parameter(paramOptions, this);
            return param.updateValueOnModule();
        });
        return Promise.all(tasks);
    }

    /** Set strategy
     * Use default strategy if strategy is omitted
     *
     * @param {StrategyInterface|string} strategy    object or name of desired strategy
     * @param {(Parameter|ParameterOptions)[]} parameters
     * @returns {Promise<void>}
     */

    public async setStrategy(strategy?: Strategy|string): Promise<void> {
        // get strategy from input parameters
        let strat: Strategy;
        if (strategy === "default") {
            strat = this.strategies.find(strat => strat.default === true);
        } else if (typeof strategy === "string") {
            strat = this.strategies.find(strat => strat.name === strategy);
        } else {
            strat = strategy;
        }

        // set strategy
        this.logger.info(`[${this.qualifiedName}] Set strategy "${strat.name}" (${strat.id})`);
        await this.parent.writeNode(this.strategyNode,
            {
                dataType: DataType.UInt32,
                value: strat.id,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });
    }

    /** Set parameter of service
     * Use current strategy
     *
     * @param {(Parameter|ParameterOptions)[]} parameters
     * @returns {Promise<boolean>}
     */
    public async setParameters(parameters: (Parameter|ParameterOptions)[]): Promise<void> {
        const strat = await this.getCurrentStrategy();
        let params: Parameter[] = parameters.map((param) => {
            if (param instanceof Parameter) {
                return param;
            } else {
                return new Parameter(param, this, strat)
            }
        });
        const tasks = params.map((param: Parameter) => param.updateValueOnModule());
        const paramResults = await Promise.all(tasks);
        this.logger.trace(`[${this.qualifiedName}] Set Parameter Promises: ${JSON.stringify(paramResults)}`);
        this.listenToServiceParameters(params);
        return Promise.resolve();
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


    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<void> {
        this.logger.debug(`[${this.qualifiedName}] Write opMode (${this.opModeNode.namespace_index} - ${this.opModeNode.node_id}): ${<number> opMode}`);
        const result = await this.parent.writeNode(this.opModeNode,
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });
        this.logger.debug(`[${this.qualifiedName}] Setting opMode ${JSON.stringify(result)}`);
        if (result.value !== 0) {
            this.logger.warn(`[${this.qualifiedName}] Error while setting opMode to ${opMode}: ${JSON.stringify(result)}`);
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    }


    public setOperationMode(): Promise<void> {
        catService.info(`Service ${this.name} automaticMode = ${manager.automaticMode}`);
        if (manager.automaticMode) {
            this.logger.info(`[${this.qualifiedName}] Bring to automatic mode`);
            return this.setToAutomaticOperationMode();
        } else {
            this.logger.info(`[${this.qualifiedName}] Bring to manual mode`);
            return this.setToManualOperationMode()
                .then(() => this.logger.info(`[${this.qualifiedName}] Service now in manual mode`));
        }
    }

    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<void>}
     */
    private async setToAutomaticOperationMode(): Promise<void> {
        let opMode: OpMode = await this.getOpMode();
        this.logger.info(`[${this.qualifiedName}] Current opMode = ${opMode}`);
        if (isOffState(opMode)) {
            this.logger.trace('First go to Manual state');
            await this.writeOpMode(OpMode.stateManOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opModeNode)
                    .once('changed', (data) => {
                        if (isManualState(data.value)) {
                            this.logger.trace(`[${this.qualifiedName}] finally in ManualMode`);
                            opMode = data.value;
                            resolve();
                        }
                    });
            });
        }

        if (isManualState(opMode)) {
            this.logger.trace('Go to Automatic state');
            await this.writeOpMode(OpMode.stateAutOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opModeNode)
                    .once('changed', (data) => {
                        this.logger.trace(`[${this.qualifiedName}] OpMode changed: ${data.value}`);
                        if (isAutomaticState(data.value)) {
                            this.logger.trace(`[${this.qualifiedName}] finally in AutomaticMode`);
                            opMode = data.value;
                            resolve();
                        }
                    });
            });
        }

        if (!isExtSource(opMode)) {
            this.logger.trace('Go to External source');
            await this.writeOpMode(OpMode.srcExtOp);
            await new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opModeNode)
                    .once('changed', (data) => {
                        this.logger.trace(`[${this.qualifiedName}] OpMode changed: ${data.value}`);
                        if (isExtSource(data.value)) {
                            this.logger.trace(`[${this.qualifiedName}] finally in ExtSource`);
                            resolve();
                        }
                    });
            });
        }
    }

    private async setToManualOperationMode(): Promise<void> {
        let opMode = await this.getOpMode();
        if (!isManualState(opMode)) {
            this.writeOpMode(OpMode.stateManOp);
            return new Promise((resolve) => {
                this.parent.listenToOpcUaNode(this.opModeNode)
                    .once('changed', (data) => {
                        this.logger.trace(`[${this.qualifiedName}] OpMode changed: ${data.value}`);
                        if (isManualState(data.value)) {
                            this.logger.trace(`[${this.qualifiedName}] finally in ManualMode`);
                            resolve();
                        }
                    });
            });
        }
    }

    private async sendCommand(command: ServiceMtpCommand): Promise<boolean> {
        if (!this.parent.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Send command ${ServiceMtpCommand[command]} (${command})`);
        await this.setOperationMode();

        let controlEnable: ControlEnableInterface = await this.getControlEnable(true);
        this.logger.debug(`[${this.qualifiedName}] ControlEnable: ${JSON.stringify(controlEnable)}`);

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
            return Promise.reject(`ControlOp does not allow ${ServiceMtpCommand[command]} (${ServiceState[await this.getServiceState()]} - ${JSON.stringify(controlEnable)})`);
        }

        const result = await this.parent.writeNode(this.commandNode,
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        this.logger.info(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]}(${command}) written: ${result.name}`);

        return result.value === 0;
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
