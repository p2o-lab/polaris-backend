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
import {DiagnosticElementMockup, getDiagnosticElementDataItemOptions} from '../../DiagnosticElement.mockup';
import {getDataAssemblyOptions} from '../../../DataAssemblyController.mockup';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/LockView4';

function getLockView4SpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		Logic: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.Logic`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		Out: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.Out`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		OutQC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.OutQC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In1En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In1En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In1: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In1`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In1QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In1QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In1Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In1Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In1Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In1Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions,
		In2En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In2En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In2: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In2`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In2QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In2QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In2Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In2Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In2Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In2Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions,
		In3En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In3En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In3: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In3`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In3QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In3QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In3Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In3Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In3Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In3Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions,
		In4En: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In4En`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In4: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In4`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In4QC: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In4QC`,
			dataType: 'Byte'
		} as OpcUaNodeOptions,
		In4Inv: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In4Inv`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		In4Txt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.In4Txt`,
			dataType: 'String'
		} as OpcUaNodeOptions
	});
}

export function getLockView4DataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getDiagnosticElementDataItemOptions(namespace, objectBrowseName),
			...getLockView4SpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getLockView4Options(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getLockView4DataItemOptions(namespace, objectBrowseName)};
	return options;
}


export class LockView4Mockup extends DiagnosticElementMockup{

	public logic = false; // False = AND; TRUE = OR;
	public out = false;
	public outQC = 0;

	public in1En = false;
	public in1 = false;
	public in1QC = 0;
	public in1Inv = false;
	public in1Txt = 'testText';

	public in2En = false;
	public in2 = false;
	public in2QC = 0;
	public in2Inv = false;
	public in2Txt = 'testText';

	public in3En = false;
	public in3 = false;
	public in3QC = 0;
	public in3Inv = false;
	public in3Txt = 'testText';

	public in4En = false;
	public in4 = false;
	public in4QC = 0;
	public in4Inv = false;
	public in4Txt = 'testText';
	

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Logic`,
			browseName: `${variableName}.Logic`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.logic});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Out`,
			browseName: `${variableName}.Out`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.out});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.OutQC`,
			browseName: `${variableName}.OutQC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.outQC});
				},
			},
		});
// INPUT 1
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In1En`,
			browseName: `${variableName}.In1En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in1En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In1`,
			browseName: `${variableName}.In1`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in1});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In1QC`,
			browseName: `${variableName}.In1QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in1QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In1Inv`,
			browseName: `${variableName}.In1Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in1Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In1Txt`,
			browseName: `${variableName}.In1Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in1Txt});
				},
			},
		});
// INPUT 2
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In2En`,
			browseName: `${variableName}.In2En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in2En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In2`,
			browseName: `${variableName}.In2`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in2});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In2QC`,
			browseName: `${variableName}.In2QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in2QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In2Inv`,
			browseName: `${variableName}.In2Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in2Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In2Txt`,
			browseName: `${variableName}.In2Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in2Txt});
				},
			},
		});
// INPUT 3
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In3En`,
			browseName: `${variableName}.In3En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in3En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In3`,
			browseName: `${variableName}.In3`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in3});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In3QC`,
			browseName: `${variableName}.In3QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in3QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In3Inv`,
			browseName: `${variableName}.In3Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in3Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In3Txt`,
			browseName: `${variableName}.In3Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in3Txt});
				},
			},
		});
// INPUT 4
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In4En`,
			browseName: `${variableName}.In4En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in4En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In4`,
			browseName: `${variableName}.In4`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in4});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In4QC`,
			browseName: `${variableName}.In4QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in4QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In4Inv`,
			browseName: `${variableName}.In4Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in4Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In4Txt`,
			browseName: `${variableName}.In4Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in4Txt});
				},
			},
		});
	}


	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...getLockView4SpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
