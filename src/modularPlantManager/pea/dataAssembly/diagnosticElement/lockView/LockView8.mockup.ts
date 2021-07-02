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
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../_extensions/wqcDA/WQCDA.mockup';
import {catPEAMockup} from '../../../../../logging';

export function getLockView8MockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {
	return (
		{	
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
			Logic: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Logic`,
				dataType: 'Boolean'
			},
			Out: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Out`,
				dataType: 'Boolean'
			},
			OutQC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.OutQC`,
				dataType: 'Byte'
			},
			In1En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In1En`,
				dataType: 'Boolean'
			},
			In1: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In1`,
				dataType: 'Boolean'
			},
			In1QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In1QC`,
				dataType: 'Byte'
			},
			In1Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In1Inv`,
				dataType: 'Boolean'
			},
			In1Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In1Txt`,
				dataType: 'String'
			},
			In2En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In2En`,
				dataType: 'Boolean'
			},
			In2: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In2`,
				dataType: 'Boolean'
			},
			In2QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In2QC`,
				dataType: 'Byte'
			},
			In2Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In2Inv`,
				dataType: 'Boolean'
			},
			In2Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In2Txt`,
				dataType: 'String'
			},
			In3En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In3En`,
				dataType: 'Boolean'
			},
			In3: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In3`,
				dataType: 'Boolean'
			},
			In3QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In3QC`,
				dataType: 'Byte'
			},
			In3Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In3Inv`,
				dataType: 'Boolean'
			},
			In3Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In3Txt`,
				dataType: 'String'
			},
			In4En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In4En`,
				dataType: 'Boolean'
			},
			In4: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In4`,
				dataType: 'Boolean'
			},
			In4QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In4QC`,
				dataType: 'Byte'
			},
			In4Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In4Inv`,
				dataType: 'Boolean'
			},
			In4Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In4Txt`,
				dataType: 'String'
			},
			In5En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In5En`,
				dataType: 'Boolean'
			},
			In5: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In5`,
				dataType: 'Boolean'
			},
			In5QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In5QC`,
				dataType: 'Byte'
			},
			In5Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In5Inv`,
				dataType: 'Boolean'
			},
			In5Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In5Txt`,
				dataType: 'String'
			},
			In6En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In6En`,
				dataType: 'Boolean'
			},
			In6: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In6`,
				dataType: 'Boolean'
			},
			In6QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In6QC`,
				dataType: 'Byte'
			},
			In6Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In6Inv`,
				dataType: 'Boolean'
			},
			In6Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In6Txt`,
				dataType: 'String'
			},
			In7En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In7En`,
				dataType: 'Boolean'
			},
			In7: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In7`,
				dataType: 'Boolean'
			},
			In7QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In7QC`,
				dataType: 'Byte'
			},
			In7Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In7Inv`,
				dataType: 'Boolean'
			},
			In7Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In7Txt`,
				dataType: 'String'
			},
			In8En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In8En`,
				dataType: 'Boolean'
			},
			In8: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In8`,
				dataType: 'Boolean'
			},
			In8QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In8QC`,
				dataType: 'Byte'
			},
			In8Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In8Inv`,
				dataType: 'Boolean'
			},
			In8Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In8Txt`,
				dataType: 'String'
			}
		}
	);
}

export abstract class LockView8Mockup {

	public readonly name: string;
	public readonly wqc: WQCDAMockup;

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

	public in5En = false;
	public in5 = false;
	public in5QC = 0;
	public in5Inv = false;
	public in5Txt = 'textText';

	public in6En = false;
	public in6 = false;
	public in6QC = 0;
	public in6Inv = false;
	public in6Txt = 'textText';

	public in7En = false;
	public in7 = false;
	public in7QC = 0;
	public in7Inv = false;
	public in7Txt = 'textText';

	public in8En = false;
	public in8 = false;
	public in8QC = 0;
	public in8Inv = false;
	public in8Txt = 'textText';
	
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		catPEAMockup.debug(`Add variable ${variableName}`);

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});

		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.Logic`,
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
			nodeId: `ns=${namespace};s=${variableName}.Out`,
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
			nodeId: `ns=${namespace};s=${variableName}.OutQC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In1En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In1`,
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
			nodeId: `ns=${namespace};s=${variableName}.In1QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In1Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In1Txt`,
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
			nodeId: `ns=${namespace};s=${variableName}.In2En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In2`,
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
			nodeId: `ns=${namespace};s=${variableName}.In2QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In2Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In2Txt`,
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
			nodeId: `ns=${namespace};s=${variableName}.In3En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In3`,
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
			nodeId: `ns=${namespace};s=${variableName}.In3QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In3Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In3Txt`,
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
			nodeId: `ns=${namespace};s=${variableName}.In4En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In4`,
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
			nodeId: `ns=${namespace};s=${variableName}.In4QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In4Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In4Txt`,
			browseName: `${variableName}.In4Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in4Txt});
				},
			},
		});

		// INPUT 5
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In5En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In5`,
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
			nodeId: `ns=${namespace};s=${variableName}.In5QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In5Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In5Txt`,
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
			nodeId: `ns=${namespace};s=${variableName}.In6En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In6`,
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
			nodeId: `ns=${namespace};s=${variableName}.In6QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In6Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In6Txt`,
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
			nodeId: `ns=${namespace};s=${variableName}.In7En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In7`,
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
			nodeId: `ns=${namespace};s=${variableName}.In7QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In7Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In7Txt`,
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
			nodeId: `ns=${namespace};s=${variableName}.In8En`,
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
			nodeId: `ns=${namespace};s=${variableName}.In8`,
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
			nodeId: `ns=${namespace};s=${variableName}.In8QC`,
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
			nodeId: `ns=${namespace};s=${variableName}.In8Inv`,
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
			nodeId: `ns=${namespace};s=${variableName}.In8Txt`,
			browseName: `${variableName}.In8Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in8Txt});
				},
			},
		});
	}

	public getLockView8InstanceMockupJSON() {
		return getLockView8MockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
