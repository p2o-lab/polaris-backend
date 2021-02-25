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

import {StateConditionOptions} from '@p2olab/polaris-interface';
import {BaseService, PEA} from '../../pea';
import {ServiceState} from '../../pea/serviceSet/service/enum';
import {Condition} from '../Condition';
import {PEACondition} from './PEACondition';

const mapping: { [key: string]: ServiceState } = {
	'idle': ServiceState.IDLE,
	'starting': ServiceState.STARTING,
	'execute': ServiceState.EXECUTE,
	'completing': ServiceState.COMPLETING,
	'completed': ServiceState.COMPLETED,
	'resetting': ServiceState.RESETTING,
	'pausing': ServiceState.PAUSING,
	'paused': ServiceState.PAUSED,
	'resuming': ServiceState.RESUMING,
	'holding': ServiceState.HOLDING,
	'held': ServiceState.HELD,
	'unholding': ServiceState.UNHOLDING,
	'stopping': ServiceState.STOPPING,
	'stopped': ServiceState.STOPPED,
	'aborting': ServiceState.ABORTING,
	'aborted': ServiceState.ABORTED
};

export class ServiceStateCondition extends PEACondition {
	public readonly service: BaseService;
	public readonly state: ServiceState;

	constructor(options: StateConditionOptions, peaSet: PEA[]) {
		super(options, peaSet);
		if (!this.usedPEA) {
			throw new Error(`State ${options.state} is not a valid state for a condition (${JSON.stringify(options)}`);
		}
		this.service = this.usedPEA.getService(options.service);
		this.state = mapping[options.state.toLowerCase()];
		if (!this.state) {
			throw new Error(`State ${options.state} is not a valid state for a condition (${JSON.stringify(options)}`);
		}
	}

	public listen(): Condition {
		this.service.eventEmitter.on('state', this.check);
		this.check(this.service.state);
		return this;
	}

	public clear(): void {
		super.clear();
		this.service.eventEmitter.removeListener('state', this.check);
	}

	private check = (expectedState: ServiceState): void => {
		this._fulfilled = (expectedState === this.state);
		this.emit('stateChanged', this._fulfilled);
	}
}
