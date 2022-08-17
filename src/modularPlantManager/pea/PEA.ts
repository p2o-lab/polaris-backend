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
	AdapterConnectOptions,
	AdapterOptions,
	CommandEnableInfo, ConnectionInfo, DataAssemblyOptions, OpcUaAdapterOptions, OperationMode,
	ParameterInterface, PEAInterface,
	ServiceCommand,
	ServiceInterface, ServiceSourceMode,
	VariableChange
} from '@p2olab/polaris-interface';
import {BaseDataItem, DataItemEmitter} from './connectionHandler';
import {
	DataAssembly, DataAssemblyFactory,
	ServiceState
} from './dataAssembly';
import {Procedure, Service} from './serviceSet';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catPEA} from '../../logging';
import {ConnectionHandler} from './connectionHandler/ConnectionHandler';
import {DataAssemblyModel, PEAModel, ServiceModel} from '@p2olab/pimad-interface';
import {IDProvider} from '../_utils';
import {DataItem} from '@p2olab/pimad-types';

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
	 * when connection changes
	 * @event connectionChange
	 */
	connectionChange: void;

	/**
	 * when commandEnable of one service changes
	 * @event commandEnable
	 */
	controlEnable: {
		service: Service;
		controlEnable: CommandEnableInfo
	};
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
	};
	/**
	 * Notify when a service changes its osLevel
	 * @event osLevelChanged
	 */
	osLevelChanged: {
		service: Service;
		osLevel: number;
	};
	/**
	 * Notify when a service changes its sourceMode
	 * @event sourceModeChanged
	 */
	serviceSourceModeChanged: {
		service: Service;
		sourceMode: ServiceSourceMode;
	};
	/**
	 * Notify when a procedure of a service changes
	 * @event procedureChanged
	 */
	procedureChanged: {
		service: Service;
		requestedProcedure: number | undefined,
		currentProcedure: number | undefined,
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

export class PEA extends (EventEmitter as new() => PEAEmitter) {

	public readonly options: PEAModel;
	public readonly id: string;
	public readonly pimadIdentifier: string;
	public readonly name: string;

	public services: Service[] = [];
	public dataAssemblies: DataAssembly[] = [];
	// PEAController is protected and can't be deleted by the user
	private protected = false;
	public connectionHandler: ConnectionHandler;

	private readonly logger: Category;

	constructor(options: PEAModel) {
		super();
		this.logger = catPEA;

		this.options = options;
		this.pimadIdentifier = options.pimadIdentifier;
		this.name = options.name;
		this.id = IDProvider.generateIdentifier();

		this.connectionHandler = new ConnectionHandler()
			.on('connected', () => this.emit('connected'))
			.on('disconnected', () => this.emit('disconnected'));
		options.endpoints.forEach(
			epOptions => {
				const adapterOptions: OpcUaAdapterOptions = {name: epOptions.name, endpoint: epOptions.value};
				this.connectionHandler.addConnectionAdapter(adapterOptions);
			});


		if (options.services) {
			this.services = options.services.map((serviceModel: ServiceModel) => new Service(serviceModel, this.connectionHandler, this.id));
		}

		if (options.dataAssemblies) {
			this.dataAssemblies = options.dataAssemblies
				.map((options: DataAssemblyModel) =>
					DataAssemblyFactory.create(options, this.connectionHandler)
				);
		}
		this.subscribe().then();
	}

	public async updateConnectionAdapter(adapterId: string, options: AdapterOptions) {
		await this.connectionHandler.updateAdapter(adapterId, options);
	}

	public isProtected(): boolean {
		return this.protected;
	}

	set protection(value: boolean) {
		this.logger.info(`Set Protection to ${value}`);
		this.protected = value;
	}

	public findServiceId(serviceName: string): string | undefined {
		const service = this.services.find((service) => service.name === serviceName);
		return service? service.id : undefined;
	}

	public findService(serviceId: string): Service | undefined {
		const service = this.services.find((service) => service.id === serviceId);
		if (!service) this.logger.warn(`[${this.id}] Could not find service with id ${serviceId}`);
		return service;
	}

	public getServiceStates(): ServiceInterface[] {
		this.logger.trace(`[${this.id}] check service states`);
		return this.services.map((service) => service.json());
	}

	public async initializeConnection(adapterId: string, options?: AdapterOptions): Promise<void> {
		await this.connectionHandler.updateAdapter(adapterId, options);
	}

	/**
	 * This function connects the PEA to the OPCUAServer
	 */
	public async connect(adapterId?: string, options?: AdapterConnectOptions): Promise<void> {
		if (adapterId){
			await this.connectionHandler.connectAdapter(adapterId, options);
			await this.connectionHandler.startMonitoring(adapterId);
		} else {
			await this.connectionHandler.connectAllConnectionAdapters();
			await this.connectionHandler.startMonitoring();
		}
		this.emit('connected');
	}

	/**
	 * This function subscribes to all DataAssemblies and Services
	 */
	private async subscribe(): Promise<void> {
		const pv = this.subscribeToAllDataAssemblies();
		const pa = this.subscribeToAllServices();
		await Promise.all([pv,pa]);
		this.logger.info(`[${this.id}] Successfully subscribed to ${this.connectionHandler.monitoredDataItemsCount()} DataItems`);
	}

	/**
	 * This function disconnects the POL from  to the OPCUAServer
	 */
	public async disconnect(): Promise<void> {
		this.logger.info(`[${this.id}] Disconnect PEA`);
		await this.connectionHandler.disconnect();
		this.emit('disconnected');
		this.logger.info(`[${this.id}] PEA disconnected`);
	}

	/**
	 * Close session and disconnect from PEA
	 */
	private async unsubscribe(): Promise<void> {
		await this.unsubscribeFromAllDataAssemblies();
		await this.unsubscribeFromAllServices();
		this.services.forEach((s) => s.unsubscribe());
	}

	/**
	 * Get JSON serialisation of PEAController
	 * @returns {PEAInterface} (can be passed to frontend e.g.)
	 */
	public json(): PEAInterface {
		return {
			name: this.name,
			id: this.id,
			pimadIdentifier: this.pimadIdentifier,
			description: '',
			connectionInfo: this.getConnectionInfo(),
			services: this.getServiceStates(),
			processValues: [],
			protected: this.protected
		};
	}

	/**
	 * is PEAController connected to actual PEA
	 * @returns {boolean}
	 */
	public isConnected(): boolean {
		return this.connectionHandler.connected();
	}

	/**
	 * get current ConnectionInfo of PEA
	 */
	public getConnectionInfo(): ConnectionInfo {
		return this.connectionHandler.connectionInfo;
	}


	public listenToDataAssembly(dataAssemblyName: string, specificDataItemName?: string): DataItemEmitter {
		const dataAssembly: DataAssembly | undefined = this.dataAssemblies.find(
			(dataAssembly) => dataAssembly.name === dataAssemblyName);
		if (!dataAssembly) {
			throw new Error(`PEA ${this.id} does not contain DataAssembly ${dataAssemblyName}`);
		}
		const emitter: EventEmitter = new EventEmitter();

		if (!specificDataItemName){
			dataAssembly.on('changed', (data: any) => emitter.emit('changed', data));
		} else {
			const dataItem: DataItem<any> | undefined =  dataAssembly.dataItems[specificDataItemName as keyof typeof dataAssembly.dataItems];
			if (!dataItem) {
				throw new Error(`PEA ${this.id} does not contain DataAssembly ${dataAssemblyName}`);
			}
			(dataItem as BaseDataItem<any>).on('changed', (data: any) => emitter.emit('changed', data));
		}
		return emitter;
	}

	/**
	 * Pause all services in PEAController which are currently in execute state
	 */
	public async pauseAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Pause all running services`);
		const tasks = this.services.map(async (service) => {
			if (service.isCommandExecutable(ServiceCommand.pause)) {
				return service.executeCommand(ServiceCommand.pause);
			} else {
				throw new Error('Command is not executable');
			}
		});
		return Promise.all(tasks);
	}

	/**
	 * Resume all services in PEAController which are currently paused
	 */
	public async resumeAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Resume all paused services`);
		const tasks = this.services.map(async (service) => {
			if (service.isCommandExecutable(ServiceCommand.resume)) {
				return service.executeCommand(ServiceCommand.resume);
			} else {
				throw new Error('Command is not executable');
			}
		});
		return Promise.all(tasks);
	}

	/**
	 * Hold all services in PEAController which are currently in execute state
	 */
	public async holdAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Hold all executed services`);
		const tasks = this.services.map(async (service) => {
			if (service.isCommandExecutable(ServiceCommand.hold)) {
				return service.executeCommand(ServiceCommand.hold);
			} else {
				throw new Error('Command is not executable');
			}
		});
		return Promise.all(tasks);
	}

	/**
	 * Unhold all services in PEAController which are currently in held state
	 */
	public async unholdAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Resume all held services`);
		const tasks = this.services.map(async (service) => {
			if (service.isCommandExecutable(ServiceCommand.unhold)) {
				return service.executeCommand(ServiceCommand.unhold);
			} else {
				throw new Error('Command is not executable');
			}
		});
		return Promise.all(tasks);
	}

	/**
	 * Abort all services in PEAController
	 */
	public abortAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Abort all services`);
		const tasks = this.services.map((service) => service.executeCommand(ServiceCommand.abort));
		return Promise.all(tasks);
	}

	/**
	 * Stop all non-idle services in PEAController
	 */
	public async stopAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Stop all non-idle services`);
		const tasks = this.services.map(async (service) => {
			if (service.isCommandExecutable(ServiceCommand.stop)) {
				return service.executeCommand(ServiceCommand.stop);
			} else {
				throw new Error('Command is not executable');
			}
		});
		return Promise.all(tasks);
	}

	/**
	 * Reset all services in PEAController
	 */
	public resetAllServices(): Promise<void[]> {
		this.logger.info(`[${this.id}] Reset all services`);
		const tasks = this.services.map((service) => service.executeCommand(ServiceCommand.reset));
		return Promise.all(tasks);
	}


	private subscribeToAllDataAssemblies(): Promise<Awaited<void>[]> {
		return Promise.all(
			this.dataAssemblies.map((dataAssembly: DataAssembly) => {
				this.logger.info(`[${this.id}] subscribe to DataAssembly ${dataAssembly.name}`);
				dataAssembly.on('changed', (data) => {
					this.logger.info(`[${this.id}] DataAssembly changed: ${JSON.stringify(dataAssembly.toJson())}`);
					const entry: VariableChange = {
						timestampPOL: new Date(),
						timestampPEA: (data.dataItem as BaseDataItem<any>).lastChange,
						pea: this.id,
						variable: dataAssembly.name,
						value: (data.dataItem as BaseDataItem<any>).value,
						unit: dataAssembly.toJson().unit!
					};
					this.emit('variableChanged', entry);
				});
				return dataAssembly.subscribe();
			})
		);
	}

	private unsubscribeFromAllDataAssemblies(): void {
		this.dataAssemblies.forEach((variable: DataAssembly) => variable.unsubscribe());
	}

	private subscribeToAllServices(): void {
		this.services.forEach((service) => {
			service
				.on('commandExecuted', (data) => {
					this.emit('commandExecuted', {
						service,
						procedure: data.procedure,
						command: data.command,
						parameter: data.parameter
					});
				})
				.on('commandEnable', (controlEnable: CommandEnableInfo) => {
					this.emit('controlEnable', {service, controlEnable});
				})
				.on('state', (state) => {
					this.logger.info(`[${this.id}] state changed: ${service.name} = ${ServiceState[state]}`);
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
					this.logger.info(`[${this.id}] opMode changed: ${service.name} = ${JSON.stringify(opMode)}`);
					this.emit('opModeChanged', {service: service, operationMode: opMode});
				})
				.on('sourceMode', (sourceMode) => {
					this.logger.info(`[${this.id}] sourceMode changed: ${service.name} = ${JSON.stringify(sourceMode)}`);
					this.emit('serviceSourceModeChanged', {service: service, sourceMode});
				})
				.on('osLevel', (osLevel) => {
					this.logger.info(`[${this.id}] osLevel changed: ${service.name} = ${JSON.stringify(osLevel)}`);
					this.emit('osLevelChanged', {service: service, osLevel});
				})
				.on('procedure', (procedure) => {
					this.logger.info(`[${this.id}] procedure changed: ${service.name} = ${JSON.stringify(procedure)}`);
					this.emit('procedureChanged', {service: service, ...procedure});
				})
				.on('parameterChanged', (data) => {
					this.logger.info(`[${this.id}] parameter changed: ` +
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
			service.subscribeToChanges().then();
		});
	}

	private unsubscribeFromAllServices(): void {
		this.services.forEach((service) => service.unsubscribe());
	}

	getDataAssemblyJson(): DataAssemblyOptions[] {
		const result: DataAssemblyOptions[] = [];
		this.dataAssemblies.forEach((dataAssembly) => result.push(dataAssembly.toDataAssemblyOptionsJson()));
		this.services.forEach((service) => service.getDataAssemblyJson().forEach((r) => result.push(r)));
		return result;
	}
}
