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
import {BaseDataAssemblyRuntime, Constructor} from '../../index';
import {DataAssemblyController} from '../../DataAssemblyController';

export interface WQCRuntime extends BaseDataAssemblyRuntime {
	WQC: OpcUaDataItem<number>;
}

export class WQC {
	private dAController: any;
	wqc: number | undefined;

	constructor(dAController: any) {
		this.dAController = dAController;
	}

	initialize(){
		//handle static and dynamic variables
		if(typeof this.dAController.options.dataItems.WQC == 'string'){
			this.wqc = Number(this.dAController.options.dataItems.WQC);
		}
		else{
			this.dAController.communication.WQC = this.dAController.createDataItem('WQC', 'write');
		}
	}

	get WQC(): number | undefined {
		if(this.wqc != undefined) return this.wqc;
		else return this.dAController.communication.WQC.value;
	}
}
