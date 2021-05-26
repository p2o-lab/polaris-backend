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

export class LimitMonitoring {
	vAHEn: OpcUaDataItem<any>;
	vAHLim: OpcUaDataItem<any>;
	vAHAct: OpcUaDataItem<any>;
	vWHEn: OpcUaDataItem<any>;
	vWHLim: OpcUaDataItem<any>;
	vWHAct: OpcUaDataItem<any>;
	vTHEn: OpcUaDataItem<any>;
	vTHLim: OpcUaDataItem<any>;
	vTHAct: OpcUaDataItem<any>;
	vALEn: OpcUaDataItem<any>;
	vALLim: OpcUaDataItem<any>;
	vALAct: OpcUaDataItem<any>;
	vWLEn: OpcUaDataItem<any>;
	vWLLim: OpcUaDataItem<any>;
	vWLAct: OpcUaDataItem<any>;
	vTLEn: OpcUaDataItem<any>;
	vTLLim: OpcUaDataItem<any>;
	vTLAct: OpcUaDataItem<any>;

	constructor(dataAssemblyController: any) {
		this.vAHEn = dataAssemblyController.createDataItem('VAHEn', 'read');
		this.vAHLim = dataAssemblyController.createDataItem('VAHLim', 'write');
		this.vAHAct = dataAssemblyController.createDataItem('VAHAct', 'read');
		this.vWHEn = dataAssemblyController.createDataItem('VWHEn', 'read');
		this.vWHLim = dataAssemblyController.createDataItem('VWHLim', 'write');
		this.vWHAct = dataAssemblyController.createDataItem('VWHAct', 'read');
		this.vTHEn = dataAssemblyController.createDataItem('VTHEn', 'read');
		this.vTHLim = dataAssemblyController.createDataItem('VTHLim', 'write');
		this.vTHAct = dataAssemblyController.createDataItem('VTHAct', 'read');
		this.vALEn = dataAssemblyController.createDataItem('VALEn', 'read');
		this.vALLim = dataAssemblyController.createDataItem('VALLim', 'write');
		this.vALAct = dataAssemblyController.createDataItem('VALAct', 'read');
		this.vWLEn = dataAssemblyController.createDataItem('VWLEn', 'read');
		this.vWLLim = dataAssemblyController.createDataItem('VWLLim', 'write');
		this.vWLAct = dataAssemblyController.createDataItem('VWLAct', 'read');
		this.vTLEn = dataAssemblyController.createDataItem('VTLEn', 'read');
		this.vTLLim = dataAssemblyController.createDataItem('VTLLim', 'write');
		this.vTLAct = dataAssemblyController.createDataItem('VTLAct', 'read');
	}
	initializeScaleSettings(dataAssemblyController: any){
		dataAssemblyController.VAHEn = this.vAHEn;
		dataAssemblyController.VAHLim = this.vAHLim;
		dataAssemblyController.VAHAct = this.vAHAct;
		dataAssemblyController.VWHEn = this.vWHEn;
		dataAssemblyController.VWHLim = this.vWHLim;
		dataAssemblyController.VWHAct = this.vWHAct;
		dataAssemblyController.VTHEn = this.vTHEn;
		dataAssemblyController.VTHLim = this.vTHLim;
		dataAssemblyController.VTHAct = this.vTHAct;
		dataAssemblyController.VALEn = this.vALEn;
		dataAssemblyController.VALLim = this.vALLim;
		dataAssemblyController.VALAct = this.vALAct;
		dataAssemblyController.VWLEn = this.vWLEn;
		dataAssemblyController.VWLLim = this.vWHLim;
		dataAssemblyController.VWLAct = this.vWLAct;
		dataAssemblyController.VTLEn = this.vTLEn;
		dataAssemblyController.VTLLim = this.vTLLim;
		dataAssemblyController.VTLAct = this.vTLAct;
	}

}

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
