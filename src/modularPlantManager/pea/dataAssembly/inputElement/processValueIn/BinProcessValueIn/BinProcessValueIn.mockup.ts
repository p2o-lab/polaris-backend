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
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../../_extensions/wqcDA/WQCDA.mockup';
import {getInputElementMockupReferenceJSON} from '../../InputElement.mockup';

export function getBinProcessValueInMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {
	return (
		{
			...getInputElementMockupReferenceJSON(namespace, objectBrowseName),
			VExt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VExt`,
				dataType: 'Boolean'
			},
			VState0: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VState0`,
				dataType: 'String'
			},
			VState1: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VState1`,
				dataType: 'String'
			}
		}
	);
}

export class BinProcessValueInMockup{

	public readonly name: string;
	public wqc: WQCDAMockup;
	public vExt = false;
	public vState0 = 'state0_active';
	public vState1 = 'state1_active';
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VExt`,
			browseName: `${variableName}.VExt`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vExt});
				},
				set: (variant: Variant): StatusCodes => {
					this.vExt = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VState0`,
			browseName: `${variableName}.VState0`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.vState0});
				},
				set: (variant: Variant): StatusCodes => {
					this.vState0 = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VState1`,
			browseName: `${variableName}.VState1`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.vState1});
				},
				set: (variant: Variant): StatusCodes => {
					this.vState1 = variant.value;
					return StatusCodes.Good;
				},
			},
		});
	}

	public getBinProcessValueInInstanceMockupJSON() {
		return getBinProcessValueInMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
