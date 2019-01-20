/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Recipe} from './Recipe';
import {catManager} from '../config/logging';
import {EventEmitter} from 'events';
import {PlayerInterface, RecipeState, Repeat, TransitionOptions} from '@plt/pfe-ree-interface';
import {RecipeRun} from "./RecipeRun";
import StrictEventEmitter from 'strict-event-emitter-types';
import {Step} from './Step';
import {Transition} from './Transition';

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
 *
 * @event completed
 *
 */
export class Player extends (EventEmitter as { new(): PlayerEmitter }) {
    public repeat: Repeat;

    private _currentItem: number;

    private _playlist: Recipe[];

    readonly recipeRuns: RecipeRun[];
    currentRecipeRun: RecipeRun;

    get playlist(): Recipe[] {
        return this._playlist;
    }

    private _status: RecipeState;

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
        return this;
    }

    public getCurrentRecipe(): Recipe {
        return this._playlist[this._currentItem];
    }

    /**
     * Remove recipe from playlist
     * @param {number} index in playlist
     * @return Player
     */
    public remove(index: number): Player {
        catManager.info(`Delete recipe ${index} from playlist`);
        this._playlist.splice(index, 1);
        return this;
    }

    /**
     * Get JSON serialisation of player
     * @returns {PlayerInterface}
     */
    public json(): PlayerInterface {
        return {
            playlist: this._playlist.map(recipe => recipe.json()),
            currentItem: this._currentItem,
            repeat: this.repeat,
            status: this.status,
            recipeRuns: this.recipeRuns.slice(-10).map((rr) => {return {
                id: rr.id,
                name: rr.recipe.name,
                startTime: rr.startTime,
                endTime: rr.endTime
            }})
        };
    }

    /**
     * Start recipe if player is currently idle or stopped.
     * Resume if player is currently paused
     *
     * @returns Player
     */
    public start(): Player {
        if (this.status === RecipeState.idle || this.status === RecipeState.stopped) {
            this._status = RecipeState.running;
            this._currentItem = 0;
            this.emit('started');
            this.runCurrentRecipe();
        } else if (this.status === RecipeState.paused) {
            this._status = RecipeState.running;
            this.getCurrentRecipe().modules.forEach((module) => {
                module.resume();
            });
        } else {
            throw new Error('Player currently already running');
        }
        return this;
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
            this.getCurrentRecipe().modules.forEach((module) => {
                module.pause();
            });
        }
    }

    /**
     * Stop the current recipe of player
     */
    public stop() {
        if (this.status === RecipeState.running) {
            this._status = RecipeState.stopped;
            this.getCurrentRecipe().stop();
        }
    }

    /**
     * Force transition of current recipe
     */
    public forceTransition(stepName: string, nextStepName: string) {
        const recipe = this.getCurrentRecipe();
        console.log(stepName, recipe.current_step.name);
        if (recipe.current_step.name!==stepName) {
            throw new Error('Wrong step')
        }
        const step = recipe.current_step;
        const transition = step.transitions.find(tr=> tr.next_step_name === nextStepName);
        if (!transition) {
            throw new Error('Does not contain nextStep');
        }
        step.enterTransition(transition);
    }

    private runCurrentRecipe(): Player {
        this.currentRecipeRun = new RecipeRun(this.getCurrentRecipe());
        this.recipeRuns.push(this.currentRecipeRun);
        this.currentRecipeRun.start()
            .once('started', () => this.emit('recipeStarted', this.currentRecipeRun.recipe))
            .on('stepFinished', ({finishedStep, nextStep}) => this.emit('stepFinished', finishedStep))
            .once('completed', () => {
                this.emit('recipeFinished', this.currentRecipeRun.recipe);
                catManager.info(`recipe finished ${this.currentItem + 1}/${this._playlist.length} (player ${this.status})`);
                if (this._currentItem + 1 < this._playlist.length) {
                    this._currentItem = this._currentItem + 1;
                    catManager.info(`Go to next recipe (${this.currentItem + 1}/${this.playlist.length})`);
                    this.runCurrentRecipe();
                } else {
                    this._status = RecipeState.completed;
                    this._currentItem = undefined;
                    this.emit('completed');
                }
            });
        return this;
    }
}
