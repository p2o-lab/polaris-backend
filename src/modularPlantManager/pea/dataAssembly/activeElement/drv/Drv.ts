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
import {OpcUaConnection, DataItem} from '../../../connection';
import {
	Interlock, InterlockRuntime,
	OpMode, OpModeRuntime,
	Reset, ResetRuntime
} from '../../baseFunction';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';

export type DrvRuntime = ActiveElementRuntime & OpModeRuntime & InterlockRuntime & ResetRuntime & {
	SafePos: DataItem<boolean>;
	SafePosAct: DataItem<boolean>;

	FwdAut: DataItem<boolean>;
	FwdCtrl: DataItem<boolean>;
	FwdEn: DataItem<boolean>;
	FwdFbk: DataItem<boolean>;
	FwdFbkCalc: DataItem<boolean>;
	FwdOp: DataItem<boolean>;

	RevAut: DataItem<boolean>;
	RevCtrl: DataItem<boolean>;
	RevEn: DataItem<boolean>;
	RevFbk: DataItem<boolean>;
	RevFbkCalc: DataItem<boolean>;
	RevOp: DataItem<boolean>;

	StopAut: DataItem<boolean>;
	StopOp: DataItem<boolean>;
	Trip: DataItem<boolean>;
};

export class Drv extends ActiveElement {

	public readonly communication!: DrvRuntime;
	public readonly reset: Reset;
	public readonly interlock: Interlock;
	public readonly opMode: OpMode;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.reset = new Reset(this);
		this.interlock = new Interlock(this);
		this.opMode = new OpMode(this);

		this.communication.SafePos = this.createDataItem('SafePos', 'boolean');
		this.communication.SafePosAct = this.createDataItem('SafePosAct', 'boolean');

		this.communication.FwdAut = this.createDataItem('FwdAut', 'boolean');
		this.communication.FwdCtrl = this.createDataItem('FwdCtrl', 'boolean');
		this.communication.FwdEn = this.createDataItem('FwdEn', 'boolean');
		this.communication.FwdFbk = this.createDataItem('FwdFbk', 'boolean');
		this.communication.FwdFbkCalc = this.createDataItem('FwdFbkCalc', 'boolean');
		this.communication.FwdOp = this.createDataItem('FwdOp', 'boolean', 'write');

		this.communication.RevAut = this.createDataItem('RevAut', 'boolean');
		this.communication.RevCtrl = this.createDataItem('RevCtrl', 'boolean');
		this.communication.RevEn = this.createDataItem('RevEn', 'boolean');
		this.communication.RevFbk = this.createDataItem('RevFbk', 'boolean');
		this.communication.RevFbkCalc = this.createDataItem('RevFbkCalc', 'boolean');
		this.communication.RevOp = this.createDataItem('RevOp', 'boolean', 'write');

		this.communication.StopAut = this.createDataItem('StopAut', 'boolean');
		this.communication.StopOp = this.createDataItem('StopOp', 'boolean', 'write');
		this.communication.Trip = this.createDataItem('Trip', 'boolean');
	}
}
