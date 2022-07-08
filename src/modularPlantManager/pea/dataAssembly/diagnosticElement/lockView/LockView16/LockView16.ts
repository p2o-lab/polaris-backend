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
import { DataItemFactory, getDataItemModel } from '../../../dataItem/DataItemFactory';
import {LockView8, LockView8Runtime} from '../LockView8';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';

export type LockView16Runtime = LockView8Runtime & {
	In9En: DataItem<boolean>;
	In9: DataItem<boolean>;
	In9QC: DataItem<number>;
	In9Inv: DataItem<boolean>;
	In9Txt: DataItem<string>;

	In10En: DataItem<boolean>;
	In10: DataItem<boolean>;
	In10QC: DataItem<number>;
	In10Inv: DataItem<boolean>;
	In10Txt: DataItem<string>;

	In11En: DataItem<boolean>;
	In11: DataItem<boolean>;
	In11QC: DataItem<number>;
	In11Inv: DataItem<boolean>;
	In11Txt: DataItem<string>;

	In12En: DataItem<boolean>;
	In12: DataItem<boolean>;
	In12QC: DataItem<number>;
	In12Inv: DataItem<boolean>;
	In12Txt: DataItem<string>;

	In13En: DataItem<boolean>;
	In13: DataItem<boolean>;
	In13QC: DataItem<number>;
	In13Inv: DataItem<boolean>;
	In13Txt: DataItem<string>;

	In14En: DataItem<boolean>;
	In14: DataItem<boolean>;
	In14QC: DataItem<number>;
	In14Inv: DataItem<boolean>;
	In14Txt: DataItem<string>;

	In15En: DataItem<boolean>;
	In15: DataItem<boolean>;
	In15QC: DataItem<number>;
	In15Inv: DataItem<boolean>;
	In15Txt: DataItem<string>;

	In16En: DataItem<boolean>;
	In16: DataItem<boolean>;
	In16QC: DataItem<number>;
	In16Inv: DataItem<boolean>;
	In16Txt: DataItem<string>;
};

export class LockView16  extends LockView8 {
	In9En: DataItem<boolean>;
	In9: DataItem<boolean>;
	In9QC: DataItem<number>;
	In9Inv: DataItem<boolean>;
	In9Txt: DataItem<string>;

	In10En: DataItem<boolean>;
	In10: DataItem<boolean>;
	In10QC: DataItem<number>;
	In10Inv: DataItem<boolean>;
	In10Txt: DataItem<string>;

	In11En: DataItem<boolean>;
	In11: DataItem<boolean>;
	In11QC: DataItem<number>;
	In11Inv: DataItem<boolean>;
	In11Txt: DataItem<string>;

	In12En: DataItem<boolean>;
	In12: DataItem<boolean>;
	In12QC: DataItem<number>;
	In12Inv: DataItem<boolean>;
	In12Txt: DataItem<string>;

	In13En: DataItem<boolean>;
	In13: DataItem<boolean>;
	In13QC: DataItem<number>;
	In13Inv: DataItem<boolean>;
	In13Txt: DataItem<string>;

	In14En: DataItem<boolean>;
	In14: DataItem<boolean>;
	In14QC: DataItem<number>;
	In14Inv: DataItem<boolean>;
	In14Txt: DataItem<string>;

	In15En: DataItem<boolean>;
	In15: DataItem<boolean>;
	In15QC: DataItem<number>;
	In15Inv: DataItem<boolean>;
	In15Txt: DataItem<string>;

	In16En: DataItem<boolean>;
	In16: DataItem<boolean>;
	In16QC: DataItem<number>;
	In16Inv: DataItem<boolean>;
	In16Txt: DataItem<string>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.In9En = DataItemFactory.create(getDataItemModel(options, 'In9En'), connectionHandler);
		this.In9 = DataItemFactory.create(getDataItemModel(options, 'In9'), connectionHandler);
		this.In9QC = DataItemFactory.create(getDataItemModel(options, 'In9QC'), connectionHandler);
		this.In9Inv = DataItemFactory.create(getDataItemModel(options, 'In9Inv'), connectionHandler);
		this.In9Txt = DataItemFactory.create(getDataItemModel(options, 'In9Txt'), connectionHandler);

		this.In10En = DataItemFactory.create(getDataItemModel(options, 'In10En'), connectionHandler);
		this.In10 = DataItemFactory.create(getDataItemModel(options, 'In10'), connectionHandler);
		this.In10QC = DataItemFactory.create(getDataItemModel(options, 'In10QC'), connectionHandler);
		this.In10Inv = DataItemFactory.create(getDataItemModel(options, 'In10Inv'), connectionHandler);
		this.In10Txt = DataItemFactory.create(getDataItemModel(options, 'In10Txt'), connectionHandler);

		this.In11En = DataItemFactory.create(getDataItemModel(options, 'In11En'), connectionHandler);
		this.In11 = DataItemFactory.create(getDataItemModel(options, 'In11'), connectionHandler);
		this.In11QC = DataItemFactory.create(getDataItemModel(options, 'In11QC'), connectionHandler);
		this.In11Inv = DataItemFactory.create(getDataItemModel(options, 'In11Inv'), connectionHandler);
		this.In11Txt = DataItemFactory.create(getDataItemModel(options, 'In11Txt'), connectionHandler);

		this.In12En = DataItemFactory.create(getDataItemModel(options, 'In12En'), connectionHandler);
		this.In12 = DataItemFactory.create(getDataItemModel(options, 'In12'), connectionHandler);
		this.In12QC = DataItemFactory.create(getDataItemModel(options, 'In12QC'), connectionHandler);
		this.In12Inv = DataItemFactory.create(getDataItemModel(options, 'In12Inv'), connectionHandler);
		this.In12Txt = DataItemFactory.create(getDataItemModel(options, 'In12Txt'), connectionHandler);

		this.In13En = DataItemFactory.create(getDataItemModel(options, 'In13En'), connectionHandler);
		this.In13 = DataItemFactory.create(getDataItemModel(options, 'In13'), connectionHandler);
		this.In13QC = DataItemFactory.create(getDataItemModel(options, 'In13QC'), connectionHandler);
		this.In13Inv = DataItemFactory.create(getDataItemModel(options, 'In13Inv'), connectionHandler);
		this.In13Txt = DataItemFactory.create(getDataItemModel(options, 'In13Txt'), connectionHandler);

		this.In14En = DataItemFactory.create(getDataItemModel(options, 'In14En'), connectionHandler);
		this.In14 = DataItemFactory.create(getDataItemModel(options, 'In14'), connectionHandler);
		this.In14QC = DataItemFactory.create(getDataItemModel(options, 'In14QC'), connectionHandler);
		this.In14Inv = DataItemFactory.create(getDataItemModel(options, 'In14Inv'), connectionHandler);
		this.In14Txt = DataItemFactory.create(getDataItemModel(options, 'In14Txt'), connectionHandler);

		this.In15En = DataItemFactory.create(getDataItemModel(options, 'In15En'), connectionHandler);
		this.In15 = DataItemFactory.create(getDataItemModel(options, 'In15'), connectionHandler);
		this.In15QC = DataItemFactory.create(getDataItemModel(options, 'In15QC'), connectionHandler);
		this.In15Inv = DataItemFactory.create(getDataItemModel(options, 'In15Inv'), connectionHandler);
		this.In15Txt = DataItemFactory.create(getDataItemModel(options, 'In15Txt'), connectionHandler);

		this.In16En = DataItemFactory.create(getDataItemModel(options, 'In16En'), connectionHandler);
		this.In16 = DataItemFactory.create(getDataItemModel(options, 'In16'), connectionHandler);
		this.In16QC = DataItemFactory.create(getDataItemModel(options, 'In16QC'), connectionHandler);
		this.In16Inv = DataItemFactory.create(getDataItemModel(options, 'In16Inv'), connectionHandler);
		this.In16Txt = DataItemFactory.create(getDataItemModel(options, 'In16Txt'), connectionHandler);
	}

}
