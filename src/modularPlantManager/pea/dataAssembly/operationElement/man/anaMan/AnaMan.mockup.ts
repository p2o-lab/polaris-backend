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

import {getUnitSettingsDataItemOptions, UnitSettingsMockup} from '../../../baseFunction/unitSettings/UnitSettings.mockup';
import {
	getScaleSettingsDataItemOptions,
	ScaleSettingMockup
} from '../../../baseFunction/scaleSettings/ScaleSetting.mockup';
import {
	getValueLimitationDataItemOptions,
	ValueLimitationMockup
} from '../../../baseFunction/valueLimitation/ValueLimitation.mockup';
import {getOperationElementDataItemOptions, OperationElementMockup} from '../../OperationElement.mockup';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../DataAssemblyController.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaMan';

function getAnaManSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		VOut: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VOut`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		VMan: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VMan`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		VRbk: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VRbk`,
			dataType: 'Float'
		} as OpcUaNodeOptions,

		VFbk: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VFbk`,
			dataType: 'Float'
		} as OpcUaNodeOptions
	});
}

export function getAnaManDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getOperationElementDataItemOptions(namespace, objectBrowseName),
			...getScaleSettingsDataItemOptions(namespace, objectBrowseName, 'Ana'),
			...getValueLimitationDataItemOptions(namespace, objectBrowseName, 'Ana'),
			...getUnitSettingsDataItemOptions(namespace, objectBrowseName),
			...getAnaManSpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getAnaManOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getAnaManDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class AnaManMockup extends OperationElementMockup {

	protected vRbk = 0;
	protected vMan = 0;
	protected vOut = 0
	protected vFbk = 0;

	public readonly scaleSettings: ScaleSettingMockup<'Ana'>;
	public readonly valueLimitation: ValueLimitationMockup<'Ana'>;
	public readonly unit: UnitSettingsMockup;
	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'Ana');
		this.valueLimitation = new ValueLimitationMockup(namespace, this.mockupNode, this.name,'Ana');
		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);

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

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.scaleSettings.getDataItemOptions(),
			...this.valueLimitation.getDataItemOptions(),
			...this.unit.getDataItemOptions(),
			...getAnaManSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
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
