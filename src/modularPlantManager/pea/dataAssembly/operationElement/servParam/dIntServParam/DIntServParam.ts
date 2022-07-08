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

export type DIntServParamRuntime = ServParamRuntime & ScaleSettingsRuntime & UnitSettingsRuntime & ValueLimitationRuntime &{
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
	public readonly unitSettings: UnitSettings;
	public readonly valueLimitation: ValueLimitation;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.scaleSettings = new ScaleSettings(options, connectionHandler);
		this.unitSettings = new UnitSettings(options, connectionHandler);
		this.valueLimitation = new ValueLimitation(options, connectionHandler);

		this.communication.VExt = DataItemFactory.create(getDataItemModel(options, 'VExt'), connectionHandler);
		this.communication.VOp = DataItemFactory.create(getDataItemModel(options, 'VOp'), connectionHandler);
		this.communication.VInt = DataItemFactory.create(getDataItemModel(options, 'VInt'), connectionHandler);
		this.communication.VReq = DataItemFactory.create(getDataItemModel(options, 'VReq'), connectionHandler);
		this.communication.VOut = DataItemFactory.create(getDataItemModel(options, 'VOut'), connectionHandler);
		this.communication.VFbk = DataItemFactory.create(getDataItemModel(options, 'VFbk'), connectionHandler);


		this.defaultReadDataItem = this.communication.VOut;
		this.defaultReadDataItemType = 'number';

		this.defaultWriteDataItem = this.communication.VExt;
		this.defaultWriteDataItemType = 'number';
	}
}
