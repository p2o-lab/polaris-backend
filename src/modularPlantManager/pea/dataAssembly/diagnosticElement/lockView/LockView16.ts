/* tslint:disable:max-classes-per-file */
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
import {OpcUaConnection, OpcUaDataItem} from '../../../connection';
import {LockView8, LockView8Runtime} from './LockView8';

export type LockView16Runtime = LockView8Runtime & {
	In9En: OpcUaDataItem<boolean>;
	In9: OpcUaDataItem<boolean>;
	In9QC: OpcUaDataItem<number>;
	In9Inv: OpcUaDataItem<boolean>;
	In9Txt: OpcUaDataItem<string>;

	In10En: OpcUaDataItem<boolean>;
	In10: OpcUaDataItem<boolean>;
	In10QC: OpcUaDataItem<number>;
	In10Inv: OpcUaDataItem<boolean>;
	In10Txt: OpcUaDataItem<string>;

	In11En: OpcUaDataItem<boolean>;
	In11: OpcUaDataItem<boolean>;
	In11QC: OpcUaDataItem<number>;
	In11Inv: OpcUaDataItem<boolean>;
	In11Txt: OpcUaDataItem<string>;

	In12En: OpcUaDataItem<boolean>;
	In12: OpcUaDataItem<boolean>;
	In12QC: OpcUaDataItem<number>;
	In12Inv: OpcUaDataItem<boolean>;
	In12Txt: OpcUaDataItem<string>;

	In13En: OpcUaDataItem<boolean>;
	In13: OpcUaDataItem<boolean>;
	In13QC: OpcUaDataItem<number>;
	In13Inv: OpcUaDataItem<boolean>;
	In13Txt: OpcUaDataItem<string>;

	In14En: OpcUaDataItem<boolean>;
	In14: OpcUaDataItem<boolean>;
	In14QC: OpcUaDataItem<number>;
	In14Inv: OpcUaDataItem<boolean>;
	In14Txt: OpcUaDataItem<string>;

	In15En: OpcUaDataItem<boolean>;
	In15: OpcUaDataItem<boolean>;
	In15QC: OpcUaDataItem<number>;
	In15Inv: OpcUaDataItem<boolean>;
	In15Txt: OpcUaDataItem<string>;

	In16En: OpcUaDataItem<boolean>;
	In16: OpcUaDataItem<boolean>;
	In16QC: OpcUaDataItem<number>;
	In16Inv: OpcUaDataItem<boolean>;
	In16Txt: OpcUaDataItem<string>;
};

export class LockView16 extends LockView8 {
	public readonly communication!: LockView16Runtime;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.communication.In9En = this.createDataItem('In9En', 'read', 'boolean');
		this.communication.In9 = this.createDataItem('In9', 'read', 'boolean');
		this.communication.In9QC = this.createDataItem('In9QC', 'read', 'number');
		this.communication.In9Inv = this.createDataItem('In9Inv', 'read', 'boolean');
		this.communication.In9Txt = this.createDataItem('In9Txt', 'read', 'string');

		this.communication.In10En = this.createDataItem('In10En', 'read', 'boolean');
		this.communication.In10 = this.createDataItem('In10', 'read', 'boolean');
		this.communication.In10QC = this.createDataItem('In10QC', 'read', 'number');
		this.communication.In10Inv = this.createDataItem('In10Inv', 'read', 'boolean');
		this.communication.In10Txt = this.createDataItem('In10Txt', 'read', 'string');

		this.communication.In11En = this.createDataItem('In11En', 'read', 'boolean');
		this.communication.In11 = this.createDataItem('In11', 'read', 'boolean');
		this.communication.In11QC = this.createDataItem('In11QC', 'read', 'number');
		this.communication.In11Inv = this.createDataItem('In11Inv', 'read', 'boolean');
		this.communication.In11Txt = this.createDataItem('In11Txt', 'read', 'string');

		this.communication.In12En = this.createDataItem('In12En', 'read', 'boolean');
		this.communication.In12 = this.createDataItem('In12', 'read', 'boolean');
		this.communication.In12QC = this.createDataItem('In12QC', 'read', 'number');
		this.communication.In12Inv = this.createDataItem('In12Inv', 'read', 'boolean');
		this.communication.In12Txt = this.createDataItem('In12Txt', 'read', 'string');

		this.communication.In13En = this.createDataItem('In13En', 'read', 'boolean');
		this.communication.In13 = this.createDataItem('In13', 'read', 'boolean');
		this.communication.In13QC = this.createDataItem('In13QC', 'read', 'number');
		this.communication.In13Inv = this.createDataItem('In13Inv', 'read', 'boolean');
		this.communication.In13Txt = this.createDataItem('In13Txt', 'read', 'string');

		this.communication.In14En = this.createDataItem('In14En', 'read', 'boolean');
		this.communication.In14 = this.createDataItem('In14', 'read', 'boolean');
		this.communication.In14QC = this.createDataItem('In14QC', 'read', 'number');
		this.communication.In14Inv = this.createDataItem('In14Inv', 'read', 'boolean');
		this.communication.In14Txt = this.createDataItem('In14Txt', 'read', 'string');

		this.communication.In15En = this.createDataItem('In15En', 'read', 'boolean');
		this.communication.In15 = this.createDataItem('In15', 'read', 'boolean');
		this.communication.In15QC = this.createDataItem('In15QC', 'read', 'number');
		this.communication.In15Inv = this.createDataItem('In15Inv', 'read', 'boolean');
		this.communication.In15Txt = this.createDataItem('In15Txt', 'read', 'string');

		this.communication.In16En = this.createDataItem('In16En', 'read', 'boolean');
		this.communication.In16 = this.createDataItem('In16', 'read', 'boolean');
		this.communication.In16QC = this.createDataItem('In16QC', 'read', 'number');
		this.communication.In16Inv = this.createDataItem('In16Inv', 'read', 'boolean');
		this.communication.In16Txt = this.createDataItem('In16Txt', 'read', 'string');
	}

}
