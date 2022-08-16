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
import {ServParam} from '../ServParam';
import {ScaleSettings, UnitSettings, ValueLimitation} from '../../../baseFunction';
import {ConnectionHandler} from '../../../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';
import {DIntServParamDataItems} from '@p2olab/pimad-types';

export class DIntServParam extends ServParam {

	public readonly dataItems!: DIntServParamDataItems;

	public scaleSettings!: ScaleSettings<number>;
	public unitSettings!: UnitSettings;
	public valueLimitation!: ValueLimitation<number>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}	

		this.defaultReadDataItem = this.dataItems.VOut;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.dataItems.VExt;
		this.defaultWriteDataItemType = 'number';
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
		this.scaleSettings = new ScaleSettings(this.dataItems);
		this.unitSettings = new UnitSettings(this.dataItems);
		this.valueLimitation = new ValueLimitation(this.dataItems);
	}
}
