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
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../../../_extensions/opModeDA/OpModeDA.mockup';
import {
	getServiceSourceModeDAMockupReferenceJSON,
	ServiceSourceModeDAMockup
} from '../../../_extensions/serviceSourceModeDA/ServiceSourceModeDA.mockup';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../../_extensions/wqcDA/WQCDA.mockup';
import {DataAssemblyMockup, getDataAssemblyMockupReferenceJSON} from '../../../DataAssembly.mockup';
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

export function getAnaServParamMockupReferenceJSON(
	namespace = 1,
	objectBrowseName = 'P2OGalaxy') {

	return ({
			...getDataAssemblyMockupReferenceJSON(namespace,objectBrowseName),
			...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName),
			...getOpModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getServiceSourceModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
			...getUnitDAMockupReferenceJSON(namespace,objectBrowseName),
			...getScaleSettingDAMockupReferenceJSON(namespace,objectBrowseName,'Float'),
			...getValueLimitationDAMockupReferenceJSON(namespace,objectBrowseName, 'Float'),
			Sync: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Sync`,
				dataType: 'Boolean'
			},
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

export class AnaServParamMockup {

	public readonly name: string;
	protected vExt = 0;
	protected vOp = 0;
	protected vInt = 0;
	protected vReq = 0;
	protected vOut = 0
	protected vFbk = 0;
	public readonly dataAssembly: DataAssemblyMockup;
	public readonly osLevel: OSLevelDAMockup;
	public readonly opMode: OpModeDAMockup;
	public readonly serviceSourceMode: ServiceSourceModeDAMockup;
	public readonly wqc: WQCDAMockup;
	public readonly unit: UnitDAMockup;
	public readonly scaleSettings: ScaleSettingDAMockup<DataType.Double>;
	public readonly valueLimitation: ValueLimitationDAMockup<DataType.Double>;
	protected interval: Timeout | undefined;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		this.dataAssembly = new DataAssemblyMockup(namespace, this.mockupNode, this.name);
		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.opMode = new OpModeDAMockup(namespace, this.mockupNode, this.name);
		this.serviceSourceMode = new ServiceSourceModeDAMockup(namespace, this.mockupNode, this.name);
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
		this.unit = new UnitDAMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingDAMockup(namespace, this.mockupNode, this.name, DataType.Double);
		this.valueLimitation = new ValueLimitationDAMockup(namespace, this.mockupNode, this.name,DataType.Double);

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
					this.vExt = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.VOp`,
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
			nodeId: `ns=${namespace};s=${variableName}.VInt`,
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
			nodeId: `ns=${namespace};s=${variableName}.VReq`,
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
			nodeId: `ns=${namespace};s=${variableName}.VOut`,
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
			nodeId: `ns=${namespace};s=${variableName}.VFbk`,
			browseName: `${variableName}.VFbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vFbk});
				},
			},
		});
	}

	public getAnaServParamMockupJSON() {
		return getAnaServParamMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name || 'UnqualifiedName');
	}

	public startCurrentTimeUpdate(): void {
		this.interval = global.setInterval(() => {
			this.vOut = Math.random();
		}, 1000);
	}

	public stopCurrentTimeUpdate(): void {
		if (this.interval) {
			global.clearInterval(this.interval);
		}
	}
}
