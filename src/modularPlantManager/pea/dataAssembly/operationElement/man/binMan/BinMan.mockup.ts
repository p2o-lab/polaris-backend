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

import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../../../_extensions/osLevelDA/OSLevelDA.mockup';
import {getUnitDAMockupReferenceJSON, UnitDAMockup} from '../../../_extensions/unitDA/UnitDA.mockup';
import {
	getScaleSettingDAMockupReferenceJSON,
	ScaleSettingDAMockup
} from '../../../_extensions/scaleSettingsDA/ScaleSettingDA.mockup';
import {
	getValueLimitationDAMockupReferenceJSON,
	ValueLimitationDAMockup
} from '../../../_extensions/valueLimitationDA/ValueLimitationDA.mockup';
import {
	getSourceModeDAMockupReferenceJSON,
	SourceModeDAMockup
} from '../../../_extensions/sourceModeDA/SourceModeDA.mockup';

export function getBinManMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName),
			VOut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOut`,
				dataType: 'Boolean'
			},
			VState0: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VState0`,
				dataType: 'Boolean'
			},
			VState1: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VState1`,
				dataType: 'Boolean'
			},
			VMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VMan`,
				dataType: 'Boolean'
			},
			VRbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VRbk`,
				dataType: 'Boolean'
			},
			VFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFbk`,
				dataType: 'Boolean'
			}
		}
	);
}

export class BinManMockup {

	public readonly name: string;
	protected vState0= 'off';
	protected vState1= 'on';
	protected vRbk = false;
	protected vMan = false;
	protected vOut = false;
	protected vFbk = false;
	
	public readonly osLevel: OSLevelDAMockup;
	protected interval: Timeout | undefined;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		
		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=1;s=${variableName}.VState0`,
			browseName: `${variableName}.VState0`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.vState0});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=1;s=${variableName}.VState1`,
			browseName: `${variableName}.VState1`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.vState1});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VMan`,
			browseName: `${variableName}.VMan`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vMan});
				},
				set: (variant: Variant): StatusCodes => {
					this.vMan = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VOut`,
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
			nodeId: `ns=${namespace};s=${variableName}.VFbk`,
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
			nodeId: `ns=${namespace};s=${variableName}.VRbk`,
			browseName: `${variableName}.VRbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.vRbk});
				},
			},
		});
	}

	public getBinManMockupJSON() {
		return getBinManMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}

	public startCurrentTimeUpdate(): void {
		this.interval = global.setInterval(() => {
			this.vOut =!this.vOut;
		}, 1000);
	}

	public stopCurrentTimeUpdate(): void {
		if (this.interval) {
			global.clearInterval(this.interval);
		} else {
			throw new Error('No interval defined.');
		}
	}
}
