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
import {OpcUaConnection, OpcUaDataItem} from '../../../../connection';
import {OperationElement, OperationElementRuntime} from '../../OperationElement';

export type BinManRuntime = OperationElementRuntime & {
	VMan: OpcUaDataItem<boolean>;
	VRbk: OpcUaDataItem<boolean>;
	VFbk: OpcUaDataItem<boolean>;
	VOut: OpcUaDataItem<boolean>;
	VState0: OpcUaDataItem<string>;
	VState1: OpcUaDataItem<string>;
};

export class BinMan extends OperationElement {

	public readonly communication!: BinManRuntime;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);
		this.communication.VMan = this.createDataItem('VMan', 'write', 'boolean');
		this.communication.VRbk = this.createDataItem('VRbk', 'read', 'boolean');
		this.communication.VFbk = this.createDataItem('VFbk', 'read', 'boolean');

		this.communication.VOut = this.createDataItem('VOut', 'read', 'boolean');
		this.communication.VState0 = this.createDataItem('VState0', 'read', 'string');
		this.communication.VState1 = this.createDataItem('VState1', 'read', 'string');

		this.defaultReadDataItem = this.communication.VOut;
		this.defaultReadDataItemType = 'boolean';
		this.defaultWriteDataItem = this.communication.VMan;
		this.defaultWriteDataItemType = 'boolean';
	}

}
