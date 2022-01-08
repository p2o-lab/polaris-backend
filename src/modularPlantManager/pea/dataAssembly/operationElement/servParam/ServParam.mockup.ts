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
	getServiceSourceModeDataItemOptions,
	ServiceSourceModeMockup
} from '../../baseFunction/serviceSourceMode/ServiceSourceMode.mockup';
import {getWQCDataItemOptions, WQCMockup} from '../../baseFunction/wqc/WQC.mockup';
import {getOpModeDataItemOptions, OpModeMockup} from '../../baseFunction/opMode/OpMode.mockup';
import {getOperationElementDataItemOptions, OperationElementMockup} from '../OperationElement.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../DataAssemblyController.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement';

function getServParamSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		Sync: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.Sync`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions
	});
}

export function getServParamDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getOperationElementDataItemOptions(namespace, objectBrowseName),
			...getWQCDataItemOptions(namespace, objectBrowseName),
			...getOpModeDataItemOptions(namespace, objectBrowseName),
			...getServiceSourceModeDataItemOptions(namespace, objectBrowseName),
			...getServParamSpecificDataItemOptions(namespace, objectBrowseName),
		}
	);
}

export function getServParamOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getServParamDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class ServParamMockup extends OperationElementMockup{

	public readonly varSync: boolean = false;
	protected opMode: OpModeMockup;
	protected serviceSourceMode: ServiceSourceModeMockup;
	protected wqc: WQCMockup;

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

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.wqc.getDataItemOptions(),
			...this.opMode.getDataItemOptions(),
			...this.serviceSourceMode.getDataItemOptions(),
			...getServParamSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
