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
    opModetoJson,
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
    StrategyInterface,
    OpModeInterface
} from '@p2olab/polaris-interface';
import {Unit} from './Unit';
import {EventEmitter} from 'events';
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
 * Events emitted by [[Service]]
 */
interface ServiceEvents {
    /**
     * Notify when the [[Service] changes its state
     * @event
     */
    state: {state: ServiceState, timestamp: Date};

    opMode: OpModeInterface;
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
    /** service configuration configuration parameters */
    readonly parameters: ConfigurationParameter[];
    /** [Module] of the service */
    readonly parent: Module;

    private serviceParametersEventEmitters: EventEmitter[];
    private lastStatusChange: Date;

    /** OPC UA node of command/controlOp variable */
    readonly command: OpcUaNodeOptions;
    readonly commandMan: OpcUaNodeOptions;
    /** OPC UA node of status variable */
    readonly status: OpcUaNodeOptions;
    /** OPC UA node of controlEnable variable */
    readonly controlEnable: OpcUaNodeOptions;
    /** OPC UA node of opMode variable */
    readonly opMode: OpcUaNodeOptions;
    /** OPC UA node of strategy variable */
    readonly strategy: OpcUaNodeOptions;
    readonly strategyMan: OpcUaNodeOptions;
    /** OPC UA node of currentStrategy variable */
    readonly currentStrategy: OpcUaNodeOptions;

    readonly logger: Category;

    // use ControlExt (true) or ControlOp (false)
    readonly automaticMode;

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        super();
        this.name = serviceOptions.name;
        this.automaticMode = true;

        const com = serviceOptions.communication;

        this.opMode = com.OpMode;
        if (!this.opMode) {
            throw new Error(`No opMode variable in service ${this.name} during parsing`);
        }

        this.status = com.State || com.CurrentState;
        if (!this.status) {
            throw new Error(`No status variable in service ${this.name} during parsing`);
        }

        this.controlEnable = com.ControlEnable || com.CommandEnable;
        if (!this.controlEnable) {
            throw new Error(`No controlEnable variable in service ${this.name} during parsing`);
        }

        this.command = com.ControlExt || com.CommandExt;
        if (!this.command) {
            throw new Error(`No command variable in service ${this.name} during parsing`);
        }

        this.commandMan = com.ControlOp || com.CommandMan;
        if (!this.commandMan) {
            throw new Error(`No commandMan variable in service ${this.name} during parsing`);
        }

        this.strategy = com.StrategyExt;
        if (!this.strategy) {
            throw new Error(`No strategy variable in service ${this.name} during parsing`);
        }

        this.strategyMan = com.StrategyOp || com.StrategyMan;
        if (!this.strategyMan) {
            throw new Error(`No strategyMan variable in service ${this.name} during parsing`);
        }

        this.currentStrategy = com.CurrentStrategy;
        if (!this.currentStrategy) {
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
     * Listen to state, controlEnable, command, currentStrategy and opMode of service and emits specific events for them
     *
     * @returns {Service}
     */
    public async subscribeToService(): Promise<Service> {
        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        if (this.controlEnable) {
            await this.getControlEnable();
            this.logger.debug(`[${this.qualifiedName}] initial controlEnable: ${this.controlEnable.value}`);
            this.parent.listenToOpcUaNode(this.controlEnable)
                .on('changed', (data) => {
                    this.controlEnable.value = data.value;
                    this.controlEnable.timestamp = new Date();
                    this.logger.info(`[${this.qualifiedName}] ControlEnable changed: ${JSON.stringify(controlEnableToJson(<ServiceControlEnable> this.controlEnable.value))}`);
                    this.emit('controlEnable', controlEnableToJson(<ServiceControlEnable> this.controlEnable.value));
                });
        }
        if (this.status) {
            await this.getServiceState();
            this.logger.debug(`[${this.qualifiedName}] initial status: ${this.status.value}`);
            this.parent.listenToOpcUaNode(this.status)
                .on('changed', (data) => {
                    this.status.value = data.value;
                    this.status.timestamp = new Date();
                    this.lastStatusChange = new Date();
                    this.logger.info(`[${this.qualifiedName}] Status changed: ${ServiceState[<ServiceState> this.status.value]}`);
                    this.emit('state', {state: <ServiceState> this.status.value, timestamp: this.status.timestamp});
                    if (data.value === ServiceState.COMPLETED || data.value === ServiceState.ABORTED || data.value === ServiceState.STOPPED) {
                        this.clearListeners();
                    }
                });
        }
        if (this.command) {
            let result = await this.parent.readVariableNode(this.command);
            this.command.value = result.value.value;
            this.logger.debug(`[${this.qualifiedName}] initial command: ${this.command.value}`);
            this.parent.listenToOpcUaNode(this.command)
                .on('changed', (data) => {
                    this.command.value = data.value;
                    this.command.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] Command changed: ${ServiceMtpCommand[<ServiceMtpCommand> this.command.value]}`);
                });
        }
        if (this.commandMan) {
            let result = await this.parent.readVariableNode(this.commandMan);
            this.commandMan.value = result.value.value;
            this.logger.debug(`[${this.qualifiedName}] initial commandMan: ${this.commandMan.value}`);
            this.parent.listenToOpcUaNode(this.commandMan)
                .on('changed', (data) => {
                    this.commandMan.value = data.value;
                    this.commandMan.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] CommandMan changed: ${ServiceMtpCommand[<ServiceMtpCommand> this.commandMan.value]}`);
                });
        }
        if (this.currentStrategy) {
            await this.getCurrentStrategy();
            this.logger.debug(`[${this.qualifiedName}] initial current strategy: ${this.currentStrategy.value}`);
            this.parent.listenToOpcUaNode(this.currentStrategy)
                .on('changed', (data) => {
                    this.currentStrategy.value = data.value;
                    this.currentStrategy.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] Current Strategy changed: ${this.currentStrategy.value}`);
                });
        }
        if (this.opMode) {
            await this.getOpMode();
            this.logger.debug(`[${this.qualifiedName}] initial opMode: ${this.opMode.value}`);
            this.parent.listenToOpcUaNode(this.opMode)
                .on('changed', (data) => {
                    this.opMode.value = data.value;
                    this.opMode.timestamp = new Date();
                    this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ${this.opMode.value}`);
                    this.emit('opMode', opModetoJson(<OpMode> this.opMode.value));
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
        if (!this.status.value ||
            (new Date().getMilliseconds() - this.status.timestamp.getMilliseconds() < 1000)) {
            const result = await this.parent.readVariableNode(this.status);
            if (result.value.value != this.status.value) {
                this.lastStatusChange = new Date();
            }
            this.status.value = result.value.value;
            this.status.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update service state: ${ServiceState[<ServiceState> this.status.value]}`);
        }
        return <ServiceState> this.status.value;
    }

    /**
     * Get current control enable from internal memory.
     * If there is no control enable or it is older than 1000ms, retrieve an updated version from PEA
     * @param {boolean} force   force to retrieve data from PEA and not from internal memory
     * @returns {Promise<ControlEnableInterface>}
     */
    public async getControlEnable(force = false): Promise<ControlEnableInterface> {
        if (!this.controlEnable.value || force ||
            (new Date().getMilliseconds() - this.controlEnable.timestamp.getMilliseconds() < 1000)) {
            this.controlEnable.value = (await this.parent.readVariableNode(this.controlEnable)).value.value;
            this.controlEnable.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update control enable: ${JSON.stringify(controlEnableToJson(<ServiceControlEnable> this.controlEnable.value))}`);
        }
        return controlEnableToJson(<ServiceControlEnable> this.controlEnable.value);
    }

    /**
     * Get current strategy from internal memory.
     * If there is no current strategy or it is older than 1000ms, retrieve an updated version from PEA
     * If PEA has no known strategy set in server, set it to default strategy
     */
    public async getCurrentStrategy(): Promise<Strategy> {
        if (!this.currentStrategy.value ||
            (new Date().getMilliseconds() - this.currentStrategy.timestamp.getMilliseconds() < 1000)) {
            this.currentStrategy.value = (await this.parent.readVariableNode(this.currentStrategy)).value.value;
            this.currentStrategy.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update currentStrategy: ${this.currentStrategy.value}`);
        }
        let strategy = this.strategies.find(strat => strat.id == this.currentStrategy.value);
        if (!strategy) {
            strategy = this.strategies.find(strat => strat.default);
            this.setStrategyParameters(strategy);
        }
        return strategy;
    }


    /**
     * Get current opMode from internal memory.
     * If there is no opMode or it is older than 1000ms, retrieve an updated version from PEA
     */
    public async getOpMode(): Promise<OpMode> {
        if (!this.opMode.value ||
            (new Date().getMilliseconds() - this.opMode.timestamp.getMilliseconds() < 1000)) {
            const result = await this.parent.readVariableNode(this.opMode);
            this.opMode.value = result.value.value;
            this.opMode.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update opMode: ${<OpMode> this.opMode.value}`);
        }
        return <OpMode> this.opMode.value;
    }

    /**
     * get JSON overview about service and its state, opMode, strategies, strategyParameters and controlEnable
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
            opMode: opModetoJson(opMode),
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

    /** get current strategyParameters
     * from strategy or service (if strategy is undefined)
     * @param {StrategyInterface} strategy
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
     * Set strategy and strategy strategyParameters and execute a command for service on PEA
     * @param {ServiceCommand} command  command to be executed on PEA
     * @param {StrategyInterface}    strategy  strategy to be set on PEA
     * @param {Parameter[]|ParameterOptions[]} parameters     strategyParameters to be set on PEA
     * @returns {Promise<void>}
     */
    async execute(command?: ServiceCommand, strategy?: Strategy, parameters?: (Parameter|ParameterOptions)[] ): Promise<void> {
        if (!this.parent.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Execute ${command} (${ strategy ? strategy.name : '' })`);
        let result;
        if (strategy || parameters) {
            await this.setStrategyParameters(strategy, parameters);
        }
        if (!strategy) {
            strategy = await this.getCurrentStrategy();
        }
        if (command) {
            result = await this.executeCommand(command);
        }

        this.emit('commandExecuted', {
            timestampPfe: new Date(),
            strategy: strategy,
            command: command,
            parameter: await this.getCurrentParameters(strategy)
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
        return result;
    }

    private start(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.START);
    }

    private restart(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    private stop(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    private reset(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    private complete(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    private abort(): Promise<boolean> {
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

    /** Set strategy and strategy parameter
     * Use default strategy if strategy is omitted
     *
     * @param {StrategyInterface|string} strategy    object or name of desired strategy
     * @param {(Parameter|ParameterOptions)[]} parameters
     * @returns {Promise<void>}
     */
    public async setStrategyParameters(strategy?: Strategy|string, parameters?: (Parameter|ParameterOptions)[]): Promise<void> {
        // get strategy from input strategyParameters
        let strat: Strategy;
        if (!strategy) {
            strat = this.strategies.find(strat => strat.default === true);
        } else if (typeof strategy === "string") {
            strat = this.strategies.find(strat => strat.name === strategy);
        } else {
            strat = strategy;
        }

        // set strategy
        this.logger.info(`[${this.qualifiedName}] Set strategy "${strat.name}" (${strat.id})`);
        await this.parent.writeNode(this.automaticMode ? this.strategy : this.strategyMan,
            {
                dataType: DataType.UInt32,
                value: strat.id,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });

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
            this.logger.trace(`[${this.qualifiedName}] Set Parameter Promises: ${JSON.stringify(paramResults)}`);
            this.listenToServiceParameters(params);
        }
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

    /**
     *
     */
    private clearListeners() {
        this.logger.info(`[${this.qualifiedName}] clear parameter listener`);
        this.serviceParametersEventEmitters.forEach(listener => listener.removeAllListeners());
    }


    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<void> {
        this.logger.debug(`[${this.qualifiedName}] Write opMode (${this.opMode.namespace_index} - ${this.opMode.node_id}): ${<number> opMode}`);
        const result = await this.parent.writeNode(this.opMode,
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
        if (this.automaticMode) {
            this.logger.info(`[${this.qualifiedName}] Bring to automatic mode`);
            return this.setToAutomaticOperationMode();
        } else {
            this.logger.info(`[${this.qualifiedName}] Bring to manual mode`);
            return this.setToManualOperationMode()
                .then(() => this.logger.info(`[${this.qualifiedName}] Service now in manual mode`));
        }
    }

    private async waitForOpModeToPassSpecificTest(testFunction: (opMode: OpMode) => boolean) {
        return new Promise((resolve) => {
            let event = this.parent.listenToOpcUaNode(this.opMode);
            function test(data) {
                if (testFunction(data.value)) {
                    event.removeListener('changed', test);
                    resolve();
                }
            }
            event.on('changed', test);
        });
    }
    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<void>}
     */
    private async setToAutomaticOperationMode(): Promise<void> {
        let opMode: OpMode = await this.getOpMode();
        this.logger.info(`[${this.qualifiedName}] Current opMode = ${opMode}`);
        if (isOffState(<OpMode> this.opMode.value)) {
            this.logger.info('First go to Manual state');
            await this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
            /*await new Promise((resolve) => {
                let event = this.parent.listenToOpcUaNode(this.opMode);
                function test(data) {
                    if (isManualState(data.value)) {
                        opMode = data.value;
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });*/
            this.logger.info(`[${this.qualifiedName}] in ManualMode`);
        }

        if (isManualState(<OpMode> this.opMode.value)) {
            this.logger.info('Go to Automatic state');
            await this.writeOpMode(OpMode.stateAutOp);
            //await this.waitForOpModeToPassSpecificTest(isAutomaticState);
            await new Promise((resolve) => {
                let event = this.parent.listenToOpcUaNode(this.opMode);
                function test(data) {
                    if (isAutomaticState(data.value)) {
                        opMode = data.value;
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
            this.logger.info(`[${this.qualifiedName}] in AutomaticMode`);
        }

        if (!isExtSource(<OpMode> this.opMode.value)) {
            this.logger.info('Go to External source');
            await this.writeOpMode(OpMode.srcExtOp);
            //await this.waitForOpModeToPassSpecificTest(isExtSource);
            await new Promise((resolve) => {
                let event = this.parent.listenToOpcUaNode(this.opMode);
                function test(data) {
                    if (isExtSource(data.value)) {
                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
            this.logger.trace(`[${this.qualifiedName}] in ExtSource`);
        }
    }

    private async setToManualOperationMode(): Promise<void> {
        let opMode = await this.getOpMode();
        if (!isManualState(<OpMode> this.opMode.value)) {
            await this.writeOpMode(OpMode.stateManOp);
            //await this.waitForOpModeToPassSpecificTest(isManualState);
            await new Promise((resolve) => {
                let event = this.parent.listenToOpcUaNode(this.opMode);
                function test(data) {
                    if (isManualState(data.value)) {

                        event.removeListener('changed', test);
                        resolve();
                    }
                }
                event.on('changed', test);
            });
            this.logger.info(`[${this.qualifiedName}] finally in ManualMode`);
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
            this.logger.info(`ControlOp does not allow ${ServiceMtpCommand[command]}- ${JSON.stringify(controlEnable)}`);
            return Promise.reject('Control Op does not allow command');
        }

        const result = await this.parent.writeNode(this.automaticMode ? this.command : this.commandMan,
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        this.logger.info(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]}(${command}) written: ${result.name}`);

        return result.value === 0;
    }

}
