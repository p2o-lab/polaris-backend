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

import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {DataItem} from '../../../dataItem/DataItem';
import {ServParam, ServParamRuntime} from '../ServParam';
import {
	ScaleSettings,
	ScaleSettingsRuntime,
	UnitSettingsRuntime,
	UnitSettings,
	ValueLimitation,
	ValueLimitationRuntime
} from '../../../baseFunction';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../../dataItem/DataItemFactory';
import {keys} from 'ts-transformer-keys';

export type DIntServParamRuntime = ServParamRuntime & ScaleSettingsRuntime & UnitSettingsRuntime & ValueLimitationRuntime &{
	VExt: DataItem<number>;
	VOp: DataItem<number>;
	VInt: DataItem<number>;
	VReq: DataItem<number>;
	VOut: DataItem<number>;
	VFbk: DataItem<number>;
};

export class DIntServParam extends ServParam {

	public readonly dataItems!: DIntServParamRuntime;

	public scaleSettings!: ScaleSettings;
	public unitSettings!: UnitSettings;
	public valueLimitation!: ValueLimitation;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}	

		this.defaultReadDataItem = this.dataItems.VOut;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.dataItems.VExt;
		this.defaultWriteDataItemType = 'number';
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
		this.scaleSettings = new ScaleSettings(this.dataItems);
		this.unitSettings = new UnitSettings(this.dataItems);
		this.valueLimitation = new ValueLimitation(this.dataItems);
	}
}
