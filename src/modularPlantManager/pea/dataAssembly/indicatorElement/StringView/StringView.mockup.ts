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
import {getIndicatorElementDataItemModel, IndicatorElementMockup} from '../IndicatorElement.mockup';
import {DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';

import {getDataAssemblyModel} from '../../DataAssembly.mockup';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/StringView';

function getStringViewSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	const dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'Text';
	dataItem.dataType = 'String';
	const ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.Text`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}

export function getStringViewDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getIndicatorElementDataItemModel(namespace, objectBrowseName),
			...getStringViewSpecificDataItemModels(namespace, objectBrowseName),
		];
}

export function getStringViewDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = [
		...options.dataItems,
		...getStringViewDataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class StringViewMockup extends IndicatorElementMockup {

	public text = 'dummyText';

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Text`,
			browseName: `${variableName}.Text`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.text});
				},
			},
		});
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...getStringViewSpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		];
		return options;
	}
}
