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
import {getWQCMockupReferenceJSON} from '../../../baseFunction/wqc/WQC.mockup';
import {getLockView8MockupReferenceJSON, LockView8Mockup} from '../LockView8/LockView8.mockup';

export function getLockView16MockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {
	return (
		{
			...getWQCMockupReferenceJSON(namespace,objectBrowseName),
			...getLockView8MockupReferenceJSON(namespace, objectBrowseName),
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

export class LockView16Mockup extends LockView8Mockup{

	public in9En = false;
	public in9 = false;
	public in9QC = 0;
	public in9Inv = false;
	public in9Txt = 'testText';

	public in10En = false;
	public in10 = false;
	public in10QC = 0;
	public in10Inv = false;
	public in10Txt = 'testText';

	public in11En = false;
	public in11 = false;
	public in11QC = 0;
	public in11Inv = false;
	public in11Txt = 'testText';

	public in12En = false;
	public in12 = false;
	public in12QC = 0;
	public in12Inv = false;
	public in12Txt = 'testText';

	public in13En = false;
	public in13 = false;
	public in13QC = 0;
	public in13Inv = false;
	public in13Txt = 'testText';

	public in14En = false;
	public in14 = false;
	public in14QC = 0;
	public in14Inv = false;
	public in14Txt = 'testText';

	public in15En = false;
	public in15 = false;
	public in15QC = 0;
	public in15Inv = false;
	public in15Txt = 'testText';

	public in16En = false;
	public in16 = false;
	public in16QC = 0;
	public in16Inv = false;
	public in16Txt = 'testText';


	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		// INPUT 9
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In9En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In9`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In9QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In9Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In9Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In10En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In10`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In10QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In10Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In10Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In11En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In11`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In11QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In11Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In11Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In12En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In12`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In12QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In12Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In12Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In13En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In13`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In13QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In13Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In13Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In14En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In14`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In14QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In14Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In14Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In15En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In15`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In15QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In15Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In15Txt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In16En`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In16`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In16QC`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In16Inv`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.In16Txt`,
			browseName: `${variableName}.In16Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in16Txt});
				},
			},
		});
	}

	public getLockView16InstanceMockupJSON(): object {
		return getLockView16MockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
