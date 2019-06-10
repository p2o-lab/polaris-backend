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
    OpModeInterface,
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    StrategyInterface
} from '@p2olab/polaris-interface';
import {Unit} from './Unit';
import {EventEmitter} from 'events';
import {BaseService, BaseServiceEvents} from './BaseService';
import StrictEventEmitter from 'strict-event-emitter-types';
import {DataAssembly, DataAssemblyOptions} from '../dataAssembly/DataAssembly';
import {Strategy, StrategyOptions} from './Strategy';
import {Category} from 'typescript-logging';
import {Module} from './Module';
import {catService} from '../../config/logging';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';

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
    'AnaView': 'string',
    'ExtAnaOp': 'number',
    'ExtDigOp': 'number'
};

/**
 * Events emitted by [[Service]]
 */
interface ServiceEvents extends BaseServiceEvents {
    /**
     * Notify when the [[Service] changes its state
     * @event state
     */
    state: {state: ServiceState, timestamp: Date};

    variableChanged: {strategy?: Strategy; parameter: DataAssembly; value: number}

    opMode: OpModeInterface;
    /**
     * Notify when controlEnable changes
     * @event controlEnable
     */
    controlEnable: ControlEnableInterface;
}

type ServiceEmitter = StrictEventEmitter<EventEmitter, ServiceEvents>;

/**
 * TestServerService of a [[Module]]
 *
 * after connection to a real PEA, commands can be triggered and states can be retrieved
 *
 */
export class Service extends BaseService {

    readonly eventEmitter: ServiceEmitter;

    /** strategies of the service */
    readonly strategies: Strategy[];
    /** service configuration configuration parameters */
    readonly parameters: DataAssembly[];
    /** [Module] of the service */
    readonly parent: Module;

    private serviceParametersEventEmitters: EventEmitter[];

    get state(): ServiceState {
        return <ServiceState> this.statusNode.value;
    }

    get controlEnable(): ControlEnableInterface {
        return controlEnableToJson(<ServiceControlEnable> this.controlEnableNode.value);
    }

    /** OPC UA node of command/controlOp variable */
    readonly command: OpcUaNodeOptions;
    readonly commandMan: OpcUaNodeOptions;
    /** OPC UA node of status variable */
    readonly statusNode: OpcUaNodeOptions;
    /** OPC UA node of controlEnable variable */
    readonly controlEnableNode: OpcUaNodeOptions;
    /** OPC UA node of opMode variable */
    readonly opModeNode: OpcUaNodeOptions;
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
        this.eventEmitter = new EventEmitter();

        this._name = serviceOptions.name;
        this.automaticMode = true;

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
                .map(options => DataAssemblyFactory.create(options, parent));
        }
        this.parent = parent;
        this.serviceParametersEventEmitters = [];

        this._lastStatusChange = new Date();
        this.logger = catService;
    }

    public get qualifiedName() {
        return `${this.parent.id}.${this.name}`
    }

    /**
     * Listen to state, controlEnable, command, currentStrategy and opMode of service and emits specific events for them
     *
     * @returns {TestServerService}
     */
    public async subscribeToService(): Promise<ServiceEmitter> {

        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        if (this.controlEnableNode) {
            await this.getControlEnable();
            this.logger.debug(`[${this.qualifiedName}] initial controlEnable: ${this.controlEnable}`);
            this.parent.listenToOpcUaNode(this.controlEnableNode)
                .on('changed', (data) => {
                    this.logger.info(`[${this.qualifiedName}] ControlEnable changed: ${JSON.stringify(this.controlEnable)}`);
                    this.eventEmitter.emit('controlEnable', this.controlEnable);
                });
        }
        if (this.statusNode) {
            await this.getServiceState();
            this.logger.debug(`[${this.qualifiedName}] initial status: ${this.statusNode.value}`);
            this.parent.listenToOpcUaNode(this.statusNode)
                .on('changed', (data) => {
                    this._lastStatusChange = new Date();
                    this.logger.info(`[${this.qualifiedName}] Status changed: ${ServiceState[<ServiceState> this.statusNode.value]}`);
                    this.eventEmitter.emit('state', {
                        state: <ServiceState> this.statusNode.value,
                        timestamp: this.statusNode.timestamp
                    });
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
                    this.logger.debug(`[${this.qualifiedName}] Command changed: ${ServiceMtpCommand[<ServiceMtpCommand> this.command.value]}`);
                });
        }
        if (this.commandMan) {
            let result = await this.parent.readVariableNode(this.commandMan);
            this.commandMan.value = result.value.value;
            this.logger.debug(`[${this.qualifiedName}] initial commandMan: ${this.commandMan.value}`);
            this.parent.listenToOpcUaNode(this.commandMan)
                .on('changed', (data) => {
                    this.logger.debug(`[${this.qualifiedName}] CommandMan changed: ${ServiceMtpCommand[<ServiceMtpCommand> this.commandMan.value]}`);
                });
        }
        if (this.currentStrategy) {
            await this.getCurrentStrategy();
            this.logger.debug(`[${this.qualifiedName}] initial current strategy: ${this.currentStrategy.value}`);
            this.parent.listenToOpcUaNode(this.currentStrategy)
                .on('changed', (data) => {
                    this.logger.debug(`[${this.qualifiedName}] Current Strategy changed: ${this.currentStrategy.value}`);
                });
        }
        if (this.opModeNode) {
            await this.getOpMode();
            this.logger.debug(`[${this.qualifiedName}] initial opMode: ${this.opModeNode.value}`);
            this.parent.listenToOpcUaNode(this.opModeNode)
                .on('changed', (data) => {
                    this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ${this.opModeNode.value}`);
                    this.eventEmitter.emit('opMode', opModetoJson(<OpMode> this.opModeNode.value));
                });
        }
        this.parameters.forEach(param => param.subscribe()
            .on('V', (data) => {
                this.eventEmitter.emit('variableChanged', {parameter: param, value: data})
            }));
        this.strategies.forEach(strategy => strategy.subscribe()
                .on('processValueChanged', (data) => {
                    this.eventEmitter.emit('variableChanged', {
                        strategy: strategy,
                        parameter: data.processValue,
                        value: data.value
                    })
            })
            /*.on('parameterChanged', (data) => {
                this.eventEmitter.emit('parameterChanged', {strategy: strategy, parameter: data.parameter, value: data.value.value})
            })*/
        );
        return this.eventEmitter;
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
        if (!this.currentStrategy.value ||
            (new Date().getMilliseconds() - this.currentStrategy.timestamp.getMilliseconds() < 1000)) {
            this.currentStrategy.value = (await this.parent.readVariableNode(this.currentStrategy)).value.value;
            this.currentStrategy.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update currentStrategy: ${this.currentStrategy.value}`);
        }
        let strategy = this.strategies.find(strat => strat.id == this.currentStrategy.value);
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
            this.logger.debug(`[${this.qualifiedName}] Update opMode: ${JSON.stringify(opModetoJson(<OpMode> this.opModeNode.value))}`);
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
        if (!strategy) {
            strategy = await this.getCurrentStrategy();
        }
        if (command) {
            result = await this.executeCommand(command);
        }

        this.eventEmitter.emit('commandExecuted', {
            timestamp: new Date(),
            strategy: strategy,
            command: command,
            parameter: await this.getCurrentParameters(strategy)
        });
    }


    start(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.START);
    }

    restart(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    stop(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    reset(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    complete(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    abort(): Promise<boolean> {
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

    public async setStrategy(strategy?: Strategy | string, parameters?: Parameter[]): Promise<void> {
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
        await this.parent.writeNode(this.automaticMode ? this.strategy : this.strategyMan,
            {
                dataType: DataType.UInt32,
                value: strat.id,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });

        if (parameters) {
            this.setParameters(parameters);
        }
    }

    public async setParameters(parameters: (Parameter | ParameterOptions)[]): Promise<void> {
        let params: Parameter[] = await Promise.all(parameters.map(async (param) => {
            if (param instanceof Parameter) {
                return param;
            } else {
                const strat = await this.getCurrentStrategy();
                return new Parameter(param, this, strat)
            }
        }));
        const tasks = params.map((param: Parameter) => param.updateValueOnModule());
        const paramResults = await Promise.all(tasks);
        this.logger.trace(`[${this.qualifiedName}] Set Parameter Promises: ${JSON.stringify(paramResults)}`);
        await this.listenToServiceParameters(params);
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
        if (this.automaticMode) {
            return this.setToAutomaticOperationMode();
        } else {
            return this.setToManualOperationMode();
        }
    }

    public async waitForOpModeToPassSpecificTest(testFunction: (opMode: OpMode) => boolean) {
        return new Promise((resolve) => {
            let event = this.parent.listenToOpcUaNode(this.opModeNode);
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
    private async setToAutomaticOperationMode(): Promise<void> {
        let opMode: OpMode = await this.getOpMode();
        this.logger.debug(`[${this.qualifiedName}] Current opMode = ${JSON.stringify(opModetoJson(opMode))}`);
        if (isOffState(<OpMode> this.opModeNode.value)) {
            this.logger.info(`[${this.qualifiedName}] Go to Manual state`);
            this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
            this.logger.info(`[${this.qualifiedName}] in ManualMode`);
        }

        if (isManualState(<OpMode> this.opModeNode.value)) {
            this.logger.info(`[${this.qualifiedName}] Go to Automatic state`);
            this.writeOpMode(OpMode.stateAutOp);
            await this.waitForOpModeToPassSpecificTest(isAutomaticState);
            this.logger.info(`[${this.qualifiedName}] in AutomaticMode`);
        }

        if (!isExtSource(<OpMode> this.opModeNode.value)) {
            this.logger.info(`[${this.qualifiedName}] Go to External source`);
            this.writeOpMode(OpMode.srcExtOp);
            await this.waitForOpModeToPassSpecificTest(isExtSource);
            this.logger.info(`[${this.qualifiedName}] in ExtSource`);
        }
    }

    private async setToManualOperationMode(): Promise<void> {
        await this.getOpMode();
        if (!isManualState(<OpMode> this.opModeNode.value)) {
            this.logger.info(`[${this.qualifiedName}] Go to Manual state`);
            await this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
            this.logger.info(`[${this.qualifiedName}] in ManualMode`);
        }
    }

    private async sendCommand(command: ServiceMtpCommand): Promise<boolean> {
        if (!this.parent.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Send command ${ServiceMtpCommand[command]}`);
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
            this.logger.info(`[${this.qualifiedName}] ControlOp does not allow ${ServiceMtpCommand[command]}- ${JSON.stringify(controlEnable)}`);
            return Promise.reject(`[${this.qualifiedName}] ControlOp does not allow command ${ServiceMtpCommand[command]}`);
        }

        const result = await this.parent.writeNode(this.automaticMode ? this.command : this.commandMan,
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        this.logger.info(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written: ${result.name}`);

        return result.value === 0;
    }

}
