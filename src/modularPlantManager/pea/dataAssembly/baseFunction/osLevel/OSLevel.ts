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

import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';
import {OSLevelDataItems} from '@p2olab/pimad-types';
import {BaseDataItem} from '../../dataItem/DataItem';

/**
 * Events emitted by [[OSLevel]]
 */
export interface OSLevelEvents {
	changed: number;
}

type OSLevelEmitter = StrictEventEmitter<EventEmitter, OSLevelEvents>;

export class OSLevel extends (EventEmitter as new()=> OSLevelEmitter){

	private readonly dataItems!: OSLevelDataItems;

	constructor(requiredDataItems: Required<OSLevelDataItems>) {
		super();

		this.dataItems = requiredDataItems;

		(this.dataItems.OSLevel as BaseDataItem<number>).on('changed', () => {
			this.emit('changed', this.osLevel);
		});
	}

	get osLevel(): number {
		return this.dataItems.OSLevel.value;
	}

	set osLevel(value: number) {
		if (Number.isInteger(value) && value >= 0) (this.dataItems.OSLevel as BaseDataItem<number>).write(value).then();
	}
}
