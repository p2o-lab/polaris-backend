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

import {PlayerInterface, RecipeInterface, RecipeState, Repeat} from '@p2olab/polaris-interface';
import {Recipe} from './Recipe';
import {RecipeRun} from './RecipeRun';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catPlayer} from '../../logging';

/**
 * Events emitted by [[Player]]
 */
interface PlayerEvents {
	/**
	 * when player has successfully started
	 * @event started
	 */
	started: void;
	/**
	 * when something inside a recipe changes
	 * @event recipeChanged
	 */
	recipeChanged: Recipe;
	/**
	 * Notify when a recipe is completed
	 * @event recipeFinished
	 */
	recipeFinished: Recipe;
	/**
	 * when player completes
	 * @event completed
	 */
	completed: void;
}

type PlayerEmitter = StrictEventEmitter<EventEmitter, PlayerEvents>;

/**
 * Player can play recipes in a playlist
 * Only one recipe is active at one point in time
 */
export class Player extends (EventEmitter as new() => PlayerEmitter) {

	public readonly recipeRuns: RecipeRun[];
	public currentRecipeRun: RecipeRun | undefined;
	public repeat: Repeat = Repeat.none;

	constructor() {
		super();
		this._playlist = [];
		this._status = RecipeState.idle;
		this.currentRecipeRun = undefined;
		this.recipeRuns = [];
	}

	/** index in playlist starting from 0 */
	private _currentItem = -1;

	get currentItem(): number {
		return this._currentItem;
	}

	private _status: RecipeState;

	/**
	 * Getter of current {@link RecipeState}
	 * @return {@link RecipeState}
	 */
	get status(): RecipeState {
		return this._status;
	}

	private _playlist: Recipe[] = [];

	/**
	 * Getter of current {@link Recipe} in playlist
	 * @return Array of {@link Recipe}
	 */
	get playlist(): Recipe[] {
		return this._playlist;
	}

	/**
	 * Add recipe to playlist
	 * @param {Recipe} recipe to add
	 * @return Player
	 */
	public enqueue(recipe: Recipe): Player {
		this._playlist.push(recipe);
		catPlayer.info(`Recipe enqueued [${this._playlist.length}]: ${recipe.name}`);
		return this;
	}

	/**
	 * Getter for currently executed {@link Recipe}
	 * @return Recipe
	 */
	public getCurrentRecipe(): Recipe {
		return this._playlist[this._currentItem];
	}

	/**
	 * Remove recipe from playlist
	 * @param {number} index in playlist (starting from 0)
	 * @return Player
	 */
	public remove(index: number): Player {
		if (index === this.currentItem) {
			throw new Error('Can not remove currently running recipe');
		}
		if (index >= this.playlist.length) {
			throw new Error('Can not remove recipe with index greater than playlist size');
		}
		catPlayer.info(`Delete recipe ${index} from playlist`);
		this._playlist.splice(index, 1);
		if (index < this.currentItem) {
			this._currentItem -= 1;
		}
		return this;
	}

	/**
	 * Get JSON serialisation of player
	 * @returns {PlayerInterface}
	 */
	public json(): PlayerInterface {
		return {
			playlist: this._playlist.map((recipe) => ({id: recipe.id, name: recipe.name, options: recipe.options})),
			currentRecipe: this.getCurrentRecipe() ? this.getCurrentRecipe().json() : {} as RecipeInterface,
			currentItem: this._currentItem,
			repeat: this.repeat,
			status: this.status,
			recipeRuns: this.recipeRuns.slice(-10).map((rr) => {
				return {
					id: rr.id,
					name: rr.recipe.name,
					startTime: rr.startTime,
					endTime: rr.endTime,
					status: rr.status
				};
			})
		};
	}

	/**
	 * Start recipe if player is currently idle or stopped.
	 * Resume if player is currently paused
	 *
	 * resolves when player has finished
	 *
	 * @returns Player
	 */
	public async start(): Promise<void> {
		catPlayer.info(`Start player: ${this._playlist.map((item) => item.name)} ` +
			`(current state: ${RecipeState[this.status]})`);
		if (this._playlist.length <= 0) {
			catPlayer.warn('No recipes in playlist');
			throw new Error('No recipes in playlist');
		}
		if (this.status === RecipeState.idle ||
			this.status === RecipeState.stopped ||
			this.status === RecipeState.completed) {
			this._status = RecipeState.running;
			this._currentItem = 0;
			catPlayer.info('Player started');
			this.emit('started');
			while (this.currentItem < this.playlist.length) {
				catPlayer.info(`Go to next recipe (${this.currentItem + 1}/${this.playlist.length})`);
				await this.runCurrentRecipe();
				this._currentItem = this._currentItem + 1;
			}
			catPlayer.info('Player finished');
			this._status = RecipeState.completed;
			this._currentItem = -1;
			this.emit('completed');
		} else if (this.status === RecipeState.paused) {
			this._status = RecipeState.running;
			this.getCurrentRecipe().peaSet.forEach((peaController) => {
				peaController.resumeAllServices();
			});
		} else {
			throw new Error('Player currently already running');
		}
	}

	public reset(): void {
		if (this.status === RecipeState.completed || this.status === RecipeState.stopped) {
			this._currentItem = -1;
			this._status = RecipeState.idle;
		}
	}

	/**
	 * Pause the current recipe
	 */
	public async pause(): Promise<void> {
		if (this.status === RecipeState.running) {
			this._status = RecipeState.paused;
			this.getCurrentRecipe().pause().then();
		} else {
			return Promise.reject('Recipe not running');
		}
	}

	/**
	 * Stop the current recipe of player
	 */
	public async stop(): Promise<void> {
		if (this.status === RecipeState.running) {
			catPlayer.info('Stopping player');
			this._status = RecipeState.stopped;
			await this.currentRecipeRun?.stop();
			this.currentRecipeRun = undefined;
		} else {
			return Promise.reject('Recipe not running');
		}
	}

	/**
	 * Force transition of current recipe
	 *
	 */
	public forceTransition(stepName: string, nextStepName: string): void {
		const recipe = this.getCurrentRecipe();
		if (recipe.currentStep?.name !== stepName) {
			throw new Error(`Wrong step. Expected: ${recipe.currentStep?.name} - Actual: ${stepName}`);
		}
		const step = recipe.currentStep;
		const transition = step?.transitions.find((tr) => tr.nextStepName === nextStepName);
		if (!transition) {
			throw new Error('Does not contain nextStep');
		}
		step?.enterTransition(transition);
	}

	/** Run current recipe in playlist and resolve when this recipe is completed
	 *
	 * @returns {Promise<void>}
	 */
	private async runCurrentRecipe(): Promise<void> {
		catPlayer.info(`Start recipe ${this.getCurrentRecipe().name}`);
		this.currentRecipeRun = new RecipeRun(this.getCurrentRecipe());
		this.recipeRuns.push(this.currentRecipeRun);
		return new Promise((resolve) => {
			this.currentRecipeRun!
				.on('changed', () => {
					this.emit('recipeChanged', this.currentRecipeRun!.recipe);
				})
				.once('completed', () => {
					this.emit('recipeFinished', this.currentRecipeRun!.recipe);
					this.currentRecipeRun!.removeAllListeners('changed');
					catPlayer.info(`recipe finished ${this.currentItem + 1}/${this._playlist.length} (${this.status})`);
					resolve();
				});
			this.currentRecipeRun!.start();
		});
	}
}
