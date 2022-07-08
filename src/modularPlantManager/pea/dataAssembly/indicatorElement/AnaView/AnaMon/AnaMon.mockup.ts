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

import {Namespace, UAObject} from 'node-opcua';
import {getOSLevelDataItemModel, OSLevelMockup} from '../../../baseFunction/osLevel/OSLevel.mockup';
import {
	getLimitMonitoringDataItemModel,
	LimitMonitoringMockup
} from '../../../baseFunction/limitMonitoring/LimitMonitoring.mockup';

import {getDataAssemblyModel} from '../../../DataAssembly.mockup';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';
import {AnaViewMockup, getAnaViewDataItemModel} from '../AnaView.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView/AnaMon';

export function getAnaMonDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getAnaViewDataItemModel(namespace, objectBrowseName),
			...getOSLevelDataItemModel(namespace, objectBrowseName),
			...getLimitMonitoringDataItemModel(namespace, objectBrowseName, 'Ana'),
		];
}

export function getAnaMonDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getAnaMonDataItemModel(namespace, objectBrowseName)
		];
	return options;
}

export class AnaMonMockup extends AnaViewMockup{

	public osLevel: OSLevelMockup;
	public limitMonitoring: LimitMonitoringMockup<'Ana'>;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.osLevel = new OSLevelMockup(namespace, this.mockupNode, this.name);
		this.limitMonitoring = new LimitMonitoringMockup(namespace, this.mockupNode, this.name, 'Ana');
	}

	public getDataAssemblyModel(): DataAssemblyModel {
		const options = super.getDataAssemblyModel();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.osLevel.getDataItemModel(),
			...this.limitMonitoring.getDataItemModel()
		};
		return options;
	}
}
