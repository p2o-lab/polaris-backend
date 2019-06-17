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

import {
    ControlEnableInterface,
    OpcUaNodeOptions,
    OpModeInterface,
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    StrategyInterface
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {DataType, DataValue, Variant, VariantArrayType} from 'node-opcua-client';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catService} from '../../config/logging';
import {ExtAnaOp} from '../dataAssembly/AnaOp';
import {AnaView} from '../dataAssembly/AnaView';
import {ExtBinOp} from '../dataAssembly/BinOp';
import {BinView} from '../dataAssembly/BinView';
import {DataAssembly, DataAssemblyOptions} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {ExtDigOp} from '../dataAssembly/DigOp';
import {DigView} from '../dataAssembly/DigView';
import {StrView} from '../dataAssembly/Str';
import {Parameter} from '../recipe/Parameter';
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
import {Module} from './Module';
import {Strategy, StrategyOptions} from './Strategy';
import {UNIT} from './Unit';

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
    };
    strategies: StrategyOptions[];
    parameters: DataAssemblyOptions[];
}

const interfaceClassToType = {
    'StrView': 'string',
    'AnaView': 'string',
    'ExtAnaOp': 'number',
    'ExtDigOp': 'number'
};

/**
 * Events emitted by [[TestServerService]]
 */
interface ServiceEvents {
    /**
     * Notify when the [[TestServerService] changes its state
     * @event state
     */
    state: {state: ServiceState, timestamp: Date};

    variableChanged: { strategy?: Strategy; parameter: DataAssembly; value: number };

    parameterChanged: { strategy?: Strategy; parameter: DataAssembly, value: number };

    opMode: OpModeInterface;
    /**
     * Notify when controlEnable changes
     * @event controlEnable
     */
    controlEnable: ControlEnableInterface;
    /**
     * whenever a command is executed from the POL
     * @event commandExecuted
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
 * TestServerService of a [[Module]]
 *
 * after connection to a real PEA, commands can be triggered and states can be retrieved
 *
 */
export class Service extends (EventEmitter as new() => ServiceEmitter) {

    public get qualifiedName() {
        return `${this.parent.id}.${this.name}`;
    }

    /** name of the service */
    public readonly name: string;
    /** strategies of the service */
    public readonly strategies: Strategy[];
    /** service configuration configuration parameters */
    public readonly parameters: DataAssembly[];
    /** [Module] of the service */
    public readonly parent: Module;
    /** OPC UA node of command/controlOp variable */
    public readonly command: OpcUaNodeOptions;
    public readonly commandMan: OpcUaNodeOptions;
    /** OPC UA node of status variable */
    public readonly status: OpcUaNodeOptions;
    /** OPC UA node of controlEnable variable */
    public readonly controlEnable: OpcUaNodeOptions;
    /** OPC UA node of opMode variable */
    public readonly opMode: OpcUaNodeOptions;
    /** OPC UA node of strategy variable */
    public readonly strategy: OpcUaNodeOptions;
    public readonly strategyMan: OpcUaNodeOptions;
    /** OPC UA node of currentStrategy variable */
    public readonly currentStrategy: OpcUaNodeOptions;
    public readonly logger: Category;
    // use ControlExt (true) or ControlOp (false)
    public readonly automaticMode: boolean;
    private serviceParametersEventEmitters: EventEmitter[];
    private lastStatusChange: Date;

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
            .map((option) => new Strategy(option, parent));
        if (serviceOptions.parameters) {
            this.parameters = serviceOptions.parameters
                .map((options) => DataAssemblyFactory.create(options, parent));
        }
        this.parent = parent;
        this.serviceParametersEventEmitters = [];

        this.lastStatusChange = new Date();
        this.logger = catService;
    }

    /**
     * Listen to state, controlEnable, command, currentStrategy and opMode of service and emits specific events for them
     *
     * @returns {TestServerService}
     */
    public async subscribeToService(): Promise<Service> {
        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        if (this.controlEnable) {
            await this.getControlEnable();
            this.logger.debug(`[${this.qualifiedName}] initial controlEnable: ${this.controlEnable.value}`);
            this.parent.listenToOpcUaNode(this.controlEnable)
                .on('changed', () => {
                    this.logger.info(`[${this.qualifiedName}] ControlEnable changed: ` +
                        `${JSON.stringify(controlEnableToJson(this.controlEnable.value as ServiceControlEnable))}`);
                    this.emit('controlEnable', controlEnableToJson(this.controlEnable.value as ServiceControlEnable));
                });
        }
        if (this.status) {
            await this.getServiceState();
            this.logger.debug(`[${this.qualifiedName}] initial status: ${this.status.value}`);
            this.parent.listenToOpcUaNode(this.status)
                .on('changed', (data) => {
                    this.lastStatusChange = new Date();
                    this.logger.info(`[${this.qualifiedName}] Status changed: ` +
                        `${ServiceState[this.status.value as ServiceState]}`);
                    this.emit('state', {state: this.status.value as ServiceState, timestamp: this.status.timestamp});
                    if (data.value === ServiceState.COMPLETED ||
                        data.value === ServiceState.ABORTED ||
                        data.value === ServiceState.STOPPED) {
                        this.clearListeners();
                    }
                });
        }
        if (this.command) {
            const result = await this.parent.readVariableNode(this.command);
            this.command.value = result.value.value;
            this.logger.debug(`[${this.qualifiedName}] initial command: ${this.command.value}`);
            this.parent.listenToOpcUaNode(this.command)
                .on('changed', () => {
                    this.logger.debug(`[${this.qualifiedName}] Command changed: ` +
                        `${ServiceMtpCommand[this.command.value as ServiceMtpCommand]}`);
                });
        }
        if (this.commandMan) {
            const result = await this.parent.readVariableNode(this.commandMan);
            this.commandMan.value = result.value.value;
            this.logger.debug(`[${this.qualifiedName}] initial commandMan: ${this.commandMan.value}`);
            this.parent.listenToOpcUaNode(this.commandMan)
                .on('changed', () => {
                    this.logger.debug(`[${this.qualifiedName}] CommandMan changed: ` +
                        `${ServiceMtpCommand[this.commandMan.value as ServiceMtpCommand]}`);
                });
        }
        if (this.currentStrategy) {
            await this.getCurrentStrategy();
            this.logger.debug(`[${this.qualifiedName}] initial current strategy: ${this.currentStrategy.value}`);
            this.parent.listenToOpcUaNode(this.currentStrategy)
                .on('changed', () => {
                    this.logger.debug(`[${this.qualifiedName}] Current Strategy changed: ` +
                        `${this.currentStrategy.value}`);
                });
        }
        if (this.opMode) {
            await this.getOpMode();
            this.logger.debug(`[${this.qualifiedName}] initial opMode: ${this.opMode.value}`);
            this.parent.listenToOpcUaNode(this.opMode)
                .on('changed', () => {
                    this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ${this.opMode.value}`);
                    this.emit('opMode', opModetoJson(this.opMode.value as OpMode));
                });
        }
        this.parameters.forEach((param) => param.subscribe()
            .on('V', (data) => {
                this.emit('variableChanged', {parameter: param, value: data});
            }));
        this.strategies.forEach((strategy) => strategy.subscribe()
            .on('processValueChanged', (data) => {
                this.emit('variableChanged', {strategy, parameter: data.processValue, value: data.value});
            })
            .on('parameterChanged', (data) => {
                this.emit('parameterChanged', {strategy, parameter: data.parameter, value: data.value});
            })
        );
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
            if (result.value.value !== this.status.value) {
                this.lastStatusChange = new Date();
            }
            this.status.value = result.value.value;
            this.status.timestamp = new Date();
            this.logger.debug(`[${this.qualifiedName}] Update service state: ` +
                `${ServiceState[this.status.value as ServiceState]}`);
        }
        return this.status.value as ServiceState;
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
            this.logger.debug(`[${this.qualifiedName}] Update control enable: ` +
                `${JSON.stringify(controlEnableToJson(this.controlEnable.value as ServiceControlEnable))}`);
        }
        return controlEnableToJson(this.controlEnable.value as ServiceControlEnable);
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
        let strategy = this.strategies.find((strat) => strat.id === this.currentStrategy.value);
        if (!strategy) {
            strategy = this.strategies.find((strat) => strat.default);
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
            this.logger.debug(`[${this.qualifiedName}] Update opMode: ` +
                `${JSON.stringify(opModetoJson(this.opMode.value as OpMode))}`);
        }
        return this.opMode.value as OpMode;
    }

    /**
     * get JSON overview about service and its state, opMode, strategies, strategyParameters and controlEnable
     * @returns {Promise<ServiceInterface>}
     */
    public async getOverview(): Promise<ServiceInterface> {
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
            strategies,
            currentStrategy: currentStrategy.name,
            parameters: params,
            controlEnable,
            lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000
        };
    }

    /**
     * Get all strategies for service with its current strategyParameters
     * @returns {Promise<StrategyInterface[]>}
     */
    public async getStrategies(): Promise<StrategyInterface[]> {
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
    public async getCurrentParameters(strategy?: Strategy): Promise<ParameterInterface[]> {
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
                if (param instanceof AnaView) {
                    value = param.V.value;
                    max = param.VSclMax.value;
                    min = param.VSclMin.value;
                    unit = param.VUnit.value;
                } else if (param instanceof ExtAnaOp) {
                    value = param.VRbk.value;
                    max = param.VMax.value;
                    min = param.VMin.value;
                    unit = param.VUnit.value;
                } else if (param instanceof DigView) {
                    value = param.V.value;
                    max = param.VSclMax.value;
                    min = param.VSclMin.value;
                    unit = param.VUnit.value;
                } else if (param instanceof ExtDigOp) {
                    value = param.VRbk.value;
                    max = param.VMax.value;
                    min = param.VMin.value;
                    unit = param.VUnit.value;
                } else if (param instanceof BinView) {
                    value = param.V.value;
                } else if (param instanceof ExtBinOp) {
                    value = param.VRbk.value;
                } else if (param instanceof StrView) {
                    value = param.Text.value;
                }
                if (unit) {
                    const unitItem = UNIT.find((item) => item.value === unit);
                    unit = unitItem.unit;
                }
                return {
                    name,
                    value,
                    max,
                    min,
                    unit,
                    readonly: param.interfaceClass === 'StrView',
                    type: interfaceClassToType[param.interfaceClass]
                };
            });
        }
        return await Promise.all(tasks);
    }

    /**
     * Set strategy and strategy parameters and execute a command for service on PEA
     * @param {ServiceCommand} command  command to be executed on PEA
     * @param {StrategyInterface}    strategy to be set on PEA
     * @param {Parameter[]|ParameterOptions[]} parameters     strategyParameters to be set on PEA
     * @returns {Promise<void>}
     */
    public async execute(command?: ServiceCommand, strategy?: Strategy, parameters?: Array<Parameter | ParameterOptions>): Promise<void> {
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
            strategy,
            command,
            parameter: await this.getCurrentParameters(strategy)
        });
        return result;
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
    public async setStrategyParameters(strategy?: Strategy | string, parameters?: Array<Parameter | ParameterOptions>): Promise<void> {
        // get strategy from input strategyParameters
        let strat: Strategy;
        if (!strategy) {
            strat = this.strategies.find((str) => str.default === true);
        } else if (typeof strategy === 'string') {
            strat = this.strategies.find((str) => str.name === strategy);
        } else {
            strat = strategy;
        }

        await this.setOperationMode();

        // set strategy
        this.logger.info(`[${this.qualifiedName}] Set strategy "${strat.name}" (ID=${strat.id})`);
        const nodeId = this.automaticMode ? this.strategy : this.strategyMan;
        const result = await this.parent.writeNode(nodeId,
            {
                dataType: DataType.UInt32,
                value: strat.id,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });

        // set strategy parameters
        if (parameters) {
            const params: Parameter[] = parameters.map((param) => {
                if (param instanceof Parameter) {
                    return param;
                } else {
                    return new Parameter(param, this, strat);
                }
            });
            const tasks = params.map((param: Parameter) => param.updateValueOnModule());
            const paramResults = await Promise.all(tasks);
            this.logger.trace(`[${this.qualifiedName}] Set Parameter Promises: ${JSON.stringify(paramResults)}`);
            this.listenToServiceParameters(params);
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
            const event = this.parent.listenToOpcUaNode(this.opMode);
            event.on('changed', function test(data) {
                if (testFunction(data.value)) {
                    event.removeListener('changed', test);
                    resolve();
                }
            });
        });
    }

    public async isCommandExecutable(command: ServiceCommand): Promise<boolean> {
        const controlEnable: ControlEnableInterface = await this.getControlEnable(true);
        this.logger.debug(`[${this.qualifiedName}] ControlEnable: ${JSON.stringify(controlEnable)}`);
        return controlEnable[command];
    }

    /**
     * Execute command by writing ControlOp/ControlExt
     *
     * @param {ServiceCommand} command
     * @returns {Promise<boolean>}
     */
    private async executeCommand(command: ServiceCommand): Promise<boolean> {
        const commandExecutable = await this.isCommandExecutable(command);
        if (!commandExecutable) {
            this.logger.info(`[${this.qualifiedName}] ControlOp does not allow ${command}`);
            throw new Error(`[${this.qualifiedName}] ControlOp does not allow command ${command}`);
        }
        let result;
        if (command === ServiceCommand.start) {
            result = this.start();
        } else if (command === ServiceCommand.stop) {
            result = this.stop();
        } else if (command === ServiceCommand.reset) {
            result = this.reset();
        } else if (command === ServiceCommand.complete) {
            result = this.complete();
        } else if (command === ServiceCommand.abort) {
            result = this.abort();
        } else if (command === ServiceCommand.unhold) {
            result = this.unhold();
        } else if (command === ServiceCommand.pause) {
            result = this.pause();
        } else if (command === ServiceCommand.resume) {
            result = this.resume();
        } else if (command === ServiceCommand.restart) {
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
        this.serviceParametersEventEmitters.forEach((listener) => listener.removeAllListeners());
    }

    /**
     * Write OpMode to service
     * @param {OpMode} opMode
     * @returns {boolean}
     */
    private async writeOpMode(opMode: OpMode): Promise<void> {
        this.logger.debug(`[${this.qualifiedName}] Write opMode ` +
            `(${this.opMode.namespace_index} - ${this.opMode.node_id}): ${opMode as number}`);
        const result = await this.parent.writeNode(this.opMode,
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });
        this.logger.debug(`[${this.qualifiedName}] Setting opMode ${JSON.stringify(result)}`);
        if (result.value !== 0) {
            this.logger.warn(`[${this.qualifiedName}] Error while setting opMode to ${opMode}: ` +
                `${JSON.stringify(result)}`);
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<void>}
     */
    private async setToAutomaticOperationMode(): Promise<void> {
        const opMode: OpMode = await this.getOpMode();
        this.logger.debug(`[${this.qualifiedName}] Current opMode = ${JSON.stringify(opModetoJson(opMode))}`);
        if (isOffState(this.opMode.value as OpMode)) {
            this.logger.info(`[${this.qualifiedName}] Go to Manual state`);
            this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
            this.logger.info(`[${this.qualifiedName}] in ManualMode`);
        }

        if (isManualState(this.opMode.value as OpMode)) {
            this.logger.info(`[${this.qualifiedName}] Go to Automatic state`);
            this.writeOpMode(OpMode.stateAutOp);
            await this.waitForOpModeToPassSpecificTest(isAutomaticState);
            this.logger.info(`[${this.qualifiedName}] in AutomaticMode`);
        }

        if (!isExtSource(this.opMode.value as OpMode)) {
            this.logger.info(`[${this.qualifiedName}] Go to External source`);
            this.writeOpMode(OpMode.srcExtOp);
            await this.waitForOpModeToPassSpecificTest(isExtSource);
            this.logger.info(`[${this.qualifiedName}] in ExtSource`);
        }
    }

    private async setToManualOperationMode(): Promise<void> {
        await this.getOpMode();
        if (!isManualState(this.opMode.value as OpMode)) {
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
