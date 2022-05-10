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

import {OperationOptions, StepInterface, TransitionOptions} from '@p2olab/polaris-interface';
import {PEAController} from '../../pea';
import {Operation} from './operation/Operation';
import {Transition} from './transition/Transition';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catRecipe} from '../../../logging';

export interface StepOptions {
	name: string;
	operations: OperationOptions[];
	transitions: TransitionOptions[];
}

/**
 * Events emitted by [[Step]]
 */
interface StepEvents {
	/**
	 * when step is completed
	 * @event completed
	 */
	completed: Transition;

	/**
	 * when operation inside step has changed (completed or aborted)
	 * @event operationChanged
	 */
	operationChanged: Operation;
}

type StepEmitter = StrictEventEmitter<EventEmitter, StepEvents>;

/**
 * Executable [[Step]] from [[Recipe]]
 */
export class Step extends (EventEmitter as new () => StepEmitter) {
	public name: string;
	public operations: Operation[];
	public transitions: Transition[];

	constructor(options: StepOptions, peaSet: PEAController[]) {
		super();

		if (options.name) {
			this.name = options.name;
		} else {
			throw new Error(`"name" property is missing in ${JSON.stringify(options)}`);
		}
		if (options.operations) {
			this.operations = options.operations.map(
				(operationOptions) => new Operation(operationOptions, peaSet)
			);
		} else {
			throw new Error(`"operations" array is missing in ${JSON.stringify(options)}`);
		}
		if (options.transitions) {
			this.transitions = options.transitions.map(
				(transitionOptions) => new Transition(transitionOptions, peaSet)
			);
		} else {
			throw new Error(`"transitions" array is missing in ${JSON.stringify(options)}`);
		}
	}

	public getUsedPEAs(): Set<PEAController> {
		let set = new Set<PEAController>(this.operations.map((op: Operation) => op.pea!));
		this.transitions.forEach((tr) => {
			set = new Set([...set, ...tr.getUsedPEAs()]);
		});
		return set;
	}

	public execute(): void {
		// execute operations for step
		this.operations.forEach((operation) => {
			catRecipe.info(`Start operation ${operation.pea?.id} ${operation.service.name} ` +
				`${JSON.stringify(operation.command)}`);
			operation.execute().then();
			operation.on('changed', (state) => {
				if (state === 'completed' || state === 'aborted') {
					operation.removeAllListeners('changed');
				}
				this.emit('operationChanged', operation);
			});
		});

		// TODO: check if operation all have successfully executed

		// start listening to transitions of step
		this.transitions.forEach((transition) => {
			catRecipe.info(`Start listening for transition ${JSON.stringify(transition.json())}`);
			transition.condition
				.on('stateChanged', (status) => {
					catRecipe.info(`Status of step ${this.name} ` +
						`for transition to ${transition.nextStepName}: ${status}`);
					if (status) {
						this.enterTransition(transition);
					}
				});
			transition.condition.listen();
		});
	}

	/**
	 * enter transition (clear conditions and emit 'completed')
	 * @param {Transition} nextTransition
	 */
	public enterTransition(nextTransition: Transition): void {
		// clear up all conditions
		this.transitions.forEach((transition) => {
			transition.condition.clear();
		});
		this.emit('completed', nextTransition);
	}

	public json(): StepInterface {
		return {
			name: this.name,
			transitions: this.transitions.map((transition) => transition.json()),
			operations: this.operations.map((operation) => operation.json())
		};
	}
}
