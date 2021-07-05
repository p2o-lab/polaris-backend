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

import {OperationMode} from '@p2olab/polaris-interface';
import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';

export function getOpModeDAMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			StateChannel: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateChannel`,
				dataType: 'Boolean'
			},
			StateOffAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOffAut`,
				dataType: 'Boolean'
			},
			StateOpAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOpAut`,
				dataType: 'Boolean'
			},
			StateAutAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateAutAut`,
				dataType: 'Boolean'
			},
			StateOffOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOffOp`,
				dataType: 'Boolean'
			},
			StateOpOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOpOp`,
				dataType: 'Boolean'
			},
			StateAutOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateAutOp`,
				dataType: 'Boolean'
			},
			StateOpAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOpAct`,
				dataType: 'Boolean'
			},
			StateAutAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateAutAct`,
				dataType: 'Boolean'
			},
			StateOffAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOffAct`,
				dataType: 'Boolean'
			}
		}
	);
}

export class OpModeDAMockup {
	public opMode: OperationMode = OperationMode.Offline;
	public stateChannel = false;
	public stateOffAut = false;
	public stateOpAut = false;
	public stateAutAut = false;
	public stateOffOp = false;
	public stateOpOp = false;
	public stateAutOp = false;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName,
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateChannel`,
			browseName: `${variableName}.StateChannel`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateChannel});
				}
			}
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateOffAut`,
			browseName: `${variableName}.StateOffAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateOffAut});
				}
			}
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateOpAut`,
			browseName: `${variableName}.StateOpAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateOpAut});
				}
			}
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateAutAut`,
			browseName: `${variableName}.StateAutAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateAutAut});
				}
			}
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateOffOp`,
			browseName: `${variableName}.StateOffOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateOffOp});
				},
				set: (variant: any) => {
					this.stateOffOp = variant.value;
					if (this.stateOffOp) {
						if (this.stateOpAct && !this.stateChannel) {
							this.opMode = OperationMode.Offline;
						} //TODO:else?
						this.stateOffOp = false;
					}
					return StatusCodes.Good;
				}
			}
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateOpOp`,
			browseName: `${variableName}.StateOpOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateOpOp});
				},
				set: (variant: any) => {
					this.stateOpOp = variant.value;
					if (this.stateOpOp) {
						if (!this.stateChannel) {
							this.opMode = OperationMode.Operator;
						}
						this.stateOpOp = false;
					}
					return StatusCodes.Good;
				}
			}
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateAutOp`,
			browseName: `${variableName}.StateAutOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateAutOp});
				},
				set: (variant: any) => {
					this.stateAutOp = variant.value;
					if (this.stateAutOp) {
						if (this.stateOpAct && !this.stateChannel) {
							this.opMode = OperationMode.Automatic;
						}
						this.stateAutOp = false;
					}
					return StatusCodes.Good;
				}
			}
		});

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateOffAct`,
			browseName: `${variableName}.StateOffAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateOffAct});
				}
			}
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateOpAct`,
			browseName: `${variableName}.StateOpAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateOpAct});
				}
			}
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StateAutAct`,
			browseName: `${variableName}.StateAutAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stateAutAct});
				}
			}
		});
	}

	public get stateOpAct(): boolean {
		return this.opMode === OperationMode.Operator;
	}

	public get stateAutAct(): boolean {
		return this.opMode === OperationMode.Automatic;
	}

	public get stateOffAct(): boolean {
		return this.opMode === OperationMode.Offline;
	}

	public getOpModeDAInstanceMockupJSON() {
		return getOpModeDAMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
