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

import {DataItem} from '../../dataItem/DataItem';
import {
	OpMode, OpModeRuntime,
} from '../../baseFunction';
import {
	OperationElement, OperationElementRuntime,
} from '../OperationElement';
import {
	ServiceSourceModeController,
	ServiceSourceModeRuntime
} from '../../baseFunction/serviceSourceMode/ServiceSourceModeController';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';

export type ServParamRuntime = OperationElementRuntime & OpModeRuntime & ServiceSourceModeRuntime & {
	Sync: DataItem<boolean>;
};

export class ServParam extends OperationElement {

	public readonly communication!: ServParamRuntime;
	public readonly serviceSourceMode: ServiceSourceModeController;
	public readonly serviceOpMode: OpMode;

	//public readonly wqc: WQC;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options, connectionHandler);
		//this.wqc = new WQC(this);

		this.serviceSourceMode = new ServiceSourceModeController(options, connectionHandler);
		this.serviceOpMode = new OpMode(options, connectionHandler);

		this.communication.Sync = DataItemFactory.create(getDataItemModel(options, 'Sync'), connectionHandler);
	}
}
