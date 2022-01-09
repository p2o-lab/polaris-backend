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
	getSourceModeDataItemOptions,
	SourceModeMockup
} from '../../../../baseFunction/sourceMode/SourceMode.mockup';
import {BinManMockup, getBinManDataItemOptions} from '../BinMan.mockup';
import {getWQCDataItemOptions, WQCMockup} from '../../../../baseFunction/wqc/WQC.mockup';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../../DataAssemblyController.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement/BinMan/BinManInt';

function getBinManIntSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		VInt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VInt`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions
	});
}

export function getBinManIntDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getBinManDataItemOptions(namespace, objectBrowseName),
			...getWQCDataItemOptions(namespace, objectBrowseName),
			...getSourceModeDataItemOptions(namespace, objectBrowseName),
			...getBinManIntSpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getBinManIntOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getBinManIntDataItemOptions(namespace, objectBrowseName)};
	return options;
}


export class BinManIntMockup extends BinManMockup {
	protected vInt = false;
	public readonly wqc: WQCMockup;
	public readonly sourceMode: SourceModeMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.wqc = new WQCMockup(namespace, this.mockupNode, this.name);
		this.sourceMode = new SourceModeMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VInt`,
			browseName: `${variableName}.VInt`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vInt});
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
			...this.sourceMode.getDataItemOptions(),
			...getBinManIntSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
