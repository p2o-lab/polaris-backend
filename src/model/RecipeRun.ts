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

import {RecipeInterface} from 'pfe-ree-interface';
import { Recipe } from './Recipe';
import { v4 } from 'uuid';
import { EventEmitter } from 'events';

/** One specific recipe run with all logs
 *
 */
export class RecipeRun {

    id: string;
    startTime: Date;
    endTime: Date;
    recipe: Recipe;

    eventEmitter: EventEmitter;

    constructor(recipe: Recipe) {
        this.id = v4();
        this.recipe = recipe;
        this.eventEmitter = new EventEmitter();
    }

    public json(): { id: string; startTime: Date; endTime: Date; recipe: RecipeInterface } {
        return {
            id: this.id,
            startTime: this.startTime,
            endTime: this.endTime,
            recipe: this.recipe.json()
        };
    }

    /** Starts the linked recipe
     *
     */
    public start() {
        this.startTime = new Date();
        return this.recipe.start()
            .on('recipe_finished', () => {
                this.endTime = new Date();
            });

    }
}
