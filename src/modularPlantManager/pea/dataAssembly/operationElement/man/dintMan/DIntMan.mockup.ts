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

import {getOSLevelMockupReferenceJSON, OSLevelMockup} from '../../../baseFunction/osLevel/OSLevel.mockup';
import {getUnitMockupReferenceJSON, UnitMockup} from '../../../baseFunction/unit/Unit.mockup';
import {
	getScaleSettingsMockupReferenceJSON,
	ScaleSettingMockup
} from '../../../baseFunction/scaleSettings/ScaleSetting.mockup';
import {
	getValueLimitationMockupReferenceJSON,
	ValueLimitationMockup
} from '../../../baseFunction/valueLimitation/ValueLimitation.mockup';

export function getDIntManMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {

	return ({
			...getOSLevelMockupReferenceJSON(namespace,objectBrowseName),
			...getScaleSettingsMockupReferenceJSON(namespace,objectBrowseName,'Int32'),
			...getValueLimitationMockupReferenceJSON(namespace,objectBrowseName, 'Int32'),
			...getUnitMockupReferenceJSON(namespace,objectBrowseName),
			VOut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOut`,
				dataType: 'Int32'
			},
			VMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VMan`,
				dataType: 'Int32'
			},
			VRbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VRbk`,
				dataType: 'Int32'
			},

			VFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VFbk`,
				dataType: 'Int32'
			}
		}
	);
}

export class DIntManMockup {
	public readonly name: string;
	protected vRbk = 0;
	protected vMan = 0;
	protected vOut = 0;
	protected vFbk = 0;
	
	public readonly osLevel: OSLevelMockup;
	public readonly scaleSettings: ScaleSettingMockup<DataType.Int32>;
	public readonly valueLimitation: ValueLimitationMockup<DataType.Int32>;
	public readonly unit: UnitMockup;
	protected interval: Timeout | undefined;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		
		this.osLevel = new OSLevelMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, DataType.Int32);
		this.valueLimitation = new ValueLimitationMockup(namespace, this.mockupNode, this.name,DataType.Int32);
		this.unit = new UnitMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VMan`,
			browseName: `${variableName}.VMan`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vMan});
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
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vOut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VFbk`,
			browseName: `${variableName}.VFbk`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VRbk`,
			browseName: `${variableName}.VRbk`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vRbk});
				},
			},
		});
	}

	public getDIntManMockupJSON(): object {
		return getDIntManMockupReferenceJSON(
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
