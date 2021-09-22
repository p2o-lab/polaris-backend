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
import {Constructor} from '../_helper';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../../DataAssemblyController';

export interface OSLevelRuntime extends BaseDataAssemblyRuntime {
	OSLevel: OpcUaDataItem<number>;
}

export class OSLevel {
	private dAController: any;
	osLevel: number | undefined;

	constructor(dAController: any) {
		this.dAController = dAController;
		this.initialize();
	}

	private initialize(): void{
		//handle static and dynamic variables
		if(typeof this.dAController.options.dataItems.OSLevel == 'string'){
			this.osLevel = Number(this.dAController.options.dataItems.OSLevel);
		}
		else{
			this.dAController.communication.OSLevel = this.dAController.createDataItem('OSLevel', 'write');
		}
	}

	get OSLevel(): number | undefined {
		if(this.osLevel!=undefined) return this.osLevel; //static
		else return this.dAController.communication.OSLevel.value; //dynamic
	}
}
