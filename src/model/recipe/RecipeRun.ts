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

import {RecipeRunInterface} from '@p2olab/polaris-interface';
import {EventEmitter} from 'events';
import {v4} from 'uuid';
import {ServiceLogEntry, VariableLogEntry} from '../../logging/archive';
import {Recipe, RecipeEmitter} from './Recipe';
import {Step} from './Step';

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

    public readonly id: string;
    public readonly recipe: Recipe;

    public serviceLog: ServiceLogEntry[] = [];
    public variableLog: VariableLogEntry[] = [];
    private _startTime: Date;
    private _endTime: Date;

    private boundOnCompleted = () => this.onCompleted();

    public json(): RecipeRunInterface {
        return {
            id: this.id,
            startTime: this._startTime,
            endTime: this._endTime,
            recipe: this.recipe.options,
            serviceLog: this.serviceLog,
            variableLog: this.variableLog
        };
    }

    private boundOnStarted = () => this.onStarted();
    private boundOnStepFinished = (finishedStep: Step) => this.onStepFinished(finishedStep);

    constructor(recipe: Recipe) {
        super();
        this.id = v4();
        this.recipe = recipe;
    }

    /** Starts the linked recipe and resolves when recipe is started
     *
     */
    public async start(): Promise<Recipe> {
        this._startTime = new Date();
        this.recipe
            .on('completed', this.boundOnCompleted)
            .on('stepFinished', this.boundOnStepFinished)
            .on('started', this.boundOnStarted);
        return await this.recipe.start();
    }

    /** Stop the linked recipe
     *
     */
    public async stop(): Promise<void> {
        this.removeRecipeListeners();
        this.emit('stopped', this.recipe.currentStep);
        await this.recipe.stop();
    }

    private removeRecipeListeners() {
        this.recipe.removeListener('completed', this.boundOnCompleted);
        this.recipe.removeListener('stepFinished', this.boundOnStepFinished);
        this.recipe.removeListener('started', this.boundOnStarted);
    }

    private onCompleted() {
        this._endTime = new Date();
        this.removeRecipeListeners();
        this.emit('completed');
    }

    private onStarted() {
        this.emit('started');
    }

    private onStepFinished(finishedStep) {
        this.emit('stepFinished', finishedStep);
    }
}
