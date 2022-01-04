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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getOSLevelMockupReferenceJSON, OSLevelMockup} from '../../../_extensions/osLevel/OSLevel.mockup';
import {BinViewMockup, getBinViewMockupReferenceJSON} from '../BinView.mockup';

export function getBinMonMockupReferenceJSON(namespace: number, objectBrowseName: string): object {
	return (
		{
			...getOSLevelMockupReferenceJSON(namespace, objectBrowseName),
			...getBinViewMockupReferenceJSON(namespace,objectBrowseName),
			VFlutEn: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFlutEn`,
				dataType: 'Boolean'
			},
			VFlutTi: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFlutTi`,
				dataType: 'Float'
			},
			VFlutCnt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFlutCnt`,
				dataType: 'Int16'
			},
			VFlutAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFlutAct`,
				dataType: 'Boolean'
			}
		}
	);
}

export class BinMonMockup extends BinViewMockup{

	public vFlutEn = false;
	public vFlutTi = 0;
	public vFlutCnt = 0;
	public vFlutAct = false;
	public osLevel: OSLevelMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.osLevel = new OSLevelMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFlutEn`,
			browseName: `${variableName}.VFlutEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vFlutEn});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFlutTi`,
			browseName: `${variableName}.VFlutTi`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vFlutTi});
				},
				set: (variant: Variant): StatusCodes => {
					this.vFlutTi = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFlutCnt`,
			browseName: `${variableName}.VFlutCnt`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vFlutCnt});
				},
				set: (variant: Variant): StatusCodes => {
					this.vFlutCnt = parseInt(variant.value,10);
					return StatusCodes.Good;
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFlutAct`,
			browseName: `${variableName}.VFlutAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vFlutAct});
				},
			},
		});
	}

	public getBinMonInstanceMockupJSON(): object {
		return getBinMonMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
