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
import {DataAssemblyDataItems} from '../../DataAssembly';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';

export type LimitMonitoringRuntime = DataAssemblyDataItems & {
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

/**
 * Events emitted by [[LimitMonitoring]]
 */
export interface LimitMonitoringEvents {
	changed: string;
}

type LimitMonitoringEmitter = StrictEventEmitter<EventEmitter, LimitMonitoringEvents>;

export class LimitMonitoring extends (EventEmitter as new() => LimitMonitoringEmitter) {
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

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super();

		this.VAHEn = DataItemFactory.create(getDataItemModel(options, 'VAHEn'), connectionHandler);
		this.VAHLim = DataItemFactory.create(getDataItemModel(options, 'VAHLim'), connectionHandler);
		this.VAHAct = DataItemFactory.create(getDataItemModel(options, 'VAHAct'), connectionHandler);
		this.VWHEn = DataItemFactory.create(getDataItemModel(options, 'VWHEn'), connectionHandler);
		this.VWHLim = DataItemFactory.create(getDataItemModel(options, 'VWHLim'), connectionHandler);
		this.VWHAct = DataItemFactory.create(getDataItemModel(options, 'VWHAct'), connectionHandler);
		this.VTHEn = DataItemFactory.create(getDataItemModel(options, 'VTHEn'), connectionHandler);
		this.VTHLim = DataItemFactory.create(getDataItemModel(options, 'VTHLim'), connectionHandler);
		this.VTHAct = DataItemFactory.create(getDataItemModel(options, 'VTHAct'), connectionHandler);
		this.VALEn = DataItemFactory.create(getDataItemModel(options, 'VALEn'), connectionHandler);
		this.VALLim = DataItemFactory.create(getDataItemModel(options, 'VALLim'), connectionHandler);
		this.VALAct = DataItemFactory.create(getDataItemModel(options, 'VALAct'), connectionHandler);
		this.VWLEn = DataItemFactory.create(getDataItemModel(options, 'VWLEn'), connectionHandler);
		this.VWLLim = DataItemFactory.create(getDataItemModel(options, 'VWLLim'), connectionHandler);
		this.VWLAct = DataItemFactory.create(getDataItemModel(options, 'VWLAct'), connectionHandler);
		this.VTLEn = DataItemFactory.create(getDataItemModel(options, 'WQC'), connectionHandler);
		this.VTLLim = DataItemFactory.create(getDataItemModel(options, 'WQC'), connectionHandler);
		this.VTLAct = DataItemFactory.create(getDataItemModel(options, 'WQC'), connectionHandler);
	}
}


