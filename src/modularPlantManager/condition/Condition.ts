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

import {ConditionOptions} from '@p2olab/polaris-interface';
import {PEA} from '../pea';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';

/**
 * Events emitted by [[Condition]]
 */
interface ConditionEvents {
	/**
	 * Notify when the condition changes its state. Parameter is a boolean representing if condition is fulfilled.
	 * @event stateChanged
	 */
	stateChanged: boolean;
}

type ConditionEmitter = StrictEventEmitter<EventEmitter, ConditionEvents>;

export abstract class Condition extends (EventEmitter as new() => ConditionEmitter) {

	private readonly options: ConditionOptions;
	protected readonly usedPEA: PEA | undefined;

	protected constructor(options: ConditionOptions, peaSet: PEA[]) {
		// eslint-disable-next-line constructor-super
		super();
		this.options = options;

		if ('pea' in options && options.pea && peaSet) {
			this.usedPEA = peaSet.find((p) => p.id === options.pea);
		}
	}

	protected _fulfilled = false;

	get fulfilled(): boolean {
		return this._fulfilled;
	}

	/**
	 * Listen to any change in condition and inform via 'stateChanged' event
	 */
	public abstract listen(): Condition;

	/**
	 * Clear listening on condition
	 */
	public clear(): void {
		this._fulfilled = false;
		this.removeAllListeners('stateChanged');
	}


	public getUsedPEAs(): Set<PEA> {
		const set = new Set<PEA>();
		if (this.usedPEA) {
			set.add(this.usedPEA);
		}
		return set;
	}

	public json(): ConditionOptions {
		return this.options;
	}
}
