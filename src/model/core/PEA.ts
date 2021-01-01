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

import {catModule} from '@/logging/logging';
import {
    ControlEnableInterface,
    ModuleInterface,
    ModuleOptions, OperationMode,
    ParameterInterface,
    ServiceCommand,
    ServiceInterface, SourceMode,
    VariableChange
} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {DataAssembly} from '../dataAssembly/DataAssembly';
import {DataAssemblyFactory} from '../dataAssembly/DataAssemblyFactory';
import {DataItemEmitter} from '../dataAssembly/DataItem';
import {ServiceState} from 'src/model/dataAssembly/enum';
import {OpcUaConnection} from 'src/model/connection/OpcUaConnection';
import {Procedure} from './Procedure';
import {Service} from './Service';

export interface ParameterChange {
    timestampPEA: Date;
    service: Service;
    procedure: string;
    parameter: string;
    value: any;
    unit: string;
    parameterType: 'parameter' | 'processValueIn' | 'processValueOut' | 'reportValue';
}

/**
 * Events emitted by [[PEA]]
 */
interface PEAEvents {
    /**
     * when POL successfully connects to PEA
     * @event connected
     */
    connected: void;
    /**
     * when POL is disconnected from PEA
     * @event disconnected
     */
    disconnected: void;
    /**
     * when controlEnable of one service changes
     * @event controlEnable
     */
    controlEnable: { service: Service, controlEnable: ControlEnableInterface };
    /**
     * Notify when a service changes its state
     * @event stateChanged
     */
    stateChanged: {
        service: Service,
        state: ServiceState
    };
    /**
     * Notify when a service changes its opMode
     * @event opModeChanged
     */
    opModeChanged: {
        service: Service,
        operationMode: OperationMode,
        sourceMode: SourceMode
    };
    /**
     * Notify when a variable inside a PEA changes
     * @event variableChanged
     */
    variableChanged: VariableChange;

    /**
     * Notify when a parameter changes
     * @event parameterChanged
     */
    parameterChanged: ParameterChange;

    /**
     * whenever a command is executed from the POL
     * @event commandExecuted
     */
    commandExecuted: {
        service: Service,
        procedure: Procedure,
        command: ServiceCommand,
        parameter: ParameterInterface[]
    };

    /**
     * when one service goes to *completed*
     * @event serviceCompleted
     */
    serviceCompleted: Service;
}

type PEAEmitter = StrictEventEmitter<EventEmitter, PEAEvents>;

/**
 * PEA (PEA) with its services and variables
 *
 * in order to interact with a PEA, you must first [[connect]] to it
 *
 */
export class PEA extends (EventEmitter as new() => PEAEmitter) {

    public readonly options: ModuleOptions;
    public readonly id: string;
    public readonly services: Service[];
    public readonly variables: DataAssembly[];
    // PEA is protected and can't be deleted by the user
    public protected: boolean = false;
    public readonly connection: OpcUaConnection;

    private readonly description: string;
    private readonly hmiUrl: string;
    private readonly logger: Category;

    constructor(options: ModuleOptions, protectedPEA: boolean = false) {
        super();
        this.options = options;
        this.id = options.id;
        this.description = options.description;
        this.protected = protectedPEA;
        this.hmiUrl = options.hmi_url;
        this.connection = new OpcUaConnection(this.id, options.opcua_server_url, options.username, options.password)
            .on('connected', () => this.emit('connected'))
            .on('disconnected', () => this.emit('disconnected'));
        this.logger = catModule;

        if (options.services) {
            this.services = options.services.map((serviceOpts) => new Service(serviceOpts, this.connection, this.id));
        }
        if (options.process_values) {
            this.variables = options.process_values
                .map((variableOptions) => DataAssemblyFactory.create(variableOptions, this.connection));
        }
    }

    public getService(serviceName: string): Service {
        const service = this.services.find((s) => s.name === serviceName);
        if (service) {
            return service;
        } else if (!serviceName && this.services.length === 1) {
            return this.services[0];
        } else {
            throw new Error(`[${this.id}] Could not find service with name ${serviceName}`);
        }
    }

    public getServiceStates(): ServiceInterface[] {
        this.logger.trace(`[${this.id}] check service states`);
        return this.services.map((service) => service.json());
    }

    public async connect() {
        await this.connection.connect();
        await this.subscribeToAllVariables();
        await this.subscribeToAllServices();
        this.logger.info(`[${this.id}] Successfully subscribed to ${this.connection.monitoredItemSize()} assemblies`);
    }

    /**
     * Close session and disconnect from PEA
     *
     */
    public async disconnect(): Promise<void> {
        this.logger.info(`[${this.id}] Disconnect PEA`);
        await this.unsubscribeFromAllVariables();
        await this.unsubscribeFromAllServices();
        this.services.forEach((s) => s.unsubscribe());
        await this.connection.disconnect();
        this.emit('disconnected');
        this.logger.info(`[${this.id}] PEA disconnected`);
    }

    /**
     * Get JSON serialisation of PEA
     */
    public json(): ModuleInterface {
        return {
            id: this.id,
            description: this.description,
            endpoint: this.connection.endpoint,
            hmiUrl: this.hmiUrl,
            connected: this.isConnected(),
            services: this.getServiceStates(),
            process_values: [],
            protected: this.protected
        };
    }

    /**
     * is POL connected to PEA
     * @returns {boolean}
     */
    public isConnected(): boolean {
        return this.connection.isConnected();
    }

    public listenToDataAssembly(dataAssemblyName: string, variableName: string): DataItemEmitter {
        const dataAssembly: DataAssembly = this.variables.find((variable) => variable.name === dataAssemblyName);
        if (!dataAssembly) {
            throw new Error(`ProcessValue ${dataAssemblyName} is not specified for PEA ${this.id}`);
        }
        const emitter: EventEmitter = new EventEmitter();
        dataAssembly.on(variableName, (data) => emitter.emit('changed', data));
        return emitter;
    }

    /**
     * Abort all services in PEA
     */
    public abort(): Promise<void[]> {
        this.logger.info(`[${this.id}] Abort all services`);
        const tasks = this.services.map((service) => service.executeCommand(ServiceCommand.abort));
        return Promise.all(tasks);
    }

    /**
     * Pause all services in PEA which are currently running
     */
    public pause(): Promise<void[]> {
        this.logger.info(`[${this.id}] Pause all running services`);
        const tasks = this.services.map((service) => {
            if (service.isCommandExecutable(ServiceCommand.pause)) {
                return service.executeCommand(ServiceCommand.pause);
            }
        });
        return Promise.all(tasks);
    }

    /**
     * Resume all services in PEA which are currently paused
     */
    public resume(): Promise<void[]> {
        this.logger.info(`[${this.id}] Resume all paused services`);
        const tasks = this.services.map((service) => {
            if (service.isCommandExecutable(ServiceCommand.resume)) {
                return service.executeCommand(ServiceCommand.resume);
            }
        });
        return Promise.all(tasks);
    }

    /**
     * Stop all non-idle services in PEA
     */
    public stop(): Promise<void[]> {
        this.logger.info(`[${this.id}] Stop all non-idle services`);
        const tasks = this.services.map((service) => {
            if (service.isCommandExecutable(ServiceCommand.stop)) {
                return service.executeCommand(ServiceCommand.stop);
            }
        });
        return Promise.all(tasks);
    }

    /**
     * Reset all services in PEA
     */
    public reset(): Promise<void[]> {
        this.logger.info(`[${this.id}] Reset all services`);
        const tasks = this.services.map((service) => service.executeCommand(ServiceCommand.reset));
        return Promise.all(tasks);
    }

    private subscribeToAllVariables(): Promise<DataAssembly[]> {
        return Promise.all(
            this.variables.map((variable: DataAssembly) => {
                catModule.debug(`[${this.id}] subscribe to process variable ${variable.name}`);
                variable.on('V', (data) => {
                    this.logger.debug(`[${this.id}] variable changed: ${JSON.stringify(variable.toJson())}`);
                    const entry: VariableChange = {
                        timestampPfe: new Date(),
                        timestampModule: data.timestamp,
                        module: this.id,
                        variable: variable.name,
                        value: data.value,
                        unit: variable.toJson().unit
                    };
                    this.emit('variableChanged', entry);
                });
                return variable.subscribe(1000);
            })
        );
    }

    private unsubscribeFromAllVariables() {
        this.variables.forEach((variable: DataAssembly) => variable.unsubscribe());
    }

    private subscribeToAllServices() {
        return Promise.all(this.services.map((service) => {
            service.eventEmitter
                .on('commandExecuted', (data) => {
                    this.emit('commandExecuted', {
                        service,
                        procedure: data.procedure,
                        command: data.command,
                        parameter: data.parameter
                    });
                })
                .on('controlEnable', (controlEnable: ControlEnableInterface) => {
                    this.emit('controlEnable', {service, controlEnable});
                })
                .on('state', (state) => {
                    this.logger.debug(`[${this.id}] state changed: ${service.name} = ${ServiceState[state]}`);
                    const entry = {
                        timestampPfe: new Date(),
                        timestampModule: service.lastStatusChange,
                        service: service,
                        state: state
                    };
                    this.emit('stateChanged', entry);
                    if (state === ServiceState.COMPLETED) {
                        this.emit('serviceCompleted', service);
                    }
                })
                .on('opMode', (opMode) => {
                    this.logger.debug(`[${this.id}] opMode changed: ${service.name} = ${JSON.stringify(opMode)}`);
                    this.emit('opModeChanged', {service: service, ...opMode});
                })
                .on('parameterChanged', (data) => {
                    this.logger.debug(`[${this.id}] parameter changed: ` +
                        `${data.procedure.name}.${data.parameter} = ${data.parameter.value}`);
                    const entry: ParameterChange = {
                        timestampPEA: data.parameter.timestamp,
                        service: service,
                        procedure: data.procedure.id,
                        parameter: data.parameter.name,
                        value: data.parameter.value,
                        unit: data.parameter.unit,
                        parameterType: data.parameterType
                    };
                    this.emit('parameterChanged', entry);
                });
            return service.subscribeToService();
        }));
    }

    private unsubscribeFromAllServices() {
        this.services.forEach((service) => service.unsubscribe());
    }

}
