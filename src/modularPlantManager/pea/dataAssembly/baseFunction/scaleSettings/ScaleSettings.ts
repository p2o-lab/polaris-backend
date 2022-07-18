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

export interface ScaleSettingsRuntime {
	VSclMin: DataItem<number>;
	VSclMax: DataItem<number>;
}

/**
 * Events emitted by [[ScaleSettings]]
 */
export interface ScaleSettingsEvents {
	changed: {
		ScaleSettingsOp: boolean;
		ScaleSettingsAut: boolean;
	};
}

type ScaleSettingsEmitter = StrictEventEmitter<EventEmitter, ScaleSettingsEvents>;

export class ScaleSettings extends (EventEmitter as new () => ScaleSettingsEmitter) {

	public readonly dataItems!: ScaleSettingsRuntime;

	constructor(requiredDataItems: Required<ScaleSettingsRuntime>) {
		super();

		this.dataItems = requiredDataItems;

		}
}