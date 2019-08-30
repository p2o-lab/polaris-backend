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
    OpModeInterface,
    ParameterInterface,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    ServiceOptions,
    StrategyInterface
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catService} from '../../config/logging';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {OpcUaDataItem} from '../dataAssembly/DataItem';
import {ServiceControl} from '../dataAssembly/ServiceControl';
import {Parameter} from '../recipe/Parameter';
import {BaseService, BaseServiceEvents} from './BaseService';
import {controlEnableToJson, OpMode, opModetoJson, ServiceControlEnable, ServiceMtpCommand, ServiceState} from './enum';
import {OpcUaConnection} from './OpcUaConnection';
import {Strategy} from './Strategy';

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
        return `${this._parentId}.${this.name}`;
    }

    public get controlEnable(): ControlEnableInterface {
        return controlEnableToJson(this.commandEnableNode.value as ServiceControlEnable);
    }

    public get state(): ServiceState {
        return this.statusNode.value as ServiceState;
    }

    public get lastStatusChange(): Date {
        return this.statusNode.timestamp;
    }

    public get defaultStrategy(): Strategy {
        return this.strategies.find((strategy) => strategy.defaultStrategy);
    }

    get opMode(): OpMode {
        return this.opModeNode.value as OpMode;
    }

    get opModeNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.OpMode;
    }

    get statusNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.State;
    }

    get currentStrategyNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.CurrentStrategy;
    }

    get strategyExtNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.StrategyExt;
    }

    get strategyManNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.StrategyMan;
    }

    get commandEnableNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.CommandEnable;
    }

    get commandExtNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.CommandExt;
    }

    get commandManNode(): OpcUaDataItem<number> {
        return this.serviceControl.communication.CommandMan;
    }

    public readonly eventEmitter: ServiceEmitter;
    public readonly strategies: Strategy[] = [];
    public readonly parameters: DataAssembly[] = [];
    public readonly processValuesIn: DataAssembly[] = [];
    public readonly processValuesOut: DataAssembly[] = [];
    public readonly reportParameters: DataAssembly[] = [];
    public readonly connection: OpcUaConnection;
    // use ControlExt (true) or ControlOp (false)
    public readonly automaticMode: boolean;
    public readonly serviceControl: ServiceControl;
    private readonly logger: Category;
    private serviceParametersEventEmitters: EventEmitter[];
    private _parentId: string;

    constructor(serviceOptions: ServiceOptions, connection: OpcUaConnection, parentId: string) {
        super();
        this._parentId = parentId;
        this._name = serviceOptions.name;
        if (!serviceOptions.name) {
            throw new Error('No service name provided');
        }

        this.automaticMode = true;
        this.connection = connection;
        this.serviceParametersEventEmitters = [];

        this._lastStatusChange = new Date();
        this.logger = catService;

        this.serviceControl = new ServiceControl(
            {name: this._name, interface_class: 'ServiceControl', communication: serviceOptions.communication},
            connection);
        this.checkServiceControl();

        this.strategies = serviceOptions.strategies
            .map((option) => new Strategy(option, connection));

        if (serviceOptions.parameters) {
            this.parameters = serviceOptions.parameters
                .map((options) => DataAssemblyFactory.create(options, connection));
        }
        if (serviceOptions.processValuesIn) {
            this.processValuesIn = serviceOptions.processValuesIn
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, connection));
        }
        if (serviceOptions.processValuesOut) {
            this.processValuesOut = serviceOptions.processValuesOut
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, connection));
        }
        if (serviceOptions.reportParameters) {
            this.reportParameters = serviceOptions.reportParameters
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, connection));
        }
    }

    /**
     * Get current strategy from internal memory.
     */
    public getCurrentStrategy(): Strategy {
        return this.strategies.find((strat) => parseInt(strat.id, 10) === this.currentStrategyNode.value);
    }

    /**
     * Notify about changes in to serviceControl, strategies, configuration parameters and process values
     * via events and log messages
     */
    public async subscribeToService(): Promise<ServiceEmitter> {
        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        this.serviceControl
            .on('CommandEnable', () => {
                this.logger.info(`[${this.qualifiedName}] ControlEnable changed: ` +
                    `${JSON.stringify(this.controlEnable)}`);
                this.eventEmitter.emit('controlEnable', this.controlEnable);
            })
            .on('CommandExt', () => {
                this.logger.debug(`[${this.qualifiedName}] CommandExt changed: ` +
                    `${ServiceMtpCommand[this.commandExtNode.value as ServiceMtpCommand]}`);
            })
            .on('CommandMan', () => {
                this.logger.debug(`[${this.qualifiedName}] CommandMan changed: ` +
                    `${ServiceMtpCommand[this.commandManNode.value as ServiceMtpCommand]}`);
            })
            .on('CurrentStrategy', () => {
                this.logger.debug(`[${this.qualifiedName}] Current Strategy changed: ` +
                    `${this.currentStrategyNode.value}`);
            })
            .on('OpMode', () => {
                this.logger.info(`[${this.qualifiedName}] Current OpMode changed: ${this.opModeNode.value}`);
                this.eventEmitter.emit('opMode', opModetoJson(this.opMode));
            })
            .on('State', () => {
                this.logger.info(`[${this.qualifiedName}] State changed: ` +
                    `${ServiceState[this.statusNode.value as ServiceState]}`);
                this.eventEmitter.emit('state', {
                    state: this.state,
                    timestamp: this.lastStatusChange
                });
                if (this.state === ServiceState.COMPLETED ||
                    this.state === ServiceState.ABORTED ||
                    this.state === ServiceState.STOPPED) {
                    this.clearListeners();
                }
            });
        const tasks = [];
        tasks.push(await this.serviceControl.subscribe(50));

        tasks.concat(
            this.parameters.map(async (param) => (await param.subscribe())
                .on('V', (data) => {
                    this.eventEmitter.emit('variableChanged', {
                        parameter: param.name,
                        value: data,
                        unit: param.getUnit()
                    });
                })),
            this.processValuesIn.map(async (param) => (await param.subscribe())
                .on('V', (data) => {
                    this.eventEmitter.emit('variableChanged', {
                        parameter: param.name,
                        value: data,
                        unit: param.getUnit()
                    });
                })),
            this.processValuesOut.map(async (param) => (await param.subscribe())
                .on('V', (data) => {
                    this.eventEmitter.emit('variableChanged', {
                        parameter: param.name,
                        value: data,
                        unit: param.getUnit()
                    });
                })),
            this.strategies.map(async (strategy) => (await strategy.subscribe())
                .on('parameterChanged', (data) => {
                    this.eventEmitter.emit('parameterChanged', {
                        strategy,
                        parameter: data.parameter.name,
                        value: data.value,
                        unit: data.parameter.getUnit()
                    });
                })
            ));
        await Promise.all(tasks);
        return this.eventEmitter;
    }

    /**
     * get JSON overview about service and its state, opMode, strategies, parameters and controlEnable
     */
    public getOverview(): ServiceInterface {
        const strategies = this.getStrategies();
        const params = this.getCurrentParameters();
        const currentStrategy = this.getCurrentStrategy();
        return {
            name: this.name,
            opMode: opModetoJson(this.opMode),
            status: ServiceState[this.state],
            strategies: strategies,
            currentStrategy: currentStrategy ? currentStrategy.name : null,
            parameters: params,
            processValuesIn: [],
            processValuesOut: [],
            reportParameters: [],
            controlEnable: this.controlEnable,
            lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000
        };
    }

    /**
     * Get all strategies for service with its current strategyParameters
     */
    public getStrategies(): StrategyInterface[] {
        return this.strategies.map((strategy) => {
            return {
                id: strategy.id,
                name: strategy.name,
                default: strategy.defaultStrategy,
                sc: strategy.selfCompleting,
                parameters: this.getCurrentParameters(strategy)
            };
        });
    }

    /** get current parameters
     * from strategy or service (if strategy is undefined)
     * @param {Strategy} strategy
     */
    public getCurrentParameters(strategy?: Strategy): ParameterInterface[] {
        let params: DataAssembly[] = [];
        if (strategy) {
            params = strategy.parameters;
        } else {
            params = this.parameters;
        }
        let paramInterface = [];
        if (params) {
            paramInterface = params.map((param) => param.toJson());
        }
        return paramInterface;
    }

    /**
     * Set strategy and strategy parameters and execute a command for service on PEA
     * @param {ServiceCommand} command  command to be executed on PEA
     * @param {Strategy}    strategy  strategy to be set on PEA
     * @param {Parameter[]|ParameterOptions[]} parameters     strategyParameters to be set on PEA
     * @returns {Promise<void>}
     */
    public async execute(command?: ServiceCommand,
                         strategy?: Strategy,
                         parameters?: Array<Parameter | ParameterOptions>): Promise<void> {
        if (!this.connection.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Execute ${command} (${strategy ? strategy.name : ''})`);
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
            strategy: strategy,
            command: command,
            parameter: this.getCurrentParameters(strategy)
        });
    }

    // overridden method from Base Service
    public start() {
        return this.sendCommand(ServiceMtpCommand.START);
    }

    public restart() {
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    public stop() {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    public reset() {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    public complete() {
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    public abort() {
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    public unhold() {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    public pause() {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    public resume() {
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
            strat = this.defaultStrategy;
        } else if (typeof strategy === 'string') {
            strat = this.strategies.find((strati) => strati.name === strategy);
        } else {
            strat = strategy;
        }

        // first set opMode and then set strategy
        await this.setOperationMode();
        const node = this.automaticMode ?
            this.serviceControl.communication.StrategyExt : this.serviceControl.communication.StrategyMan;
        await node.write(strat.id);
        if (parameters) {
            this.setParameters(parameters);
        }
    }

    /** Set both service parameter and strategy parameter
     *
     * @param parameters
     */
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
            return this.serviceControl.setToAutomaticOperationMode();
        } else {
            return this.serviceControl.setToManualOperationMode();
        }
    }

    public async waitForOpModeToPassSpecificTest(testFunction: (opMode: OpMode) => boolean) {
        return this.serviceControl.waitForOpModeToPassSpecificTest(testFunction);
    }

    private listenToServiceParameters(parameters: Parameter[]) {
        parameters.forEach((param) => {
            if (param.continuous) {
                const listener: EventEmitter = param.listenToParameter();
                listener.on('changed', () => param.updateValueOnModule());
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

    private async sendCommand(command: ServiceMtpCommand) {
        this.logger.info(`[${this.qualifiedName}] Send command ${ServiceMtpCommand[command]}`);
        await this.setOperationMode();

        const node = this.automaticMode ? this.commandExtNode : this.commandManNode;
        await node.write(command);
        this.logger.info(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written`);
    }

    private checkServiceControl() {
        if (!this.opModeNode) {
            throw new Error(`No OpMode variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.statusNode) {
            throw new Error(`No status variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.commandEnableNode) {
            throw new Error(`No commandEnable variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.commandExtNode) {
            throw new Error(`No commandExt variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.commandManNode) {
            throw new Error(`No commandMan variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.strategyExtNode) {
            throw new Error(`No strategyExt variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.strategyManNode) {
            throw new Error(`No strategyMan variable in service ${this.qualifiedName} during parsing`);
        }

        if (!this.currentStrategyNode) {
            throw new Error(`No currentStrategy variable in service ${this.name} during parsing`);
        }
    }
}
