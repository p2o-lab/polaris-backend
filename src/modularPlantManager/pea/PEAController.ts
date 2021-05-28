/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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
	CommandEnableInterface, DataAssemblyOptions,
	OperationMode,
	ParameterInterface, PEAInterface, PEAOptions, ServerSettingsOptions,
	ServiceCommand,
	ServiceInterface, ServiceOptions, ServiceSourceMode,
	VariableChange
} from '@p2olab/polaris-interface';
import {DataItemEmitter, OpcUaConnection} from './connection';
import {DataAssemblyController, DataAssemblyControllerFactory, ServiceState} from './dataAssembly';
import {Procedure, Service} from './serviceSet';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catPEA} from '../../logging';

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
 * Events emitted by [[PEAController]]
 */
interface PEAEvents {
	/**
	 * when POL successfully connects to PEAController
	 * @event connected
	 */
	connected: void;
	/**
	 * when POL is disconnected from PEAController
	 * @event disconnected
	 */
	disconnected: void;
	/**
	 * when commandEnable of one service changes
	 * @event commandEnable
	 */
	controlEnable: { service: Service; controlEnable: CommandEnableInterface };
	/**
	 * Notify when a service changes its state
	 * @event stateChanged
	 */
	stateChanged: {
		service: Service;
		state: ServiceState;
	};
	/**
	 * Notify when a service changes its opMode
	 * @event opModeChanged
	 */
	opModeChanged: {
		service: Service;
		operationMode: OperationMode;
		sourceMode: ServiceSourceMode;
	};
	/**
	 * Notify when a variable inside a PEAController changes
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
		service: Service;
		procedure: Procedure;
		command: ServiceCommand;
		parameter: ParameterInterface[];
	};

	/**
	 * when one service goes to *completed*
	 * @event serviceCompleted
	 */
	serviceCompleted: Service;
}

type PEAEmitter = StrictEventEmitter<EventEmitter, PEAEvents>;

/**
 * PEAController with its Services and DataAssemblies
 *
 * in order to interact with a PEAController, you must first [[connect]] to it
 *
 */
export class PEAController extends (EventEmitter as new() => PEAEmitter) {

	public readonly options: PEAOptions;
	public readonly id: string;
	public readonly pimadIdentifier: string;
	public readonly name: string;

	public readonly services: Service[] = [];
	public readonly variables: DataAssemblyController[] = [];
	// PEAController is protected and can't be deleted by the user
	public protected = false;
	public connection: OpcUaConnection;

	private readonly description: string;
	private readonly hmiUrl: string;
	private readonly logger: Category;

	constructor(options: PEAOptions, protectedPEA = false) {
		super();
		this.options = options;
		this.pimadIdentifier = options.pimadIdentifier;
		this.name = options.name;
		this.id = options.id;
		this.description = options.description || '';
		this.protected = protectedPEA;
		this.hmiUrl = options.hmiUrl || '';

		this.connection = new OpcUaConnection(this.id, options.opcuaServerUrl, options.username, options.password)
			.on('connected', () => this.emit('connected'))
			.on('disconnected', () => this.emit('disconnected'));
		this.logger = catPEA;

		/*if (options.) {
			this.services = options.services.map((serviceOpts: ServiceOptions) => new Service(serviceOpts, this.connection, this.id));
		}*/

		if (options) {
			this.variables = options.dataAssemblies
				.map((variableOptions: DataAssemblyOptions) =>
					DataAssemblyControllerFactory.create(variableOptions, this.connection)
				);
		}
	}

	public setConnection(options: ServerSettingsOptions){
		this.connection = new OpcUaConnection(this.id, options.serverUrl, options.username, options.password)
			.on('connected', () => this.emit('connected'))
			.on('disconnected', () => this.emit('disconnected'));
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

	public async connect(): Promise<void> {
		await this.connection.connect();
		const pv = this.subscribeToAllVariables();
		const pa = this.subscribeToAllServices();
		await this.connection.startListening();
		await Promise.all([pv, pa]);
		this.logger.info(`[${this.id}] Successfully subscribed to ${this.connection.monitoredItemSize()} assemblies`);
	}

	/**
	 * Close session and disconnect from PEAController
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
	 * Get JSON serialisation of PEAController
	 */
	public json(): PEAInterface {
		return {
			name: this.name,
			id: this.id,
			pimadIdentifier: this.pimadIdentifier,
			description: this.description,
			endpoint: this.connection.endpoint,
			hmiUrl: this.hmiUrl,
			connected: this.isConnected(),
			services: this.getServiceStates(),
			processValues: [],
			protected: this.protected
		};
	}

	/**
	 * is POL connected to PEAController
	 * @returns {boolean}
	 */
	public isConnected(): boolean {
		return this.connection.isConnected();
	}

	public listenToDataAssembly(dataAssemblyName: string, variableName: string): DataItemEmitter {
		const dataAssembly: DataAssemblyController | undefined = this.variables.find(
			(variable) => variable.name === dataAssemblyName);
		if (!dataAssembly) {
			throw new Error(`ProcessValue ${dataAssemblyName} is not specified for PEA ${this.id}`);
		}
		const emitter: EventEmitter = new EventEmitter();
		dataAssembly.on(variableName, (data) => emitter.emit('changed', data));
		return emitter;
	}

	/**
	 * Abort all services in PEAController
	 */
	public abort(): Promise<void[]> {
		this.logger.info(`[${this.id}] Abort all services`);
		const tasks = this.services.map((service) => service.executeCommand(ServiceCommand.abort));
		return Promise.all(tasks);
	}

	/**
	 * Pause all services in PEAController which are currently running
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
	 * Resume all services in PEAController which are currently paused
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
	 * Stop all non-idle services in PEAController
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
	 * Reset all services in PEAController
	 */
	public reset(): Promise<void[]> {
		this.logger.info(`[${this.id}] Reset all services`);
		const tasks = this.services.map((service) => service.executeCommand(ServiceCommand.reset));
		return Promise.all(tasks);
	}

	private subscribeToAllVariables(): Promise<DataAssemblyController[]> {
		return Promise.all(
			this.variables.map((variable: DataAssemblyController) => {
				this.logger.debug(`[${this.id}] subscribe to process variable ${variable.name}`);
				variable.on('V', (data) => {
					this.logger.debug(`[${this.id}] variable changed: ${JSON.stringify(variable.toJson())}`);
					const entry: VariableChange = {
						timestampPOL: new Date(),
						timestampPEA: data.timestamp,
						pea: this.id,
						variable: variable.name,
						value: data.value,
						unit: variable.toJson().unit!
					};
					this.emit('variableChanged', entry);
				});
				return variable.subscribe();
			})
		);
	}

	private unsubscribeFromAllVariables(): void {
		this.variables.forEach((variable: DataAssemblyController) => variable.unsubscribe());
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
				.on('controlEnable', (controlEnable: CommandEnableInterface) => {
					this.emit('controlEnable', {service, controlEnable});
				})
				.on('state', (state) => {
					this.logger.debug(`[${this.id}] state changed: ${service.name} = ${ServiceState[state]}`);
					const entry = {
						timestampPOL: new Date(),
						timestampPEA: service.lastStatusChange,
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
						`${data.procedure?.name}.${data.parameter.name} = ${data.parameter.value}`);
					const entry: ParameterChange = {
						timestampPEA: data.parameter.timestamp!,
						service: service,
						procedure: data.procedure!.id,
						parameter: data.parameter.name,
						value: data.parameter.value,
						unit: data.parameter.unit!,
						parameterType: data.parameterType
					};
					this.emit('parameterChanged', entry);
				});
			return service.subscribeToService();
		}));
	}

	private unsubscribeFromAllServices(): void {
		this.services.forEach((service) => service.unsubscribe());
	}

}
