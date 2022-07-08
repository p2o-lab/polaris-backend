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

// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;
import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getUnitSettingsDataItemModel, UnitSettingsMockup} from '../../../baseFunction/unitSettings/UnitSettings.mockup';
import {
	getScaleSettingsDataItemModel,

	ScaleSettingMockup
} from '../../../baseFunction/scaleSettings/ScaleSetting.mockup';
import {
	getValueLimitationDataItemModel,
	ValueLimitationMockup
} from '../../../baseFunction/valueLimitation/ValueLimitation.mockup';
import {getServParamDataItemModel, ServParamMockup} from '../ServParam.mockup';

import {getDataAssemblyModel} from '../../../DataAssembly.mockup';
import {DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam';

function getAnaServParamSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	let dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'VExt';
	dataItem.dataType = 'Float';
	let ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VExt`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VOp';
	dataItem.dataType = 'Float';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VOp`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VInt';
	dataItem.dataType = 'Float';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VInt`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VReq';
	dataItem.dataType = 'Float';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VReq`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VOut';
	dataItem.dataType = 'Float';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VOut`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VFbk';
	dataItem.dataType = 'Float';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VFbk`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'Sync';
	dataItem.dataType = 'Float';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.Sync`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}

export function getAnaServParamDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getServParamDataItemModel(namespace, objectBrowseName),
			...getUnitSettingsDataItemModel(namespace, objectBrowseName),
			...getScaleSettingsDataItemModel(namespace, objectBrowseName, 'Ana'),
			...getValueLimitationDataItemModel(namespace, objectBrowseName, 'Ana'),
			...getAnaServParamSpecificDataItemModels(namespace, objectBrowseName),
		];
}

export function getAnaServParamDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getAnaServParamDataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class AnaServParamMockup extends ServParamMockup{

	public vExt = 0;
	public vOp = 0;
	public vInt = 0;
	public vReq = 0;
	public vOut = 0;
	public vFbk = 0;
	
	public unit: UnitSettingsMockup;
	public scaleSettings: ScaleSettingMockup<'Ana'>;
	public valueLimitation: ValueLimitationMockup<'Ana'>;
	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'Ana');
		this.valueLimitation = new ValueLimitationMockup(namespace, this.mockupNode, this.name,'Ana');

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VExt`,
			browseName: `${variableName}.VExt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vExt});
				},
				set: (variant: Variant): StatusCodes => {
					this.vExt = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VOp`,
			browseName: `${variableName}.VOp`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.vOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VInt`,
			browseName: `${variableName}.VInt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vInt});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VReq`,
			browseName: `${variableName}.VReq`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vReq});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VOut`,
			browseName: `${variableName}.VOut`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vOut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFbk`,
			browseName: `${variableName}.VFbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vFbk});
				},
			},
		});
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...this.unit.getDataItemModel(),
			...this.scaleSettings.getDataItemModel(),
			...this.valueLimitation.getDataItemModel(),
			...getAnaServParamSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		];
		return options;
	}

	public startCurrentTimeUpdate(): void {
		this.interval = global.setInterval(() => {
			this.vOut = Math.random();
		}, 1000);
	}

	public stopCurrentTimeUpdate(): void {
		if (this.interval) {
			global.clearInterval(this.interval);
		}else {
			throw new Error('No interval defined.');
		}
	}
}
