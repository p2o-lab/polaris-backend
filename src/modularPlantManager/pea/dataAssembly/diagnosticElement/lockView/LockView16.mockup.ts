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

export function getLockView16MockupReferenceJSON(
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
			},
			In9En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In9En`,
				dataType: 'Boolean'
			},
			In9: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In9`,
				dataType: 'Boolean'
			},
			In9QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In9QC`,
				dataType: 'Byte'
			},
			In9Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In9Inv`,
				dataType: 'Boolean'
			},
			In9Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In9Txt`,
				dataType: 'String'
			},
			In10En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In10En`,
				dataType: 'Boolean'
			},
			In10: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In10`,
				dataType: 'Boolean'
			},
			In10QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In10QC`,
				dataType: 'Byte'
			},
			In10Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In10Inv`,
				dataType: 'Boolean'
			},
			In10Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In10Txt`,
				dataType: 'String'
			},
			In11En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In11En`,
				dataType: 'Boolean'
			},
			In11: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In11`,
				dataType: 'Boolean'
			},
			In11QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In11QC`,
				dataType: 'Byte'
			},
			In11Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In11Inv`,
				dataType: 'Boolean'
			},
			In11Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In11Txt`,
				dataType: 'String'
			},
			In12En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In12En`,
				dataType: 'Boolean'
			},
			In12: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In12`,
				dataType: 'Boolean'
			},
			In12QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In12QC`,
				dataType: 'Byte'
			},
			In12Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In12Inv`,
				dataType: 'Boolean'
			},
			In12Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In12Txt`,
				dataType: 'String'
			},
			In13En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In13En`,
				dataType: 'Boolean'
			},
			In13: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In13`,
				dataType: 'Boolean'
			},
			In13QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In13QC`,
				dataType: 'Byte'
			},
			In13Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In13Inv`,
				dataType: 'Boolean'
			},
			In13Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In13Txt`,
				dataType: 'String'
			},
			In14En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In14En`,
				dataType: 'Boolean'
			},
			In14: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In14`,
				dataType: 'Boolean'
			},
			In14QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In14QC`,
				dataType: 'Byte'
			},
			In14Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In14Inv`,
				dataType: 'Boolean'
			},
			In14Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In14Txt`,
				dataType: 'String'
			},
			In15En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In15En`,
				dataType: 'Boolean'
			},
			In15: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In15`,
				dataType: 'Boolean'
			},
			In15QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In15QC`,
				dataType: 'Byte'
			},
			In15Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In15Inv`,
				dataType: 'Boolean'
			},
			In15Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In15Txt`,
				dataType: 'String'
			},
			In16En: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In16En`,
				dataType: 'Boolean'
			},
			In16: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In16`,
				dataType: 'Boolean'
			},
			In16QC: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In16QC`,
				dataType: 'Byte'
			},
			In16Inv: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In16Inv`,
				dataType: 'Boolean'
			},
			In16Txt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.In16Txt`,
				dataType: 'String'
			}
		}
	);
}

export abstract class LockView16Mockup {

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

	public in9En = false;
	public in9 = false;
	public in9QC = 0;
	public in9Inv = false;
	public in9Txt = 'textText';

	public in10En = false;
	public in10 = false;
	public in10QC = 0;
	public in10Inv = false;
	public in10Txt = 'textText';

	public in11En = false;
	public in11 = false;
	public in11QC = 0;
	public in11Inv = false;
	public in11Txt = 'textText';

	public in12En = false;
	public in12 = false;
	public in12QC = 0;
	public in12Inv = false;
	public in12Txt = 'textText';

	public in13En = false;
	public in13 = false;
	public in13QC = 0;
	public in13Inv = false;
	public in13Txt = 'textText';

	public in14En = false;
	public in14 = false;
	public in14QC = 0;
	public in14Inv = false;
	public in14Txt = 'textText';

	public in15En = false;
	public in15 = false;
	public in15QC = 0;
	public in15Inv = false;
	public in15Txt = 'textText';

	public in16En = false;
	public in16 = false;
	public in16QC = 0;
	public in16Inv = false;
	public in16Txt = 'textText';

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

		// INPUT 9
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In9En`,
			browseName: `${variableName}.In9En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in9En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In9`,
			browseName: `${variableName}.In9`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in9});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In9QC`,
			browseName: `${variableName}.In9QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in9QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In9Inv`,
			browseName: `${variableName}.In9Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in9Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In9Txt`,
			browseName: `${variableName}.In9Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in9Txt});
				},
			},
		});
// INPUT 10
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In10En`,
			browseName: `${variableName}.In10En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in10En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In10`,
			browseName: `${variableName}.In10`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in10});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In10QC`,
			browseName: `${variableName}.In10QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in10QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In10Inv`,
			browseName: `${variableName}.In10Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in10Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In10Txt`,
			browseName: `${variableName}.In10Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in10Txt});
				},
			},
		});
// INPUT 11
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In11En`,
			browseName: `${variableName}.In11En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in11En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In11`,
			browseName: `${variableName}.In11`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in11});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In11QC`,
			browseName: `${variableName}.In11QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in11QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In11Inv`,
			browseName: `${variableName}.In11Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in11Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In11Txt`,
			browseName: `${variableName}.In11Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in11Txt});
				},
			},
		});
// INPUT 12
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In12En`,
			browseName: `${variableName}.In12En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in12En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In12`,
			browseName: `${variableName}.In12`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in12});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In12QC`,
			browseName: `${variableName}.In12QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in12QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In12Inv`,
			browseName: `${variableName}.In12Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in12Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In12Txt`,
			browseName: `${variableName}.In12Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in12Txt});
				},
			},
		});
// INPUT 13
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In13En`,
			browseName: `${variableName}.In13En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in13En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In13`,
			browseName: `${variableName}.In13`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in13});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In13QC`,
			browseName: `${variableName}.In13QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in13QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In13Inv`,
			browseName: `${variableName}.In13Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in13Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In13Txt`,
			browseName: `${variableName}.In13Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in13Txt});
				},
			},
		});
// INPUT 14
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In14En`,
			browseName: `${variableName}.In14En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in14En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In14`,
			browseName: `${variableName}.In14`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in14});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In14QC`,
			browseName: `${variableName}.In14QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in14QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In14Inv`,
			browseName: `${variableName}.In14Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in14Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In14Txt`,
			browseName: `${variableName}.In14Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in14Txt});
				},
			},
		});
// INPUT 15
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In15En`,
			browseName: `${variableName}.In15En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in15En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In15`,
			browseName: `${variableName}.In15`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in15});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In15QC`,
			browseName: `${variableName}.In15QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in15QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In15Inv`,
			browseName: `${variableName}.In15Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in15Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In15Txt`,
			browseName: `${variableName}.In15Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in15Txt});
				},
			},
		});
// INPUT 16
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In16En`,
			browseName: `${variableName}.In16En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in16En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In16`,
			browseName: `${variableName}.In16`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in16});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In16QC`,
			browseName: `${variableName}.In16QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in16QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In16Inv`,
			browseName: `${variableName}.In16Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in16Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.In16Txt`,
			browseName: `${variableName}.In16Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in16Txt});
				},
			},
		});
	}

	public getLockView16InstanceMockupJSON() {
		return getLockView16MockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
