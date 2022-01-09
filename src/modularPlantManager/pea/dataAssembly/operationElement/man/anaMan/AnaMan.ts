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
import {
	ScaleSettings, ScaleSettingsRuntime,
	UnitSettingsRuntime, UnitSettings,
	ValueLimitation, ValueLimitationRuntime
} from '../../../baseFunction';
import {OperationElement, OperationElementRuntime} from '../../OperationElement';

export type AnaManRuntime =
	OperationElementRuntime & UnitSettingsRuntime
	& ValueLimitationRuntime & ScaleSettingsRuntime
	& {
	VOut: DataItem<number>;
	VRbk: DataItem<number>;
	VFbk: DataItem<number>;
	VMan: DataItem<number>;
};

export class AnaMan extends OperationElement {

	public readonly communication!: AnaManRuntime;
	public readonly scaleSettings: ScaleSettings;
	public readonly unitSettings: UnitSettings;
	public readonly valueLimitation: ValueLimitation;


	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.communication.VOut = this.createDataItem('VOut', 'number');
		this.communication.VRbk = this.createDataItem('VRbk', 'number');
		this.communication.VFbk = this.createDataItem('VFbk','number');
		this.communication.VMan = this.createDataItem('VMan', 'number','write');

		this.unitSettings = new UnitSettings(this);
		this.scaleSettings = new ScaleSettings(this);
		this.valueLimitation = new ValueLimitation(this);

		this.defaultReadDataItem = this.communication.VOut;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.communication.VMan;
		this.defaultWriteDataItemType = 'number';
	}
}
