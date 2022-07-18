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
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';

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

	public readonly dataItems!: LockView4Runtime;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}	

		this.defaultReadDataItem = this.dataItems.Out;
		this.defaultReadDataItemType = 'boolean';
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
	}
}
