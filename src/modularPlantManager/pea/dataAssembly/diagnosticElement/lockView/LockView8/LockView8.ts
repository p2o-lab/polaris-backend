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
import {LockView4, LockView4Runtime} from '../LockView4';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';

export type LockView8Runtime = LockView4Runtime & {
	In5En: DataItem<boolean>;
	In5: DataItem<boolean>;
	In5QC: DataItem<number>;
	In5Inv: DataItem<boolean>;
	In5Txt: DataItem<string>;

	In6En: DataItem<boolean>;
	In6: DataItem<boolean>;
	In6QC: DataItem<number>;
	In6Inv: DataItem<boolean>;
	In6Txt: DataItem<string>;

	In7En: DataItem<boolean>;
	In7: DataItem<boolean>;
	In7QC: DataItem<number>;
	In7Inv: DataItem<boolean>;
	In7Txt: DataItem<string>;

	In8En: DataItem<boolean>;
	In8: DataItem<boolean>;
	In8QC: DataItem<number>;
	In8Inv: DataItem<boolean>;
	In8Txt: DataItem<string>;
};

export class LockView8 extends LockView4 {

	public readonly dataItems!: LockView8Runtime;

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
