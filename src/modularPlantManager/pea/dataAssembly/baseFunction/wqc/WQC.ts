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
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';

export type WQCRuntime = {
	WQC: DataItem<number>;
}

/**
 * Events emitted by [[OSLevel]]
 */
export interface WQCEvents extends BaseServiceEvents {
	changed: number;
}

type WQCEmitter = StrictEventEmitter<EventEmitter, WQCEvents>;

export class WQC extends (EventEmitter as new () => WQCEmitter) {
	private dAController: any;

	constructor(dAController: any) {
		super();
		this.dAController = dAController;

		this.dAController.communication.WQC = this.dAController.createDataItem('WQC', 'number');
		this.dAController.communication.WQC.on('changed', () => {
			this.emit('changed', this.dAController.communication.WQC.value);
		});
	}

	get WQC(): number{
		return this.dAController.communication.WQC.value;
	}
}
