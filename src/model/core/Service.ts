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
    ControlEnableInterface, OperationMode,
    ParameterOptions,
    ServiceCommand,
    ServiceInterface,
    ServiceOptions, SourceMode
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catService} from '../../logging/logging';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {ServiceControl} from '../dataAssembly/ServiceControl';
import {WritableDataAssembly} from '../dataAssembly/WritableDataAssembly';
import {BaseService, BaseServiceEvents} from './BaseService';
import {controlEnableToJson, ServiceControlEnable, ServiceMtpCommand, ServiceState} from './enum';
import {Module} from './Module';
import {OpcUaConnection} from './OpcUaConnection';
import {Procedure} from './Procedure';

/**
 * Events emitted by [[Service]]
 */
interface ServiceEvents extends BaseServiceEvents {
    opMode: {
        operationMode: OperationMode,
        sourceMode: SourceMode
    };
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
        return controlEnableToJson(this.serviceControl.communication.CommandEnable.value as ServiceControlEnable);
    }

    public get state(): ServiceState {
        return this.serviceControl.communication.State.value as ServiceState;
    }

    public get lastStatusChange(): Date {
        return this.serviceControl.communication.State.timestamp;
    }

    public get currentProcedure() {
        return this.serviceControl.communication.CurrentStrategy.value;
    }

    public readonly eventEmitter: ServiceEmitter;
    public readonly procedures: Procedure[] = [];
    public readonly parameters: WritableDataAssembly[] = [];
    public readonly connection: OpcUaConnection;
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
        this.connection = connection;
        this.serviceParametersEventEmitters = [];

        this._lastStatusChange = new Date();
        this.logger = catService;

        this.serviceControl = new ServiceControl(
            {name: this._name, interface_class: 'ServiceControl', communication: serviceOptions.communication},
            connection);

        this.procedures = serviceOptions.strategies
            .map((option) => new Procedure(option, connection));

        if (serviceOptions.parameters) {
            this.parameters = serviceOptions.parameters
                .map((options) => DataAssemblyFactory.create(options, connection) as WritableDataAssembly);
        }
    }

    public getDefaultProcedure(): Procedure {
        return this.procedures.find((procedure) => procedure.defaultProcedure);
    }

    /**
     * Get current procedure from internal memory.
     */
    public getCurrentProcedure(): Procedure {
        return this.procedures.find((proc) => parseInt(proc.id, 10) === this.currentProcedure);
    }

    /**
     * Notify about changes in to serviceControl, procedures, configuration parameters and process values
     * via events and log messages
     */
    public async subscribeToService(): Promise<ServiceEmitter> {
        this.logger.info(`[${this.qualifiedName}] Subscribe to service`);
        this.serviceControl
            .on('CommandEnable', () => {
                this.logger.debug(`[${this.qualifiedName}] ControlEnable changed: ` +
                    `${JSON.stringify(this.controlEnable)}`);
                this.eventEmitter.emit('controlEnable', this.controlEnable);
            })
            .on('OpMode', () => {
                this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ` +
                    `${this.serviceControl.getOperationMode()}`);
                this.eventEmitter.emit('opMode',
                    {
                        operationMode: this.serviceControl.getOperationMode(),
                        sourceMode: this.serviceControl.getSourceMode()
                    });
            })
            .on('State', () => {
                this.logger.debug(`[${this.qualifiedName}] State changed: ` +
                    `${ServiceState[this.state]}`);
                this.eventEmitter.emit('state', this.state);
                if (this.state === ServiceState.COMPLETED ||
                    this.state === ServiceState.ABORTED ||
                    this.state === ServiceState.STOPPED) {
                    this.clearListeners();
                }
            });
        const tasks = [];
        tasks.push(this.serviceControl.subscribe(50));

        tasks.concat(
            this.parameters.map((param) => {
                return param.subscribe();
            }),
            this.procedures.map((procedure) => {
                procedure.on('parameterChanged', (data) => {
                    this.eventEmitter.emit('parameterChanged', {
                        procedure,
                        parameter: data.parameter,
                        parameterType: data.parameterType
                    });
                });
                return procedure.subscribe();
            }));
        await Promise.all(tasks);
        return this.eventEmitter;
    }

    public unsubscribe() {
        this.serviceControl.unsubscribe();
        this.parameters.forEach((param) => param.unsubscribe());
        this.procedures.forEach((procedure) => procedure.unsubscribe());
    }

    /**
     * get JSON overview about service and its state, opMode, procedures, parameters and controlEnable
     */
    public json(): ServiceInterface {
        const currentProcedure = this.getCurrentProcedure();
        return {
            name: this.name,
            operationMode: this.serviceControl.getOperationMode(),
            sourceMode: this.serviceControl.getSourceMode(),
            status: ServiceState[this.state],
            strategies: this.procedures.map((procedure) => procedure.toJson()),
            currentStrategy: currentProcedure ? currentProcedure.name : null,
            parameters: this.parameters.map((param) => param.toJson()),
            controlEnable: this.controlEnable,
            lastChange: this.lastStatusChange ?
                (new Date().getTime() - this.lastStatusChange.getTime()) / 1000 :
                undefined
        };
    }

    // overridden method from Base Service
    public async executeCommand(command: ServiceCommand) {
        if (!this.connection.isConnected()) {
            throw new Error('Module is not connected');
        }
        await super.executeCommand(command);
        const currentProcedure = this.getCurrentProcedure();
        this.eventEmitter.emit('commandExecuted', {
            procedure: currentProcedure,
            command: command,
            parameter: currentProcedure.parameters.map((param) => param.toJson())
        });
        this.logger.info(`[${this.qualifiedName}] ${command} executed`);
        }

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

    /** Set procedure
     * Use default procedure if procedure is omitted
     * @returns {Promise<void>}
     */

    public async setProcedure(procedure: Procedure): Promise<void> {
        this.logger.debug(`[${this.qualifiedName}] set procedure: ${procedure.name}`);

        // first set opMode and then set procedure
        await this.setOperationMode();
        await this.serviceControl.communication.StrategyExt.write(procedure.id);
    }

    public getProcedureByNameOrDefault(procedureName: string) {
        let procedure: Procedure;
        if (!procedureName) {
            procedure = this.getDefaultProcedure();
        } else {
            procedure = this.procedures.find((proc) => proc.name === procedureName);
        }
        return procedure;
    }

    public async setParameters(parameterOptions: ParameterOptions[], modules: Module[] = []) {
        parameterOptions.map((p) => {
            const dataAssembly = this.findInputParameter(p.name);
            dataAssembly.setValue(p, modules);
        });
    }

    public async setOperationMode() {
        await this.serviceControl.setToAutomaticOperationMode();
        await this.serviceControl.setToExternalSourceMode();
    }

    public findInputParameter(parameterName: string): WritableDataAssembly {
        const parameterList = [].concat(
            this.parameters,
            this.getCurrentProcedure().parameters,
            this.getCurrentProcedure().processValuesIn
        );
        return parameterList.find((obj) => (obj.name === parameterName));
    }

    /**
     *
     */
    private clearListeners() {
        this.logger.info(`[${this.qualifiedName}] clear parameter listener`);
        this.serviceParametersEventEmitters.forEach((listener) => listener.removeAllListeners());
    }

    private async sendCommand(command: ServiceMtpCommand) {
        this.logger.debug(`[${this.qualifiedName}] Send command ${ServiceMtpCommand[command]}`);
        await this.setOperationMode();

        await this.serviceControl.communication.CommandExt.write(command);
        this.logger.trace(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written`);
    }

}
