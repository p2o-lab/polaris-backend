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

import {OperationOptions} from '@p2olab/polaris-interface';
import {catRecipe} from '../../../config/logging';
import {Module} from '../../core/Module';
import {Operation} from '../../recipe/Operation';
import {PetrinetTransition} from './PetrinetTransition';

export interface PetrinetStateOptions {
    id: string;
    operations: OperationOptions[];
    nextTransitions: string[];
}

export class PetrinetState {

    public readonly id: string;
    public readonly options: PetrinetStateOptions;
    public nextTransitions: PetrinetTransition[];
    public operationCompleted: boolean;
    private operations: Operation[];

    constructor(options, modules: Module[]) {
        this.id = options.id;
        this.options = options;
        this.operations = options.operations.map((op) => new Operation(op, modules));
        this.operationCompleted = false;
    }

    /**
     * Execute all operations for PetrinetState
     *
     * Resolves when all operations are completed; rejects if one operation is aborted
     * @returns {Promise<void>}
     */
    public async execute() {
        const tasks = this.operations.map((operation) => new Promise((resolve, reject) => {
                catRecipe.info(`Start operation ${operation.module.id} ${operation.service.name} ` +
                    `${JSON.stringify(operation.command)}`);
                operation.execute();
                operation.emitter.on('changed', (state) => {
                    if (state === 'completed') {
                        resolve();
                    } else if (state === 'aborted') {
                        reject();
                    }
                });
            })
        );
        await Promise.all(tasks);
        this.operationCompleted = true;
    }
}
