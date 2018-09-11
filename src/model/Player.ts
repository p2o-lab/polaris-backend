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

import {Recipe} from "./Recipe";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";
import {PlayerInterface, RecipeState, Repeat} from "pfe-ree-interface";
import {manager} from "./Manager";

export class Player {
    public repeat: Repeat = Repeat.none;
    private eventEmitter: EventEmitter = new EventEmitter();

    private _currentItem: number = 0;

    private _playlist: Recipe[] = [];

    get playlist(): Recipe[] {
        return this._playlist;
    }

    private _status: RecipeState = RecipeState.idle;

    get currentItem(): number {
        return this._currentItem;
    }

    constructor() {
        this.eventEmitter.on('recipe_finished', () => {
            catRM.info(`recipe finished ${this.currentItem}/${this.playlist.length} (${this.status})`);
            if (this._status === RecipeState.running) {
                this._currentItem = this._currentItem + 1;
                if (this._currentItem < this._playlist.length) {
                    catRM.info(`Go to next recipe (${this.currentItem + 1}/${this.playlist.length})`);
                    this.runCurrentRecipe();
                } else {
                    this._status = RecipeState.completed;
                }
            }
        });
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
        catRM.info(`Delete recipe ${index} from playlist`);
        this._playlist.splice(index, 1);
    }

    public async json(): Promise<PlayerInterface> {
        const pl = this._playlist.map(recipe => recipe.json());
        return {
            playlist: await Promise.all(pl),
            currentItem: this._currentItem,
            repeat: this.repeat,
            status: this.status
        };
    }

    public async start() {
        if (this.status === RecipeState.idle || this.status === RecipeState.stopped) {
            this._status = RecipeState.running;
            manager.eventEmitter.emit('refresh', 'recipe');
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
            this._currentItem = 0;
            this._status = RecipeState.idle;
            manager.eventEmitter.emit('refresh', 'recipe');
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
            this.getCurrentRecipe().modules.forEach((module) => {
                module.stop();
            });
        }
    }

    private runCurrentRecipe() {
        const events = this.getCurrentRecipe().start();
        events.on('recipe_finished', (data) => {
            this.eventEmitter.emit('recipe_finished', data);
        });
    }
}
