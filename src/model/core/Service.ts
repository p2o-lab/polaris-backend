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
    OpcUaNodeOptions,
    OpModeInterface,
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    ServiceOptions,
    StrategyInterface
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {DataType, VariantArrayType} from 'node-opcua';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catService} from '../../config/logging';
import {ExtAnaOp} from '../dataAssembly/AnaOp';
import {AnaView} from '../dataAssembly/AnaView';
import {ExtBinOp} from '../dataAssembly/BinOp';
import {BinView} from '../dataAssembly/BinView';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {ExtDigOp} from '../dataAssembly/DigOp';
import {DigView} from '../dataAssembly/DigView';
import {StrView} from '../dataAssembly/Str';
import {Parameter} from '../recipe/Parameter';
import {BaseService, BaseServiceEvents} from './BaseService';
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
import {Strategy} from './Strategy';
import {UNIT} from './Unit';

const interfaceClassToType = {
    'StrView': 'string',
    'AnaView': 'string',
    'ExtAnaOp': 'number',
    'ExtDigOp': 'number'
};

/**
 * Events emitted by [[Service]]
 */
interface ServiceEvents extends BaseServiceEvents {
    opMode: OpModeInterface;
}

type ServiceEmitter = StrictEventEmitter<EventEmitter, ServiceEvents>;

/**
 * Service of a [[Module]]
 *
 * after connection to a real PEA, commands can be triggered and states can be retrieved
 *
 */
export class Service extends BaseService {

    public get qualifiedName() {
        return `${this.parent.id}.${this.name}`;
    }

    get opMode(): OpMode {
        return this.opModeNode.value as OpMode;
    }

    public readonly eventEmitter: ServiceEmitter;

    /** strategies of the service */
    public readonly strategies: Strategy[];
    /** service configuration configuration parameters */
    public readonly parameters: DataAssembly[];
    /** [Module] of the service */
    public readonly parent: Module;
    // use ControlExt (true) or ControlOp (false)
    public readonly automaticMode: boolean;

    /** OPC UA node of command/controlOp variable */
    private readonly commandNode: OpcUaNodeOptions;
    private readonly commandManNode: OpcUaNodeOptions;
    /** OPC UA node of status variable */
    private readonly statusNode: OpcUaNodeOptions;
    /** OPC UA node of controlEnable variable */
    private readonly controlEnableNode: OpcUaNodeOptions;
    /** OPC UA node of opMode variable */
    private readonly opModeNode: OpcUaNodeOptions;
    /** OPC UA node of strategy variable */
    private readonly strategyNode: OpcUaNodeOptions;
    private readonly strategyManNode: OpcUaNodeOptions;
    /** OPC UA node of currentStrategy variable */
    private readonly currentStrategyNode: OpcUaNodeOptions;

    private readonly logger: Category;
    private serviceParametersEventEmitters: EventEmitter[];

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        super();
        this._name = serviceOptions.name;
        this.automaticMode = true;
        this.parent = parent;
        this.serviceParametersEventEmitters = [];

        this._lastStatusChange = new Date();
        this.logger = catService;

        const com = serviceOptions.communication;

        this.opModeNode = com.OpMode;
        if (!this.opModeNode) {
            throw new Error(`No opMode variable in service ${this.qualifiedName} during parsing`);
        }

        this.statusNode = com.State || com.CurrentState;
        if (!this.statusNode) {
            throw new Error(`No status variable in service ${this.qualifiedName} during parsing`);
        }

        this.controlEnableNode = com.ControlEnable || com.CommandEnable;
        if (!this.controlEnableNode) {
            throw new Error(`No controlEnable variable in service ${this.qualifiedName} during parsing`);
        }

        this.commandNode = com.ControlExt || com.CommandExt;
        if (!this.commandNode) {
            throw new Error(`No command variable in service ${this.qualifiedName} during parsing`);
        }

        this.commandManNode = com.ControlOp || com.CommandMan;
        if (!this.commandManNode) {
            throw new Error(`No commandMan variable in service ${this.qualifiedName} during parsing`);
        }

        this.strategyNode = com.StrategyExt;
        if (!this.strategyNode) {
            throw new Error(`No strategy variable in service ${this.qualifiedName} during parsing`);
        }

        this.strategyManNode = com.StrategyOp || com.StrategyMan;
        if (!this.strategyManNode) {
            throw new Error(`No strategyMan variable in service ${this.qualifiedName} during parsing`);
        }

        this.currentStrategyNode = com.CurrentStrategy;
        if (!this.currentStrategyNode) {
            throw new Error(`No currentStrategy variable in service ${this.name} during parsing`);
        }

        this.strategies = serviceOptions.strategies
            .map((option) => new Strategy(option, parent));
        if (serviceOptions.parameters) {
            this.parameters = serviceOptions.parameters
                .map((options) => DataAssemblyFactory.create(options, parent));
        }

    }

    /**
     * Get current strategy from internal memory.
     */
    public getCurrentStrategy(): Strategy {
        return this.strategies.find((strat) => parseInt(strat.id, 10) === this.currentStrategyNode.value);
    }

    /**
     * Listen to state, controlEnable, command, currentStrategy and opMode of service and emits specific events for them
     * resolves when at least state has its initial value
     *
     * @returns {Promise<ServiceEmitter>}
     */
    public async subscribeToService(): Promise<ServiceEmitter> {
        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        if (this.controlEnableNode) {
            this.parent.listenToOpcUaNode(this.controlEnableNode).on('changed', (data) => {
                this.controlEnableNode.value = data.value;
                this.controlEnableNode.timestamp = new Date();
                this._controlEnable = controlEnableToJson(this.controlEnableNode.value as ServiceControlEnable);
                this.logger.info(`[${this.qualifiedName}] ControlEnable changed: ` +
                    `${JSON.stringify(this.controlEnable)}`);
                this.eventEmitter.emit('controlEnable', this.controlEnable);
            });
        }
        if (this.commandNode) {
            this.parent.listenToOpcUaNode(this.commandNode).on('changed', (data) => {
                this.commandNode.value = data.value;
                this.commandNode.timestamp = new Date();
                this.logger.debug(`[${this.qualifiedName}] Command changed: ` +
                    `${ServiceMtpCommand[this.commandNode.value as ServiceMtpCommand]}`);
            });
        }
        if (this.commandManNode) {
            this.parent.listenToOpcUaNode(this.commandManNode).on('changed', (data) => {
                this.commandManNode.value = data.value;
                this.commandManNode.timestamp = new Date();
                this.logger.debug(`[${this.qualifiedName}] CommandMan changed: ` +
                    `${ServiceMtpCommand[this.commandManNode.value as ServiceMtpCommand]}`);
            });
        }
        if (this.currentStrategyNode) {
            this.parent.listenToOpcUaNode(this.currentStrategyNode).on('changed', (data) => {
                this.currentStrategyNode.value = data.value;
                this.currentStrategyNode.timestamp = new Date();
                this.logger.debug(`[${this.qualifiedName}] Current Strategy changed: ` +
                    `${this.currentStrategyNode.value}`);
            });
        }
        if (this.opModeNode) {
            this.parent.listenToOpcUaNode(this.opModeNode).on('changed', (data) => {
                this.opModeNode.value = data.value;
                this.opModeNode.timestamp = new Date();
                this.logger.info(`[${this.qualifiedName}] Current OpMode changed: ${this.opModeNode.value}`);
                this.eventEmitter.emit('opMode', opModetoJson(this.opMode));
            });
        }
        this.parameters.forEach((param) => param.subscribe()
            .on('V', (data) => {
                this.eventEmitter.emit('variableChanged', {parameter: param.name, value: data, unit: param.getUnit()});
            }));
        this.strategies.forEach((strategy) => strategy.subscribe()
            .on('processValueChanged', (data) => {
                    this.eventEmitter.emit('variableChanged', {
                        strategy,
                        parameter: data.processValue.name,
                        value: data.value,
                        unit: data.processValue.getUnit()
                    });
            })
            .on('parameterChanged', (data) => {
                this.eventEmitter.emit('parameterChanged', {
                    strategy,
                    parameter: data.parameter.name,
                    value: data.value,
                    unit: data.parameter.getUnit()
                });
            })
        );

        if (this.statusNode) {
            this.parent.listenToOpcUaNode(this.statusNode).on('changed', (data) => {
                this.statusNode.value = data.value;
                this.statusNode.timestamp = new Date();
                this._lastStatusChange = new Date();
                this._state = this.statusNode.value as ServiceState;
                this.logger.info(`[${this.qualifiedName}] Status changed: ` +
                    `${ServiceState[this.statusNode.value as ServiceState]}`);
                this.eventEmitter.emit('state', {
                    state: this.state,
                    timestamp: this.statusNode.timestamp
                });
                if (this.state === ServiceState.COMPLETED ||
                    this.state === ServiceState.ABORTED ||
                    this.state === ServiceState.STOPPED) {
                    this.clearListeners();
                }
            });
        }
        // wait until first update of state has been arrived
        await new Promise((resolve) => this.eventEmitter.once('state', resolve));
        return this.eventEmitter;
    }

    /**
     * get JSON overview about service and its state, opMode, strategies, parameters and controlEnable
     * @returns {Promise<ServiceInterface>}
     */
    public async getOverview(): Promise<ServiceInterface> {
        const strategies = await this.getStrategies();
        const params = await this.getCurrentParameters();
        const currentStrategy = this.getCurrentStrategy();
        return {
            name: this.name,
            opMode: opModetoJson(this.opMode),
            status: ServiceState[this.state],
            strategies,
            currentStrategy: currentStrategy ? currentStrategy.name : null,
            parameters: params,
            controlEnable: this.controlEnable,
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

    /** get current parameters
     * from strategy or service (if strategy is undefined)
     * @param {Strategy} strategy
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
     * @param {Strategy}    strategy  strategy to be set on PEA
     * @param {Parameter[]|ParameterOptions[]} parameters     strategyParameters to be set on PEA
     * @returns {Promise<void>}
     */
    public async execute(command?: ServiceCommand, strategy?: Strategy, parameters?: Array<Parameter|ParameterOptions>)
    : Promise<void> {
        if (!this.parent.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Execute ${command} (${ strategy ? strategy.name : '' })`);
        if (strategy) {
            await this.setStrategy(strategy);
        }
        if (!strategy) {
            strategy = await this.getCurrentStrategy();
        }
        if (command) {
            await this.executeCommand(command);
        }

        this.eventEmitter.emit('commandExecuted', {
            timestamp: new Date(),
            strategy,
            command,
            parameter: await this.getCurrentParameters(strategy)
        });
    }

    public start(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.START);
    }

    public restart(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    public stop(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    public reset(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    public complete(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    public abort(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    public unhold(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    public pause(): Promise<boolean> {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    public resume(): Promise<boolean> {
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
        if (!strategy) {
            strat = this.strategies.find((strati) => strati.default === true);
        } else if (typeof strategy === 'string') {
            strat = this.strategies.find((strati) => strati.name === strategy);
        } else {
            strat = strategy;
        }

        // first set opMode and then set strategy
        await this.setOperationMode();
        const nodeId = this.automaticMode ? this.strategyNode : this.strategyManNode;
        await this.parent.writeNode(nodeId,
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

    public async setParameters(parameters: Array<Parameter | ParameterOptions> = []): Promise<void> {
        const params: Parameter[] = await Promise.all(parameters.map(async (param) => {
            if (param instanceof Parameter) {
                return param;
            } else {
                const strat = await this.getCurrentStrategy();
                return new Parameter(param, this, strat);
            }
        }));
        const tasks = params.map((param: Parameter) => param.updateValueOnModule());
        const paramResults = await Promise.all(tasks);
        this.logger.trace(`[${this.qualifiedName}] Set Parameter Promises: ${JSON.stringify(paramResults)}`);
        await this.listenToServiceParameters(params);
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
            const event = this.parent.listenToOpcUaNode(this.opModeNode);
            event.on('changed', function test(data) {
                if (testFunction(data.value)) {
                    event.removeListener('changed', test);
                    resolve();
                }
            });
        });
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
        this.logger.debug(`[${this.qualifiedName}] Write opMode (${this.opModeNode.namespace_index} - ` +
            `${this.opModeNode.node_id}): ${opMode as number}`);
        const result = await this.parent.writeNode(this.opModeNode,
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
        this.logger.debug(`[${this.qualifiedName}] Current opMode = ${JSON.stringify(opModetoJson(this.opMode))}`);
        if (isOffState(this.opMode)) {
            this.logger.info(`[${this.qualifiedName}] Go to Manual state`);
            this.writeOpMode(OpMode.stateManOp);
            await this.waitForOpModeToPassSpecificTest(isManualState);
            this.logger.info(`[${this.qualifiedName}] in ManualMode`);
        }

        if (isManualState(this.opMode)) {
            this.logger.info(`[${this.qualifiedName}] Go to Automatic state`);
            this.writeOpMode(OpMode.stateAutOp);
            await this.waitForOpModeToPassSpecificTest(isAutomaticState);
            this.logger.info(`[${this.qualifiedName}] in AutomaticMode`);
        }

        if (!isExtSource(this.opMode)) {
            this.logger.info(`[${this.qualifiedName}] Go to External source`);
            this.writeOpMode(OpMode.srcExtOp);
            await this.waitForOpModeToPassSpecificTest(isExtSource);
            this.logger.info(`[${this.qualifiedName}] in ExtSource`);
        }
    }

    private async setToManualOperationMode(): Promise<void> {
        if (!isManualState(this.opMode)) {
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

        const result = await this.parent.writeNode(this.automaticMode ? this.commandNode : this.commandManNode,
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        this.logger.info(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written: ${result.name}`);

        return result.value === 0;
    }

}
