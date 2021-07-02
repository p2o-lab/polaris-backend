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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../../_extensions/wqcDA/WQCDA.mockup';
import {getScaleSettingDAMockupReferenceJSON, ScaleSettingDAMockup} from '../../../_extensions/scaleSettingsDA/ScaleSettingDA.mockup';
import {getUnitDAMockupReferenceJSON, UnitDAMockup} from '../../../_extensions/unitDA/UnitDA.mockup';
import {getInputElementMockupReferenceJSON} from '../../InputElement.mockup';

export function getAnaProcessValueInMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {
	return (
		{
			...getInputElementMockupReferenceJSON(namespace, objectBrowseName),
			...getScaleSettingDAMockupReferenceJSON(namespace, objectBrowseName, 'Float'),
			...getUnitDAMockupReferenceJSON(namespace, objectBrowseName),
			VExt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.VExt`,
				dataType: 'Float'
			}
		}
	);
}

export class AnaProcessValueInMockup{

	public readonly name: string;
	public wqc: WQCDAMockup;
	public scaleSettings: ScaleSettingDAMockup<DataType.Double>;
	public unit: UnitDAMockup;
	public vExt = 0;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingDAMockup<DataType.Double>(namespace, this.mockupNode, this.name, DataType.Double);
		this.unit = new UnitDAMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VExt`,
			browseName: `${variableName}.VExt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vExt});
				},
				set: (variant: Variant): StatusCodes => {
					let newValue = parseFloat(variant.value);
					if (newValue < this.scaleSettings.vSclMin) {
						newValue = this.scaleSettings.vSclMin;
					} else if (newValue > this.scaleSettings.vSclMax) {
						newValue = this.scaleSettings.vSclMax;
					}
					this.vExt = newValue;
					return StatusCodes.Good;
				},
			},
		});

	}

	public getAnaProcessValueInInstanceMockupJSON() {
		return getAnaProcessValueInMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
