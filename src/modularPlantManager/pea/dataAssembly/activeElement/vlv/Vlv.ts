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
import {Interlock, InterlockRuntime, OpMode, OpModeRuntime, Reset, ResetRuntime} from '../../_extensions';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';

export type VlvRuntime = ActiveElementRuntime & OpModeRuntime & InterlockRuntime & ResetRuntime & {
	SafePos: DataItem<boolean>;
	SafePosEn: DataItem<boolean>;
	SafePosAct: DataItem<boolean>;

	OpenAut: DataItem<boolean>;
	OpenFbk: DataItem<boolean>;
	OpenFbkCalc: DataItem<boolean>;
	OpenOp: DataItem<boolean>;

	CloseAut: DataItem<boolean>;
	CloseFbk: DataItem<boolean>;
	CloseFbkCalc: DataItem<boolean>;
	CloseOp: DataItem<boolean>;
};

export class Vlv extends ActiveElement {
	public readonly communication!: VlvRuntime;
	public readonly reset: Reset;
	public readonly interlock: Interlock;
	public readonly opMode: OpMode;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.reset = new Reset(this);
		this.interlock = new Interlock(this);
		this.opMode = new OpMode(this);

		this.communication.SafePos = this.createDataItem('SafePos', 'boolean');
		this.communication.SafePosEn = this.createDataItem('SafePosEn', 'boolean');
		this.communication.SafePosAct = this.createDataItem('SafePosAct', 'boolean');

		this.communication.OpenAut = this.createDataItem('OpenAut', 'boolean');
		this.communication.OpenFbk = this.createDataItem('OpenFbk', 'boolean');
		this.communication.OpenFbkCalc = this.createDataItem('OpenFbkCalc', 'boolean');
		this.communication.OpenOp = this.createDataItem('OpenOp', 'boolean', 'write');

		this.communication.CloseAut = this.createDataItem('CloseAut', 'boolean');
		this.communication.CloseFbk = this.createDataItem('CloseFbk', 'boolean');
		this.communication.CloseFbkCalc = this.createDataItem('CloseFbkCalc', 'boolean');
		this.communication.CloseOp = this.createDataItem('CloseOp', 'boolean', 'write');
	}
}
