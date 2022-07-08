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


import {DataItem} from '../../dataItem/DataItem';
import {
	Interlock, InterlockRuntime,
	OpMode, OpModeRuntime,
	Reset, ResetRuntime
} from '../../baseFunction';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import { DataItemFactory, getDataItemModel } from '../../dataItem/DataItemFactory';

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

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.reset = new Reset(options, connectionHandler);
		this.interlock = new Interlock(options, connectionHandler);
		this.opMode = new OpMode(options, connectionHandler);

		this.communication.SafePos = DataItemFactory.create(getDataItemModel(options, 'SafePos'), connectionHandler);
		this.communication.SafePosAct = DataItemFactory.create(getDataItemModel(options, 'SafePosAct'), connectionHandler);

		this.communication.FwdAut = DataItemFactory.create(getDataItemModel(options, 'FwdAut'), connectionHandler);
		this.communication.FwdCtrl = DataItemFactory.create(getDataItemModel(options, 'FwdCtrl'), connectionHandler);
		this.communication.FwdEn = DataItemFactory.create(getDataItemModel(options, 'FwdEn'), connectionHandler);
		this.communication.FwdFbk = DataItemFactory.create(getDataItemModel(options, 'FwdFbk'), connectionHandler);
		this.communication.FwdFbkCalc = DataItemFactory.create(getDataItemModel(options, 'FwdFbkCalc'), connectionHandler);
		this.communication.FwdOp = DataItemFactory.create(getDataItemModel(options, 'FwdOp'), connectionHandler);

		this.communication.RevAut = DataItemFactory.create(getDataItemModel(options, 'RevAut'), connectionHandler);
		this.communication.RevCtrl = DataItemFactory.create(getDataItemModel(options, 'RevCtrl'), connectionHandler);
		this.communication.RevEn = DataItemFactory.create(getDataItemModel(options, 'RevEn'), connectionHandler);
		this.communication.RevFbk = DataItemFactory.create(getDataItemModel(options, 'RevFbk'), connectionHandler);
		this.communication.RevFbkCalc = DataItemFactory.create(getDataItemModel(options, 'RevFbkCalc'), connectionHandler);
		this.communication.RevOp = DataItemFactory.create(getDataItemModel(options, 'RevOp'), connectionHandler);

		this.communication.StopAut = DataItemFactory.create(getDataItemModel(options, 'StopAut'), connectionHandler);
		this.communication.StopOp = DataItemFactory.create(getDataItemModel(options, 'StopOp'), connectionHandler);
		this.communication.Trip = DataItemFactory.create(getDataItemModel(options, 'Trip'), connectionHandler);
	}
}
