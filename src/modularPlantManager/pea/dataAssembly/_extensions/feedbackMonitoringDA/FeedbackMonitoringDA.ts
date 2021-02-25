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
import {BaseDataAssemblyRuntime, DataAssembly} from '../../DataAssembly';
import {Constructor} from '../_helper';

export interface FeedbackMonitoringRuntime extends BaseDataAssemblyRuntime {
	MonEn: OpcUaDataItem<boolean>;
	MonSafePos: OpcUaDataItem<boolean>;
	MonStatErr: OpcUaDataItem<boolean>;
	MonDynErr: OpcUaDataItem<boolean>;
	MonStatTi: OpcUaDataItem<number>;
	MonDynTi: OpcUaDataItem<number>;
}


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function FeedbackMonitoringDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {
	return class extends Base {
		public communication!: FeedbackMonitoringRuntime;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(...args: any[]) {
			super(...args);
			this.communication.MonEn = this.createDataItem('MonEn', 'write');
			this.communication.MonSafePos = this.createDataItem('MonSafePos', 'read');
			this.communication.MonStatErr = this.createDataItem('MonStatErr', 'read');
			this.communication.MonDynErr = this.createDataItem('MonDynErr', 'read');
			this.communication.MonStatTi = this.createDataItem('MonStatTi', 'read');
			this.communication.MonDynTi = this.createDataItem('MonDynTi', 'read');
		}
	};
}
