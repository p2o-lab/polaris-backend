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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getOpModeDataItemModel, OpModeMockup} from '../../baseFunction/opMode/OpMode.mockup';
import {getInterlockDataItemModel, InterlockMockup} from '../../baseFunction/interlock/Interlock.mockup';
import {getResetDataItemModel, ResetMockup} from '../../baseFunction/reset/Reset.mockup';
import {ActiveElementMockup, getActiveElementDataItemModel} from '../ActiveElement.mockup';
import {DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';

import {getDataAssemblyModel} from '../../DataAssembly.mockup';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/ActiveElement';

function getDrvSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	let dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'SafePos';
	dataItem.dataType = 'Boolean';
	let ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.SafePos`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'SafePosAct';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.SafePosAct`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'FwdAut';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.FwdAut`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'FwdCtrl';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.FwdCtrl`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'FwdEn';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.FwdEn`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'FwdFbk';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.FwdFbk`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'FwdFbkCalc';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.FwdFbkCalc`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'FwdOp';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.FwdOp`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'RevAut';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.RevAut`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'RevCtrl';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.RevCtrl`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'RevEn';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.RevEn`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'RevFbk';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.RevFbk`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'RevFbkCalc';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.RevFbkCalc`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'RevOp';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.RevFbkCalc`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'StopAut';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.StopAut`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'StopOp';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.StopOp`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'Trip';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.Trip`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}


export function getDrvDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getActiveElementDataItemModel(namespace, objectBrowseName),
			...getOpModeDataItemModel(namespace, objectBrowseName),
			...getInterlockDataItemModel(namespace, objectBrowseName),
			...getResetDataItemModel(namespace, objectBrowseName),
			...getDrvSpecificDataItemModels(namespace, objectBrowseName),
	];
}


export function getDrvDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getDrvDataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class DrvMockup extends ActiveElementMockup{

	public operationMode: OpModeMockup;
	public interlock: InterlockMockup;
	public reset: ResetMockup;

	public safePos = false;
	public safePosAct = false;

	public fwdEn= false;
	public revEn= false;
	public stopOp= false;
	public fwdOp= false;
	public revOp= false;
	public stopAut= false;
	public fwdAut= false;
	public revAut= false;
	public fwdCtrl= false;
	public revCtrl= false;
	public revFbkCalc= false;
	public revFbk= false;
	public fwdFbkCalc= false;
	public fwdFbk= false;
	public trip= false;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.operationMode = new OpModeMockup(namespace,this.mockupNode,this.name);
		this.interlock= new InterlockMockup(namespace,this.mockupNode,this.name);
		this.reset= new ResetMockup(namespace,this.mockupNode,this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SafePos`,
			browseName: `${variableName}.SafePos`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.safePos});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SafePosAct`,
			browseName: `${variableName}.SafePosAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.safePosAct});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdEn`,
			browseName: `${variableName}.FwdEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevEn`,
			browseName: `${variableName}.RevEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StopOp`,
			browseName: `${variableName}.StopOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stopOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.stopOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdOp`,
			browseName: `${variableName}.FwdOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.fwdOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevOp`,
			browseName: `${variableName}.RevOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.revOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StopAut`,
			browseName: `${variableName}.StopAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stopAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdAut`,
			browseName: `${variableName}.FwdAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevAut`,
			browseName: `${variableName}.RevAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdCtrl`,
			browseName: `${variableName}.FwdCtrl`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdCtrl});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevCtrl`,
			browseName: `${variableName}.RevCtrl`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revCtrl});
				},
			},
		});
		
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevFbkCalc`,
			browseName: `${variableName}.RevFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revFbkCalc});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevFbk`,
			browseName: `${variableName}.RevFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdFbkCalc`,
			browseName: `${variableName}.FwdFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdFbkCalc});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdFbk`,
			browseName: `${variableName}.FwdFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Trip`,
			browseName: `${variableName}.Trip`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.trip});
				},
			},
		});

	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...this.operationMode.getDataItemModel(),
			...this.reset.getDataItemModel(),
			...this.interlock.getDataItemModel(),
			...getDrvSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		];
		return options;
	}
}
