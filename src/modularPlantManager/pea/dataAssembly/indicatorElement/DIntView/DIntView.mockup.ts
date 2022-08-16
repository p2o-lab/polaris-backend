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

import {DataType, Namespace, UAObject, Variant} from 'node-opcua';
import {
	getScaleSettingsDataItemModel,
	ScaleSettingMockup
} from '../../baseFunction/scaleSettings/ScaleSetting.mockup';
import {getUnitSettingsDataItemModel, UnitSettingsMockup} from '../../baseFunction/unitSettings/UnitSettings.mockup';

import {getDataAssemblyModel} from '../../DataAssembly.mockup';
import {getIndicatorElementDataItemModel, IndicatorElementMockup} from '../IndicatorElement.mockup';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';
import {Access} from '@p2olab/pimad-types';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/DIntView';

function getDIntViewSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	const dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'V';
	dataItem.dataType = 'Int32';
	const ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = Access.ReadWriteAccess;
	ciOptions.nodeId.identifier = `${objectBrowseName}.V`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}

export function getDIntViewDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getIndicatorElementDataItemModel(namespace, objectBrowseName),
			...getScaleSettingsDataItemModel(namespace, objectBrowseName, 'DInt'),
			...getUnitSettingsDataItemModel(namespace, objectBrowseName),
			...getDIntViewSpecificDataItemModels(namespace, objectBrowseName),
];
}

export function getDIntViewDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getDIntViewDataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class DIntViewMockup extends IndicatorElementMockup{

	public v = 0;
	public scaleSettings: ScaleSettingMockup<'DInt'>;
	public unit: UnitSettingsMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'DInt');
		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.V`,
			browseName: `${variableName}.V`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.v});
				},
			},
		});
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...this.scaleSettings.getDataItemModel(),
			...this.unit.getDataItemModel(),
			...getDIntViewSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		];
		return options;
	}
}
