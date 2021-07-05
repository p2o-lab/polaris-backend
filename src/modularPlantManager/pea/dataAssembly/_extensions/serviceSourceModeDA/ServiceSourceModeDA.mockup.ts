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

import {OperationMode, ServiceSourceMode} from '@p2olab/polaris-interface';
import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getUnitDAMockupReferenceJSON} from '../unitDA/UnitDA.mockup';

export function getServiceSourceModeDAMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			SrcChannel: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcChannel`,
				dataType: 'Boolean'
			},
			SrcIntAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcIntAct`,
				dataType: 'Boolean'
			},
			SrcIntAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcIntAut`,
				dataType: 'Boolean'
			},
			SrcIntOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcIntOp`,
				dataType: 'Boolean'
			},
			SrcExtAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcExtAct`,
				dataType: 'Boolean'
			},
			SrcExtAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcExtAut`,
				dataType: 'Boolean'
			},
			SrcExtOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SrcExtOp`,
				dataType: 'Boolean'
			}
		}
	);
}

export class ServiceSourceModeDAMockup {
	public srcMode: ServiceSourceMode = ServiceSourceMode.Extern;

	public srcChannel = false;
	public srcIntAct = false;
	public srcIntAut = false;
	public srcIntOp = false;
	public srcExtAct = false;
	public srcExtAut = false;
	public srcExtOp = false;
	public readonly  mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName,
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcChannel`,
			browseName: `${variableName}.SrcChannel`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcChannel});
				},
			},
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcExtAut`,
			browseName: `${variableName}.SrcExtAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcExtAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcIntAut`,
			browseName: `${variableName}.SrcIntAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcIntAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcIntOp`,
			browseName: `${variableName}.SrcIntOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcIntOp});
				},
				set: (variant: Variant) => {
					this.srcIntOp = variant.value;
					if (this.srcIntOp) {
						if (this.srcChannel) {
							this.srcMode = ServiceSourceMode.Intern;
							this.srcIntAct = true;
							this.srcExtAct = false;
						} //TODO else?
					} //TODO else?
					this.srcIntOp = false;
					return StatusCodes.Good;
				},
			},
		});


		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcExtOp`,
			browseName: `${variableName}.SrcExtOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcExtOp});
				},
				set: (variant: Variant) => {
					this.srcExtOp = variant.value;
					if (this.srcExtOp) {
						if (this.srcChannel) {
							this.srcMode = ServiceSourceMode.Extern;
							this.srcIntAct = false;
							this.srcExtAct = true;
						}
					}
					this.srcExtOp = false;
					return StatusCodes.Good;
				},
			},
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcIntAct`,
			browseName: `${variableName}.SrcIntAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcIntAct});
				},

			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SrcExtAct`,
			browseName: `${variableName}.SrcExtAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.srcExtAct});
				},

			},
		});

	}

	public getServiceSourceModeDAInstanceMockupJSON() {
		return getServiceSourceModeDAMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
