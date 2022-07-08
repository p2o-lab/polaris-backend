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

import {getOperationElementDataItemModel, OperationElementMockup} from '../../OperationElement.mockup';
import {getDataAssemblyModel} from '../../../DataAssembly.mockup';
import {DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement/DIntMan';

function getDIntManSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	let dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'VOut';
	dataItem.dataType = 'Int32';
	let ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VOut`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VMan';
	dataItem.dataType = 'Int32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VMan`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VRbk';
	dataItem.dataType = 'Int32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VRbk`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'VFbk';
	dataItem.dataType = 'Int32';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.VFbk`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}

export function getDIntManDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getOperationElementDataItemModel(namespace, objectBrowseName),
			...getScaleSettingsDataItemModel(namespace, objectBrowseName, 'DInt'),
			...getValueLimitationDataItemModel(namespace, objectBrowseName, 'DInt'),
			...getUnitSettingsDataItemModel(namespace, objectBrowseName),
			...getDIntManSpecificDataItemModels(namespace, objectBrowseName),
	];
}

export function getDIntManDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getDIntManDataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class DIntManMockup extends OperationElementMockup {

	public vRbk = 0;
	public vMan = 0;
	public vOut = 0;
	public vFbk = 0;

	public scaleSettings: ScaleSettingMockup<'DInt'>;
	public valueLimitation: ValueLimitationMockup<'DInt'>;
	public unit: UnitSettingsMockup;

	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'DInt');
		this.valueLimitation = new ValueLimitationMockup(namespace, this.mockupNode, this.name, 'DInt');
		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VMan`,
			browseName: `${variableName}.VMan`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vMan});
				},
				set: (variant: Variant): StatusCodes => {
					this.vMan = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VOut`,
			browseName: `${variableName}.VOut`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vOut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFbk`,
			browseName: `${variableName}.VFbk`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VRbk`,
			browseName: `${variableName}.VRbk`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vRbk});
				},
			},
		});
	}


	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...this.scaleSettings.getDataItemModel(),
			...this.valueLimitation.getDataItemModel(),
			...this.unit.getDataItemModel(),
			...getDIntManSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
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
