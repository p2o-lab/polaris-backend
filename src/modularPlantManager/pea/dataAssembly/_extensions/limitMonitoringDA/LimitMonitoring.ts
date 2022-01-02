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

import {DataItem} from '../../../connection';
import {BaseDataAssemblyRuntime} from '../../DataAssemblyController';

export type LimitMonitoringRuntime = BaseDataAssemblyRuntime & {
	VAHEn: DataItem<boolean>;
	VAHLim: DataItem<number>;
	VAHAct: DataItem<boolean>;
	VWHEn: DataItem<boolean>;
	VWHLim: DataItem<number>;
	VWHAct: DataItem<boolean>;
	VTHEn: DataItem<boolean>;
	VTHLim: DataItem<number>;
	VTHAct: DataItem<boolean>;
	VALEn: DataItem<boolean>;
	VALLim: DataItem<number>;
	VALAct: DataItem<boolean>;
	VWLEn: DataItem<boolean>;
	VWLLim: DataItem<number>;
	VWLAct: DataItem<boolean>;
	VTLEn: DataItem<boolean>;
	VTLLim: DataItem<number>;
	VTLAct: DataItem<boolean>;
};

export class LimitMonitoring {
	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
		this.initialize();
	}

	private initialize(): void{
		this.dAController.communication.VAHEn = this.dAController.createDataItem('VAHEn', 'boolean');
		this.dAController.communication.VAHLim = this.dAController.createDataItem('VAHLim', 'number', 'write');
		this.dAController.communication.VAHAct = this.dAController.createDataItem('VAHAct', 'boolean');
		this.dAController.communication.VWHEn = this.dAController.createDataItem('VWHEn', 'boolean');
		this.dAController.communication.VWHLim = this.dAController.createDataItem('VWHLim', 'number', 'write');
		this.dAController.communication.VWHAct = this.dAController.createDataItem('VWHAct', 'boolean');
		this.dAController.communication.VTHEn = this.dAController.createDataItem('VTHEn', 'boolean');
		this.dAController.communication.VTHLim = this.dAController.createDataItem('VTHLim', 'number', 'write');
		this.dAController.communication.VTHAct = this.dAController.createDataItem('VTHAct', 'boolean');
		this.dAController.communication.VALEn = this.dAController.createDataItem('VALEn', 'boolean');
		this.dAController.communication.VALLim = this.dAController.createDataItem('VALLim', 'number', 'write');
		this.dAController.communication.VALAct = this.dAController.createDataItem('VALAct', 'boolean');
		this.dAController.communication.VWLEn = this.dAController.createDataItem('VWLEn', 'boolean');
		this.dAController.communication.VWLLim = this.dAController.createDataItem('VWLLim', 'number', 'write');
		this.dAController.communication.VWLAct = this.dAController.createDataItem('VWLAct', 'boolean');
		this.dAController.communication.VTLEn = this.dAController.createDataItem('VTLEn', 'boolean');
		this.dAController.communication.VTLLim = this.dAController.createDataItem('VTLLim', 'number', 'write');
		this.dAController.communication.VTLAct = this.dAController.createDataItem('VTLAct', 'boolean');
	}

}


