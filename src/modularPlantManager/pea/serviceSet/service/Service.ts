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
	CommandEnableInterface, OperationMode, ParameterInterface,
	ParameterOptions,
	ServiceCommand,
	ServiceInterface,
	ServiceOptions, ServiceSourceMode
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../../connection';
import {
	controlEnableToJson, DataAssemblyControllerFactory,
	InputElement, ServiceControl,
	ServiceControlEnable, ServiceMtpCommand,
	ServiceState, ServParam
} from '../../dataAssembly';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {PEAController} from '../../PEAController';
import {BaseService, BaseServiceEvents} from './BaseService';
import {Procedure} from './procedure/Procedure';
import {catService} from '../../../../logging';



/**
 * Events emitted by [[Service]]
 */
export interface ServiceEvents extends BaseServiceEvents {
	opMode: {
		operationMode: OperationMode;
		sourceMode: ServiceSourceMode;
	};
}

type ServiceEmitter = StrictEventEmitter<EventEmitter, ServiceEvents>;

/**
 * Service of a [[PEAController]]
 *
 * after connection to a real PEAController, commands can be triggered and states can be retrieved
 *
 */
export class Service extends BaseService {

	public readonly eventEmitter!: ServiceEmitter;
	public readonly procedures: Procedure[] = [];
	public readonly parameters: ServParam[] = [];
	public readonly connection: OpcUaConnection;
	public serviceControl: ServiceControl;
	private readonly logger: Category;
	private serviceParametersEventEmitters: EventEmitter[];
	private readonly _parentId: string;

	constructor(serviceOptions: ServiceOptions, connection: OpcUaConnection, parentId: string) {
		super();
		this._parentId = parentId;
		this._name = serviceOptions.name;
		if (!serviceOptions || Object.keys(serviceOptions).length == 0) {
			throw new Error('No service options provided.');
		}
		else if (!serviceOptions.name) {
			throw new Error('No service name provided');
		}
		this.connection = connection;
		this.serviceParametersEventEmitters = [];

		this._lastStatusChange = new Date();
		this.logger = catService;

		this.serviceControl = new ServiceControl(
			{name: this._name, metaModelRef: 'ServiceControl', dataItems: serviceOptions.communication},
			connection);

		this.procedures = serviceOptions.procedures
			.map((option) => new Procedure(option, connection));

		// TODO: Check what happens if DataAssemblyController already exists --> Is that a matter?
		if (serviceOptions.parameters) {
			this.parameters = serviceOptions.parameters
				.map((options) => DataAssemblyControllerFactory.create(options, connection) as ServParam);
		}
	}

	public get qualifiedName(): string {
		return `${this._parentId}.${this.name}`;
	}

	public get commandEnable(): CommandEnableInterface {
		return controlEnableToJson(this.serviceControl.communication.CommandEn.value as ServiceControlEnable);
	}

	public get state(): ServiceState {
		return this.serviceControl.communication.StateCur.value as ServiceState;
	}

	public get lastStatusChange(): Date {
		if(this.serviceControl.communication.StateCur.timestamp) return this.serviceControl.communication.StateCur.timestamp;
		else return new Date();
	}

	public get currentProcedure(): number | undefined {
		return this.serviceControl.communication.ProcedureCur.value;
	}

	public getDefaultProcedure(): Procedure | undefined {
		return this.procedures.find((procedure) => procedure.defaultProcedure);
	}

	/**
	 * Get current procedure from internal memory.
	 */
	public getCurrentProcedure(): Procedure |undefined{
		const curProc = this.procedures.find((proc) => parseInt(proc.id, 10) === this.currentProcedure);
		// TODO: why throw error? program will crash if there is no current procedure
/*		if (!curProc) {
			throw new Error('Current Procedure not found.');
		}*/
		return curProc;
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
					`${JSON.stringify(this.commandEnable)}`);
				this.eventEmitter.emit('controlEnable', this.commandEnable);
			})
			.on('OpMode', () => {
				this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ` +
					`${this.serviceControl.opMode.getOperationMode()}`);
				this.eventEmitter.emit('opMode',
					{
						operationMode: this.serviceControl.opMode.getOperationMode(),
						sourceMode: this.serviceControl.serviceSourceMode.getServiceSourceMode()
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

		const psc = this.serviceControl.subscribe();
		const par = this.parameters.map((param) => {
			return param.subscribe();
		});

		const procedures = this.procedures.map((procedure) => {
				procedure.on('parameterChanged', (data) => {
					this.eventEmitter.emit('parameterChanged', {
						procedure,
						parameter: data.parameter,
						parameterType: data.parameterType
					});
				});
				return procedure.subscribe();
			}
		);

		await Promise.all([procedures, psc, par]);
		return this.eventEmitter;
	}

	public unsubscribe(): void {
		this.serviceControl.unsubscribe();
		this.parameters.forEach((param) => param.unsubscribe());
		this.procedures.forEach((procedure) => procedure.unsubscribe());
	}

	/**
	 * get JSON overview about service and its state, opMode, procedures, parameters and commandEnable
	 */
	public json(): ServiceInterface {
		return {
			name: this.name,
			operationMode: this.serviceControl.opMode.getOperationMode(),
			serviceSourceMode: this.serviceControl.serviceSourceMode.getServiceSourceMode(),
			status: ServiceState[this.state],
			procedures: this.procedures.map((procedure) => procedure.toJson()),
			currentProcedure: this.getCurrentProcedure()?.name,
			parameters: this.parameters.map((param) => param.toJson()),
			controlEnable: this.commandEnable,
			lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000,
			peaId: this._parentId,
		};
	}

	// overridden method from Base Service
	public async executeCommandAndWaitForStateChange(command: ServiceCommand): Promise<void> {
		if (!this.connection.isConnected()) {
			throw new Error('PEAController is not connected');
		}
		await super.executeCommand(command);
		const currentProcedure = this.getCurrentProcedure();
		if(currentProcedure){
			this.eventEmitter.emit('commandExecuted', {
				procedure: currentProcedure,
				command: command,
				parameter: currentProcedure?.parameters.map((param) => param.toJson() as ParameterInterface)
			});
			this.logger.info(`[${this.qualifiedName}] ${command} executed`);
		}
		let expectedState='';
		switch(command){
			case('start'):
				expectedState='EXECUTE';
				break;
			case('stop'):
				expectedState='STOPPED';
				break;
			case('reset'):
				expectedState='IDLE';
				break;
			case('abort'):
				expectedState='ABORTED';
				break;
			case('complete'):
				expectedState='COMPLETED';
				break;
			case('pause'):
				expectedState='PAUSED';
				break;
			case('resume'):
				expectedState='EXECUTE';
				break;
			case('hold'):
				expectedState='HOLD';
				break;
			case('restart'):
				// TODO is this okay?
				// on 'restart' the program can't detect a change, because in the end the state stays at 'EXECUTE'
				if (ServiceState[this.state] === 'EXECUTE') return;

		}
		await this.waitForStateChangeWithTimeout(expectedState);
	}

	public start(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.START);
	}

	public restart(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.RESTART);
	}

	public stop(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.STOP);
	}

	public reset(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.RESET);
	}

	public complete(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.COMPLETE);
	}

	public abort(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.ABORT);
	}

	public hold(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.HOLD);
	}

	public unhold(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.UNHOLD);
	}

	public pause(): Promise<void> {
		return this.sendCommand(ServiceMtpCommand.PAUSE);
	}

	public resume(): Promise<void> {
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
		await this.serviceControl.communication.ProcedureExt.write(procedure.id);
	}

	public getProcedureByNameOrDefault(procedureName: string): Procedure | undefined {
		let procedure: Procedure | undefined;
		if (!procedureName) {
			procedure = this.getDefaultProcedure();
		} else {
			procedure = this.procedures.find((proc) => proc.name === procedureName);
		}
		if(!procedure){
			throw new Error('Could not find Procedure by Name or Default.');
		}
		return procedure;
	}

	public async setParameters(parameterOptions: ParameterOptions[], peaSet: PEAController[] = []): Promise<void> {
		parameterOptions.map((p) => {
			const dataAssembly = this.findInputParameter(p.name);
			if(!dataAssembly){
				throw new Error('Parameter not found.');
			}
			dataAssembly?.setValue(p, peaSet);
		});
	}

	public async setOperationMode(): Promise<void> {
		await this.serviceControl.opMode.setToAutomaticOperationMode();
		await this.serviceControl.serviceSourceMode.setToExternalServiceSourceMode();
	}

	public findInputParameter(parameterName: string): InputElement | ServParam | undefined {
		let result: InputElement | ServParam | undefined;
		result = this.parameters.find((obj) => (obj.name === parameterName));
		if (!result) {
			result = this.getCurrentProcedure()?.parameters.find((obj) => (obj.name === parameterName));
		}
		if (!result) {
			result = this.getCurrentProcedure()?.processValuesIn.find((obj) => (obj.name === parameterName));
		}
		return result;
	}

	/**
	 *
	 */
	private clearListeners(): void {
		this.logger.info(`[${this.qualifiedName}] clear parameter listener`);
		this.serviceParametersEventEmitters.forEach((listener) => listener.removeAllListeners());
	}

	private async sendCommand(command: ServiceMtpCommand): Promise<void> {
		this.logger.debug(`[${this.qualifiedName}] Send command ${ServiceMtpCommand[command]}`);
		await this.setOperationMode();

		await this.serviceControl.communication.CommandExt.write(command);
		this.logger.trace(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written`);
	}

}
