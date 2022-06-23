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

import {CommandEnableInfo, DataAssemblyOptions, OperationMode, ParameterInterface, ParameterOptions, ServiceCommand, ServiceInterface, ServiceOptions, ServiceSourceMode} from '@p2olab/polaris-interface';
import {DynamicDataItem, OpcUaConnection} from '../../connection';
import {controlEnableToJson, DataAssemblyControllerFactory, InputElement, ServiceControl, ServiceControlEnable, ServiceMtpCommand, ServiceState, ServParam} from '../../dataAssembly';

import {EventEmitter} from 'events';
import {Category} from 'typescript-logging';
import {PEAController} from '../../PEAController';
import {BaseService} from './BaseService';
import {Procedure} from './procedure/Procedure';
import {catService} from '../../../../logging';


/**
 * Service of a [[PEAController]]
 *
 * after connection to a real PEAController, commands can be triggered and states can be retrieved
 *
 */
export class Service extends BaseService{

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

	public get commandEnable(): CommandEnableInfo {
		return controlEnableToJson(this.serviceControl.communication.CommandEn.value as ServiceControlEnable);
	}

	public get state(): ServiceState {
		return this.serviceControl.communication.StateCur.value as ServiceState;
	}

	public get lastStatusChange(): Date {
		return (this.serviceControl.communication.StateCur as DynamicDataItem<number>)?.timestamp || new Date();
	}

	public get currentProcedureId(): number | undefined {
		return this.serviceControl.currentProcedure();
	}

	public get currentProcedure(): Procedure | undefined {
		let result;
		const currentProcedureId = this.currentProcedureId;
		if (currentProcedureId) {
			result = this.findProcedure(currentProcedureId);
		}
		return result;
	}

	public get requestedProcedureId(): number | undefined {
		return this.serviceControl.requestedProcedure();
	}

	public get requestedProcedure(): Procedure | undefined {
		let result;
		const requestedProcedureId = this.requestedProcedureId;
		if (requestedProcedureId) {
			result = this.findProcedure(requestedProcedureId);
		}
		return result;
	}

	/**
	 * Find procedure from internal memory.
	 */
	public findProcedure(procedureId: number): Procedure | undefined {
		return this.procedures.find((proc) => proc.procedureId === procedureId);
	}

	/**
	 * Notify about changes in to serviceControl, procedures, configuration parameters and process values
	 * via events and log messages
	 */
	public async subscribeToChanges(): Promise<void> {
		this.logger.info(`[${this.qualifiedName}] Subscribe to changes`);
		this.serviceControl
			.on('commandEn', () => {
				this.logger.debug(`[${this.qualifiedName}] ControlEnable changed: ` +
					`${JSON.stringify(this.commandEnable)}`);
				this.emit('commandEnable', this.commandEnable);
			})
			.on('opMode', () => {
				this.logger.debug(`[${this.qualifiedName}] Current OpMode changed: ` +
					`${this.serviceControl.opMode.getServiceOperationMode()}`);
				this.emit('opMode', this.serviceControl.opMode.getServiceOperationMode());
			})
			.on('serviceSourceMode', () => {
				this.logger.debug(`[${this.qualifiedName}] Current SourceMode changed: ` +
					`${this.serviceControl.serviceSourceMode.getServiceSourceMode()}`);
				this.emit('sourceMode', this.serviceControl.serviceSourceMode.getServiceSourceMode());
			})
			.on('osLevel', (data) => {
				this.logger.debug(`[${this.qualifiedName}] Current OSLevel changed: ` +
					`${data}`);
				this.emit('osLevel', data);
			})
			.on('Procedure', () => {
				this.logger.debug(`[${this.qualifiedName}] Procedure changed:`);
				this.emit('procedure',
					{
						requestedProcedure: this.serviceControl.requestedProcedure(),
						currentProcedure: this.serviceControl.currentProcedure()
					});
			})
			.on('StateCur', () => {
				this.logger.debug(`[${this.qualifiedName}] State changed: ` +
					`${ServiceState[this.state]}`);
				this.emit('state', this.state);
				if (this.state === ServiceState.COMPLETED ||
					this.state === ServiceState.ABORTED ||
					this.state === ServiceState.STOPPED) {
					this.clearListeners();
				}
			});

		await this.serviceControl.subscribe();
		await this.parameters.forEach((param) => {param.subscribe();});

		this.procedures.forEach((procedure) => {
				procedure.on('parameterChanged', (data) => {
					this.emit('parameterChanged', {
						procedure,
						parameter: data.parameter,
						parameterType: data.parameterType
					});
				});
			});
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
			id: this.id,
			name: this.name,
			peaId: this._parentId,
			operationMode: this.serviceControl.opMode.getServiceOperationMode(),
			requestedProcedure: this.requestedProcedureId || 0,
			serviceSourceMode: this.serviceControl.serviceSourceMode.getServiceSourceMode(),
			osLevel: this.serviceControl.osLevel.osLevel,
			state: ServiceState[this.state],
			procedures: this.procedures.map((procedure) => procedure.toJson()),
			currentProcedure: this.currentProcedureId || 0,
			parameters: this.parameters.map((param) => param.toJson()),
			commandEnable: this.commandEnable,
			lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000,
		};
	}

	public async executeCommand(command: ServiceCommand): Promise<void> {
		if (!this.connection.isConnected()) {
			throw new Error('PEAController is not connected');
		}
		await super.executeCommand(command);
		const currentProcedure = this.currentProcedure;
		if(currentProcedure){
			this.emit('commandExecuted', {
				procedure: currentProcedure,
				command: command,
				parameter: currentProcedure.parameters.map((param) => param.toJson() as ParameterInterface)
			});
			this.logger.info(`[${this.qualifiedName}] ${command} executed`);
		}
		let expectedState='';
		switch(command){
			case('start'):
				expectedState = 'EXECUTE';
				break;
			case('stop'):
				expectedState = 'STOPPED';
				break;
			case('reset'):
				expectedState = 'IDLE';
				break;
			case('abort'):
				expectedState = 'ABORTED';
				break;
			case('complete'):
				expectedState = 'COMPLETED';
				break;
			case('pause'):
				expectedState = 'PAUSED';
				break;
			case('resume'):
				expectedState = 'EXECUTE';
				break;
			case('hold'):
				expectedState = 'HOLD';
				break;
			case('unhold'):
				expectedState = 'EXECUTE';
				break;
			case('restart'):
				expectedState = 'EXECUTE';
				break;
		}
		// await this.waitForStateChangeWithTimeout(expectedState, 1000);
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

	/** Request a procedure
	 * @returns {Promise<void>}
	 */

	public async requestProcedureAutomatic(id: number): Promise<void> {
		if(this.validProcedureId(id) && this.serviceControl.opMode.isAutomaticState() && this.serviceControl.serviceSourceMode.isExtSource()){
			this.logger.debug(`[${this.qualifiedName}] request procedure: ${id}`);
		await (this.serviceControl.communication.ProcedureExt as DynamicDataItem<number>).write(id);
		} else {
			this.logger.debug(`[${this.qualifiedName}] cant set procedure: ${id}. Expected a valid procedure id, automatic external mode`);
		}
	}

	public async requestProcedureOperator(id: number): Promise<void> {
		if(this.validProcedureId(id) && this.serviceControl.opMode.isOperatorState() && this.serviceControl.osLevel.osLevel>0){
			this.logger.debug(`[${this.qualifiedName}] request procedure: ${id}`);
			await (this.serviceControl.communication.ProcedureOp as DynamicDataItem<number>).write(id);
		} else {
			this.logger.debug(`[${this.qualifiedName}] cant set procedure: ${id}. Expected a valid procedure id and operator mode`);
		}
	}

	public async changeOsLevel(value: number): Promise<void> {
		this.serviceControl.osLevel.osLevel = value;
	}

	private validProcedureId(id: number): boolean {
		return !!this.procedures.find(p => p.procedureId == id) || id === 0;
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


	public findInputParameter(parameterName: string): InputElement | ServParam | undefined {
		let result: InputElement | ServParam | undefined;
		result = this.parameters.find((obj) => (obj.name === parameterName));

		if (!result) {
			result = this.currentProcedure?.parameters.find((obj) => (obj.name === parameterName));
		}
		if (!result) {
			result = this.currentProcedure?.processValuesIn.find((obj) => (obj.name === parameterName));
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
		await this.requestOpMode(OperationMode.Automatic);

		await (this.serviceControl.communication.CommandExt as DynamicDataItem<number>).write(command);
		this.logger.trace(`[${this.qualifiedName}] Command ${ServiceMtpCommand[command]} written`);
	}

	async requestServiceSourceMode(serviceSourceMode: ServiceSourceMode): Promise<void>{
		switch (serviceSourceMode) {
			case ServiceSourceMode.Extern:
				await this.serviceControl.serviceSourceMode.setToExternalServiceSourceMode();
				break;
			case ServiceSourceMode.Intern:
				await this.serviceControl.serviceSourceMode.setToInternalServiceSourceMode();
				break;
		}
	}

	async requestOpMode(opMode: OperationMode): Promise<void> {
		switch (opMode) {
			case OperationMode.Offline:
				await this.serviceControl.opMode.setToOfflineOperationMode();
				break;
			case OperationMode.Operator:
				await this.serviceControl.opMode.setToOperatorOperationMode();
				break;
			case OperationMode.Automatic:
				await this.serviceControl.opMode.setToAutomaticOperationMode();
				break;
		}
	}

	getDataAssemblyJson(): DataAssemblyOptions[] {
		const result: DataAssemblyOptions[] = [];
		result.push(this.serviceControl.toDataAssemblyOptionsJson());
		this.procedures.forEach((procedure) => procedure.getDataAssemblyJson().forEach((r) => result.push(r)));
		this.parameters.forEach((serviceParam) => result.push(serviceParam.toDataAssemblyOptionsJson()));
		return result;
	}
}
