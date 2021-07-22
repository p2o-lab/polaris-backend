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

export function getAnaManMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName),
			...getScaleSettingDAMockupReferenceJSON(namespace,objectBrowseName,'Float'),
			...getValueLimitationDAMockupReferenceJSON(namespace,objectBrowseName, 'Float'),
			...getUnitDAMockupReferenceJSON(namespace,objectBrowseName),
			VOut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOut`,
				dataType: 'Float'
			},
			VMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VMan`,
				dataType: 'Float'
			},
			VRbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VRbk`,
				dataType: 'Float'
			},

			VFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFbk`,
				dataType: 'Float'
			}
		}
	);
}

export class AnaManMockup {

	public readonly name: string;
	protected vRbk = 0;
	protected vMan = 0;
	protected vOut = 0
	protected vFbk = 0;
	
	public readonly osLevel: OSLevelDAMockup;
	public readonly scaleSettings: ScaleSettingDAMockup<DataType.Double>;
	public readonly valueLimitation: ValueLimitationDAMockup<DataType.Double>;
	public readonly unit: UnitDAMockup;
	protected interval: Timeout | undefined;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		
		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingDAMockup(namespace, this.mockupNode, this.name, DataType.Double);
		this.valueLimitation = new ValueLimitationDAMockup(namespace, this.mockupNode, this.name,DataType.Double);
		this.unit = new UnitDAMockup(namespace, this.mockupNode, this.name);
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VMan`,
			browseName: `${variableName}.VMan`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vMan});
				},
				set: (variant: Variant): StatusCodes => {
					this.vMan = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VOut`,
			browseName: `${variableName}.VOut`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vOut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFbk`,
			browseName: `${variableName}.VFbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VRbk`,
			browseName: `${variableName}.VRbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vRbk});
				},
			},
		});
	}

	public getAnaManMockupJSON() {
		return getAnaManMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}

	public startCurrentTimeUpdate(): void {
		this.interval = global.setInterval(() => {
			this.vOut = Math.random();
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
