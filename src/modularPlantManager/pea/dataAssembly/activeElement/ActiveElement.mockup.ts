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
import {catPEAMockup} from '../../PEA.mockup';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../_extensions/opModeDA/OpModeDA.mockup';
import {
	getServiceSourceModeDAMockupReferenceJSON,
	ServiceSourceModeDAMockup
} from '../_extensions/serviceSourceModeDA/ServiceSourceModeDA.mockup';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../_extensions/wqcDA/WQCDA.mockup';
import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../_extensions/osLevelDA/OSLevelDA.mockup';
import {getServParamMockupReferenceJSON} from '../operationElement/servParam/ServParam.mockup';
import {getDataAssemblyMockupReferenceJSON} from '../DataAssembly.mockup';
import {getSourceModeDAMockupReferenceJSON} from '../_extensions/sourceModeDA/SourceModeDA.mockup';


export function getActiveElementMockupReferenceJSON(
	namespace = 1,
	objectBrowseName = 'P2OGalaxy') {

	return ({
			...getDataAssemblyMockupReferenceJSON(namespace,objectBrowseName),
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
			...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName)
		}
	);
}

export class ActiveElementMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});

		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
	}

	public getActiveElementMockupJSON() {
		return getActiveElementMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name || 'UnqualifiedName');
	}
}
