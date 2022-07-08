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

import {Drv, DrvRuntime} from '../Drv';
import {SourceModeController, SourceModeRuntime} from '../../../baseFunction';
import {DataItem} from '../../../dataItem/DataItem';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../../dataItem/DataItemFactory';
import {DataAssemblyModel} from '@p2olab/pimad-interface';

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

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.sourceMode = new SourceModeController(options, connectionHandler);

		this.communication.RpmSclMax = DataItemFactory.create<number>(getDataItemModel(options,'RpmSclMax'), connectionHandler);
		this.communication.RpmSclMin = DataItemFactory.create<number>(getDataItemModel(options,'RpmSclMin'), connectionHandler);

		this.communication.RpmUnit = DataItemFactory.create<number>(getDataItemModel(options,'RpmUnit'), connectionHandler);

		this.communication.RpmMin = DataItemFactory.create<number>(getDataItemModel(options,'RpmMin'), connectionHandler);
		this.communication.RpmMax = DataItemFactory.create<number>(getDataItemModel(options,'RpmMax'), connectionHandler);

		this.communication.RpmInt = DataItemFactory.create<number>(getDataItemModel(options,'RpmInt'), connectionHandler);
		this.communication.RpmMan = DataItemFactory.create<number>(getDataItemModel(options,'RpmMan'), connectionHandler);

		this.communication.Rpm = DataItemFactory.create<number>(getDataItemModel(options,'Rpm'), connectionHandler);
		this.communication.RpmFbk = DataItemFactory.create<number>(getDataItemModel(options,'RpmFbk'), connectionHandler);
		this.communication.RpmFbkCalc = DataItemFactory.create<boolean>(getDataItemModel(options,'RpmFbkCalc'), connectionHandler);
		this.communication.RpmRbk = DataItemFactory.create<number>(getDataItemModel(options,'RpmRbk'), connectionHandler);

		this.defaultReadDataItem = this.communication.RpmFbk;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.communication.RpmMan;
		this.defaultWriteDataItemType = 'number';
	}
}
