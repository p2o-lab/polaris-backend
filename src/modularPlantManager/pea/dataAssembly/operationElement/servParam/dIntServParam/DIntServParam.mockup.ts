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
import {getServParamDataItemOptions, ServParamMockup} from '../ServParam.mockup';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../DataAssemblyController.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/OperationElement/DIntServParam';

function getDIntServParamSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		Sync: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.Sync`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		VExt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VExt`,
			dataType: 'Int32'
		} as OpcUaNodeOptions,
		VOp: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VOp`,
			dataType: 'Int32'
		} as OpcUaNodeOptions,
		VInt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VInt`,
			dataType: 'Int32'
		} as OpcUaNodeOptions,
		VReq: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VReq`,
			dataType: 'Int32'
		} as OpcUaNodeOptions,
		VOut: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VOut`,
			dataType: 'Int32'
		} as OpcUaNodeOptions,
		VFbk: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.VFbk`,
			dataType: 'Int32'
		} as OpcUaNodeOptions
	});
}

export function getDIntServParamDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getServParamDataItemOptions(namespace, objectBrowseName),
			...getUnitSettingsDataItemOptions(namespace, objectBrowseName),
			...getScaleSettingsDataItemOptions(namespace, objectBrowseName, 'DInt'),
			...getValueLimitationDataItemOptions(namespace, objectBrowseName, 'DInt'),
			...getDIntServParamSpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getDIntServParamOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getDIntServParamDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class DIntServParamMockup extends ServParamMockup {

	protected vExt = 0;
	protected vOp = 0;
	protected vInt = 0;
	protected vReq = 0;
	protected vOut = 0;
	protected vFbk = 0;

	public readonly unit: UnitSettingsMockup;
	public readonly scaleSettings: ScaleSettingMockup<'DInt'>;
	public readonly valueLimitation: ValueLimitationMockup<'DInt'>;

	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.unit = new UnitSettingsMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingMockup(namespace, this.mockupNode, this.name, 'DInt');
		this.valueLimitation = new ValueLimitationMockup(namespace, this.mockupNode, this.name, 'DInt');

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
					this.vExt = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VOp`,
			browseName: `${variableName}.VOp`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vOp});
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
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vInt});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.VReq`,
			browseName: `${variableName}.VReq`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.vReq});
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
	}

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.unit.getDataItemOptions(),
			...this.scaleSettings.getDataItemOptions(),
			...this.valueLimitation.getDataItemOptions(),
			...getDIntServParamSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
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
