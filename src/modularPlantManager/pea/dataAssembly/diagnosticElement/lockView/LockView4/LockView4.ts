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
import {DiagnosticElement, DiagnosticElementRuntime} from '../../DiagnosticElement';
import {DataItem} from '../../../dataItem/DataItem';
import {DataItemFactory, getDataItemModel} from '../../../dataItem/DataItemFactory';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';

export type LockView4Runtime = DiagnosticElementRuntime & {
	Logic: DataItem<boolean>; // False = AND; TRUE = OR;
	Out: DataItem<boolean>;
	OutQC: DataItem<number>;

	In1En: DataItem<boolean>;
	In1: DataItem<boolean>;
	In1QC: DataItem<number>;
	In1Inv: DataItem<boolean>;
	In1Txt: DataItem<string>;

	In2En: DataItem<boolean>;
	In2: DataItem<boolean>;
	In2QC: DataItem<number>;
	In2Inv: DataItem<boolean>;
	In2Txt: DataItem<string>;

	In3En: DataItem<boolean>;
	In3: DataItem<boolean>;
	In3QC: DataItem<number>;
	In3Inv: DataItem<boolean>;
	In3Txt: DataItem<string>;

	In4En: DataItem<boolean>;
	In4: DataItem<boolean>;
	In4QC: DataItem<number>;
	In4Inv: DataItem<boolean>;
	In4Txt: DataItem<string>;
};

export class LockView4 extends DiagnosticElement {
	Logic: DataItem<boolean>; // False = AND; TRUE = OR;
	Out: DataItem<boolean>;
	OutQC: DataItem<number>;

	In1En: DataItem<boolean>;
	In1: DataItem<boolean>;
	In1QC: DataItem<number>;
	In1Inv: DataItem<boolean>;
	In1Txt: DataItem<string>;

	In2En: DataItem<boolean>;
	In2: DataItem<boolean>;
	In2QC: DataItem<number>;
	In2Inv: DataItem<boolean>;
	In2Txt: DataItem<string>;

	In3En: DataItem<boolean>;
	In3: DataItem<boolean>;
	In3QC: DataItem<number>;
	In3Inv: DataItem<boolean>;
	In3Txt: DataItem<string>;

	In4En: DataItem<boolean>;
	In4: DataItem<boolean>;
	In4QC: DataItem<number>;
	In4Inv: DataItem<boolean>;
	In4Txt: DataItem<string>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);

		this.Logic = DataItemFactory.create(getDataItemModel(options, 'Logic'), connectionHandler);
		this.Out = DataItemFactory.create(getDataItemModel(options, 'Out'), connectionHandler);
		this.OutQC = DataItemFactory.create(getDataItemModel(options, 'OutQC'), connectionHandler);

		this.In1En = DataItemFactory.create(getDataItemModel(options, 'In1En'), connectionHandler);
		this.In1 = DataItemFactory.create(getDataItemModel(options, 'In1'), connectionHandler);
		this.In1QC = DataItemFactory.create(getDataItemModel(options, 'In1QC'), connectionHandler);
		this.In1Inv = DataItemFactory.create(getDataItemModel(options, 'In1Inv'), connectionHandler);
		this.In1Txt = DataItemFactory.create(getDataItemModel(options, 'In1Txt'), connectionHandler);

		this.In2En = DataItemFactory.create(getDataItemModel(options, 'In2En'), connectionHandler);
		this.In2 = DataItemFactory.create(getDataItemModel(options, 'In2'), connectionHandler);
		this.In2QC = DataItemFactory.create(getDataItemModel(options, 'In2QC'), connectionHandler);
		this.In2Inv = DataItemFactory.create(getDataItemModel(options, 'In2Inv'), connectionHandler);
		this.In2Txt = DataItemFactory.create(getDataItemModel(options, 'In2Txt'), connectionHandler);

		this.In3En = DataItemFactory.create(getDataItemModel(options, 'In3En'), connectionHandler);
		this.In3 = DataItemFactory.create(getDataItemModel(options, 'In3'), connectionHandler);
		this.In3QC = DataItemFactory.create(getDataItemModel(options, 'In3QC'), connectionHandler);
		this.In3Inv = DataItemFactory.create(getDataItemModel(options, 'In3Inv'), connectionHandler);
		this.In3Txt = DataItemFactory.create(getDataItemModel(options, 'In3Txt'), connectionHandler);

		this.In4En = DataItemFactory.create(getDataItemModel(options, 'In4En'), connectionHandler);
		this.In4 = DataItemFactory.create(getDataItemModel(options, 'In4'), connectionHandler);
		this.In4QC = DataItemFactory.create(getDataItemModel(options, 'In4QC'), connectionHandler);
		this.In4Inv = DataItemFactory.create(getDataItemModel(options, 'In4Inv'), connectionHandler);
		this.In4Txt = DataItemFactory.create(getDataItemModel(options, 'In4Txt'), connectionHandler);

		this.defaultReadDataItem = this.Out;
		this.defaultReadDataItemType = 'boolean';
	}

}
