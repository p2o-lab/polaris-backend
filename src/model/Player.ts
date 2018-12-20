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
import {PlayerInterface, RecipeState, Repeat} from 'pfe-ree-interface';
import {RecipeRun} from "./RecipeRun";

export class Player extends EventEmitter{
    public repeat: Repeat;

    private _currentItem: number;

    private _playlist: Recipe[];

    recipeRuns: RecipeRun[];
    private currentRecipeRun: RecipeRun;

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

    private onRecipeFinished() {
        catManager.info(`recipe finished ${this.currentItem + 1}/${this._playlist.length} (player ${this.status})`);
        if (this._status === RecipeState.running) {
            if (this._currentItem + 1 < this._playlist.length) {
                this._currentItem = this._currentItem + 1;
                catManager.info(`Go to next recipe (${this.currentItem + 1}/${this.playlist.length})`);
                this.runCurrentRecipe();
            } else {
                this._status = RecipeState.completed;
                this._currentItem = undefined;
                this.emit('completed');
            }
        }
    }

    get status() {
        return this._status;
    }

    /**
     * Add recipe to playlist
     * @param {Recipe} recipe
     */
    public enqueue(recipe: Recipe) {
        this._playlist.push(recipe);
    }

    public getCurrentRecipe(): Recipe {
        return this._playlist[this._currentItem];
    }

    /**
     * Remove recipe from playlist
     * @param {number} index in playlist
     */
    public remove(index: number) {
        catManager.info(`Delete recipe ${index} from playlist`);
        this._playlist.splice(index, 1);
    }

    public json(): PlayerInterface {
        return {
            playlist: this._playlist.map(recipe => recipe.json()),
            currentItem: this._currentItem,
            repeat: this.repeat,
            status: this.status,
            currentRecipeRun: this.currentRecipeRun ? this.currentRecipeRun.json() : undefined
        };
    }

    public async start() {
        if (this.status === RecipeState.idle || this.status === RecipeState.stopped) {
            this._status = RecipeState.running;
            this._currentItem = 0;
            this.runCurrentRecipe();
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
            this.getCurrentRecipe().modules.forEach((module) => {
                module.pause();
            });
        }
    }

    public stop() {
        if (this.status === RecipeState.running) {
            this._status = RecipeState.stopped;
            this.getCurrentRecipe().current_step.transitions.map(trans => trans.condition.clear());
            this.getCurrentRecipe().modules.forEach((module) => {
                //module.stop();
            });
        }
    }

    private runCurrentRecipe() {
        this.currentRecipeRun = new RecipeRun(this.getCurrentRecipe());
        this.recipeRuns.push(this.currentRecipeRun);
        const events = this.currentRecipeRun.start();
        events.once('recipe_finished', (finishedRecipe) => {
            this.emit('recipe_finished', finishedRecipe);
            this.onRecipeFinished();
        });
        events.on('step_finished', () => {
                this.emit('refresh', 'recipe', 'stepFinished');
            });
    }

}
