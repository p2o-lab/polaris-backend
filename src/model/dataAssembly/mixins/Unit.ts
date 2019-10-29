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
import {UNIT} from '../../core/Unit';
import {BaseDataAssemblyRuntime, DataAssembly} from '../DataAssembly';
import {OpcUaDataItem} from '../DataItem';
import {Constructor} from './mixins';

export interface UnitDataAssemblyRuntime extends BaseDataAssemblyRuntime {
    VUnit: OpcUaDataItem<number>;
}

// tslint:disable-next-line:variable-name
export function UnitDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {

    return class extends Base {
        public communication: UnitDataAssemblyRuntime;

        constructor(...args: any[]) {
            super(...args);
            this.communication.VUnit = this.createDataItem('VUnit', 'read');
        }

        public getUnit(): string {
            const unit = UNIT.find((item) => item.value === this.communication.VUnit.value);
            return unit ? unit.unit : '';
        }

        public toJson(): ParameterInterface {
            return {
                ...super.toJson(),
                unit: this.getUnit()
            };
        }
    };
}
