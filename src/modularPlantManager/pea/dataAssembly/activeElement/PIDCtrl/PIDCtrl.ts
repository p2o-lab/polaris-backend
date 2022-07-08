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
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';

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
	opMode: OpMode;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.sourceMode = new SourceModeController(options, connectionHandler);
		this.opMode = new OpMode(options, connectionHandler);

		this.communication.PV = DataItemFactory.create(getDataItemModel(options, 'PV'), connectionHandler);
		this.communication.PVSclMin = DataItemFactory.create(getDataItemModel(options, 'PVSclMin'), connectionHandler);
		this.communication.PVSclMax = DataItemFactory.create(getDataItemModel(options, 'PVSclMax'), connectionHandler);
		this.communication.PVUnit = DataItemFactory.create(getDataItemModel(options, 'PVUnit'), connectionHandler);

		this.communication.SPMan = DataItemFactory.create(getDataItemModel(options, 'SPMan'), connectionHandler);
		this.communication.SPInt = DataItemFactory.create(getDataItemModel(options, 'SPInt'), connectionHandler);
		this.communication.SPSclMin = DataItemFactory.create(getDataItemModel(options, 'SPSclMin'), connectionHandler);
		this.communication.SPSclMax = DataItemFactory.create(getDataItemModel(options, 'SPSclMax'), connectionHandler);
		this.communication.SPUnit = DataItemFactory.create(getDataItemModel(options, 'SPUnit'), connectionHandler);
		this.communication.SPIntMin = DataItemFactory.create(getDataItemModel(options, 'SPIntMin'), connectionHandler);
		this.communication.SPIntMax = DataItemFactory.create(getDataItemModel(options, 'SPIntMax'), connectionHandler);
		this.communication.SPManMin = DataItemFactory.create(getDataItemModel(options, 'SPManMin'), connectionHandler);
		this.communication.SPManMax = DataItemFactory.create(getDataItemModel(options, 'SPManMax'), connectionHandler);
		this.communication.SP = DataItemFactory.create(getDataItemModel(options, 'SP'), connectionHandler);

		this.communication.MVMan = DataItemFactory.create(getDataItemModel(options, 'MVMan'), connectionHandler);
		this.communication.MV = DataItemFactory.create(getDataItemModel(options, 'MV'), connectionHandler);
		this.communication.MVSclMin = DataItemFactory.create(getDataItemModel(options, 'MVSclMin'), connectionHandler);
		this.communication.MVSclMax = DataItemFactory.create(getDataItemModel(options, 'MVSclMax'), connectionHandler);
		this.communication.MVUnit = DataItemFactory.create(getDataItemModel(options, 'MVUnit'), connectionHandler);
		this.communication.MVMin = DataItemFactory.create(getDataItemModel(options, 'MVMin'), connectionHandler);
		this.communication.MVMax = DataItemFactory.create(getDataItemModel(options, 'MVMax'), connectionHandler);

		this.communication.P = DataItemFactory.create(getDataItemModel(options, 'P'), connectionHandler);
		this.communication.Ti = DataItemFactory.create(getDataItemModel(options, 'Ti'), connectionHandler);
		this.communication.Td = DataItemFactory.create(getDataItemModel(options, 'Td'), connectionHandler);

		this.defaultReadDataItem = this.communication.PV;
		this.defaultReadDataItemType = 'number';

		this.defaultWriteDataItem = this.communication.SPMan;
		this.defaultWriteDataItemType = 'number';
	}
}
