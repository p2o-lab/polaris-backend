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
import {LockView8, LockView8Runtime} from '../LockView8';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';

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

	public readonly dataItems!: LockView16Runtime;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		if (initial) {
						const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
	}
}
