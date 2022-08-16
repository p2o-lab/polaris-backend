/*
 * MIT License
 *
 * Copyright (c) 2020 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getServiceSourceModeDataItemModel, ServiceSourceModeMockup} from '../baseFunction/serviceSourceMode/ServiceSourceMode.mockup';
import {ServiceMtpCommand, ServiceState, ServiceStateString} from '../../serviceSet/service/enum';
import {getWQCDataItemModel, WQCMockup} from '../baseFunction/wqc/WQC.mockup';
import {getOSLevelDataItemModel, OSLevelMockup} from '../baseFunction/osLevel/OSLevel.mockup';
import {DataAssemblyMockup, getDataAssemblyModel} from '../DataAssembly.mockup';
import {MtpStateMachine, UserDefinedActions, UserDefinedGuard} from '../../stateMachine/MtpStateMachine';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';

import {getServiceOpModeDataItemModel, ServiceOpModeMockup} from '../baseFunction/serviceOpMode/ServiceOpMode.mockup';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../dataItem/DataItem.mockup';
import {Access} from '@p2olab/pimad-types';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/ServiceControl';

function getServiceControlSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	let dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'CommandOp';
	dataItem.dataType = 'UInt32';
	let ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.CommandOp`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'CommandInt';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.CommandInt`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'CommandExt';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.CommandExt`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'CommandEn';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.CommandEn`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'StateCur';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.StateCur`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'ProcedureOp';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.ProcedureOp`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'ProcedureExt';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.ProcedureExt`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'ProcedureInt';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.ProcedureInt`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'ProcedureCur';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.ProcedureCur`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'ProcedureReq';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.ProcedureReq`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'InteractQuestionID';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.InteractQuestionID`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'InteractAnswerID';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.InteractAnswerID`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'PosTextID';
	dataItem.dataType = 'UInt32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.PosTextID`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}

export function getServiceControlDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
    return [
			...getServiceOpModeDataItemModel(namespace, objectBrowseName),
			...getServiceSourceModeDataItemModel(namespace, objectBrowseName),
			...getWQCDataItemModel(namespace, objectBrowseName),
			...getOSLevelDataItemModel(namespace, objectBrowseName),
            ...getServiceControlSpecificDataItemModels(namespace, objectBrowseName),
        ];
}

export function getServiceControlDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
    const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
    options.dataItems = [
        ...options.dataItems,
        ...getServiceControlDataItemModel(namespace, objectBrowseName)
	];
    return options;
}

export class ServiceControlMockup extends DataAssemblyMockup {

	public serviceSourceMode: ServiceSourceModeMockup;
	public serviceOpMode: ServiceOpModeMockup;
	public wqc: WQCMockup;
	public osLevel: OSLevelMockup;

	public commandEn = 0;
	public commandOp = 0;
	public commandInt = 0;
	public commandExt = 0;
	public procedureExt = 0;
	public posTextID = 0;
	public interactAnswerID = 0;
	public interactQuestionID = 0;

	protected stateMachine: MtpStateMachine;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.serviceOpMode = new ServiceOpModeMockup(namespace, this.mockupNode, variableName);
		this.serviceSourceMode = new ServiceSourceModeMockup(namespace, this.mockupNode, variableName);
		this.wqc = new WQCMockup(namespace, this.mockupNode, variableName);
		this.osLevel = new OSLevelMockup(namespace, this.mockupNode, this.name);
		this.stateMachine = new MtpStateMachine(variableName, {} as UserDefinedGuard, {} as UserDefinedActions);
		this.stateMachine.start();

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CommandOp`,
			browseName: `${variableName}.CommandOp`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.commandOp});
				},
				set: (variant: Variant): StatusCodes => {
					const reqCommandOp = parseInt(variant.value, 10);
					if (!Object.values(ServiceMtpCommand).includes(reqCommandOp)) {
						return StatusCodes.BadInvalidArgument;
					}
					if (this.serviceOpMode.stateOpAct) {
						if (this.commandEn === reqCommandOp) {
							this.commandOp = reqCommandOp;
							return StatusCodes.Good;
						}
					}
					this.commandOp = ServiceMtpCommand.UNDEFINED;
					return StatusCodes.BadInvalidArgument;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CommandInt`,
			browseName: `${variableName}.CommandInt`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.commandInt});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CommandExt`,
			browseName: `${variableName}.CommandExt`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.commandExt});
				},
				set: (variant: Variant): StatusCodes => {
					const reqCommandExt = parseInt(variant.value, 10);
					if (!Object.values(ServiceMtpCommand).includes(reqCommandExt)) {
						return StatusCodes.BadInvalidArgument;
					}
					if (this.serviceOpMode.stateAutAct && this.serviceSourceMode.srcExtAct) {
						/*                     if(this.commandEn===reqCommandExt){
												 this.commandExt = reqCommandExt;
												 return StatusCodes.Good;
											 }*/
						this.logger.info(`Set service CommandExt (${this.name}): ${ServiceMtpCommand[reqCommandExt]} (${reqCommandExt})`);
						const result = this.stateMachine.triggerEvent(reqCommandExt);
						if (result) {
							return StatusCodes.Good;
						}
					}
					this.commandExt = ServiceMtpCommand.UNDEFINED;
					return StatusCodes.BadInvalidArgument;
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.ProcedureOp`,
			browseName: `${variableName}.ProcedureOp`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this._procedureOp});
				},
				set: (variant: Variant): StatusCodes => {
					const reqProcedureOp = parseInt(variant.value, 10);
					if (this.serviceOpMode.stateOpAct) {
						// TODO: check if procedure is valid
						this._procedureOp = reqProcedureOp;
						return StatusCodes.Good;
					}
					return StatusCodes.BadInvalidArgument;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.ProcedureInt`,
			browseName: `${variableName}.ProcedureInt`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this._procedureInt});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.ProcedureExt`,
			browseName: `${variableName}.ProcedureExt`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.procedureExt});
				},
				set: (variant: Variant): StatusCodes => {
					const reqProcedureExt = parseInt(variant.value, 10);
					this.procedureExt = reqProcedureExt;
					if (this.serviceOpMode.stateAutAct && this.serviceSourceMode.srcExtAct) {
						// TODO: check if procedure is valid
						this.stateMachine.setProcedureReq(reqProcedureExt);
						this.logger.info(
							`Set ProcedureReq by ProcedureExt (${this.name}): ProcedureReq: ${this.stateMachine.getProcedureReq()}`);
					}
					return StatusCodes.Good;
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateCur`,
			browseName: `${variableName}.StateCur`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					const stateCur: ServiceState = ServiceState[this.state];
					return new Variant({dataType: DataType.UInt32, value: stateCur});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CommandEn`,
			browseName: `${variableName}.CommandEn`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					let enabled = 0;
					for (const [key, value] of this.stateMachine.getCommandEnabled()) {
						if (value) {
							enabled += ServiceMtpCommand[key];
						}
					}
					return new Variant({dataType: DataType.UInt32, value: enabled});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.ProcedureCur`,
			browseName: `${variableName}.ProcedureCur`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.procedureCur});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.ProcedureReq`,
			browseName: `${variableName}.ProcedureReq`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.procedureReq});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosTextID`,
			browseName: `${variableName}.PosTextID`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.posTextID});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.InteractQuestionID`,
			browseName: `${variableName}.InteractQuestionID`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.interactQuestionID});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.InteractAnswerID`,
			browseName: `${variableName}.InteractAnswerID`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.interactAnswerID});
				},
			},
		});
	}

	private _procedureOp = 0;

	public set procedureOp(procedureOp: number) {
		const procedure = Math.trunc(procedureOp);
		if (this.serviceOpMode.stateOpAct && this.osLevel.osLevel === 0) {
			// TODO: check if procedure is valid
			this.stateMachine.setProcedureReq(procedure);
			this.logger.info(
				`Set ProcedureReq by ProcedureOp (${this.name}): ProcedureReq: ${this.stateMachine.getProcedureReq()}`);
		}
	}

	private _procedureInt = 0;

	public set procedureInt(procedureInt: number) {
		const procedure = Math.trunc(procedureInt);
		if (this.serviceOpMode.stateAutAct && this.serviceSourceMode.srcIntAct) {
			this.stateMachine.setProcedureReq(procedure);
			this.logger.info(
				`Set ProcedureReq by ProcedureInt (${this.name}): ProcedureReq: ${this.stateMachine.getProcedureReq()}`);
		}
	}

	public get state(): ServiceStateString {
		return this.stateMachine.getState();
	}

	public sendCommand(cmd: ServiceMtpCommand): void {
		this.stateMachine.triggerEvent(cmd);
	}

	public get procedureCur(): number {
		return this.stateMachine.getProcedureCur();
	}

	public get procedureReq(): number {
		return this.stateMachine.getProcedureReq();
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel((metaModelReferenceOption || metaModelReference));
		options.dataItems = [
			...options.dataItems,
            ...this.serviceOpMode.getDataItemModel(),
            ...this.serviceSourceMode.getDataItemModel(),
            ...this.wqc.getDataItemModel(),
            ...this.osLevel.getDataItemModel(),
			...getServiceControlSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string)
			];
		return options;
	}
}
