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
import {DataItem} from '../../../dataItem/DataItem';
import {BinView, BinViewRuntime} from '../BinView';
import {OSLevel, OSLevelRuntime} from '../../../baseFunction';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../../dataItem/DataItemFactory';

export type BinMonRuntime = BinViewRuntime & OSLevelRuntime & {
	VFlutTi: DataItem<number>;
	VFlutEn: DataItem<boolean>;
	VFlutCnt: DataItem<number>;
	VFlutAct: DataItem<boolean>;
};

export class BinMon extends BinView {

	public readonly communication!: BinMonRuntime;
	public readonly osLevel: OSLevel;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.osLevel = new OSLevel(options, connectionHandler);

		this.communication.VFlutTi = DataItemFactory.create(getDataItemModel(options, 'VFlutTi'), connectionHandler);
		this.communication.VFlutEn = DataItemFactory.create(getDataItemModel(options, 'VFlutEn'), connectionHandler);
		this.communication.VFlutCnt = DataItemFactory.create(getDataItemModel(options, 'VFlutCnt'), connectionHandler);
		this.communication.VFlutAct = DataItemFactory.create(getDataItemModel(options, 'VFlutAct'), connectionHandler);
	}
}
