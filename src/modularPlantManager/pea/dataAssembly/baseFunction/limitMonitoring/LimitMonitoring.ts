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
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';

export type LimitMonitoringRuntime = {
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

	public readonly dataItems!: LimitMonitoringRuntime;

	constructor(requiredDataItems: Required<LimitMonitoringRuntime>) {
		super();

		this.dataItems = requiredDataItems;
	}
}

