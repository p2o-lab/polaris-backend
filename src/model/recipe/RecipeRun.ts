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

import {RecipeRunInterface, RecipeState} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {v4} from 'uuid';
import {ServiceLogEntry, VariableLogEntry} from '../../logging/archive';
import {Recipe, RecipeEmitter} from './Recipe';

/** One specific recipe run with all logs
 *
 */
export class RecipeRun extends (EventEmitter as new() => RecipeEmitter) {

    get startTime(): Date {
        return this._startTime;
    }
    get endTime(): Date {
        return this._endTime;
    }

    get status(): RecipeState {
        return this._status;
    }

    public readonly id: string;
    public readonly recipe: Recipe;

    public serviceLog: ServiceLogEntry[] = [];
    public variableLog: VariableLogEntry[] = [];
    private _startTime: Date;
    private _endTime: Date;

    private _status: RecipeState;

    constructor(recipe: Recipe) {
        super();
        this.id = v4();
        this.recipe = recipe;
        this._status = RecipeState.idle;
    }

    public json(): RecipeRunInterface {
        return {
            id: this.id,
            startTime: this._startTime,
            endTime: this._endTime,
            recipe: this.recipe.options,
            status: this._status,
            serviceLog: this.serviceLog,
            variableLog: this.variableLog
        };
    }

    /** Starts the linked recipe and resolves when recipe is started
     *
     */
    public async start(): Promise<Recipe> {
        this._startTime = new Date();
        this.recipe
            .on('completed', this.boundOnCompleted)
            .on('changed', this.boundOnChanged)
            .on('started', this.boundOnStarted);
        return await this.recipe.start();
    }

    /** Stop the linked recipe
     *
     */
    public async stop(): Promise<void> {
        this._endTime = new Date();
        this._status = RecipeState.stopped;
        this.removeRecipeListeners();
        this.emit('stopped', this.recipe.currentStep);
        await this.recipe.stop();
    }

    private boundOnCompleted = () => this.onCompleted();
    private boundOnStarted = () => this.onStarted();

    private boundOnChanged = () => this.onChanged();

    private removeRecipeListeners() {
        this.recipe.removeListener('completed', this.boundOnCompleted);
        this.recipe.removeListener('changed', this.boundOnChanged);
        this.recipe.removeListener('started', this.boundOnStarted);
    }

    private onCompleted() {
        this._endTime = new Date();
        this._status = RecipeState.completed;
        this.emit('completed');
        this.removeRecipeListeners();
    }

    private onStarted() {
        this._status = RecipeState.running;
        this.emit('changed');
    }

    private onChanged() {
        this.emit('changed');
    }
}
