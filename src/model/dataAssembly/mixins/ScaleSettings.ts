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

import {ParameterInterface} from '@p2olab/polaris-interface';
import {BaseDataAssemblyRuntime, DataAssembly} from '../DataAssembly';
import {OpcUaDataItem} from '../DataItem';
import {Constructor} from './mixins';

export interface ScaleSettingsRuntime extends BaseDataAssemblyRuntime {
    VSclMin: OpcUaDataItem<number>;
    VSclMax: OpcUaDataItem<number>;
}

// tslint:disable-next-line:variable-name
export function ScaleSettingsDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {

    return class extends Base {
        public communication: ScaleSettingsRuntime;

        constructor(...args: any[]) {
            super(...args);
            this.communication.VSclMax = this.createDataItem('VSclMax', 'read');
            this.communication.VSclMin = this.createDataItem('VSclMin', 'read');
        }

        public toJson(): ParameterInterface {
            return {
                ...super.toJson(),
                max: this.communication.VSclMax ? this.communication.VSclMax.value : undefined,
                min: this.communication.VSclMin ? this.communication.VSclMin.value : undefined
            };
        }
    };
}
