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
import {getScaleSettingsDataItemModel, ScaleSettingMockup} from '../../baseFunction/scaleSettings/ScaleSetting.mockup';
import {getUnitSettingsDataItemModel, UnitSettingsMockup} from '../../baseFunction/unitSettings/UnitSettings.mockup';
// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;

import {getIndicatorElementDataItemModel, IndicatorElementMockup} from '../IndicatorElement.mockup';
import {getDataAssemblyModel} from '../../DataAssembly.mockup';
import {DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView';

function getAnaViewSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	const dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'V';
	dataItem.dataType = 'Float';
	const ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.V`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}


export function getAnaViewDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return ({
			...getIndicatorElementDataItemModel(namespace, objectBrowseName),
			...getScaleSettingsDataItemModel(namespace, objectBrowseName, 'Ana'),
			...getUnitSettingsDataItemModel(namespace, objectBrowseName),
			...getAnaViewSpecificDataItemModels(namespace, objectBrowseName)});
}

export function getAnaViewDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getAnaViewDataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class AnaViewMockup extends IndicatorElementMockup{

	public v = 0;

	public scaleSettings: ScaleSettingMockup<'Ana'>;
	public unit: UnitSettingsMockup;

	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string, withoutDataItemV = false) {
		super(namespace, rootNode, variableName);

		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'Ana');
		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);

		if(!withoutDataItemV){
			namespace.addVariable({
				componentOf: this.mockupNode,
				nodeId: `ns=${namespace.index};s=${variableName}.V`,
				browseName: `${variableName}.V`,
				dataType: DataType.Double,
				value: {
					get: (): Variant => {
						return new Variant({dataType: DataType.Double, value: this.v});
					},
				},
			});
		}
	}

	public startRandomOscillation(): void {
		let time = 0;
		const f1 = Math.random();
		const f2 = Math.random();
		const amplitude = this.scaleSettings.vSclMax - this.scaleSettings.vSclMin;
		const average = (this.scaleSettings.vSclMax + this.scaleSettings.vSclMin) / 2;
		this.interval = global.setInterval(() => {
			time = time + 0.5;
			this.v = average + 0.5 * amplitude * Math.sin(0.01 * (1 + f1) * time + Math.PI * f2);
		}, 500);
	}

	public stopRandomOscillation(): void {
		if (this.interval) {
			global.clearInterval(this.interval);
		}
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...this.scaleSettings.getDataItemModel(),
			...this.unit.getDataItemModel(),
			...getAnaViewSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
			];
		return options;
	}
}
