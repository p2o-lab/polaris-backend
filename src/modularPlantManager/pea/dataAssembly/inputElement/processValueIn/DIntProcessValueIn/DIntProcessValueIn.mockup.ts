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
import {getScaleSettingsDataItemOptions, ScaleSettingMockup} from '../../../baseFunction/scaleSettings/ScaleSetting.mockup';
import {getUnitSettingsDataItemOptions, UnitSettingsMockup} from '../../../baseFunction/unitSettings/UnitSettings.mockup';
import {getInputElementDataItemOptions, InputElementMockup} from '../../InputElement.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../DataAssemblyController.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/InputElement/DIntProcessValueIn';

function getDIntProcessValueInSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		VExt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VExt`,
			dataType: 'Int32'
		} as OpcUaNodeOptions
	});
}

export function getDIntProcessValueInDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getInputElementDataItemOptions(namespace, objectBrowseName),
			...getScaleSettingsDataItemOptions(namespace, objectBrowseName, 'DInt'),
			...getUnitSettingsDataItemOptions(namespace, objectBrowseName),
			...getDIntProcessValueInSpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getDIntProcessValueInOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getDIntProcessValueInDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class DIntProcessValueInMockup extends InputElementMockup{

	public scaleSettings: ScaleSettingMockup<'DInt'>;
	public unit: UnitSettingsMockup;
	public vExt = 0;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);
		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'DInt');
		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VExt`,
			browseName: `${variableName}.VExt`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vExt});
				},
				set: (variant: Variant): StatusCodes => {
					let newValue = parseInt(variant.value,10);
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

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.scaleSettings.getDataItemOptions(),
			...this.unit.getDataItemOptions(),
			...getDIntProcessValueInSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
