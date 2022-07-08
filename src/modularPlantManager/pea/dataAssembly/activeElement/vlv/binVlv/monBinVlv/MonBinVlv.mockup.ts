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
import {
	FeedbackMonitoringMockup, getFeedbackMonitoringDataItemModel,
} from '../../../../baseFunction/feedbackMonitoring/FeedbackMonitoring.mockup';
import {BinVlvMockup, getBinVlvDataItemModel} from '../BinVlv.mockup';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';

import {getDataAssemblyModel} from '../../../../DataAssembly.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/BinVlv/MonBinVlv';

export function getMonBinVlvDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getBinVlvDataItemModel(namespace, objectBrowseName),
			...getFeedbackMonitoringDataItemModel(namespace, objectBrowseName),
	];
}

export function getMonBinVlvDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getMonBinVlvDataItemModel(namespace, objectBrowseName)};
	return options;
}

export class MonBinVlvMockup extends BinVlvMockup{

	public feedbackMonitoring: FeedbackMonitoringMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		super(namespace, rootNode, variableName);
		this.feedbackMonitoring= new FeedbackMonitoringMockup(namespace, rootNode, this.name);

	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...this.feedbackMonitoring.getDataItemModel()
		];
		return options;
	}
}
