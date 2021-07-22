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

import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaConnection, OpcUaDataItem} from '../../../../connection';
import {ServParam, ServParamRuntime} from '../ServParam';
import {ScaleSettings, ScaleSettingsRuntime} from '../../../_extensions/scaleSettingsDA/ScaleSettings';
import {UnitDataAssemblyRuntime, UnitSettings} from '../../../_extensions/unitDA/UnitSettings';
import {ValueLimitation, ValueLimitationRuntime} from '../../../_extensions/valueLimitationDA/ValueLimitation';

export type AnaServParamRuntime = ServParamRuntime & ScaleSettingsRuntime & UnitDataAssemblyRuntime & ValueLimitationRuntime & {
	VExt: OpcUaDataItem<number>;
	VOp: OpcUaDataItem<number>;
	VInt: OpcUaDataItem<number>;
	VReq: OpcUaDataItem<number>;
	VOut: OpcUaDataItem<number>;
	VFbk: OpcUaDataItem<number>;
};

export class AnaServParam extends ServParam {
	public readonly communication!: AnaServParamRuntime;
	public readonly scaleSettings: ScaleSettings;
	public readonly unitSettings: UnitSettings;
	public readonly valueLimitation: ValueLimitation;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.scaleSettings = new ScaleSettings(this);
		this.unitSettings = new UnitSettings(this);
		this.valueLimitation = new ValueLimitation(this);

		this.communication.VExt = this.createDataItem('VExt', 'write', 'number');
		this.communication.VOp = this.createDataItem('VOp', 'write', 'number');
		this.communication.VInt = this.createDataItem('VInt', 'read', 'number');
		this.communication.VReq = this.createDataItem('VReq', 'read', 'number');
		this.communication.VOut = this.createDataItem('VOut', 'read', 'number');
		this.communication.VFbk = this.createDataItem('VFbk', 'read', 'number');

		this.communication.VSclMin = this.createDataItem('VSclMin', 'read', 'number');
		this.communication.VSclMax = this.createDataItem('VSclMax', 'read', 'number');
		this.communication.VUnit = this.createDataItem('VUnit', 'read', 'number');
		this.communication.VMin = this.createDataItem('VMin', 'read', 'number');
		this.communication.VMax = this.createDataItem('VMax', 'read', 'number');

		this.defaultReadDataItem = this.communication.VOut;
		this.defaultReadDataItemType = 'number';
	}
}
