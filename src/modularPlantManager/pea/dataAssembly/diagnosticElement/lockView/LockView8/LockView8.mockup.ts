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
import {getLockView4DataItemOptions, LockView4Mockup} from '../LockView4/LockView4.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../DataAssemblyController.mockup';


const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/LockView8';

function getLockView8SpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		In5En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In5En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In5: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In5`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In5QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In5QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In5Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In5Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In5Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In5Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions,
		In6En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In6En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In6: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In6`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In6QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In6QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In6Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In6Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In6Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In6Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions,
		In7En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In7En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In7: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In7`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In7QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In7QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In7Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In7Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In7Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In7Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions,
		In8En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In8En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In8: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In8`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In8QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In8QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In8Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In8Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In8Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In8Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions
	});
}


export function getLockView8DataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getLockView4DataItemOptions(namespace, objectBrowseName),
			...getLockView8SpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}


export function getLockView8Options(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getLockView8DataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class LockView8Mockup extends LockView4Mockup{

	public in5En = false;
	public in5 = false;
	public in5QC = 0;
	public in5Inv = false;
	public in5Txt = 'testText';

	public in6En = false;
	public in6 = false;
	public in6QC = 0;
	public in6Inv = false;
	public in6Txt = 'testText';

	public in7En = false;
	public in7 = false;
	public in7QC = 0;
	public in7Inv = false;
	public in7Txt = 'testText';

	public in8En = false;
	public in8 = false;
	public in8QC = 0;
	public in8Inv = false;
	public in8Txt = 'testText';
	

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		// INPUT 5
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In5En`,
			browseName: `${variableName}.In5En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in5En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In5`,
			browseName: `${variableName}.In5`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in5});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In5QC`,
			browseName: `${variableName}.In5QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in5QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In5Inv`,
			browseName: `${variableName}.In5Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in5Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In5Txt`,
			browseName: `${variableName}.In5Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in5Txt});
				},
			},
		});
// INPUT 6
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In6En`,
			browseName: `${variableName}.In6En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in6En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In6`,
			browseName: `${variableName}.In6`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in6});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In6QC`,
			browseName: `${variableName}.In6QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in6QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In6Inv`,
			browseName: `${variableName}.In6Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in6Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In6Txt`,
			browseName: `${variableName}.In6Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in6Txt});
				},
			},
		});
// INPUT 7
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In7En`,
			browseName: `${variableName}.In7En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in7En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In7`,
			browseName: `${variableName}.In7`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in7});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In7QC`,
			browseName: `${variableName}.In7QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in7QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In7Inv`,
			browseName: `${variableName}.In7Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in7Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In7Txt`,
			browseName: `${variableName}.In7Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in7Txt});
				},
			},
		});
// INPUT 8
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In8En`,
			browseName: `${variableName}.In8En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in8En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In8`,
			browseName: `${variableName}.In8`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in8});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In8QC`,
			browseName: `${variableName}.In8QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in8QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In8Inv`,
			browseName: `${variableName}.In8Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in8Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In8Txt`,
			browseName: `${variableName}.In8Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in8Txt});
				},
			},
		});
	}

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...getLockView8SpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
