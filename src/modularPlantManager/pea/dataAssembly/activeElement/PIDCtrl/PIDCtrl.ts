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
	OpModeController, OpModeRuntime,
	SourceModeController, SourceModeRuntime
} from '../../_extensions';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';

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
	public readonly communication!: PIDCtrlRuntime;
	sourceMode: SourceModeController;
	opMode: OpModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.sourceMode = new SourceModeController(this);
		this.opMode = new OpModeController(this);

		this.communication.PV = this.createDataItem('PV', 'number');
		this.communication.PVSclMin = this.createDataItem('PVSclMin', 'number');
		this.communication.PVSclMax = this.createDataItem('PVSclMax', 'number');
		this.communication.PVUnit = this.createDataItem('PVUnit', 'number');

		this.communication.SPMan = this.createDataItem('SPMan', 'number', 'write');
		this.communication.SPInt = this.createDataItem('SPInt', 'number');
		this.communication.SPSclMin = this.createDataItem('SPSclMin', 'number');
		this.communication.SPSclMax = this.createDataItem('SPSclMax', 'number');
		this.communication.SPUnit = this.createDataItem('SPUnit', 'number');
		this.communication.SPIntMin = this.createDataItem('SPIntMin', 'number');
		this.communication.SPIntMax = this.createDataItem('SPIntMax', 'number');
		this.communication.SPManMin = this.createDataItem('SPManMin', 'number');
		this.communication.SPManMax = this.createDataItem('SPManMax', 'number');
		this.communication.SP = this.createDataItem('SP', 'number');

		this.communication.MVMan = this.createDataItem('MVMan', 'number', 'write');
		this.communication.MV = this.createDataItem('MV', 'number');
		this.communication.MVSclMin = this.createDataItem('MVSclMin', 'number');
		this.communication.MVSclMax = this.createDataItem('MVSclMax', 'number');
		this.communication.MVUnit = this.createDataItem('MVUnit', 'number');
		this.communication.MVMin = this.createDataItem('MVMin', 'number');
		this.communication.MVMax = this.createDataItem('MVMax', 'number');

		this.communication.P = this.createDataItem('P', 'number');
		this.communication.Ti = this.createDataItem('Ti', 'number');
		this.communication.Td = this.createDataItem('Td', 'number');

		this.defaultReadDataItem = this.communication.PV;
		this.defaultReadDataItemType = 'number';

		this.defaultWriteDataItem = this.communication.SPMan;
		this.defaultWriteDataItemType = 'number';
	}
}
