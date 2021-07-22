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
import {
	getServiceSourceModeDAMockupReferenceJSON, ServiceSourceModeDAMockup
} from '../../_extensions/serviceSourceModeDA/ServiceSourceModeDA.mockup';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../_extensions/wqcDA/WQCDA.mockup';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../../_extensions/opModeDA/OpModeDA.mockup';
import {getOperationElementMockupReferenceJSON, OperationElementMockup} from '../OperationElement.mockup';


export function getServParamMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getOperationElementMockupReferenceJSON(namespace, objectBrowseName),
			...getOpModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getServiceSourceModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
			Sync: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Sync`,
				dataType: 'Boolean'
			}
		}
	);
}

export class ServParamMockup extends OperationElementMockup{

	public readonly varSync: boolean = false;
	protected opMode: OpModeDAMockup;
	protected serviceSourceMode: ServiceSourceModeDAMockup;
	protected wqc: WQCDAMockup;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.opMode = new OpModeDAMockup(namespace, this.mockupNode, this.name);
		this.serviceSourceMode = new ServiceSourceModeDAMockup(namespace, this.mockupNode, this.name);
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Sync`,
			browseName: `${variableName}.Sync`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.varSync});
				},
			},
		});
	}

	public getServParamMockupJSON() {
		return getServParamMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
