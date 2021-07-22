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

export type LimitMonitoringRuntime = BaseDataAssemblyRuntime & {
	VAHEn: OpcUaDataItem<boolean>;
	VAHLim: OpcUaDataItem<number>;
	VAHAct: OpcUaDataItem<boolean>;
	VWHEn: OpcUaDataItem<boolean>;
	VWHLim: OpcUaDataItem<number>;
	VWHAct: OpcUaDataItem<boolean>;
	VTHEn: OpcUaDataItem<boolean>;
	VTHLim: OpcUaDataItem<number>;
	VTHAct: OpcUaDataItem<boolean>;
	VALEn: OpcUaDataItem<boolean>;
	VALLim: OpcUaDataItem<number>;
	VALAct: OpcUaDataItem<boolean>;
	VWLEn: OpcUaDataItem<boolean>;
	VWLLim: OpcUaDataItem<number>;
	VWLAct: OpcUaDataItem<boolean>;
	VTLEn: OpcUaDataItem<boolean>;
	VTLLim: OpcUaDataItem<number>;
	VTLAct: OpcUaDataItem<boolean>;
};

export class LimitMonitoring {
	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
		this.initialize();
	}

	initialize(){
		this.dAController.communication.VAHEn = this.dAController.createDataItem('VAHEn', 'read');
		this.dAController.communication.VAHLim = this.dAController.createDataItem('VAHLim', 'write');
		this.dAController.communication.VAHAct = this.dAController.createDataItem('VAHAct', 'read');
		this.dAController.communication.VWHEn = this.dAController.createDataItem('VWHEn', 'read');
		this.dAController.communication.VWHLim = this.dAController.createDataItem('VWHLim', 'write');
		this.dAController.communication.VWHAct = this.dAController.createDataItem('VWHAct', 'read');
		this.dAController.communication.VTHEn = this.dAController.createDataItem('VTHEn', 'read');
		this.dAController.communication.VTHLim = this.dAController.createDataItem('VTHLim', 'write');
		this.dAController.communication.VTHAct = this.dAController.createDataItem('VTHAct', 'read');
		this.dAController.communication.VALEn = this.dAController.createDataItem('VALEn', 'read');
		this.dAController.communication.VALLim = this.dAController.createDataItem('VALLim', 'write');
		this.dAController.communication.VALAct = this.dAController.createDataItem('VALAct', 'read');
		this.dAController.communication.VWLEn = this.dAController.createDataItem('VWLEn', 'read');
		this.dAController.communication.VWLLim = this.dAController.createDataItem('VWLLim', 'write');
		this.dAController.communication.VWLAct = this.dAController.createDataItem('VWLAct', 'read');
		this.dAController.communication.VTLEn = this.dAController.createDataItem('VTLEn', 'read');
		this.dAController.communication.VTLLim = this.dAController.createDataItem('VTLLim', 'write');
		this.dAController.communication.VTLAct = this.dAController.createDataItem('VTLAct', 'read');
	}

}


