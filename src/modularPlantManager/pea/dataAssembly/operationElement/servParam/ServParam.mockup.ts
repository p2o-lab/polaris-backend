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
import {getServiceSourceModeDataItemModel, ServiceSourceModeMockup} from '../../baseFunction/serviceSourceMode/ServiceSourceMode.mockup';
import {getWQCDataItemModel, WQCMockup} from '../../baseFunction/wqc/WQC.mockup';
import {getOpModeDataItemModel, OpModeMockup} from '../../baseFunction/opMode/OpMode.mockup';
import {getOperationElementDataItemModel, OperationElementMockup} from '../OperationElement.mockup';
import {DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';

import {getDataAssemblyModel} from '../../DataAssembly.mockup';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement/ServParam';

function getServParamSpecificDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {

	const result: DataItemModel[] = [];
	const dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'Sync';
	dataItem.dataType = 'Boolean';
	const ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.Sync`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	return result;
}

export function getServParamDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return ({
			...getOperationElementDataItemModel(namespace, objectBrowseName),
			...getWQCDataItemModel(namespace, objectBrowseName),
			...getOpModeDataItemModel(namespace, objectBrowseName),
			...getServiceSourceModeDataItemModel(namespace, objectBrowseName),
			...getServParamSpecificDataItemModel(namespace, objectBrowseName),
		}
	);
}

export function getServParamDataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getServParamDataItemModel(namespace, objectBrowseName)
		];
	return options;
}

export class ServParamMockup extends OperationElementMockup{

	public readonly varSync: boolean = false;
	public opMode: OpModeMockup;
	public serviceSourceMode: ServiceSourceModeMockup;
	public wqc: WQCMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.wqc = new WQCMockup(namespace, this.mockupNode, this.name);
		this.opMode = new OpModeMockup(namespace, this.mockupNode, this.name);
		this.serviceSourceMode = new ServiceSourceModeMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Sync`,
			browseName: `${variableName}.Sync`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.varSync});
				},
			},
		});
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = {
			...options.dataItems,
			...this.wqc.getDataItemModel(),
			...this.opMode.getDataItemModel(),
			...this.serviceSourceMode.getDataItemModel(),
			...getServParamSpecificDataItemModel(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
