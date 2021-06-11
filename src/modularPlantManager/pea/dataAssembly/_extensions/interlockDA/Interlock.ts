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
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../../DataAssemblyController';
import {Constructor} from '../_helper';

export type InterlockRuntime = BaseDataAssemblyRuntime & {
	PermEn: OpcUaDataItem<boolean>;
	Permit: OpcUaDataItem<boolean>;
	IntlEn: OpcUaDataItem<boolean>;
	Interlock: OpcUaDataItem<boolean>;
	ProtEn: OpcUaDataItem<boolean>;
	Protect: OpcUaDataItem<boolean>;
};

export class Interlock{
	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
	}

	public setCommunication(){
		this.dAController.communication.PermEn = this.dAController.createDataItem('PermEn', 'read');
		this.dAController.communication.Permit = this.dAController.createDataItem('Permit', 'read');
		this.dAController.communication.IntlEn = this.dAController.createDataItem('IntlEn', 'read');
		this.dAController.communication.Interlock = this.dAController.createDataItem('Interlock', 'read');
		this.dAController.communication.ProtEn = this.dAController.createDataItem('ProtEn', 'read');
		this.dAController.communication.Protect = this.dAController.createDataItem('Protect', 'read');
	}
}