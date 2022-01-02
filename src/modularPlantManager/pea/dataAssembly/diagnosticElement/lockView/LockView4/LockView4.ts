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
import {DiagnosticElement, DiagnosticElementRuntime} from '../../DiagnosticElement';
import {OpcUaConnection, DataItem} from '../../../../connection';

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
	public readonly communication!: LockView4Runtime;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.communication.Logic = this.createDataItem('Logic', 'boolean');
		this.communication.Out = this.createDataItem('Out', 'boolean');
		this.communication.OutQC = this.createDataItem('OutQC', 'number');

		this.communication.In1En = this.createDataItem('In1En', 'boolean');
		this.communication.In1 = this.createDataItem('In1', 'boolean');
		this.communication.In1QC = this.createDataItem('In1QC', 'number');
		this.communication.In1Inv = this.createDataItem('In1Inv', 'boolean');
		this.communication.In1Txt = this.createDataItem('In1Txt', 'string');

		this.communication.In2En = this.createDataItem('In2En', 'boolean');
		this.communication.In2 = this.createDataItem('In2', 'boolean');
		this.communication.In2QC = this.createDataItem('In2QC', 'number');
		this.communication.In2Inv = this.createDataItem('In2Inv', 'boolean');
		this.communication.In2Txt = this.createDataItem('In2Txt', 'string');

		this.communication.In3En = this.createDataItem('In3En', 'boolean');
		this.communication.In3 = this.createDataItem('In3', 'boolean');
		this.communication.In3QC = this.createDataItem('In3QC', 'number');
		this.communication.In3Inv = this.createDataItem('In3Inv', 'boolean');
		this.communication.In3Txt = this.createDataItem('In3Txt', 'string');

		this.communication.In4En = this.createDataItem('In4En', 'boolean');
		this.communication.In4 = this.createDataItem('In4', 'boolean');
		this.communication.In4QC = this.createDataItem('In4QC', 'number');
		this.communication.In4Inv = this.createDataItem('In4Inv', 'boolean');
		this.communication.In4Txt = this.createDataItem('In4Txt', 'string');

		this.defaultReadDataItem = this.communication.Out;
		this.defaultReadDataItemType = 'boolean';
	}

}
