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

import {ParameterInterface} from '@p2olab/polaris-interface';
import {OpcUaDataItem} from '../../../connection';
import {Constructor} from '../_helper';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../../DataAssemblyController';
import {UNIT} from './Unit';

export interface UnitDataAssemblyRuntime extends BaseDataAssemblyRuntime {
	VUnit: OpcUaDataItem<number>;
}

export class UnitSettings {

	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
	}

	setCommunication(){
		this.dAController.communication.VUnit = this.dAController.createDataItem('VUnit', 'read');
	}

	public getUnit(): string {
		const unit = UNIT.find((item) => item.value === this.dAController.communication.VUnit?.value);
		return unit ? unit.unit : '';
	}

	// TODO: adjust function
/*	public unitToJson(): ParameterInterface {
		return {
			...super.toJson(),
			max: this.communication.VSclMax?.value,
			min: this.communication.VSclMin?.value
		};
	}*/
}


