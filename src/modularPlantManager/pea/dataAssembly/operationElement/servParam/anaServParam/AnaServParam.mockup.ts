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
import {getUnitDAMockupReferenceJSON, UnitDAMockup} from '../../../_extensions/unitDA/UnitDA.mockup';
import {
	getScaleSettingDAMockupReferenceJSON,
	ScaleSettingDAMockup
} from '../../../_extensions/scaleSettingsDA/ScaleSettingDA.mockup';
import {
	getValueLimitationDAMockupReferenceJSON,
	ValueLimitationDAMockup
} from '../../../_extensions/valueLimitationDA/ValueLimitationDA.mockup';
import {getServParamMockupReferenceJSON, ServParamMockup} from '../ServParam.mockup';

export function getAnaServParamMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {

	return ({
			...getServParamMockupReferenceJSON(namespace, objectBrowseName),
			...getUnitDAMockupReferenceJSON(namespace,objectBrowseName),
			...getScaleSettingDAMockupReferenceJSON(namespace,objectBrowseName,'Float'),
			...getValueLimitationDAMockupReferenceJSON(namespace,objectBrowseName, 'Float'),
			VExt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VExt`,
				dataType: 'Float'
			},
			VOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOp`,
				dataType: 'Float'
			},
			VInt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VInt`,
				dataType: 'Float'
			},
			VReq: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VReq`,
				dataType: 'Float'
			},
			VOut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VOut`,
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

export class AnaServParamMockup extends ServParamMockup{

	protected vExt = 0;
	protected vOp = 0;
	protected vInt = 0;
	protected vReq = 0;
	protected vOut = 0
	protected vFbk = 0;
	
	public readonly unit: UnitDAMockup;
	public readonly scaleSettings: ScaleSettingDAMockup<DataType.Double>;
	public readonly valueLimitation: ValueLimitationDAMockup<DataType.Double>;
	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.unit = new UnitDAMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingDAMockup(namespace, this.mockupNode, this.name, DataType.Double);
		this.valueLimitation = new ValueLimitationDAMockup(namespace, this.mockupNode, this.name,DataType.Double);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VExt`,
			browseName: `${variableName}.VExt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vExt});
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
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vOp});
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
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vInt});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VReq`,
			browseName: `${variableName}.VReq`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vReq});
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
	}

	public getAnaServParamMockupJSON(): object {
		return getAnaServParamMockupReferenceJSON(
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
