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
import {DiagnosticElement, DiagnosticElementRuntime} from '../DiagnosticElement';
import {OpcUaConnection, OpcUaDataItem} from '../../../connection';

export type LockView4Runtime = DiagnosticElementRuntime & {
	Logic: OpcUaDataItem<boolean>; // False = AND; TRUE = OR;
	Out: OpcUaDataItem<boolean>;
	OutQC: OpcUaDataItem<number>;

	In1En: OpcUaDataItem<boolean>;
	In1: OpcUaDataItem<boolean>;
	In1QC: OpcUaDataItem<number>;
	In1Inv: OpcUaDataItem<boolean>;
	In1Txt: OpcUaDataItem<string>;

	In2En: OpcUaDataItem<boolean>;
	In2: OpcUaDataItem<boolean>;
	In2QC: OpcUaDataItem<number>;
	In2Inv: OpcUaDataItem<boolean>;
	In2Txt: OpcUaDataItem<string>;

	In3En: OpcUaDataItem<boolean>;
	In3: OpcUaDataItem<boolean>;
	In3QC: OpcUaDataItem<number>;
	In3Inv: OpcUaDataItem<boolean>;
	In3Txt: OpcUaDataItem<string>;

	In4En: OpcUaDataItem<boolean>;
	In4: OpcUaDataItem<boolean>;
	In4QC: OpcUaDataItem<number>;
	In4Inv: OpcUaDataItem<boolean>;
	In4Txt: OpcUaDataItem<string>;
};

export class LockView4 extends DiagnosticElement {
	public readonly communication!: LockView4Runtime;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.communication.Logic = this.createDataItem('Logic', 'read', 'boolean');
		this.communication.Out = this.createDataItem('Out', 'read', 'boolean');
		this.communication.OutQC = this.createDataItem('OutQC', 'read', 'number');

		this.communication.In1En = this.createDataItem('In1En', 'read', 'boolean');
		this.communication.In1 = this.createDataItem('In1', 'read', 'boolean');
		this.communication.In1QC = this.createDataItem('In1QC', 'read', 'number');
		this.communication.In1Inv = this.createDataItem('In1Inv', 'read', 'boolean');
		this.communication.In1Txt = this.createDataItem('In1Txt', 'read', 'string');

		this.communication.In2En = this.createDataItem('In2En', 'read', 'boolean');
		this.communication.In2 = this.createDataItem('In2', 'read', 'boolean');
		this.communication.In2QC = this.createDataItem('In2QC', 'read', 'number');
		this.communication.In2Inv = this.createDataItem('In2Inv', 'read', 'boolean');
		this.communication.In2Txt = this.createDataItem('In2Txt', 'read', 'string');

		this.communication.In3En = this.createDataItem('In3En', 'read', 'boolean');
		this.communication.In3 = this.createDataItem('In3', 'read', 'boolean');
		this.communication.In3QC = this.createDataItem('In3QC', 'read', 'number');
		this.communication.In3Inv = this.createDataItem('In3Inv', 'read', 'boolean');
		this.communication.In3Txt = this.createDataItem('In3Txt', 'read', 'string');

		this.communication.In4En = this.createDataItem('In4En', 'read', 'boolean');
		this.communication.In4 = this.createDataItem('In4', 'read', 'boolean');
		this.communication.In4QC = this.createDataItem('In4QC', 'read', 'number');
		this.communication.In4Inv = this.createDataItem('In4Inv', 'read', 'boolean');
		this.communication.In4Txt = this.createDataItem('In4Txt', 'read', 'string');

		this.defaultReadDataItem = this.communication.Out;
		this.defaultReadDataItemType = 'boolean';
	}

}
