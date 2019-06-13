/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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

import {PlayerInterface, RecipeState, Repeat} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catManager, catPlayer} from '../../config/logging';
import {Recipe} from './Recipe';
import {RecipeRun} from './RecipeRun';
import {Step} from './Step';

/**
 * Events emitted by [[Player]]
 */
interface PlayerEvents {
    /**
     * when player has successfully started
     * @event
     */
    started: void;
    /**
     * when player has started a recipe
     * @event
     */
    recipeStarted: Recipe;
    /**
     * when a step is finished in the player
     * @event
     */
    stepFinished: Step;
    /**
     * Notify when a recipe is completed
     * @event
     */
    recipeFinished: Recipe;
    /**
     * when player completes
     * @event
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
    public currentRecipeRun: RecipeRun;
    public repeat: Repeat;

    /** index in playlist starting from 0 */
    private _currentItem: number;
    private _status: RecipeState;
    private _playlist: Recipe[] = [];

    get playlist(): Recipe[] {
        return this._playlist;
    }

    get currentItem(): number {
        return this._currentItem;
    }

    constructor() {
        super();
        this._playlist = [];
        this._status = RecipeState.idle;
        this.currentRecipeRun = undefined;
        this.recipeRuns = [];
    }

    get status() {
        return this._status;
    }

    /**
     * Add recipe to playlist
     * @param {Recipe} recipe
     * @return Player
     */
    public enqueue(recipe: Recipe): Player {
        this._playlist.push(recipe);
        catPlayer.info(`Recipe enqueued [${this._playlist.length}]: ${recipe.name}`);
        return this;
    }

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
        catManager.info(`Delete recipe ${index} from playlist`);
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
            playlist: this._playlist.map((recipe) => recipe.json()),
            currentItem: this._currentItem,
            repeat: this.repeat,
            status: this.status,
            recipeRuns: this.recipeRuns.slice(-10).map((rr) => {
                return {
                    id: rr.id,
                    name: rr.recipe.name,
                    startTime: rr.startTime,
                    endTime: rr.endTime
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
    public async start() {
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
                catManager.info(`Go to next recipe (${this.currentItem + 1}/${this.playlist.length})`);
                await this.runCurrentRecipe();
                this._currentItem = this._currentItem + 1;
            }
            catPlayer.info('Player finished');
            this._status = RecipeState.completed;
            this._currentItem = undefined;
            this.emit('completed');
        } else if (this.status === RecipeState.paused) {
            this._status = RecipeState.running;
            this.getCurrentRecipe().modules.forEach((module) => {
                module.resume();
            });
        } else {
            throw new Error('Player currently already running');
        }
    }

    public reset() {
        if (this.status === RecipeState.completed || this.status === RecipeState.stopped) {
            this._currentItem = undefined;
            this._status = RecipeState.idle;
        }
    }

    /**
     * Pause all modules used in current recipe
     * TODO: pause only those which should be currently in running due to the recipe
     */
    public pause() {
        if (this.status === RecipeState.running) {
            this._status = RecipeState.paused;
            this.getCurrentRecipe().pause();
        }
    }

    /**
     * Stop the current recipe of player
     */
    public async stop() {
        catPlayer.info('Stop player');
        if (this.status === RecipeState.running) {
            this._status = RecipeState.stopped;
            return this.getCurrentRecipe().stop();
        }
    }

    /**
     * Force transition of current recipe
     *
     */
    public forceTransition(stepName: string, nextStepName: string) {
        const recipe = this.getCurrentRecipe();
        if (recipe.currentStep.name !== stepName) {
            throw new Error(`Ẁrong step. Expected: ${recipe.currentStep.name} - Actual: ${stepName}`);
        }
        const step = recipe.currentStep;
        const transition = step.transitions.find((tr) => tr.nextStepName === nextStepName);
        if (!transition) {
            throw new Error('Does not contain nextStep');
        }
        step.enterTransition(transition);
    }

    /** Run current recipe in playlist and resolve when this recipe is completed
     *
     * @returns {Promise<void>}
     */
    private async runCurrentRecipe(): Promise<void> {
        catPlayer.info(`Start recipe ${this.getCurrentRecipe().name}`);
        this.currentRecipeRun = new RecipeRun(this.getCurrentRecipe());
        this.recipeRuns.push(this.currentRecipeRun);
        return new Promise(async (resolve) => {
            this.currentRecipeRun.recipe
                .on('stepFinished', (finishedStep) => this.emit('stepFinished', finishedStep))
                .once('started', () => this.emit('recipeStarted', this.currentRecipeRun.recipe))
                .once('completed', () => {
                    this.emit('recipeFinished', this.currentRecipeRun.recipe);
                    catPlayer.info(`recipe finished ${this.currentItem + 1}/${this._playlist.length} (${this.status})`);
                    this.currentRecipeRun.recipe.removeAllListeners('stepFinished');
                    resolve();
                });
            this.currentRecipeRun.start();
        });
    }
}
