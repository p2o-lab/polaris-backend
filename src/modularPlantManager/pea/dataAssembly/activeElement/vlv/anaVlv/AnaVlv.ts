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
import {Vlv, VlvRuntime} from '../Vlv';
import {SourceModeController, SourceModeRuntime} from '../../../baseFunction';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {DataItem} from '../../../dataItem/DataItem';
import {DataItemFactory, getDataItemModel} from '../../../dataItem/DataItemFactory';

export type AnaVlvRuntime = VlvRuntime & SourceModeRuntime & {
	Pos: DataItem<number>;
	PosFbk: DataItem<number>;
	PosFbkCalc: DataItem<boolean>;
	PosRbk: DataItem<number>;
	PosInt: DataItem<number>;
	PosMan: DataItem<number>;
	PosUnit: DataItem<number>;
	PosSclMin: DataItem<number>;
	PosSclMax: DataItem<number>;
	PosMin: DataItem<number>;
	PosMax: DataItem<number>;

	OpenAct: DataItem<boolean>;
	CloseAct: DataItem<boolean>;
};

export class AnaVlv extends Vlv {
	public readonly communication!: AnaVlvRuntime;
	sourceMode: SourceModeController;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.sourceMode = new SourceModeController(options, connectionHandler);

		this.communication.Pos = DataItemFactory.create(getDataItemModel(options, 'Pos'), connectionHandler);
		this.communication.PosFbk = DataItemFactory.create(getDataItemModel(options, 'PosFbk'), connectionHandler);
		this.communication.PosFbkCalc = DataItemFactory.create(getDataItemModel(options, 'PosFbkCalc'), connectionHandler);
		this.communication.PosRbk = DataItemFactory.create(getDataItemModel(options, 'PosRbk'), connectionHandler);
		this.communication.PosInt = DataItemFactory.create(getDataItemModel(options, 'PosInt'), connectionHandler);
		this.communication.PosMan = DataItemFactory.create(getDataItemModel(options, 'PosMan'), connectionHandler);
		this.communication.PosUnit = DataItemFactory.create(getDataItemModel(options, 'PosUnit'), connectionHandler);
		this.communication.PosSclMin = DataItemFactory.create(getDataItemModel(options, 'PosSclMin'), connectionHandler);
		this.communication.PosSclMax = DataItemFactory.create(getDataItemModel(options, 'PosSclMax'), connectionHandler);
		this.communication.PosMin = DataItemFactory.create(getDataItemModel(options, 'PosMin'), connectionHandler);
		this.communication.PosMax = DataItemFactory.create(getDataItemModel(options, 'PosMax'), connectionHandler);

		this.communication.OpenAct = DataItemFactory.create(getDataItemModel(options, 'OpenAct'), connectionHandler);
		this.communication.CloseAct = DataItemFactory.create(getDataItemModel(options, 'CloseAct'), connectionHandler);
	}
}
