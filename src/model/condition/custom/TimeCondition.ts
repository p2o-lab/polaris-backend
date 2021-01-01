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

import {TimeConditionOptions} from '@p2olab/polaris-interface';
import {catCondition} from 'src/logging/logging';
import {Condition} from 'src/model/condition/Condition';
import {PEA} from '@/model/core/PEA';
import Timeout = NodeJS.Timeout;

export class TimeCondition extends Condition {

    private timer: Timeout;
    private duration: number;

    constructor(options: TimeConditionOptions) {
        super(options);
        if (options.duration <= 0) {
            throw new Error('Duration is negative');
        }
        this.duration = options.duration * 1000;
        this._fulfilled = false;
        catCondition.trace(`Add TimeCondition: ${JSON.stringify(options)}`);
    }

    public listen(): Condition {
        catCondition.debug(`Start Timer: ${this.duration}`);
        this.timer = global.setTimeout(() => {
                catCondition.debug(`TimeCondition finished: ${this.duration}`);
                this._fulfilled = true;
                this.emit('stateChanged', this._fulfilled);
            },
            this.duration);
        return this;
    }

    public clear(): void {
        super.clear();
        if (this.timer) {
            global.clearTimeout(this.timer);
        }
    }

    public getUsedModules(): Set<PEA> {
        return new Set<PEA>();
    }
}
