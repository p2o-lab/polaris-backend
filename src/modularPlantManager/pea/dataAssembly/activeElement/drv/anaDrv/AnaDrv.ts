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
import {Drv, DrvRuntime} from '../Drv';
import {SourceModeController, SourceModeRuntime} from '../../../_extensions';

export type AnaDrvRuntime = DrvRuntime & SourceModeRuntime & {
	RpmSclMax: DataItem<number>;
	RpmSclMin: DataItem<number>;

	RpmUnit: DataItem<number>;

	RpmMin: DataItem<number>;
	RpmMax: DataItem<number>;

	RpmInt: DataItem<number>;
	RpmMan: DataItem<number>;

	Rpm: DataItem<number>;
	RpmFbk: DataItem<number>;
	RpmFbkCalc: DataItem<boolean>;
	RpmRbk: DataItem<number>;
};

export class AnaDrv extends Drv {

	public readonly communication!: AnaDrvRuntime;
	readonly sourceMode: SourceModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.sourceMode = new SourceModeController(this);

		this.communication.RpmSclMax = this.createDataItem('RpmSclMax', 'number');
		this.communication.RpmSclMin = this.createDataItem('RpmSclMin', 'number');

		this.communication.RpmUnit = this.createDataItem('RpmUnit', 'number');

		this.communication.RpmMin = this.createDataItem('RpmMin',  'number');
		this.communication.RpmMax = this.createDataItem('RpmMax', 'number');

		this.communication.RpmInt = this.createDataItem('RpmInt', 'number');
		this.communication.RpmMan = this.createDataItem('RpmMan', 'number');

		this.communication.Rpm = this.createDataItem('Rpm', 'number');
		this.communication.RpmFbk = this.createDataItem('RpmFbk', 'number');
		this.communication.RpmFbkCalc = this.createDataItem('RpmFbkCalc', 'boolean');
		this.communication.RpmRbk = this.createDataItem('RpmRbk', 'number');

		this.defaultReadDataItem = this.communication.RpmFbk;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.communication.RpmMan;
		this.defaultWriteDataItemType = 'number';
	}
}
