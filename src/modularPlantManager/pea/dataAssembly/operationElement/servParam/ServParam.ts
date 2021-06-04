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
import {OpModeRuntime, WQCRuntime
} from '../../_extensions';
import {
	OperationElement, OperationElementRuntime,
} from '../OperationElement';
import {
	ServiceSourceModeController,
	ServiceSourceModeRuntime
} from '../../_extensions/serviceSourceModeDA/ServiceSourceModeController';
import {OpModeController} from '../../_extensions/opModeDA/OpModeController';
import {WQC} from '../../_extensions/wqcDA/WQC';

export type ServParamRuntime = OperationElementRuntime & OpModeRuntime & ServiceSourceModeRuntime & WQCRuntime & {
	Sync: OpcUaDataItem<boolean>;
};

export class ServParam extends OperationElement {
	//TODO: check accessablity? (private, readonly, public?)
	public readonly communication!: ServParamRuntime;
	serviceSourceMode: ServiceSourceModeController;
	opMode: OpModeController;
	public readonly wqc: WQC;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);
		this.wqc = new WQC(this);
		this.wqc.setCommunication();

		this.serviceSourceMode = new ServiceSourceModeController(this);
		this.serviceSourceMode.setCommunication();

		this.opMode = new OpModeController(this);
		this.opMode.initializeOpMode(this);

		this.communication.Sync = this.createDataItem('Sync', 'read', 'boolean');
	}
}
