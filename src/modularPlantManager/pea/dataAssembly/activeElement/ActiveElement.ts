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
import {OpcUaConnection} from '../../connection';
import {OSLevelDA, OSLevelRuntime, WQCDA, WQCRuntime} from '../_extensions';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../DataAssemblyController';
import {OSLevel} from '../_extensions/osLevelDA/OSLevel';
import {WQC} from '../_extensions/wqcDA/WQC';

export type ActiveElementRuntime = BaseDataAssemblyRuntime & WQCRuntime & OSLevelRuntime;

export class ActiveElement extends DataAssemblyController {

	public readonly communication: ActiveElementRuntime = {} as ActiveElementRuntime;
	public readonly osLevel: OSLevel;
	public readonly wqc: WQC;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.osLevel = new OSLevel(this);
		this.osLevel.initializeOSLevel(this);

		this.wqc = new WQC(this);
		this.wqc.initializeWQC(this);
	}
}
