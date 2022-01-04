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

import {OpcUaConnection, DataItem} from '../../connection';
import {
	BaseDataAssemblyRuntime, DataAssemblyController, OpModeRuntime, WQCRuntime
} from '../index';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpMode, WQC} from '../_extensions';
import {
	ServiceSourceModeController,
	ServiceSourceModeRuntime
} from '../_extensions/serviceSourceMode/ServiceSourceModeController';

export type ServiceControlRuntime = BaseDataAssemblyRuntime & OpModeRuntime & ServiceSourceModeRuntime & WQCRuntime & {
	CommandOp: DataItem<number>;
	CommandInt: DataItem<number>;
	CommandExt: DataItem<number>;
	CommandEn: DataItem<number>;
	StateCur: DataItem<number>;

	ProcedureOp: DataItem<number>;
	ProcedureExt: DataItem<number>;
	ProcedureInt: DataItem<number>;
	ProcedureCur: DataItem<number>;
	ProcedureReq: DataItem<number>;

	InteractQuestionID: DataItem<number>;
	InteractAnswerID: DataItem<number>;
	PosTextID: DataItem<number>;
};

export class ServiceControl extends DataAssemblyController {
	public readonly communication!: ServiceControlRuntime;
	public readonly wqc: WQC;
	public readonly opMode: OpMode;
	public readonly serviceSourceMode: ServiceSourceModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.wqc = new WQC(this);
		this.opMode = new OpMode(this);
		this.serviceSourceMode = new ServiceSourceModeController(this);

		this.communication.CommandOp = this.createDataItem('CommandOp', 'number', 'write');
		this.communication.CommandInt = this.createDataItem('CommandInt', 'number', 'write');
		this.communication.CommandExt = this.createDataItem('CommandExt', 'number', 'write');
		this.communication.CommandEn = this.createDataItem('CommandEn','number');
		this.communication.StateCur = this.createDataItem('StateCur','number');

		this.communication.ProcedureOp = this.createDataItem('ProcedureOp', 'number', 'write');
		this.communication.ProcedureExt = this.createDataItem('ProcedureExt', 'number', 'write');
		this.communication.ProcedureInt = this.createDataItem('ProcedureInt','number');
		this.communication.ProcedureCur = this.createDataItem('ProcedureCur','number');
		this.communication.ProcedureReq = this.createDataItem('ProcedureReq','number');

		this.communication.InteractQuestionID = this.createDataItem('InteractQuestionID','number');
		this.communication.InteractAnswerID = this.createDataItem('InteractAnswerID', 'number', 'write');
		this.communication.PosTextID = this.createDataItem('PosTextID','number');

		this.defaultReadDataItem = this.communication.StateCur;
		this.defaultReadDataItemType = 'number';

		this.defaultWriteDataItem = this.communication.CommandExt;
		this.defaultWriteDataItemType = 'number';
	}
}
