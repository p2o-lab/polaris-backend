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

import {RecipeInterface, RecipeOptions, RecipeState, StepInterface} from '@p2olab/polaris-interface';
import {PEAController} from '../pea';
import {Step} from './step/Step';
import {Transition} from './step/transition/Transition';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {v4} from 'uuid';
import {catRecipe} from '../../logging';

/**
 * Events emitted by [[Recipe]]
 */
export interface RecipeEvents {
	/**
	 * when recipe has successfully started
	 * @event started
	 */
	started: void;
	/**
	 * when recipe has been stopped, returns recent step
	 * @event stopped
	 */
	stopped: Step;
	/**
	 * when something internal changes in a recipe (e.g. a step is finished or operation is executed)
	 * @event changed
	 */
	changed: void;
	/**
	 * when recipe completes
	 * @event completed
	 */
	completed: void;
}

export type RecipeEmitter = StrictEventEmitter<EventEmitter, RecipeEvents>;

/** Recipe which can be started.
 * It is parsed from RecipeOptions
 *
 */
export class Recipe extends (EventEmitter as new() => RecipeEmitter) {

	public readonly id: string;
	public readonly name: string;
	public readonly options: RecipeOptions;
	public readonly protected: boolean;

	// necessary peas
	public peaSet: Set<PEAController> = new Set<PEAController>();
	public readonly initialStep: Step | undefined;
	public readonly steps: Step[];

	// dynamic properties
	public currentStep: Step | undefined;
	public status: RecipeState;
	public lastChange: Date;
	private stepListener: EventEmitter | undefined;

	constructor(options: RecipeOptions, peas: PEAController[], protectedRecipe = false) {
		// eslint-disable-next-line constructor-super
		super();
		this.id = v4();
		if (options.name) {
			this.name = options.name;
		} else {
			throw new Error('Name property of recipe is missing');
		}

		if (options.steps) {
			this.steps = options.steps.map((stepOptions) => new Step(stepOptions, peas));

			// Resolve next steps to appropriate objects
			this.steps.forEach((step: Step) => {
				this.peaSet = new Set([...this.peaSet, ...step.getUsedPEAs()]);
				step.transitions.forEach((transition) => {
					transition.nextStep = this.steps.find((s) => s.name === transition.nextStepName);
					if (!transition.nextStep && !['completed', 'finished'].find((v) => v === transition.nextStepName)) {
						throw new Error(`Recipe load error ${this.name}: Next step "${transition.nextStepName}" ` +
							`not found in step "${step.name}" ` +
							`for condition "${JSON.stringify(transition.condition.json())}"`);
					}
				});
			});
		} else {
			throw new Error('steps array is missing in activeRecipe');
		}
		if (options.initialStep) {
			this.initialStep = this.steps.find((step) => step.name === options.initialStep);
		}
		if (!this.initialStep) {
			throw new Error(`"initialStep" property '${options.initialStep}' is not found in provided steps`);
		}

		this.options = options;
		this.protected = protectedRecipe;
		this.status = RecipeState.idle;
		this.lastChange = new Date();

		catRecipe.info(`Recipe ${this.name} (version: ${this.options.version}) successfully parsed`);
	}

	/** Get JSON description of recipe
	 *
	 * @returns {RecipeInterface}
	 */
	public json(): RecipeInterface {
		return {
			id: this.id,
			peas: Array.from(this.peaSet).map((p) => p.id),
			status: this.status,
			currentStep: this.currentStep ? this.currentStep.json() : {} as StepInterface,
			options: this.options,
			protected: this.protected,
			lastChange: (new Date().getTime() - this.lastChange.getTime()) / 1000
		};
	}

	/** Connect to all peas necessary for this recipe
	 *
	 * @returns {Promise<void[]>}
	 */
	public connectPEAs(): Promise<void[] | void> {
		let promise;
		const tasks = Array.from(this.peaSet).map((p) => p.connectAndSubscribe());
		if (tasks.length > 0) {
			promise = Promise.all(tasks);
		} else {
			promise = Promise.resolve();
		}
		return promise;
	}

	/**
	 * Connect to peas and then start the recipe; returns after connection to peas established
	 */
	public async start(): Promise<Recipe> {
		if (this.status === RecipeState.running) {
			throw new Error('Recipe is already running');
		}
		this.currentStep = this.initialStep!;
		this.status = RecipeState.running;
		await this.connectPEAs()
			.catch((reason) => {
				throw new Error(`Could not connect to all PEAs for recipe ${this.name}. ` +
					`Start of recipe not possible: ${reason.toString()}`);
			});
		this.executeStep();
		this.emit('started');
		return this;
	}

	/**
	 * Pause the recipe by pausing all peas
	 */
	public pause(): void {
		if (this.status !== RecipeState.running) {
			throw new Error('Can only pause running recipe');
		}
		this.peaSet.forEach((p) => {
			p.pause();
		});
	}

	/**
	 * Stops recipe and resolves when all services are stopped
	 *
	 * Clear monitoring of all conditions. Services won't be touched.
	 */
	public async stop(): Promise<void> {
		if (this.status !== RecipeState.running) {
			throw new Error('Can only stop running recipe');
		}
		catRecipe.info(`Stop recipe ${this.name}`);
		await Promise.all(Array.from(this.peaSet).map((p) => p.stop()));
		this.status = RecipeState.stopped;
		if (this.stepListener) {
			this.stepListener.removeAllListeners('completed');
		}
		if (this.currentStep) {
			this.currentStep.operations.forEach((operation) => operation.stop());
			this.currentStep.transitions.forEach((trans) => trans.condition.clear());
		}
		this.emit('stopped', this.currentStep!);
		this.currentStep = undefined;
	}

	private executeStep(): void {
		catRecipe.info(`Execute step: ${this.currentStep!.name}`);
		this.lastChange = new Date();
		this.stepListener = this.currentStep!.eventEmitter
			.on('operationChanged', () => {
				this.emit('changed');
			})
			.once('completed', (transition: Transition) => {
				this.stepListener!.removeAllListeners('operationChanged');
				if (transition.nextStep) {
					catRecipe.info(`Step ${this.currentStep!.name} finished. New step is ${transition.nextStepName}`);
					this.currentStep = transition.nextStep;
					this.executeStep();
				} else {
					catRecipe.info(`Recipe completed: ${this.name}`);
					this.currentStep = undefined;
					this.status = RecipeState.completed;
					this.emit('completed');
				}
				this.emit('changed');
			});
		this.currentStep!.execute();
	}

}
