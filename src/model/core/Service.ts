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
import {
    controlEnableToJson,
    OpMode,
    opModetoJson,
    ServiceControlEnable,
    ServiceMtpCommand,
    ServiceState
} from './enum';
import {Module} from './Module';
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
        return `${this.module.id}.${this.name}`;
    }

    public get controlEnable(): ControlEnableInterface {
        return controlEnableToJson(this.commandEnableNode.value as ServiceControlEnable);
    }

    public get state(): ServiceState {
        return this.statusNode.value as ServiceState;
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

    /** strategies of the service */
    public readonly strategies: Strategy[] = [];
    /** service configuration configuration parameters */
    public readonly parameters: DataAssembly[] = [];
    public readonly processValuesIn: DataAssembly[] = [];
    public readonly processValuesOut: DataAssembly[] = [];
    public readonly reportParameters: DataAssembly[] = [];
    /** [Module] of the service */
    public readonly module: Module;
    // use ControlExt (true) or ControlOp (false)
    public readonly automaticMode: boolean;

    public readonly serviceControl: ServiceControl;

    private readonly logger: Category;
    private serviceParametersEventEmitters: EventEmitter[];

    constructor(serviceOptions: ServiceOptions, module: Module) {
        super();
        this._name = serviceOptions.name;
        if (!serviceOptions.name) {
            throw new Error('No service name provided');
        }

        this.automaticMode = true;
        this.module = module;
        this.serviceParametersEventEmitters = [];

        this._lastStatusChange = new Date();
        this.logger = catService;

        this.serviceControl = new ServiceControl(
            {name: this._name, interface_class: 'ServiceControl', communication: serviceOptions.communication},
            module);

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

        this.strategies = serviceOptions.strategies
            .map((option) => new Strategy(option, module));

        if (serviceOptions.parameters) {
            this.parameters = serviceOptions.parameters
                .map((options) => DataAssemblyFactory.create(options, module));
        }

        if (serviceOptions.processValuesIn) {
            this.processValuesIn = serviceOptions.processValuesIn
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, module));
        }
        if (serviceOptions.processValuesOut) {
            this.processValuesOut = serviceOptions.processValuesOut
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, module));
        }
        if (serviceOptions.reportParameters) {
            this.reportParameters = serviceOptions.reportParameters
                .map((pvOptions) => DataAssemblyFactory.create(pvOptions, module));
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
        this.serviceControl
            .on('CommandEnable', () => {
                this.logger.info(`[${this.qualifiedName}] ControlEnable changed: ` +
                    `${JSON.stringify(this.controlEnable)}`);
                this.eventEmitter.emit('controlEnable', this.controlEnable);
            })
            .on('CommandExt', () => {
                this.logger.info(`[${this.qualifiedName}] CommandExt changed: ` +
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
                this._lastStatusChange = new Date();
                this.logger.info(`[${this.qualifiedName}] State changed: ` +
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
        await this.serviceControl.subscribe(50);

        this.parameters.forEach(async (param) => (await param.subscribe())
            .on('V', (data) => {
                this.eventEmitter.emit('variableChanged', {parameter: param.name, value: data, unit: param.getUnit()});
            }));
        this.processValuesIn.forEach(async (param) => (await param.subscribe())
            .on('V', (data) => {
                this.eventEmitter.emit('variableChanged', {parameter: param.name, value: data, unit: param.getUnit()});
            }));
        this.processValuesOut.forEach(async (param) => (await param.subscribe())
            .on('V', (data) => {
                this.eventEmitter.emit('variableChanged', {parameter: param.name, value: data, unit: param.getUnit()});
            }));
        await Promise.all(
            this.strategies.map(async (strategy) => (await strategy.subscribe())
                .on('parameterChanged', (data) => {
                    this.eventEmitter.emit('parameterChanged', {
                        strategy,
                        parameter: data.parameter.name,
                        value: data.value,
                        unit: data.parameter.getUnit()
                    });
                })
            )
        );
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
            processValuesIn: [],
            processValuesOut: [],
            reportParameters: [],
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
            tasks = params.map(async (param) => param.toJson());
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
    public async execute(command?: ServiceCommand,
                         strategy?: Strategy,
                         parameters?: Array<Parameter | ParameterOptions>): Promise<void> {
        if (!this.module.isConnected()) {
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
        const nodeId = this.automaticMode ?
            this.serviceControl.communication.StrategyExt : this.serviceControl.communication.StrategyMan;
        await this.module.writeNode(nodeId, strat.id);
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

    private async sendCommand(command: ServiceMtpCommand): Promise<boolean> {
        if (!this.module.isConnected()) {
            throw new Error('Module is not connected');
        }
        this.logger.info(`[${this.qualifiedName}] Send command ${ServiceMtpCommand[command]}`);
        await this.setOperationMode();

        const result =
            await this.module.writeNode(this.automaticMode ? this.commandExtNode : this.commandManNode, command);
        this.logger.info(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written: ${result.name}`);

        return result.value === 0;
    }

}
