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
import {DataItem} from '../../dataItem/DataItem';
import {
	OpMode, OpModeRuntime,
	SourceModeController, SourceModeRuntime
} from '../../baseFunction';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';

export type PIDCtrlRuntime = ActiveElementRuntime & OpModeRuntime & SourceModeRuntime & {
	PV: DataItem<number>;
	PVSclMin: DataItem<number>;
	PVSclMax: DataItem<number>;
	PVUnit: DataItem<number>;

	SPMan: DataItem<number>;
	SPInt: DataItem<number>;
	SPSclMin: DataItem<number>;
	SPSclMax: DataItem<number>;
	SPUnit: DataItem<number>;
	SPIntMin: DataItem<number>;
	SPIntMax: DataItem<number>;
	SPManMin: DataItem<number>;
	SPManMax: DataItem<number>;
	SP: DataItem<number>;

	MVMan: DataItem<number>;
	MV: DataItem<number>;
	MVSclMin: DataItem<number>;
	MVSclMax: DataItem<number>;
	MVUnit: DataItem<number>;
	MVMin: DataItem<number>;
	MVMax: DataItem<number>;

	P: DataItem<number>;
	Ti: DataItem<number>;
	Td: DataItem<number>;
};

export class PIDCtrl extends ActiveElement {

	public readonly dataItems!: PIDCtrlRuntime;

	public sourceMode!: SourceModeController;
	public opMode!: OpMode;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}	

		this.defaultReadDataItem = this.dataItems.PV;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.dataItems.SPMan;
		this.defaultWriteDataItemType = 'number';
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
		this.sourceMode = new SourceModeController(this.dataItems);
		this.opMode = new OpMode(this.dataItems);
	}
}
