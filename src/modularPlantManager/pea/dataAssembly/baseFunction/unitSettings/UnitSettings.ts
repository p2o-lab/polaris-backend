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

import {UnitCollection} from './UnitCollection';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';
import {VUnitDataItems} from '@p2olab/pimad-types';

/**
 * Events emitted by [[UnitSettings]]
 */
export interface UnitSettingsEvents {
	changed: number;
}
type UnitSettingsEventEmitter = StrictEventEmitter<EventEmitter, UnitSettingsEvents>;


export class UnitSettings extends (EventEmitter as new () => UnitSettingsEventEmitter){
	public readonly dataItems!: VUnitDataItems;

	constructor(requiredDataItems: Required<VUnitDataItems>) {
		super();

		this.dataItems = requiredDataItems;
	}

	get Unit(): string {
		const unit = UnitCollection.find((item) => item.value === this.dataItems.VUnit.value);
		return unit ? unit.unit : '';
	}
}
