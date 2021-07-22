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

// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;
import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../../../_extensions/opModeDA/OpModeDA.mockup';
import {
	getServiceSourceModeDAMockupReferenceJSON,
	ServiceSourceModeDAMockup
} from '../../../_extensions/serviceSourceModeDA/ServiceSourceModeDA.mockup';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../../_extensions/wqcDA/WQCDA.mockup';

import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../../../_extensions/osLevelDA/OSLevelDA.mockup';
import {getServParamMockupReferenceJSON, ServParamMockup} from '../ServParam.mockup';
import {BinServParam} from './BinServParam';

export function getBinServParamMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getServParamMockupReferenceJSON(namespace,objectBrowseName),
			VExt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VExt`,
				dataType: 'Boolean'
			},
			VOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOp`,
				dataType: 'Boolean'
			},
			VInt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VInt`,
				dataType: 'Boolean'
			},
			VReq: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VReq`,
				dataType: 'Boolean'
			},
			VOut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOut`,
				dataType: 'Boolean'
			},
			VFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFbk`,
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

export class BinServParamMockup extends ServParamMockup{

	protected vExt = false;
	protected vOp = false;
	protected vInt = false;
	protected vReq = false;
	protected vOut = false;
	protected vFbk = false;

	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VExt`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.VOp`,
			browseName: `${variableName}.VOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.vOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
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
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VReq`,
			browseName: `${variableName}.VReq`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vReq});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VOut`,
			browseName: `${variableName}.VOut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vOut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFbk`,
			browseName: `${variableName}.VFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vFbk});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VState0`,
			browseName: `${variableName}.VState0`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: 'off'});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VState1`,
			browseName: `${variableName}.VState1`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: 'on'});
				},
			},
		});

	}

	public getBinServParamMockupJSON() {
		return getBinServParamMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}

	public startCurrentTimeUpdate(): void {
		this.interval = global.setInterval(() => {
			this.vOut = !this.vOut;
		}, 1000);
	}

	public stopCurrentTimeUpdate(): void {
		if (this.interval) {
			global.clearInterval(this.interval);
		}else {
			throw new Error('No interval defined.');
		}
	}
}
