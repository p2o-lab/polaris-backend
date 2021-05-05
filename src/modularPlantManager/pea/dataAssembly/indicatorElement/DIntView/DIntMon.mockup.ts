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
import {getDataAssemblyMockupReferenceJSON} from '../../DataAssembly.mockup';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../_extensions/wqcDA/WQCDA.mockup';
import {
	getScaleSettingDAMockupReferenceJSON,
	ScaleSettingDAMockup
} from '../../_extensions/scaleSettingsDA/ScaleSettingDA.mockup';
import {getUnitDAMockupReferenceJSON, UnitDAMockup} from '../../_extensions/unitDA/UnitDA.mockup';
import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../../_extensions/osLevelDA/OSLevelDA.mockup';
import {
	getLimitMonitoringDAMockupReferenceJSON,
	LimitMonitoringDAMockup
} from '../../_extensions/limitMonitoringDA/LimitMonitoringDA.mockup';

export function getDIntMonMockupReferenceJSON(
	namespace = 1,
	objectBrowseName = 'P2OGalaxy') {
	return (
		{
			...getDataAssemblyMockupReferenceJSON(namespace, objectBrowseName),
			...getWQCDAMockupReferenceJSON(namespace, objectBrowseName),
			...getScaleSettingDAMockupReferenceJSON(namespace, objectBrowseName, 'Int32'),
			...getUnitDAMockupReferenceJSON(namespace, objectBrowseName),
			...getOSLevelDAMockupReferenceJSON(namespace, objectBrowseName),
			...getLimitMonitoringDAMockupReferenceJSON(namespace, objectBrowseName),
			V: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.V`,
				dataType: 'Int32'
			}
		}
	);
}

export abstract class DIntMonMockup {

	public readonly name: string;
	protected v = 0;
	public wqc: WQCDAMockup;
	public scaleSettings: ScaleSettingDAMockup<DataType.Int32>;
	public unit: UnitDAMockup;
	public osLevel: OSLevelDAMockup;
	public limitMonitoring: LimitMonitoringDAMockup;
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
		this.scaleSettings = new ScaleSettingDAMockup<DataType.Int32>(namespace, this.mockupNode, this.name, DataType.Int32);
		this.unit = new UnitDAMockup(namespace, this.mockupNode, this.name);
		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.limitMonitoring = new LimitMonitoringDAMockup(namespace, this.mockupNode, this.name, DataType.Int32);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.V`,
			browseName: `${variableName}.V`,
			dataType: DataType.Int32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Int32, value: this.v});
				},
			},
		});
	}

	public getDIntMonInstanceMockupJSON() {
		return getDIntMonMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name || 'UnqualifiedName');
	}
}