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
import {
	InterlockDA, InterlockRuntime,
	OpModeRuntime,
	ResetDA, ResetRuntime
} from '../../_extensions';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';

export type VlvRuntime = ActiveElementRuntime & OpModeRuntime & InterlockRuntime & ResetRuntime & {
	SafePos: OpcUaDataItem<boolean>;
	SafePosEn: OpcUaDataItem<boolean>;
	SafePosAct: OpcUaDataItem<boolean>;

	OpenAut: OpcUaDataItem<boolean>;
	OpenFbk: OpcUaDataItem<boolean>;
	OpenFbkCalc: OpcUaDataItem<boolean>;
	OpenOp: OpcUaDataItem<boolean>;

	CloseAut: OpcUaDataItem<boolean>;
	CloseFbk: OpcUaDataItem<boolean>;
	CloseFbkCalc: OpcUaDataItem<boolean>;
	CloseOp: OpcUaDataItem<boolean>;
};

export class Vlv extends ResetDA(InterlockDA(ActiveElement)) {

	public readonly communication!: VlvRuntime;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.communication.SafePos = this.createDataItem('SafePos', 'read', 'boolean');
		this.communication.SafePosEn = this.createDataItem('SafePosEn', 'read', 'boolean');
		this.communication.SafePosAct = this.createDataItem('SafePosAct', 'read', 'boolean');

		this.communication.OpenAut = this.createDataItem('OpenAut', 'read', 'boolean');
		this.communication.OpenFbk = this.createDataItem('OpenFbk', 'read', 'boolean');
		this.communication.OpenFbkCalc = this.createDataItem('OpenFbkCalc', 'read', 'boolean');
		this.communication.OpenOp = this.createDataItem('OpenOp', 'write', 'boolean');

		this.communication.CloseAut = this.createDataItem('CloseAut', 'read', 'boolean');
		this.communication.CloseFbk = this.createDataItem('CloseFbk', 'read', 'boolean');
		this.communication.CloseFbkCalc = this.createDataItem('CloseFbkCalc', 'read', 'boolean');
		this.communication.CloseOp = this.createDataItem('CloseOp', 'write', 'boolean');
	}
}
