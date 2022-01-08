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
	FeedbackMonitoringMockup, getFeedbackMonitoringDataItemOptions,
} from '../../../../baseFunction/feedbackMonitoring/FeedbackMonitoring.mockup';
import {BinVlvMockup, getBinVlvDataItemOptions} from '../BinVlv.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../../DataAssemblyController.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/BinVlv/MonBinVlv';

export function getMonBinVlvDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getBinVlvDataItemOptions(namespace, objectBrowseName),
			...getFeedbackMonitoringDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getMonBinVlvOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getMonBinVlvDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class MonBinVlvMockup extends BinVlvMockup{

	public feedbackMonitoring: FeedbackMonitoringMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		super(namespace, rootNode, variableName);
		this.feedbackMonitoring= new FeedbackMonitoringMockup(namespace, rootNode, this.name);

	}

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.feedbackMonitoring.getDataItemOptions()
		};
		return options;
	}
}
