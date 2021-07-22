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

import {OpcUaConnection, OpcUaDataItem} from '../../connection';
import {
	BaseDataAssemblyRuntime, DataAssemblyController, OpModeRuntime, WQCRuntime
} from '../index';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {WQC} from '../_extensions/wqcDA/WQC';
import {OpModeController} from '../_extensions/opModeDA/OpModeController';
import {
	ServiceSourceModeController,
	ServiceSourceModeRuntime
} from '../_extensions/serviceSourceModeDA/ServiceSourceModeController';

export type ServiceControlRuntime = BaseDataAssemblyRuntime & OpModeRuntime & ServiceSourceModeRuntime & WQCRuntime & {
	CommandOp: OpcUaDataItem<number>;
	CommandInt: OpcUaDataItem<number>;
	CommandExt: OpcUaDataItem<number>;
	CommandEn: OpcUaDataItem<number>;
	StateCur: OpcUaDataItem<number>;

	ProcedureOp: OpcUaDataItem<number>;
	ProcedureExt: OpcUaDataItem<number>;
	ProcedureInt: OpcUaDataItem<number>;
	ProcedureCur: OpcUaDataItem<number>;
	ProcedureReq: OpcUaDataItem<number>;

	InteractQuestionID: OpcUaDataItem<number>;
	InteractAnswerID: OpcUaDataItem<number>;
	PosTextID: OpcUaDataItem<number>;
};

export class ServiceControl extends DataAssemblyController {
	public readonly communication!: ServiceControlRuntime;
	public readonly wqc: WQC;
	public readonly opMode: OpModeController;
	public readonly serviceSourceMode: ServiceSourceModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.wqc = new WQC(this);

		this.opMode = new OpModeController(this);

		this.serviceSourceMode = new ServiceSourceModeController(this);

		this.communication.CommandOp = this.createDataItem('CommandOp', 'write');
		this.communication.CommandInt = this.createDataItem('CommandInt', 'write');
		this.communication.CommandExt = this.createDataItem('CommandExt', 'write');
		this.communication.CommandEn = this.createDataItem('CommandEn', 'read');
		this.communication.StateCur = this.createDataItem('StateCur', 'read');

		this.communication.ProcedureOp = this.createDataItem('ProcedureOp', 'write');
		this.communication.ProcedureExt = this.createDataItem('ProcedureExt', 'write');
		this.communication.ProcedureInt = this.createDataItem('ProcedureInt', 'read');
		this.communication.ProcedureCur = this.createDataItem('ProcedureCur', 'read');
		this.communication.ProcedureReq = this.createDataItem('ProcedureReq', 'read');

		this.communication.InteractQuestionID = this.createDataItem('InteractQuestionID', 'read');
		this.communication.InteractAnswerID = this.createDataItem('InteractAnswerID', 'write');
		this.communication.PosTextID = this.createDataItem('PosTextID', 'read');

		this.defaultReadDataItem = this.communication.StateCur;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.communication.CommandExt;
		this.defaultWriteDataItemType = 'number';
	}
}
