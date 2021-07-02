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

import {Namespace, UAObject} from 'node-opcua';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../_extensions/wqcDA/WQCDA.mockup';
import {catPEAMockup} from '../../../../logging';

export function getDiagnosticElementMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {
	return (
		{	
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
		}
	);
}

export abstract class DiagnosticElementMockup {

	public readonly name: string;
	public readonly wqc: WQCDAMockup;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		catPEAMockup.debug(`Add variable ${variableName}`);

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});

		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
	}

	public getDiagnosticElementInstanceMockupJSON() {
		return getDiagnosticElementMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
