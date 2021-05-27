/* tslint:disable:max-classes-per-file */
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
import {OpcUaConnection, OpcUaDataItem} from '../../../connection';
import {
	InterlockDA, InterlockRuntime,
	OpModeRuntime,
	ResetDA, ResetRuntime
} from '../../_extensions';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';
import {Reset} from '../../_extensions/resetDA/Reset';
import {Interlock} from '../../_extensions/interlockDA/Interlock';

export type DrvRuntime = ActiveElementRuntime & OpModeRuntime & InterlockRuntime & ResetRuntime & {
	SafePos: OpcUaDataItem<boolean>;
	SafePosAct: OpcUaDataItem<boolean>;

	FwdAut: OpcUaDataItem<boolean>;
	FwdCtrl: OpcUaDataItem<boolean>;
	FwdEn: OpcUaDataItem<boolean>;
	FwdFbk: OpcUaDataItem<boolean>;
	FwdFbkCalc: OpcUaDataItem<boolean>;
	FwdOp: OpcUaDataItem<boolean>;

	RevAut: OpcUaDataItem<boolean>;
	RevCtrl: OpcUaDataItem<boolean>;
	RevEn: OpcUaDataItem<boolean>;
	RevFbk: OpcUaDataItem<boolean>;
	RevFbkCalc: OpcUaDataItem<boolean>;
	RevOp: OpcUaDataItem<boolean>;

	StopAut: OpcUaDataItem<boolean>;
	StopOp: OpcUaDataItem<boolean>;
	Trip: OpcUaDataItem<boolean>;
};

export class Drv extends ActiveElement {

	public readonly communication!: DrvRuntime;
	reset: Reset;
	interlock: Interlock;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.reset = new Reset(this);
		this.reset.initializeReset(this);

		this.interlock = new Interlock(this);
		this.interlock.initializeInterlock(this);

		this.communication.SafePos = this.createDataItem('SafePos', 'read', 'boolean');
		this.communication.SafePosAct = this.createDataItem('SafePosAct', 'read', 'boolean');

		this.communication.FwdAut = this.createDataItem('FwdAut', 'read', 'boolean');
		this.communication.FwdCtrl = this.createDataItem('FwdCtrl', 'read', 'boolean');
		this.communication.FwdEn = this.createDataItem('FwdEn', 'read', 'boolean');
		this.communication.FwdFbk = this.createDataItem('FwdFbk', 'read', 'boolean');
		this.communication.FwdFbkCalc = this.createDataItem('FwdFbkCalc', 'read', 'boolean');
		this.communication.FwdOp = this.createDataItem('FwdOp', 'write', 'boolean');

		this.communication.RevAut = this.createDataItem('RevAut', 'read', 'boolean');
		this.communication.RevCtrl = this.createDataItem('RevCtrl', 'read', 'boolean');
		this.communication.RevEn = this.createDataItem('RevEn', 'read', 'boolean');
		this.communication.RevFbk = this.createDataItem('RevFbk', 'read', 'boolean');
		this.communication.RevFbkCalc = this.createDataItem('RevFbkCalc', 'read', 'boolean');
		this.communication.RevOp = this.createDataItem('RevOp', 'write', 'boolean');

		this.communication.StopAut = this.createDataItem('StopAut', 'read', 'boolean');
		this.communication.StopOp = this.createDataItem('StopOp', 'write', 'boolean');
		this.communication.Trip = this.createDataItem('Trip', 'read', 'boolean');
	}
}
