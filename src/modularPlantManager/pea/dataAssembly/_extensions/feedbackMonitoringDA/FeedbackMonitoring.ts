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
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../../DataAssemblyController';
import {Constructor} from '../_helper';

export interface FeedbackMonitoringRuntime extends BaseDataAssemblyRuntime {
	MonEn: OpcUaDataItem<boolean>;
	MonSafePos: OpcUaDataItem<boolean>;
	MonStatErr: OpcUaDataItem<boolean>;
	MonDynErr: OpcUaDataItem<boolean>;
	MonStatTi: OpcUaDataItem<number>;
	MonDynTi: OpcUaDataItem<number>;
}

export class FeedbackMonitoring {
	monEn: OpcUaDataItem<boolean>;
	monSafePos: OpcUaDataItem<boolean>;
	monStatErr: OpcUaDataItem<boolean>;
	monDynErr: OpcUaDataItem<boolean>;
	monStatTi: OpcUaDataItem<number>;
	monDynTi: OpcUaDataItem<number>;
	
	constructor(dAController: any) {
		this.monEn = dAController.createDataItem('MonEn', 'write');
		this.monSafePos = dAController.createDataItem('MonSafePos', 'read');
		this.monStatErr = dAController.createDataItem('MonStatErr', 'read');
		this.monDynErr = dAController.createDataItem('MonDynErr', 'read');
		this.monStatTi = dAController.createDataItem('MonStatTi', 'read');
		this.monDynTi = dAController.createDataItem('MonDynTi', 'read');
	}

	public initializeFeedbackMonitoring(dAController: any){
		dAController.communication.MonEn = this.monEn;
		dAController.communication.MonSafePos = this.monSafePos;
		dAController.communication.MonStatErr = this.monStatErr;
		dAController.communication.MonDynErr = this.monDynErr;
		dAController.communication.MonStatTi = this.monStatTi;
		dAController.communication.MonDynTi = this.monDynTi;
	}
}
