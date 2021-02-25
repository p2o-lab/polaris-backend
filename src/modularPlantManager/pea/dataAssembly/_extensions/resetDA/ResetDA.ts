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

import {OpcUaDataItem} from '../../../connection';
import {Constructor} from '../_helper';
import {BaseDataAssemblyRuntime, DataAssembly} from '../../DataAssembly';

export interface ResetRuntime extends BaseDataAssemblyRuntime {
	ResetOp: OpcUaDataItem<boolean>;
	ResetAut: OpcUaDataItem<boolean>;
}

// tslint:disable-next-line:variable-name
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ResetDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {
	return class extends Base {
		public communication!: ResetRuntime;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(...args: any[]) {
			super(...args);
			this.communication.ResetOp = this.createDataItem('ResetOp', 'write');
			this.communication.ResetAut = this.createDataItem('ResetAut', 'write');
		}
	};
}
