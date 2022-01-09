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
import {OpcUaConnection, DataItem} from '../../../../connection';
import {LockView8, LockView8Runtime} from '../LockView8';

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

export class LockView16 extends LockView8 {
	public readonly communication!: LockView16Runtime;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.communication.In9En = this.createDataItem('In9En', 'boolean');
		this.communication.In9 = this.createDataItem('In9', 'boolean');
		this.communication.In9QC = this.createDataItem('In9QC', 'number');
		this.communication.In9Inv = this.createDataItem('In9Inv', 'boolean');
		this.communication.In9Txt = this.createDataItem('In9Txt', 'string');

		this.communication.In10En = this.createDataItem('In10En', 'boolean');
		this.communication.In10 = this.createDataItem('In10', 'boolean');
		this.communication.In10QC = this.createDataItem('In10QC', 'number');
		this.communication.In10Inv = this.createDataItem('In10Inv', 'boolean');
		this.communication.In10Txt = this.createDataItem('In10Txt', 'string');

		this.communication.In11En = this.createDataItem('In11En', 'boolean');
		this.communication.In11 = this.createDataItem('In11', 'boolean');
		this.communication.In11QC = this.createDataItem('In11QC', 'number');
		this.communication.In11Inv = this.createDataItem('In11Inv', 'boolean');
		this.communication.In11Txt = this.createDataItem('In11Txt', 'string');

		this.communication.In12En = this.createDataItem('In12En', 'boolean');
		this.communication.In12 = this.createDataItem('In12', 'boolean');
		this.communication.In12QC = this.createDataItem('In12QC', 'number');
		this.communication.In12Inv = this.createDataItem('In12Inv', 'boolean');
		this.communication.In12Txt = this.createDataItem('In12Txt', 'string');

		this.communication.In13En = this.createDataItem('In13En', 'boolean');
		this.communication.In13 = this.createDataItem('In13', 'boolean');
		this.communication.In13QC = this.createDataItem('In13QC', 'number');
		this.communication.In13Inv = this.createDataItem('In13Inv', 'boolean');
		this.communication.In13Txt = this.createDataItem('In13Txt', 'string');

		this.communication.In14En = this.createDataItem('In14En', 'boolean');
		this.communication.In14 = this.createDataItem('In14', 'boolean');
		this.communication.In14QC = this.createDataItem('In14QC', 'number');
		this.communication.In14Inv = this.createDataItem('In14Inv', 'boolean');
		this.communication.In14Txt = this.createDataItem('In14Txt', 'string');

		this.communication.In15En = this.createDataItem('In15En', 'boolean');
		this.communication.In15 = this.createDataItem('In15', 'boolean');
		this.communication.In15QC = this.createDataItem('In15QC', 'number');
		this.communication.In15Inv = this.createDataItem('In15Inv', 'boolean');
		this.communication.In15Txt = this.createDataItem('In15Txt', 'string');

		this.communication.In16En = this.createDataItem('In16En', 'boolean');
		this.communication.In16 = this.createDataItem('In16', 'boolean');
		this.communication.In16QC = this.createDataItem('In16QC', 'number');
		this.communication.In16Inv = this.createDataItem('In16Inv', 'boolean');
		this.communication.In16Txt = this.createDataItem('In16Txt', 'string');
	}

}
