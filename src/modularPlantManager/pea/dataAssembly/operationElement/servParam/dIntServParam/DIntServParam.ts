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
import {OpcUaConnection, DataItem} from '../../../../connection';
import {ServParam, ServParamRuntime} from '../ServParam';
import {
	ScaleSettings,
	ScaleSettingsRuntime,
	UnitDataAssemblyRuntime,
	UnitController,
	ValueLimitation,
	ValueLimitationRuntime
} from '../../../_extensions';

export type DIntServParamRuntime = ServParamRuntime & ScaleSettingsRuntime & UnitDataAssemblyRuntime & ValueLimitationRuntime &{
	VExt: DataItem<number>;
	VOp: DataItem<number>;
	VInt: DataItem<number>;
	VReq: DataItem<number>;
	VOut: DataItem<number>;
	VFbk: DataItem<number>;
};

export class DIntServParam extends ServParam {
	public readonly communication!: DIntServParamRuntime;
	public readonly scaleSettings: ScaleSettings;
	public readonly unitSettings: UnitController;
	public readonly valueLimitation: ValueLimitation;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.scaleSettings = new ScaleSettings(this);
		this.unitSettings = new UnitController(this);
		this.valueLimitation = new ValueLimitation(this);

		this.communication.VExt = this.createDataItem('VExt', 'number', 'write');
		this.communication.VOp = this.createDataItem('VOp', 'number', 'write');
		this.communication.VInt = this.createDataItem('VInt', 'number');
		this.communication.VReq = this.createDataItem('VReq','number');
		this.communication.VOut = this.createDataItem('VOut', 'number');
		this.communication.VFbk = this.createDataItem('VFbk', 'number');

		this.communication.VSclMin = this.createDataItem('VSclMin', 'number');
		this.communication.VSclMax = this.createDataItem('VSclMax', 'number');
		this.communication.VUnit = this.createDataItem('VUnit', 'number');
		this.communication.VMin = this.createDataItem('VMin', 'number');
		this.communication.VMax = this.createDataItem('VMax', 'number');

		this.defaultReadDataItem = this.communication.VOut;
		this.defaultReadDataItemType = 'number';

		this.defaultWriteDataItem = this.communication.VExt;
		this.defaultWriteDataItemType = 'number';
	}
}
